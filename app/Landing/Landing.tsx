import { Image, Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { Marquee } from '@animatereactnative/marquee';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';

// Lấy chiều rộng màn hình để tính toán kích thước responsive
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Landing() {
  // Danh sách hình ảnh cho marquee
  const imageList = [
    require('../../assets/images/1.jpg'),
    require('../../assets/images/2.jpg'),
    require('../../assets/images/3.jpg'),
    require('../../assets/images/4.jpeg'),
    require('../../assets/images/5.jpg'),
    require('../../assets/images/6.jpg'),
    require('../../assets/images/7.jpg'),
    require('../../assets/images/8.jpg'),
    require('../../assets/images/9.jpg'),
    require('../../assets/images/10.jpg'),
  ];

  // Sử dụng useRouter để điều hướng
  const router = useRouter();

  return (
    // GestureHandlerRootView bao bọc toàn bộ để hỗ trợ các gesture
    <GestureHandlerRootView style={styles.root}>
      {/* Container chính sử dụng flex để chia bố cục */}
      <View style={styles.container}>
        {/* Phần trên: Chứa 3 marquee hiển thị hình ảnh */}
        <View style={styles.marqueeContainer}>
          {/* Marquee 1: Hiển thị danh sách hình ảnh với tốc độ và góc nghiêng */}
          <Marquee spacing={10} speed={0.7} style={styles.marquee}>
            <View style={styles.imageContainer}>
              {imageList.map((image, index) => (
                <Image
                  key={index}
                  source={image}
                  style={styles.image}
                  resizeMode="cover" // Đảm bảo hình ảnh hiển thị đầy đủ
                />
              ))}
            </View>
          </Marquee>

          {/* Marquee 2: Tương tự marquee 1 nhưng tốc độ chậm hơn */}
          <Marquee spacing={10} speed={0.4} style={StyleSheet.flatten([styles.marquee, { marginTop: 10 }])}>
            <View style={styles.imageContainer}>
              {imageList.map((image, index) => (
                <Image
                  key={index}
                  source={image}
                  style={styles.image}
                  resizeMode="cover"
                />
              ))}
            </View>
          </Marquee>

          {/* Marquee 3: Tương tự nhưng tốc độ trung bình */}
          <Marquee spacing={10} speed={0.5} style={StyleSheet.flatten([styles.marquee, { marginTop: 10 }])}>
            <View style={styles.imageContainer}>
              {imageList.map((image, index) => (
                <Image
                  key={index}
                  source={image}
                  style={styles.image}
                  resizeMode="cover"
                />
              ))}
            </View>
          </Marquee>
        </View>

        {/* Phần dưới: Chứa text marquee và nút điều hướng */}
        <View style={styles.contentContainer}>
          {/* Marquee cho văn bản chào mừng */}
          <Marquee spacing={300} speed={1.5}>
            <Text style={styles.welcomeText}>
              🎬 Chào mừng đến với HuyFlix. 🔍 Khám phá thông tin phim, xem trailer, đánh giá và nhiều hơn nữa. 📽️ Sẵn sàng bước vào thế giới điện ảnh? 🚀
            </Text>
          </Marquee>

          {/* Nút điều hướng đến trang Login */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace('/Login/login')}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

// Styles sử dụng StyleSheet để tối ưu hóa hiệu suất
const styles = StyleSheet.create({
  root: {
    flex: 1, // Chiếm toàn bộ không gian có sẵn
  },
  container: {
    flex: 1, // Container chính chiếm toàn bộ chiều cao
    flexDirection: 'column', // Sắp xếp các phần tử theo cột
    backgroundColor: '#fff', // Màu nền trắng cho rõ ràng
  },
  marqueeContainer: {
    flex: 2, // Chiếm 2/3 không gian (hình ảnh)
    justifyContent: 'center', // Căn giữa theo chiều dọc
  },
  contentContainer: {
    flex: 1, // Chiếm 1/3 không gian (văn bản và nút)
    padding: 20, // Khoảng cách bên trong
    justifyContent: 'center', // Căn giữa nội dung
    alignItems: 'center', // Căn giữa theo chiều ngang
  },
  marquee: {
    transform: [{ rotate: '-4deg' }], // Góc nghiêng cho marquee
  },
  imageContainer: {
    flexDirection: 'row', // Sắp xếp hình ảnh theo hàng ngang
    gap: 15, // Khoảng cách giữa các hình ảnh
  },
  image: {
    width: SCREEN_WIDTH * 0.4, // Kích thước hình ảnh responsive (40% chiều rộng màn hình)
    height: SCREEN_WIDTH * 0.4, // Tỷ lệ vuông
    borderRadius: 25, // Bo góc hình ảnh
  },
  welcomeText: {
    fontFamily: 'outfit-bold',
    fontSize: 25,
    textAlign: 'center',
    marginTop: 30,
  },
  button: {
    backgroundColor: '#299446', // Màu xanh lá
    padding: 15,
    borderRadius: 15,
    marginTop: 50,
    width: '80%', // Nút chiếm 80% chiều rộng
    alignItems: 'center', // Căn giữa văn bản trong nút
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'outfit',
  },
});