import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { auth } from '../Login/firebaseConfig';
import { db } from '../Login/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [user, setUser] = useState(auth.currentUser);
  const [userData, setUserData] = useState({ birthday: '', phoneNumber: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Trạng thái người dùng thay đổi:', currentUser?.uid);
      setUser(currentUser);

      if (currentUser) {
        const fetchUserData = async () => {
          console.log('Bắt đầu tải dữ liệu từ Firestore...');
          try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              console.log('Dữ liệu Firestore:', userDoc.data());
              setUserData(userDoc.data() as { birthday: string; phoneNumber: string });
            } else {
              console.log('Không tìm thấy dữ liệu Firestore cho người dùng này.');
              setUserData({ birthday: '', phoneNumber: '' });
            }
          } catch (e) {
            console.log('Lỗi khi tải dữ liệu từ Firestore:', e);
            setUserData({ birthday: '', phoneNumber: '' });
          }
        };

        fetchUserData();
      } else {
        setUserData({ birthday: '', phoneNumber: '' });
      }
    });

    return () => unsubscribe(); 
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/Landing/Landing');
    } catch (e) {
      console.log('Đăng xuất thất bại:', e);
    }
  };

  return (
    <LinearGradient
      colors={['#1E003D', '#0A0A23']}
      style={styles.container}
    >
      <Image
        source={require('../../assets/icons/logo1.png')}
        style={styles.logo}
      />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Tiêu đề (Tên người dùng) */}
      <Text style={styles.title}>{user?.displayName || user?.email || 'Người dùng'}</Text>

      {/* Các trường thông tin */}
      <View style={styles.infoContainer}>
        {/* Tên */}
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={20} color="#7B5AFF" style={styles.icon} />
          <Text style={styles.infoText}>{user?.displayName || user?.email || 'Người dùng'}</Text>
        </View>

        {/* Sinh nhật */}
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={20} color="#7B5AFF" style={styles.icon} />
          <Text style={styles.infoText}>{userData.birthday || 'Chưa cập nhật'}</Text>
        </View>

        {/* Số điện thoại */}
        <View style={styles.infoRow}>
          <Ionicons name="phone-portrait-outline" size={20} color="#7B5AFF" style={styles.icon} />
          <Text style={styles.infoText}>{userData.phoneNumber || 'Chưa cập nhật'}</Text>
        </View>

        {/* Email */}
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={20} color="#7B5AFF" style={styles.icon} />
          <Text style={styles.infoText}>{user?.email || 'Không có'}</Text>
        </View>

        {/* Mật khẩu */}
        <View style={styles.infoRow}>
          <Ionicons name="eye-off-outline" size={20} color="#7B5AFF" style={styles.icon} />
          <Text style={styles.infoText}>Password</Text>
          <Ionicons name="refresh-outline" size={20} color="#7B5AFF" style={styles.iconRight} />
        </View>
      </View>

      {/* Nút Edit profile */}
      <TouchableOpacity onPress={() => router.push('/Edit/edit')}>
        <LinearGradient
          colors={['#7B5AFF', '#A17BFF']}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Edit profile</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Nút Đăng xuất */}
      <TouchableOpacity onPress={handleSignOut}>
        <LinearGradient
          colors={['#7B5AFF', '#A17BFF']}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Đăng xuất</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
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
  infoText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});