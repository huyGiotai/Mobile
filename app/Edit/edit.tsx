import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { auth } from '../Login/firebaseConfig';
import { updateProfile, updatePassword } from 'firebase/auth';
import { db } from '../Login/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfileScreen() {
  const user = auth.currentUser;

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [birthday, setBirthday] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [facebook, setFacebook] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [instagram, setInstagram] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Tải dữ liệu ban đầu từ Firestore khi vào trang
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        console.log('Bắt đầu tải dữ liệu từ Firestore cho trang Edit...');
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data() as { 
              birthday: string; 
              phoneNumber: string; 
              facebook: string; 
              tiktok: string; 
              instagram: string 
            };
            console.log('Dữ liệu Firestore (Edit):', data);
            setBirthday(data.birthday || '');
            setPhoneNumber(data.phoneNumber || '');
            setFacebook(data.facebook || '');
            setTiktok(data.tiktok || '');
            setInstagram(data.instagram || '');
          } else {
            console.log('Không tìm thấy dữ liệu Firestore cho người dùng này.');
          }
        } catch (e) {
          console.log('Lỗi khi tải dữ liệu từ Firestore:', e);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const validateBirthday = (date: string) => {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(date)) return false;

    const [day, month, year] = date.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return (
      dateObj.getDate() === day &&
      dateObj.getMonth() === month - 1 &&
      dateObj.getFullYear() === year &&
      year >= 1900 &&
      year <= new Date().getFullYear()
    );
  };

  const validatePhoneNumber = (phone: string) => {
    const regex = /^(0|\+84)[35789]\d{8}$/;
    return regex.test(phone);
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');

    if (!displayName.trim()) {
      setError('Vui lòng nhập tên hiển thị!');
      return;
    }

    if (birthday && !validateBirthday(birthday)) {
      setError('Ngày sinh không hợp lệ! Định dạng: dd/mm/yyyy');
      return;
    }

    if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
      setError('Số điện thoại không hợp lệ! Ví dụ: 0901234567 hoặc +84901234567');
      return;
    }

    if (!auth.currentUser) {
      setError('Không tìm thấy người dùng. Vui lòng đăng nhập lại!');
      return;
    }

    try {
      console.log('Bắt đầu cập nhật Firebase Auth...');
      await updateProfile(auth.currentUser, {
        displayName: displayName,
      });
      console.log('Cập nhật Firebase Auth thành công!');

      if (password) {
        console.log('Bắt đầu cập nhật mật khẩu...');
        await updatePassword(auth.currentUser, password);
        console.log('Cập nhật mật khẩu thành công!');
      }

      console.log('Bắt đầu lưu vào Firestore...');
      await setDoc(
        doc(db, 'users', auth.currentUser.uid),
        {
          birthday: birthday || '',
          phoneNumber: phoneNumber || '',
          facebook: facebook || '',
          tiktok: tiktok || '',
          instagram: instagram || '',
        },
        { merge: true }
      );
      console.log('Lưu vào Firestore thành công!');

      setSuccess('Lưu thông tin thành công!');
      setTimeout(() => {
        router.push('/profile');
      }, 2000);
    } catch (e) {
      setError(`Lưu thất bại: ${e instanceof Error ? e.message : String(e)}`);
      console.log('Lỗi khi lưu:', e);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={['#7B5AFF', '#A17BFF']}
        style={styles.container}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>{displayName || 'Người dùng'}</Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color="#7B5AFF" style={styles.icon} />
            <TextInput
              value={displayName}
              onChangeText={(text) => {
                setDisplayName(text);
                setError('');
                setSuccess('');
              }}
              style={styles.input}
              placeholder="Tên"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#7B5AFF" style={styles.icon} />
            <TextInput
              value={birthday}
              onChangeText={(text) => {
                setBirthday(text);
                setError('');
                setSuccess('');
              }}
              style={styles.input}
              placeholder="Sinh nhật (dd/mm/yyyy)"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="phone-portrait-outline" size={20} color="#7B5AFF" style={styles.icon} />
            <TextInput
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text);
                setError('');
                setSuccess('');
              }}
              style={styles.input}
              placeholder="Số điện thoại"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="logo-facebook" size={20} color="#7B5AFF" style={styles.icon} />
            <TextInput
              value={facebook}
              onChangeText={(text) => {
                setFacebook(text);
                setError('');
                setSuccess('');
              }}
              style={styles.input}
              placeholder="Facebook"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="logo-tiktok" size={20} color="#7B5AFF" style={styles.icon} />
            <TextInput
              value={tiktok}
              onChangeText={(text) => {
                setTiktok(text);
                setError('');
                setSuccess('');
              }}
              style={styles.input}
              placeholder="TikTok"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="logo-instagram" size={20} color="#7B5AFF" style={styles.icon} />
            <TextInput
              value={instagram}
              onChangeText={(text) => {
                setInstagram(text);
                setError('');
                setSuccess('');
              }}
              style={styles.input}
              placeholder="Instagram"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="#7B5AFF" style={styles.icon} />
            <Text style={styles.infoText}>{user?.email || 'Không có'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="eye-off-outline" size={20} color="#7B5AFF" style={styles.icon} />
            <TextInput
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError('');
                setSuccess('');
              }}
              style={styles.input}
              placeholder="Mật khẩu mới"
              placeholderTextColor="#999"
              secureTextEntry
            />
            <Ionicons name="refresh-outline" size={20} color="#7B5AFF" style={styles.iconRight} />
          </View>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? <Text style={styles.success}>{success}</Text> : null}

        <TouchableOpacity onPress={handleSave}>
          <LinearGradient
            colors={['#7B5AFF', '#A17BFF']}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Lưu</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  icon: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  infoText: {
    fontSize: 16,
    color: '#000',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#ff3333',
    marginBottom: 15,
    fontSize: 14,
    textAlign: 'center',
  },
  success: {
    color: '#00ff00',
    marginBottom: 15,
    fontSize: 14,
    textAlign: 'center',
  },
});