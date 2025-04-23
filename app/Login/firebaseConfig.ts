import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Cấu hình Firebase với các thông tin xác thực và định danh dự án
const firebaseConfig = {
  apiKey: "AIzaSyCc9PzHXEzwRsw-wQUyLJzVk7f_igVc7I0", // Khóa API để xác thực với Firebase
  authDomain: "nguyen-mobile.firebaseapp.com", // Tên miền xác thực của dự án
  projectId: "nguyen-mobile", // ID duy nhất của dự án Firebase
  storageBucket: "nguyen-mobile.firebasestorage.app", // Bucket lưu trữ cho Firebase Storage
  messagingSenderId: "371845429798", // ID gửi tin nhắn cho Firebase Cloud Messaging
  appId: "1:371845429798:web:e3e7be14bec11f374684e7", // ID ứng dụng Firebase
  measurementId: "G-ZFHL4F573R" // ID cho Firebase Analytics (nếu sử dụng)
};

// Khởi tạo ứng dụng Firebase với cấu hình đã cung cấp
const app = initializeApp(firebaseConfig);

// Khởi tạo và xuất Firebase Authentication để quản lý đăng nhập/đăng ký
const auth = getAuth(app);

// Khởi tạo và xuất Firestore Database để lưu trữ và truy vấn dữ liệu
export const db = getFirestore(app);

// Khởi tạo và xuất Firebase Cloud Functions để gọi các hàm serverless
export const functions = getFunctions(app);

// Xuất auth để sử dụng trong các module khác
export { auth };