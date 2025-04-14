import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { auth } from './firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export const unstable_settings = {
  headerShown: false,
};

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSendResetLink = async () => {
    setError('');
    setSuccess('');

    if (!validateEmail(email)) {
      setError('Email không hợp lệ!');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Liên kết đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra email của bạn.');
      setTimeout(() => {
        router.push('./login');
      }, 3000);
    } catch (e) {
      setError(`Gửi liên kết thất bại: ${e instanceof Error ? e.message : String(e)}`);
    }
  };
  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={['#1E003D', '#1E003D']}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Image
            source={require('@/assets/icons/logo1.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>Đặt lại mật khẩu</Text>

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
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {success ? <Text style={styles.success}>{success}</Text> : null}

          <TouchableOpacity onPress={handleSendResetLink}>
            <LinearGradient
              colors={['#7A4BCF', '#5C38A5']}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Gửi liên kết đặt lại</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('./login')}>
            <Text style={styles.linkText}>Quay lại đăng nhập</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  success: {
    color: '#00ff00',
    marginBottom: 15,
    fontSize: 14,
  },
});