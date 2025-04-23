import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  Dimensions,
} from 'react-native';
import { auth } from '../Login/firebaseConfig';
import { db } from '../Login/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { images } from '@/constants/images';
import { icons } from '@/constants/icons';

// Lấy chiều rộng màn hình để tính toán kích thước responsive
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProfileScreen() {
  // State lưu thông tin người dùng từ Firebase Auth
  const [user, setUser] = useState(auth.currentUser);
  // State lưu dữ liệu bổ sung từ Firestore
  const [userData, setUserData] = useState({
    birthday: '',
    phoneNumber: '',
    facebook: '',
    tiktok: '',
    instagram: '',
    avatarUrl: '',
  });

  // Effect để lắng nghe trạng thái đăng nhập và lấy dữ liệu từ Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const fetchUserData = async () => {
          try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              setUserData({
                birthday: userDoc.data().birthday || '',
                phoneNumber: userDoc.data().phoneNumber || '',
                facebook: userDoc.data().facebook || '',
                tiktok: userDoc.data().tiktok || '',
                instagram: userDoc.data().instagram || '',
                avatarUrl: userDoc.data().avatarUrl || '',
              });
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
          } catch (e) {
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

  // Hàm xử lý đăng xuất
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace('/Login/login');
    } catch (e) {
      console.log('Đăng xuất thất bại:', e);
    }
  };

  // Hàm mở liên kết mạng xã hội
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
    <LinearGradient colors={['#1E003D', '#0A0A23']} style={styles.container}>
      {/* Hình nền cố định */}
      <Image
        source={images.bg}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Container chính sử dụng flex để bố cục */}
        <View style={styles.mainContainer}>
          {/* Logo điều hướng về trang chính */}
          <TouchableOpacity onPress={() => router.push('/')} style={styles.logoContainer}>
            <Image source={icons.logo} style={styles.logo} />
          </TouchableOpacity>

          {/* Tiêu đề (tên người dùng hoặc email) */}
          <Text style={styles.title}>{user?.displayName || user?.email || 'Người dùng'}</Text>

          {/* Hiển thị avatar */}
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

          {/* Thông tin người dùng */}
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color="#7B5AFF" style={styles.icon} />
              <Text style={styles.infoText}>
                {user?.displayName || user?.email || 'Người dùng'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color="#7B5AFF" style={styles.icon} />
              <Text style={styles.infoText}>{userData.birthday || 'Chưa cập nhật'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons
                name="phone-portrait-outline"
                size={20}
                color="#7B5AFF"
                style={styles.icon}
              />
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
              <Text
                style={[
                  styles.infoText,
                  userData.facebook && userData.facebook !== 'Chưa cập nhật'
                    ? styles.linkText
                    : {},
                ]}
              >
                {userData.facebook || 'Chưa cập nhật'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => openSocialLink(userData.tiktok, 'tiktok')}
              disabled={!userData.tiktok || userData.tiktok === 'Chưa cập nhật'}
            >
              <Ionicons name="logo-tiktok" size={20} color="#7B5AFF" style={styles.icon} />
              <Text
                style={[
                  styles.infoText,
                  userData.tiktok && userData.tiktok !== 'Chưa cập nhật'
                    ? styles.linkText
                    : {},
                ]}
              >
                {userData.tiktok || 'Chưa cập nhật'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => openSocialLink(userData.instagram, 'instagram')}
              disabled={!userData.instagram || userData.instagram === 'Chưa cập nhật'}
            >
              <Ionicons name="logo-instagram" size={20} color="#7B5AFF" style={styles.icon} />
              <Text
                style={[
                  styles.infoText,
                  userData.instagram && userData.instagram !== 'Chưa cập nhật'
                    ? styles.linkText
                    : {},
                ]}
              >
                {userData.instagram || 'Chưa cập nhật'}
              </Text>
            </TouchableOpacity>
            <View style={styles.infoRow}>
              <Ionicons name="eye-off-outline" size={20} color="#7B5AFF" style={styles.icon} />
              <Text style={styles.infoText}>Password</Text>
              <Ionicons
                name="refresh-outline"
                size={20}
                color="#7B5AFF"
                style={styles.iconRight}
              />
            </View>
          </View>

          {/* Nút chỉnh sửa hồ sơ */}
          <TouchableOpacity onPress={() => router.push('/Edit/edit')}>
            <LinearGradient colors={['#7B5AFF', '#A17BFF']} style={styles.button}>
              <Text style={styles.buttonText}>Edit profile</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Nút đăng xuất */}
          <TouchableOpacity onPress={handleSignOut}>
            <LinearGradient colors={['#7B5AFF', '#A17BFF']} style={styles.button}>
              <Text style={styles.buttonText}>Đăng xuất</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Chiếm toàn bộ không gian màn hình
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1, // Đặt hình nền phía sau
  },
  scrollContent: {
    flexGrow: 1, // Đảm bảo ScrollView chiếm toàn bộ không gian
    paddingHorizontal: SCREEN_WIDTH * 0.05, // Padding tương đối (5% chiều rộng)
    paddingBottom: 30,
  },
  mainContainer: {
    flex: 1, // Container chính chiếm toàn bộ không gian
    flexDirection: 'column', // Sắp xếp các phần tử theo cột
    justifyContent: 'center', // Căn giữa theo chiều dọc
    alignItems: 'center', // Căn giữa theo chiều ngang
  },
  logoContainer: {
    alignSelf: 'center', // Căn giữa logo
    marginTop: SCREEN_WIDTH * 0.1, // Margin trên tương đối
    marginBottom: 10,
  },
  logo: {
    width: SCREEN_WIDTH * 0.12, // Kích thước logo tương đối (12% chiều rộng)
    height: SCREEN_WIDTH * 0.1,
  },
  title: {
    fontSize: SCREEN_WIDTH * 0.06, // Font size tương đối
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: SCREEN_WIDTH * 0.3, // Avatar chiếm 30% chiều rộng màn hình
    height: SCREEN_WIDTH * 0.3,
    borderRadius: SCREEN_WIDTH * 0.15, // Bo tròn hoàn toàn
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarPlaceholder: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_WIDTH * 0.3,
    borderRadius: SCREEN_WIDTH * 0.15,
    backgroundColor: '#7B5AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarText: {
    fontSize: SCREEN_WIDTH * 0.1, // Font size chữ cái đầu tương đối
    color: '#fff',
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '100%', // Chiếm toàn bộ chiều rộng
    marginBottom: 20,
    paddingVertical: 10,
  },
  infoRow: {
    flexDirection: 'row', // Sắp xếp icon và text theo hàng ngang
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
    fontSize: SCREEN_WIDTH * 0.04, // Font size tương đối
    color: '#000',
    flex: 1, // Chiếm không gian còn lại
  },
  linkText: {
    color: '#7B5AFF',
    textDecorationLine: 'underline',
  },
  button: {
    width: SCREEN_WIDTH * 0.9, // Nút chiếm 90% chiều rộng
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: 'bold',
  },
});