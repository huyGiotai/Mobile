import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; // Để sử dụng biểu tượng mắt

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Trạng thái hiện/ẩn mật khẩu

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (e) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại!');
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
      <Text style={styles.title}>Đăng nhập</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
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

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity onPress={handleLogin}>
        <LinearGradient
          colors={['#7A4BCF', '#5C38A5']}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/Login/signin')}>
        <Text style={styles.linkText}>Tạo tài khoản</Text>
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
    fontSize: 16,
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
});