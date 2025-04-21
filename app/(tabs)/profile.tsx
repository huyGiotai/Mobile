import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Linking } from 'react-native';
import { auth } from '../Login/firebaseConfig';
import { db } from '../Login/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { images } from "@/constants/images";
import { icons } from '@/constants/icons';

export default function ProfileScreen() {
  const [user, setUser] = useState(auth.currentUser);
  const [userData, setUserData] = useState({
    birthday: '',
    phoneNumber: '',
    facebook: '',
    tiktok: '',
    instagram: '',
    avatarUrl: '', // Thêm trường avatarUrl để lưu URL avatar
  });

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
              setUserData({
                birthday: userDoc.data().birthday || '',
                phoneNumber: userDoc.data().phoneNumber || '',
                facebook: userDoc.data().facebook || '',
                tiktok: userDoc.data().tiktok || '',
                instagram: userDoc.data().instagram || '',
                avatarUrl: userDoc.data().avatarUrl || '', // Lấy avatarUrl từ Firestore
              });
            } else {
              console.log('Không tìm thấy dữ liệu Firestore cho người dùng này.');
              setUserData({
                birthday: '',
                phoneNumber: '',
                facebook: '',
                tiktok: '',
                instagram: '',
                avatarUrl: '',
              });
            }
          } catch (e) {
            console.log('Lỗi khi tải dữ liệu từ Firestore:', e);
            setUserData({
              birthday: '',
              phoneNumber: '',
              facebook: '',
              tiktok: '',
              instagram: '',
              avatarUrl: '',
            });
          }
        };

        fetchUserData();
      } else {
        setUserData({
          birthday: '',
          phoneNumber: '',
          facebook: '',
          tiktok: '',
          instagram: '',
          avatarUrl: '',
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace('/Login/login');
    } catch (e) {
      console.log('Đăng xuất thất bại:', e);
    }
  };

  const openSocialLink = async (url: string, platform: string) => {
    if (!url || url === 'Chưa cập nhật') {
      return;
    }

    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (platform === 'facebook') {
        formattedUrl = `https://facebook.com/${url}`;
      } else if (platform === 'tiktok') {
        formattedUrl = `https://tiktok.com/@${url}`;
      } else if (platform === 'instagram') {
        formattedUrl = `https://instagram.com/${url}`;
      }
    }

    try {
      const supported = await Linking.canOpenURL(formattedUrl);
      if (supported) {
        await Linking.openURL(formattedUrl);
      } else {
        console.log(`Không thể mở URL: ${formattedUrl}`);
      }
    } catch (e) {
      console.log(`Lỗi khi mở URL ${platform}:`, e);
    }
  };

  return (
    <LinearGradient
      colors={['#1E003D', '#0A0A23']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View>
        <Image
          source={images.bg}
          className="absolute transform -translate-x-3"
          resizeMode="cover"
      />
          <TouchableOpacity onPress={() => router.push('/')}>
            <Image source={icons.logo} style={styles.logo} />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{user?.displayName || user?.email || 'Người dùng'}</Text>

        {/* Thêm phần hiển thị avatar */}
        <View style={styles.avatarContainer}>
          {userData.avatarUrl ? (
            <Image source={{ uri: userData.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {(user?.displayName || user?.email || 'N')[0].toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color="#7B5AFF" style={styles.icon} />
            <Text style={styles.infoText}>{user?.displayName || user?.email || 'Người dùng'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#7B5AFF" style={styles.icon} />
            <Text style={styles.infoText}>{userData.birthday || 'Chưa cập nhật'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="phone-portrait-outline" size={20} color="#7B5AFF" style={styles.icon} />
            <Text style={styles.infoText}>{userData.phoneNumber || 'Chưa cập nhật'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="#7B5AFF" style={styles.icon} />
            <Text style={styles.infoText}>{user?.email || 'Không có'}</Text>
          </View>
          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => openSocialLink(userData.facebook, 'facebook')}
            disabled={!userData.facebook || userData.facebook === 'Chưa cập nhật'}
          >
            <Ionicons name="logo-facebook" size={20} color="#7B5AFF" style={styles.icon} />
            <Text style={[styles.infoText, userData.facebook && userData.facebook !== 'Chưa cập nhật' ? styles.linkText : {}]}>
              {userData.facebook || 'Chưa cập nhật'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => openSocialLink(userData.tiktok, 'tiktok')}
            disabled={!userData.tiktok || userData.tiktok === 'Chưa cập nhật'}
          >
            <Ionicons name="logo-tiktok" size={20} color="#7B5AFF" style={styles.icon} />
            <Text style={[styles.infoText, userData.tiktok && userData.tiktok !== 'Chưa cập nhật' ? styles.linkText : {}]}>
              {userData.tiktok || 'Chưa cập nhật'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => openSocialLink(userData.instagram, 'instagram')}
            disabled={!userData.instagram || userData.instagram === 'Chưa cập nhật'}
          >
            <Ionicons name="logo-instagram" size={20} color="#7B5AFF" style={styles.icon} />
            <Text style={[styles.infoText, userData.instagram && userData.instagram !== 'Chưa cập nhật' ? styles.linkText : {}]}>
              {userData.instagram || 'Chưa cập nhật'}
            </Text>
          </TouchableOpacity>
          <View style={styles.infoRow}>
            <Ionicons name="eye-off-outline" size={20} color="#7B5AFF" style={styles.icon} />
            <Text style={styles.infoText}>Password</Text>
            <Ionicons name="refresh-outline" size={20} color="#7B5AFF" style={styles.iconRight} />
          </View>
        </View>

        <TouchableOpacity onPress={() => router.push('/Edit/edit')}>
          <LinearGradient
            colors={['#7B5AFF', '#A17BFF']}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Edit profile</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSignOut}>
          <LinearGradient
            colors={['#7B5AFF', '#A17BFF']}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Đăng xuất</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 30,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
    marginTop: 0,
  },
  logo: {
    width: 48,
    height: 40,
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10, // Giảm margin để làm chỗ cho avatar
  },
  // Thêm style cho avatar
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#7B5AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarText: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
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
  linkText: {
    color: '#7B5AFF',
    textDecorationLine: 'underline',
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