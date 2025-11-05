const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registerCustomer = async (req, res) => {
    try {
        const { fullname, phone, email, password, address } = req.body;

        if (!fullname || !phone || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng điền đầy đủ thông tin"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email đã tồn tại"
            });
        }

        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
            return res.status(400).json({
                success: false,
                message: "Số điện thoại đã tồn tại"
            });
        }

        const initial = fullname.charAt(0).toUpperCase();
        const defaultAvatarUrl = `https://ui-avatars.com/api/?name=${initial}&background=FFFFFF&color=000000&size=128`;

        const hashedPassword = await bcrypt.hash(password, 10);

        let userAddress = [];
        userAddress = [{
            label: address.label || 'Địa chỉ mặc định',
            fullAddress: address.fullAddress || address,
            city: address.city || '',
            district: address.district || '',
            ward: address.ward || '',
            isDefault: true
        }];

        const newUser = new User({
            fullname,
            phone,
            email,
            password: hashedPassword,
            address: userAddress,
            avatar: defaultAvatarUrl,
            role: 'customer',
            provider: 'local'
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "Đăng ký thành công",
            user: {
                fullname: newUser.fullname,
                email: newUser.email,
                phone: newUser.phone,
                avatar: newUser.avatar,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Đăng ký thất bại",
            error: error.message
        });
    }
}

const loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng điền đầy đủ thông tin"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Email hoặc mật khẩu không đúng"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Email hoặc mật khẩu không đúng"
            });
        }

        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 60 * 60 * 1000,
            path: "/"
        });
        res.status(200).json({
            success: true,
            message: "Đăng nhập thành công",
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
                avatar: user.avatar,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Đăng nhập thất bại",
            error: error.message
        });
    }
}

const googleLogin = async (req, res) => {
    try {
        const { id_token } = req.body;
        if (!id_token) {
            return res.status(400).json({ success: false, message: "Thiếu id_token" });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const email = payload?.email;
        const fullname = payload?.name;
        const googleId = payload?.sub;
        const avatar = payload?.picture;
        if (!email || !googleId) {
            return res.status(400).json({ success: false, message: "Token không hợp lệ" });
        }

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                fullname: fullname || email,
                email,
                password: undefined,
                provider: 'google',
                googleId,
                avatar,
            });
        } else {
            // Nếu đã có tài khoản local, không ghi đè password
            if (!user.provider) user.provider = 'local';
            if (!user.googleId) user.googleId = googleId;
            if (!user.avatar) user.avatar = avatar;
        }

        const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: "30m" });
        const refreshToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 60 * 60 * 1000,
            path: "/"
        });
        res.status(200).json({
            success: true, message: "Đăng nhập Google thành công",
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
                avatar: user.avatar,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Đăng nhập Google thất bại" });
    }
}

const logoutCustomer = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(400).json({ success: false, message: "Đăng xuất thất bại" });
        }
        user.refreshToken = null;
        await user.save();
        res.clearCookie("refreshToken", { path: "/" });
        res.clearCookie("accessToken", { path: "/" });
        res.status(200).json({ success: true, message: "Đăng xuất thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Đăng xuất thất bại" });
    }
}

const getProfile = async (req, res) => {
    try {
        const { id } = req.user || {};
        const user = await User.findById(id);
        if (!user) {
            return res.status(401).json({ success: false, message: "Người dùng không tồn tại" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Lấy thông tin người dùng thất bại" });
    }
}

const uploadAvatar = async (req, res) => {
    try {
        const uploadedFile = req.file;
        if (!uploadedFile || !uploadedFile.location) {
            return res.status(400).json({ success: false, message: "Không nhận được file avatar" });
        }
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "Không tìm thấy user" });
        }
        user.avatar = uploadedFile.location;
        await user.save();

        res.status(200).json({ success: true, message: "Cập nhật avatar thành công", avatar: user.avatar });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Lưu ảnh đại diện thất bại" });
    }
}

const updateProfile = async (req, res) => {
    try {
        const { userId } = req.user;
        const { fullname, phone, email, address } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "Không tìm thấy user" });
        }
        user.fullname = fullname;
        user.phone = phone;
        user.email = email;
        user.address = address;
        await user.save();
        res.status(200).json({ success: true, message: "Cập nhật thông tin người dùng thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Cập nhật thông tin người dùng thất bại" });
    }
}

module.exports = { registerCustomer, loginCustomer, googleLogin, logoutCustomer, getProfile, uploadAvatar, updateProfile };