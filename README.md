# 👟 Shoe Store Website

Dự án **Shoe Store** là một ứng dụng web bán giày trực tuyến được xây dựng theo mô hình **Fullstack MERN (MongoDB, Express, React/Next.js, Node.js)**.  
Trang web cung cấp đầy đủ các tính năng từ xem sản phẩm, quản lý giỏ hàng, thanh toán trực tuyến đến quản trị hệ thống với giao diện hiện đại và trải nghiệm người dùng tốt.

---

## ✨ Tính năng chính

### 👤 Dành cho người dùng
- **🔐 Xác thực người dùng**
  - Đăng ký/Đăng nhập tài khoản
  - Đăng nhập bằng Google OAuth
  - Quên mật khẩu với OTP qua email
  - Quản lý profile và avatar

- **🛍️ Mua sắm**
  - Duyệt sản phẩm theo danh mục (Nike, Adidas, MLB, Phụ kiện)
  - Tìm kiếm sản phẩm
  - Xem chi tiết sản phẩm với nhiều hình ảnh
  - Lọc sản phẩm theo thương hiệu, giá, đánh giá
  - Xem đánh giá và rating từ người dùng khác

- **🛒 Giỏ hàng & Thanh toán**
  - Thêm/Xóa/Cập nhật sản phẩm trong giỏ hàng
  - Áp dụng mã giảm giá (Voucher)
  - Thanh toán qua ZaloPay
  - Quản lý địa chỉ giao hàng

- **📦 Quản lý đơn hàng**
  - Xem lịch sử đơn hàng
  - Theo dõi trạng thái đơn hàng
  - Đánh giá sản phẩm sau khi mua
  - Yêu cầu đổi/trả hàng

- **💬 Chat trực tuyến**
  - Chat với admin để được hỗ trợ
  - Real-time messaging với Socket.io

### 👨‍💼 Dành cho Admin
- **📊 Dashboard**
  - Thống kê doanh thu, đơn hàng, sản phẩm
  - Biểu đồ phân tích dữ liệu

- **📦 Quản lý sản phẩm**
  - Thêm/Sửa/Xóa sản phẩm
  - Upload hình ảnh lên AWS S3
  - Quản lý variants (size, color, SKU)
  - Quản lý tồn kho

- **🏷️ Quản lý danh mục & Voucher**
  - Tạo và quản lý danh mục sản phẩm
  - Tạo mã giảm giá với điều kiện áp dụng

- **📋 Quản lý đơn hàng**
  - Xem tất cả đơn hàng
  - Cập nhật trạng thái đơn hàng
  - Xử lý yêu cầu đổi/trả hàng

- **💬 Quản lý tin nhắn**
  - Xem và trả lời tin nhắn từ khách hàng
  - Đánh dấu đã đọc

---

## 🚀 Công nghệ sử dụng

### 🖥️ Frontend
- **[Next.js 16](https://nextjs.org/)** - React framework với App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Material-UI (MUI)](https://mui.com/)** - Component library
- **[Socket.io Client](https://socket.io/)** - Real-time communication
- **[Axios](https://axios-http.com/)** - HTTP client
- **[React Slick](https://react-slick.neostack.com/)** - Carousel component
- **[Recharts](https://recharts.org/)** - Chart library
- **[React OAuth Google](https://www.npmjs.com/package/@react-oauth/google)** - Google login

### ⚙️ Backend
- **[Node.js](https://nodejs.org/)** - Runtime environment
- **[Express.js 5](https://expressjs.com/)** - Web framework
- **[MongoDB](https://www.mongodb.com/)** - NoSQL database
- **[Mongoose](https://mongoosejs.com/)** - MongoDB ODM
- **[JWT](https://jwt.io/)** - Authentication tokens
- **[Bcrypt](https://www.npmjs.com/package/bcrypt)** - Password hashing
- **[Socket.io](https://socket.io/)** - Real-time bidirectional communication
- **[Redis](https://redis.io/)** - Caching & session storage
- **[AWS SDK S3](https://aws.amazon.com/sdk-for-javascript/)** - File storage
- **[Multer](https://www.npmjs.com/package/multer)** - File upload handling
- **[Nodemailer](https://nodemailer.com/)** - Email service (Resend API)
- **[Cookie Parser](https://www.npmjs.com/package/cookie-parser)** - Cookie handling
- **[CORS](https://www.npmjs.com/package/cors)** - Cross-origin resource sharing
- **[Moment.js](https://momentjs.com/)** - Date manipulation

### 🔧 Công cụ & Dịch vụ
- **AWS S3** - Lưu trữ hình ảnh sản phẩm
- **Redis** - Cache và session management
- **Resend** - Email service
- **ZaloPay** - Payment gateway
- **Google OAuth** - Social login

---

## 📁 Cấu trúc dự án

```
Shoe-Store/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Cấu hình (DB, Redis, Email)
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Auth, Role, Upload
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── socket/         # Socket.io handlers
│   │   └── server.js       # Entry point
│   ├── package.json
│   └── render.yaml         # Deployment config
│
├── frontend/               # Frontend Next.js
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   │   ├── admin/      # Admin pages
│   │   │   ├── product/    # Product pages
│   │   │   ├── checkout/   # Checkout page
│   │   │   └── ...
│   │   ├── components/     # React components
│   │   ├── context/        # React Context
│   │   ├── services/       # API services
│   │   ├── styles/         # CSS files
│   │   └── types/          # TypeScript types
│   ├── public/             # Static assets
│   ├── package.json
│   └── next.config.ts
│
└── README.md
```

---

## ⚙️ Cài đặt & Chạy dự án

### 📋 Yêu cầu hệ thống
- Node.js >= 18.x
- MongoDB (local hoặc MongoDB Atlas)
- Redis (local hoặc Redis Cloud)
- npm hoặc yarn

### 🔧 Bước 1: Clone repository

```bash
git clone https://github.com/DinhHieu07/Shoe-Store.git
cd Shoe-Store
```

### 🔧 Bước 2: Cài đặt Backend

```bash
cd backend
npm install
```

Tạo file `.env` trong thư mục `backend/`:

```env
# Server
PORT=5000
FRONTEND_URL=http://localhost:3000

# MongoDB
MONGO_URI=mongodb://localhost:27017/shoe-store
# Hoặc MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/shoe-store

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=ap-southeast-1
AWS_BUCKET_NAME=your-bucket-name

# Email (Resend)
RESEND_API_KEY=your-resend-api-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ZaloPay 
ZALOPAY_APP_ID=your-zalopay-app-id
ZALOPAY_KEY1=your-zalopay-key1
ZALOPAY_KEY2=your-zalopay-key2
```

Chạy backend:

```bash
npm run dev
```

Server mặc định chạy tại: **http://localhost:5000**

### 🔧 Bước 3: Cài đặt Frontend

Mở terminal mới:

```bash
cd frontend
npm install
```

Tạo file `.env` trong thư mục `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

Chạy frontend:

```bash
npm run dev
```

Frontend mặc định chạy tại: **http://localhost:3000**

### 🏗️ Build cho production

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

---

## 📡 API Endpoints

### 🔓 Public Routes (Không cần authentication)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/register` | Đăng ký tài khoản |
| POST | `/api/login` | Đăng nhập |
| POST | `/api/google-login` | Đăng nhập bằng Google |
| POST | `/api/refresh-token` | Làm mới access token |
| GET | `/api/get-categories` | Lấy danh sách danh mục |
| GET | `/api/get-products` | Lấy danh sách sản phẩm |
| GET | `/api/get-product-detail/:sku` | Lấy chi tiết sản phẩm |
| GET | `/api/search-products` | Tìm kiếm sản phẩm |
| GET | `/api/get-products-by-category` | Lấy sản phẩm theo danh mục |
| GET | `/api/get-vouchers` | Lấy danh sách voucher |
| POST | `/api/validate-voucher` | Kiểm tra voucher |
| POST | `/api/validate-email` | Gửi OTP quên mật khẩu |
| POST | `/api/verify-otp` | Xác thực OTP |
| POST | `/api/change-password` | Đổi mật khẩu |
| GET | `/api/get-reviews/:productId` | Lấy đánh giá sản phẩm |
| GET | `/api/get-rating-summary/:productId` | Lấy tổng hợp rating |
| POST | `/api/payment-callback/zalopay` | Callback từ ZaloPay |

### 🔒 Protected Routes (Cần authentication)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/logout` | Đăng xuất |
| GET | `/api/get-profile` | Lấy thông tin profile |
| POST | `/api/upload-avatar` | Upload avatar |
| POST | `/api/update-profile` | Cập nhật profile |
| POST | `/api/update-address` | Cập nhật địa chỉ |
| POST | `/api/add-to-cart` | Thêm vào giỏ hàng |
| GET | `/api/get-cart` | Lấy giỏ hàng |
| DELETE | `/api/delete-item-from-cart/:productId` | Xóa item khỏi giỏ hàng |
| DELETE | `/api/delete-all-items-from-cart` | Xóa tất cả items |
| PUT | `/api/update-item-quantity` | Cập nhật số lượng |
| POST | `/api/create-order` | Tạo đơn hàng |
| POST | `/api/create-payment-url/zalopay` | Tạo link thanh toán ZaloPay |
| GET | `/api/get-orders` | Lấy đơn hàng của user |
| GET | `/api/get-order-detail/:orderId` | Lấy chi tiết đơn hàng |
| POST | `/api/create-review` | Tạo đánh giá |
| POST | `/api/request-return` | Yêu cầu đổi/trả hàng |
| GET | `/api/get-messages` | Lấy tin nhắn |

### 👨‍💼 Admin Routes (Cần admin role)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/add-category` | Thêm danh mục |
| POST | `/api/add-product` | Thêm sản phẩm |
| PUT | `/api/edit-product/:id` | Sửa sản phẩm |
| DELETE | `/api/delete-product/:id` | Xóa sản phẩm |
| POST | `/api/add-voucher` | Thêm voucher |
| PUT | `/api/edit-voucher/:id` | Sửa voucher |
| DELETE | `/api/delete-voucher/:id` | Xóa voucher |
| GET | `/api/get-conversations` | Lấy danh sách cuộc trò chuyện |
| GET | `/api/get-messages-with-user/:userId` | Lấy tin nhắn với user |
| POST | `/api/mark-conversation-as-read/:userId` | Đánh dấu đã đọc |
| GET | `/api/admin/get-all-orders` | Lấy tất cả đơn hàng |
| PUT | `/api/admin/update-order-status` | Cập nhật trạng thái đơn hàng |
| GET | `/api/admin/dashboard` | Lấy dữ liệu dashboard |

---

## 🎯 Tính năng nổi bật

### 🔄 Real-time Chat
- Sử dụng Socket.io để chat trực tuyến giữa khách hàng và admin
- Thông báo tin nhắn mới real-time
- Lưu lịch sử chat trong database

### 💳 Thanh toán trực tuyến
- Tích hợp ZaloPay để thanh toán
- Xử lý callback và cập nhật trạng thái đơn hàng tự động
- Gửi email xác nhận thanh toán

### 📧 Email Service
- Gửi OTP qua email khi quên mật khẩu
- Gửi email xác nhận đơn hàng với thông tin chi tiết
- Sử dụng Resend API

### 🖼️ Quản lý hình ảnh
- Upload hình ảnh lên AWS S3
- Hỗ trợ multiple images cho mỗi sản phẩm
- Tối ưu hóa hiển thị với Next.js Image

### 🔐 Bảo mật
- JWT authentication với refresh token
- Bcrypt password hashing
- Role-based access control (RBAC)
- CORS configuration
- Cookie-based session

### ⚡ Performance
- Redis caching
- Next.js Server Components
- Image optimization
- Lazy loading components

---

## 🗄️ Database Models

- **User** - Thông tin người dùng
- **Product** - Sản phẩm với variants (size, color, SKU)
- **Category** - Danh mục sản phẩm
- **Cart** - Giỏ hàng
- **Order** - Đơn hàng
- **Voucher** - Mã giảm giá
- **Review** - Đánh giá sản phẩm
- **Conversation** - Cuộc trò chuyện
- **Message** - Tin nhắn

---

## 🚀 Deployment

### Backend (Render.com)
- File `render.yaml` đã được cấu hình sẵn
- Set environment variables trên Render dashboard
- Auto-deploy từ GitHub

### Frontend (Vercel)
- File `vercel.json` đã được cấu hình
- Connect GitHub repository
- Auto-deploy khi push code

---

## 📝 Scripts

### Backend
```bash
npm run dev      # Chạy development với nodemon
npm start        # Chạy production
```

### Frontend
```bash
npm run dev      # Chạy development với Turbopack
npm run build    # Build production
npm start        # Chạy production server
npm run lint     # Chạy ESLint
```

---

## 👨‍💻 Tác giả

- GitHub: [@DinhHieu07](https://github.com/DinhHieu07)
- Website: [shoe-store-btl-cnw.vercel.app](https://shoe-store-btl-cnw.vercel.app)

---

## ⭐ Nếu bạn thấy dự án hữu ích

Hãy để lại một ⭐ trên GitHub để ủng hộ nhé!