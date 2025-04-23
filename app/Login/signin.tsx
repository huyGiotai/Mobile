import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Image } from 'react-native';
import { auth } from './firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Component chính của màn hình đăng ký tài khoản
export default function SignInScreen() {
  // State lưu trữ email người dùng nhập
  const [email, setEmail] = useState('');
  // State lưu trữ mật khẩu người dùng nhập
  const [password, setPassword] = useState('');
  // State lưu trữ giá trị nhập lại mật khẩu
  const [confirmPassword, setConfirmPassword] = useState('');
  // State lưu trữ thông báo lỗi (nếu có)
  const [error, setError] = useState('');
  // State lưu trữ thông báo thành công (nếu có)
  const [success, setSuccess] = useState('');
  // State kiểm soát hiển thị/ẩn mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  // State kiểm soát hiển thị/ẩn nhập lại mật khẩu
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Hàm xử lý đăng ký tài khoản với Firebase Authentication
  const handleSignUp = async () => {
    // Xóa lỗi và thông báo thành công cũ
    setError('');
    setSuccess('');

    // Kiểm tra mật khẩu và nhập lại mật khẩu có khớp không
    if (password !== confirmPassword) {
      setError('Mật khẩu và nhập lại mật khẩu không khớp!');
      return;
    }

    try {
      // Tạo tài khoản mới với email và mật khẩu
      await createUserWithEmailAndPassword(auth, email, password);
      // Hiển thị thông báo thành công
      setSuccess('Đăng ký thành công!');
      // Chuyển hướng về trang đăng nhập sau 2 giây
      setTimeout(() => {
        router.push('/Login/login');
      }, 2000);
    } catch (e) {
      // Hiển thị lỗi nếu đăng ký thất bại (ví dụ: email đã tồn tại)
      setError('Đăng ký thất bại. Email đã tồn tại?');
      console.log(e);
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
        {/* Logo ứng dụng */}
        <Image
          source={require('@/assets/icons/logo1.png')}
          style={styles.logo}
        />

        {/* Tiêu đề "Tạo tài khoản" */}
        <Text style={styles.title}>Tạo tài khoản</Text>

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
            autoCapitalize="none" // Không tự động viết hoa
            placeholderTextColor="#999" // Màu placeholder
          />
        </View>

        {/* Container cho input mật khẩu với nút hiện/ẩn */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Mật khẩu"
            value={password}
            onChangeText={(text) => {
              setPassword(text); // Cập nhật mật khẩu
              setError(''); // Xóa lỗi
              setSuccess(''); // Xóa thông báo thành công
            }}
            secureTextEntry={!showPassword} // Ẩn/hiện mật khẩu
            style={styles.input}
            placeholderTextColor="#999"
          />
          {/* Nút hiện/ẩn mật khẩu */}
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'} // Biểu tượng mắt
              size={24}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        {/* Container cho input nhập lại mật khẩu với nút hiện/ẩn */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text); // Cập nhật nhập lại mật khẩu
              setError(''); // Xóa lỗi
              setSuccess(''); // Xóa thông báo thành công
            }}
            secureTextEntry={!showConfirmPassword} // Ẩn/hiện nhập lại mật khẩu
            style={styles.input}
            placeholderTextColor="#999"
          />
          {/* Nút hiện/ẩn nhập lại mật khẩu */}
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showConfirmPassword ? 'eye-off' : 'eye'} // Biểu tượng mắt
              size={24}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        {/* Hiển thị thông báo lỗi nếu có */}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {/* Hiển thị thông báo thành công nếu có */}
        {success ? <Text style={styles.success}>{success}</Text> : null}

        {/* Nút đăng ký với gradient */}
        <TouchableOpacity onPress={handleSignUp}>
          <LinearGradient
            colors={['#7A4BCF', '#5C38A5']} // Gradient tím
            style={styles.button}
          >
            <Text style={styles.buttonText}>Lưu</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Link chuyển hướng đến màn hình đăng nhập */}
        <TouchableOpacity onPress={() => router.replace('/Login/login')}>
          <Text style={styles.linkText}>Đăng nhập</Text>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

// StyleSheet định nghĩa các kiểu dáng cho giao diện
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Căn giữa theo chiều dọc
    alignItems: 'center', // Căn giữa theo chiều ngang
    paddingHorizontal: 20, // Padding hai bên
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
    flexDirection: 'row', // Bố cục ngang cho input và icon
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
  eyeIcon: {
    padding: 10, // Vùng chạm cho icon mắt
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
    fontSize: 18, // Tăng kích thước chữ
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