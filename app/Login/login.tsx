import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Image } from 'react-native';
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; // Để sử dụng biểu tượng mắt

// Component chính của màn hình đăng nhập
export default function LoginScreen() {
  // State lưu trữ email người dùng
  const [email, setEmail] = useState('');
  // State lưu trữ mật khẩu người dùng
  const [password, setPassword] = useState('');
  // State lưu trữ thông báo lỗi (nếu có)
  const [error, setError] = useState('');
  // State kiểm soát hiển thị/ẩn mật khẩu
  const [showPassword, setShowPassword] = useState(false);

  // Hàm xử lý đăng nhập với Firebase Authentication
  const handleLogin = async () => {
    try {
      // Gọi hàm đăng nhập với email và mật khẩu
      await signInWithEmailAndPassword(auth, email, password);
      // Điều hướng về trang chính sau khi đăng nhập thành công
      router.replace('/');
    } catch (e) {
      // Hiển thị thông báo lỗi nếu đăng nhập thất bại
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại!');
      console.log(e);
    }
  };

  return (
    // TouchableWithoutFeedback để ẩn bàn phím khi chạm ngoài input
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {/* LinearGradient tạo nền gradient từ tím đậm đến tím nhạt */}
      <LinearGradient
        colors={['#1E003D', '#1E003D']}
        style={styles.container}
      >
        {/* Logo ứng dụng */}
        <Image
          source={require('@/assets/icons/logo1.png')}
          style={styles.logo}
        />

        {/* Tiêu đề "Đăng nhập" */}
        <Text style={styles.title}>Đăng nhập</Text>

        {/* Container cho input email */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
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
            onChangeText={setPassword}
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

        {/* Hiển thị thông báo lỗi nếu có */}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Link chuyển hướng đến màn hình reset mật khẩu */}
        <TouchableOpacity onPress={() => router.replace('/Login/resetpassword')}>
          <Text style={styles.linkText}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        {/* Nút đăng nhập với gradient */}
        <TouchableOpacity onPress={handleLogin}>
          <LinearGradient
            colors={['#7A4BCF', '#5C38A5']} // Gradient tím
            style={styles.button}
          >
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Link chuyển hướng đến màn hình đăng ký */}
        <TouchableOpacity onPress={() => router.replace('/Login/signin')}>
          <Text style={styles.linkText}>Tạo tài khoản</Text>
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
});