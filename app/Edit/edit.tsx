import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { auth } from '../Login/firebaseConfig';
import { updateProfile, updatePassword } from 'firebase/auth';
import { db } from '../Login/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Lấy chiều rộng màn hình để tính toán kích thước responsive
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function EditProfileScreen() {
  // Lấy thông tin người dùng hiện tại từ Firebase Auth
  const user = auth.currentUser;

  // State lưu trữ thông tin chỉnh sửa
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [birthday, setBirthday] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [facebook, setFacebook] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [instagram, setInstagram] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Effect để lấy dữ liệu người dùng từ Firestore khi component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data() as {
              birthday: string;
              phoneNumber: string;
              facebook: string;
              tiktok: string;
              instagram: string;
              avatarUrl: string;
            };
            setBirthday(data.birthday || '');
            setPhoneNumber(data.phoneNumber || '');
            setFacebook(data.facebook || '');
            setTiktok(data.tiktok || '');
            setInstagram(data.instagram || '');
            setAvatarUrl(data.avatarUrl || '');
          }
        } catch (e) {
          console.log('Lỗi khi tải dữ liệu từ Firestore:', e);
        }
      }
    };

    fetchUserData();
  }, [user]);

  // Hàm chọn ảnh từ thư viện để làm avatar
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Cần quyền truy cập thư viện ảnh để chọn avatar!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      await uploadAvatar(uri);
    }
  };

  // Hàm tải avatar lên Cloudinary
  const uploadAvatar = async (uri: string) => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('Bạn cần đăng nhập để thực hiện hành động này!');
        return;
      }

      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        type: 'image/jpeg',
        name: `avatar-${user.uid}.jpg`,
      } as any);
      formData.append('upload_preset', 'avatar_upload');
      formData.append('cloud_name', 'dp26raxtu');

      const response = await fetch('https://api.cloudinary.com/v1_1/dp26raxtu/image/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (!result.secure_url) {
        throw new Error('Tải ảnh lên thất bại!');
      }

      const downloadUrl = result.secure_url;
      setAvatarUrl(downloadUrl);
      setSuccess('Cập nhật avatar thành công!');
    } catch (e) {
      setError(`Lỗi khi tải avatar: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setLoading(false);
    }
  };

  // Hàm kiểm tra định dạng ngày sinh (dd/mm/yyyy)
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

  // Hàm kiểm tra định dạng số điện thoại (Việt Nam)
  const validatePhoneNumber = (phone: string) => {
    const regex = /^(0|\+84)[35789]\d{8}$/;
    return regex.test(phone);
  };

  // Hàm xử lý lưu thông tin đã chỉnh sửa
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
      await updateProfile(auth.currentUser, {
        displayName: displayName,
      });

      if (password) {
        await updatePassword(auth.currentUser, password);
      }

      await setDoc(
        doc(db, 'users', auth.currentUser.uid),
        {
          birthday: birthday || '',
          phoneNumber: phoneNumber || '',
          facebook: facebook || '',
          tiktok: tiktok || '',
          instagram: instagram || '',
          avatarUrl: avatarUrl || '',
        },
        { merge: true }
      );

      setSuccess('Lưu thông tin thành công!');
      setTimeout(() => {
        router.replace('/profile');
      }, 2000);
    } catch (e) {
      setError(`Lưu thất bại: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    // TouchableWithoutFeedback để ẩn bàn phím khi chạm ngoài
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient colors={['#1E003D', '#0A0A23']} style={styles.container}>
        {/* Container chính sử dụng flex để bố cục */}
        <View style={styles.mainContainer}>
          {/* Nút quay lại */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={SCREEN_WIDTH * 0.06} color="#fff" />
          </TouchableOpacity>

          {/* Tiêu đề (tên người dùng) */}
          <Text style={styles.title}>{displayName || 'Người dùng'}</Text>

          {/* Hiển thị avatar hoặc loading indicator */}
          <View style={styles.avatarContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {(displayName || user?.email || 'N')[0].toUpperCase()}
                </Text>
              </View>
            )}
            <TouchableOpacity onPress={pickImage} style={styles.changeAvatarButton}>
              <Text style={styles.changeAvatarText}>Thay đổi avatar</Text>
            </TouchableOpacity>
          </View>

          {/* Container chứa các trường thông tin */}
          <View style={styles.infoContainer}>
            {/* Trường tên hiển thị */}
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

            {/* Trường ngày sinh */}
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

            {/* Trường số điện thoại */}
            <View style={styles.infoRow}>
              <Ionicons
                name="phone-portrait-outline"
                size={20}
                color="#7B5AFF"
                style={styles.icon}
              />
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

            {/* Trường Facebook */}
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

            {/* Trường TikTok */}
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

            {/* Trường Instagram */}
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

            {/* Trường email (không chỉnh sửa) */}
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color="#7B5AFF" style={styles.icon} />
              <Text style={styles.infoText}>{user?.email || 'Không có'}</Text>
            </View>

            {/* Trường mật khẩu mới */}
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

          {/* Hiển thị thông báo lỗi hoặc thành công */}
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {success ? <Text style={styles.success}>{success}</Text> : null}

          {/* Nút lưu thông tin */}
          <TouchableOpacity onPress={handleSave}>
            <LinearGradient colors={['#7B5AFF', '#A17BFF']} style={styles.button}>
              <Text style={styles.buttonText}>Lưu</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Chiếm toàn bộ không gian màn hình
  },
  mainContainer: {
    flex: 1, // Container chính chiếm toàn bộ không gian
    flexDirection: 'column', // Sắp xếp các phần tử theo cột
    paddingHorizontal: SCREEN_WIDTH * 0.05, // Padding tương đối (5% chiều rộng)
    paddingTop: SCREEN_WIDTH * 0.1, // Padding trên tương đối
  },
  backButton: {
    position: 'absolute',
    top: SCREEN_WIDTH * 0.1, // Vị trí tương đối
    left: SCREEN_WIDTH * 0.05,
  },
  title: {
    fontSize: SCREEN_WIDTH * 0.06, // Font size tương đối
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  avatarContainer: {
    alignItems: 'center', // Căn giữa avatar
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
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarText: {
    fontSize: SCREEN_WIDTH * 0.1, // Font size chữ cái đầu tương đối
    color: '#7B5AFF',
    fontWeight: 'bold',
  },
  changeAvatarButton: {
    marginTop: 10,
  },
  changeAvatarText: {
    color: '#fff',
    fontSize: SCREEN_WIDTH * 0.04, // Font size tương đối
    textDecorationLine: 'underline',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '100%', // Chiếm toàn bộ chiều rộng
    marginBottom: 20,
    paddingVertical: 10,
  },
  infoRow: {
    flexDirection: 'row', // Sắp xếp icon và input theo hàng ngang
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
    flex: 1, // Chiếm không gian còn lại
    fontSize: SCREEN_WIDTH * 0.04, // Font size tương đối
    color: '#000',
  },
  infoText: {
    fontSize: SCREEN_WIDTH * 0.04,
    color: '#000',
  },
  button: {
    width: '100%', // Nút chiếm toàn bộ chiều rộng
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
  error: {
    color: '#ff3333',
    fontSize: SCREEN_WIDTH * 0.035,
    textAlign: 'center',
    marginBottom: 15,
  },
  success: {
    color: '#00ff00',
    fontSize: SCREEN_WIDTH * 0.035,
    textAlign: 'center',
    marginBottom: 15,
  },
});