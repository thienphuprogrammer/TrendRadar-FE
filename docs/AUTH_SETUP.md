# Authentication Setup Guide

## Cấu hình Environment Variables

Tạo file `.env.local` trong thư mục frontend với nội dung:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Development settings
NODE_ENV=development
```

## Các trang Authentication đã được tạo

### 1. Trang Login (`/auth/login`)
- Form đăng nhập với email và password
- Validation với Zod schema
- Hiển thị lỗi từ API
- Tích hợp với AuthContext

### 2. Trang Register (`/auth/register`)
- Form đăng ký với các trường:
  - Email (bắt buộc)
  - Password (bắt buộc, có validation mạnh)
  - Confirm Password
  - First Name (tùy chọn)
  - Last Name (tùy chọn)
  - Role (SELLER, ANALYST, VIEWER)
- Hiển thị độ mạnh mật khẩu
- Tự động đăng nhập sau khi đăng ký thành công

### 3. Trang Forgot Password (`/auth/forgot-password`)
- Form nhập email để gửi link đặt lại mật khẩu
- Hiển thị thông báo thành công

### 4. Trang Auth Landing (`/auth`)
- Trang chọn loại authentication
- Links đến các trang login, register, forgot password

## API Integration

### AuthService
- `login(credentials)` - Đăng nhập
- `register(userData)` - Đăng ký
- `getCurrentUser()` - Lấy thông tin user hiện tại
- `refreshToken()` - Refresh access token
- `logout()` - Đăng xuất
- `forgotPassword(email)` - Gửi email đặt lại mật khẩu
- `resetPassword(token, newPassword)` - Đặt lại mật khẩu
- `changePassword(oldPassword, newPassword)` - Đổi mật khẩu

### AuthContext
- Quản lý state authentication
- Tự động kiểm tra token khi khởi tạo
- Tự động refresh token khi cần
- Cung cấp methods: login, register, logout, clearError

### AuthGuard
- Bảo vệ các route cần authentication
- Redirect đến login nếu chưa đăng nhập
- Redirect đến dashboard nếu đã đăng nhập (cho auth routes)

## Routing

- `/auth` - Trang chọn authentication
- `/auth/login` - Đăng nhập
- `/auth/register` - Đăng ký
- `/auth/forgot-password` - Quên mật khẩu
- Tất cả các route khác yêu cầu authentication

## Cách sử dụng

1. Cấu hình API URL trong `.env.local`
2. Khởi động backend server
3. Khởi động frontend: `npm run dev`
4. Truy cập `http://localhost:3000/auth` để bắt đầu

## Lưu ý

- Tokens được lưu trong localStorage
- Tự động refresh token khi hết hạn
- Tự động logout khi token không hợp lệ
- Error handling cho tất cả API calls
- Responsive design cho mobile và desktop
