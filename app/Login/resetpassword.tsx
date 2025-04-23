import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { auth } from './firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Cấu hình để ẩn header mặc định của expo-router
export const unstable_settings = {
  headerShown: false,
};

// Component chính của màn hình đặt lại mật khẩu
export default function ResetPasswordScreen() {
  // State lưu trữ email người dùng nhập
  const [email, setEmail] = useState('');
  // State lưu trữ thông báo lỗi (nếu có)
  const [error, setError] = useState('');
  // State lưu trữ thông báo thành công (nếu có)
  const [success, setSuccess] = useState('');

  // Hàm kiểm tra định dạng email hợp lệ
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex kiểm tra định dạng email
    return regex.test(email);
  };

  // Hàm xử lý gửi liên kết đặt lại mật khẩu
  const handleSendResetLink = async () => {
    setError(''); // Xóa lỗi trước đó
    setSuccess(''); // Xóa thông báo thành công trước đó

    // Kiểm tra email hợp lệ
    if (!validateEmail(email)) {
      setError('Email không hợp lệ!');
      return;
    }

    try {
      // Gửi email đặt lại mật khẩu qua Firebase Authentication
      await sendPasswordResetEmail(auth, email);
      // Hiển thị thông báo thành công
      setSuccess('Liên kết đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra email của bạn.');
      // Chuyển hướng về màn hình đăng nhập sau 3 giây
      setTimeout(() => {
        router.push('./login');
      }, 3000);
    } catch (e) {
      // Hiển thị lỗi nếu gửi email thất bại
      setError(`Gửi liên kết thất bại: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    // TouchableWithoutFeedback để ẩn bàn phím khi chạm ngoài input
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {/* LinearGradient tạo nền gradient tím đậm */}
      <LinearGradient
        colors={['#1E003D', '#1E003D']}
        style={styles.container}
      >
        {/* ScrollView để hỗ trợ cuộn khi bàn phím xuất hiện */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Logo ứng dụng */}
          <Image
            source={require('@/assets/icons/logo1.png')}
            style={styles.logo}
          />

          {/* Tiêu đề "Đặt lại mật khẩu" */}
          <Text style={styles.title}>Đặt lại mật khẩu</Text>

          {/* Container cho input email */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text); // Cập nhật email
                setError(''); // Xóa lỗi
                setSuccess(''); // Xóa thông báo thành công
              }}
              style={styles.input}
              placeholderTextColor="#999" // Màu placeholder
              keyboardType="email-address" // Bàn phím tối ưu cho email
              autoCapitalize="none" // Không tự động viết hoa
            />
          </View>

          {/* Hiển thị thông báo lỗi nếu có */}
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {/* Hiển thị thông báo thành công nếu có */}
          {success ? <Text style={styles.success}>{success}</Text> : null}

          {/* Nút gửi liên kết đặt lại mật khẩu với gradient */}
          <TouchableOpacity onPress={handleSendResetLink}>
            <LinearGradient
              colors={['#7A4BCF', '#5C38A5']} // Gradient tím
              style={styles.button}
            >
              <Text style={styles.buttonText}>Gửi liên kết đặt lại</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Link quay lại màn hình đăng nhập */}
          <TouchableOpacity onPress={() => router.replace('./login')}>
            <Text style={styles.linkText}>Quay lại đăng nhập</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

// StyleSheet định nghĩa các kiểu dáng cho giao diện
const styles = StyleSheet.create({
  container: {
    flex: 1, // Chiếm toàn bộ màn hình
  },
  scrollContainer: {
    flexGrow: 1, // Đảm bảo ScrollView mở rộng đầy đủ
    justifyContent: 'center', // Căn giữa theo chiều dọc
    alignItems: 'center', // Căn giữa theo chiều ngang
    paddingHorizontal: 20, // Padding hai bên
    paddingBottom: 20, // Padding dưới để tránh bị che
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20, // Khoảng cách dưới logo
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20, // Khoảng cách dưới tiêu đề
  },
  inputContainer: {
    flexDirection: 'row', // Bố cục ngang
    alignItems: 'center', // Căn giữa theo chiều dọc
    backgroundColor: '#fff', // Nền trắng
    borderRadius: 10, // Bo góc
    marginBottom: 15, // Khoảng cách dưới
    paddingHorizontal: 10, // Padding bên trong
    width: '100%', // Chiếm toàn bộ chiều rộng
  },
  input: {
    flex: 1, // Chiếm toàn bộ không gian còn lại
    paddingVertical: 12, // Padding trên/dưới
    fontSize: 16,
    color: '#000',
  },
  button: {
    paddingVertical: 12, // Padding trên/dưới
    borderRadius: 25, // Bo góc lớn
    paddingHorizontal: 40, // Padding hai bên
    width: '100%', // Chiếm toàn bộ chiều rộng
    alignItems: 'center', // Căn giữa văn bản
    marginVertical: 20, // Khoảng cách trên/dưới
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10, // Khoảng cách trên
    textDecorationLine: 'underline', // Gạch chân
  },
  error: {
    color: '#ff3333', // Màu đỏ cho lỗi
    marginBottom: 15, // Khoảng cách dưới
    fontSize: 14,
  },
  success: {
    color: '#00ff00', // Màu xanh lá cho thông báo thành công
    marginBottom: 15, // Khoảng cách dưới
    fontSize: 14,
  },
});