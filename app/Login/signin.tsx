import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { auth } from './firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Thêm trạng thái để hiển thị thông báo thành công
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = async () => {
    // Xóa lỗi cũ trước khi kiểm tra
    setError('');
    setSuccess(''); // Xóa thông báo thành công cũ

    // Kiểm tra mật khẩu và nhập lại mật khẩu có khớp không
    if (password !== confirmPassword) {
      setError('Mật khẩu và nhập lại mật khẩu không khớp!');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Hiển thị thông báo thành công
      setSuccess('Đăng ký thành công!');
      // Chuyển hướng về trang đăng nhập sau 2 giây
      setTimeout(() => {
        router.push('/Login/login');
      }, 2000);
    } catch (e) {
      setError('Đăng ký thất bại. Email đã tồn tại?');
      console.log(e);
    }
  };

  return (
    <LinearGradient
      colors={['#1E003D', '#1E003D']}
      style={styles.container}
    >
      <Image
        source={require('@/assets/icons/logo1.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Tạo tài khoản</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError('');
            setSuccess('');
          }}
          style={styles.input}
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Mật khẩu"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError('');
            setSuccess('');
          }}
          secureTextEntry={!showPassword}
          style={styles.input}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={24}
            color="#999"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Nhập lại mật khẩu"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setError('');
            setSuccess('');
          }}
          secureTextEntry={!showConfirmPassword}
          style={styles.input}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showConfirmPassword ? 'eye-off' : 'eye'}
            size={24}
            color="#999"
          />
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}

      <TouchableOpacity onPress={handleSignUp}>
        <LinearGradient
          colors={['#7A4BCF', '#5C38A5']}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Lưu</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/Login/login')}>
        <Text style={styles.linkText}>Đăng nhập</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: '100%',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 25,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  error: {
    color: '#ff3333',
    marginBottom: 15,
    fontSize: 14,
  },
  success: {
    color: '#00ff00', // Màu xanh lá cho thông báo thành công
    marginBottom: 15,
    fontSize: 14,
  },
});