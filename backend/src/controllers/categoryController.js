const Category = require("../models/Category");

const slugify = (str) => {
    return str.toLowerCase().replace(/ /g, '-');
}

const addCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ success: false, message: "Danh mục đã tồn tại" });
        }
        const newCategory = new Category({ name, slug: slugify(name) });
        await newCategory.save();
        res.status(200).json({ success: true, data: newCategory, message: "Danh mục đã được thêm thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Thêm danh mục thất bại." });
    }
}

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Lấy danh mục thất bại" });
    }
}

module.exports = { addCategory, getCategories };