import { Stack } from "expo-router";
import "./globals.css";
import { StatusBar } from "react-native";
import { Redirect } from "expo-router";
import { MovieProvider } from "@/context/MovieContext"; // Import MovieProvider

// Component chính định nghĩa cấu trúc định tuyến của ứng dụng
export default function RootLayout() {
  return (
    // MovieProvider bọc toàn bộ ứng dụng để chia sẻ trạng thái phim yêu thích
    <MovieProvider>
      <>
        {/* Điều hướng mặc định đến màn hình Landing */}
        <Redirect href="/Landing/Landing" />

        {/* Ẩn StatusBar trên toàn bộ ứng dụng */}
        <StatusBar hidden={true} />

        {/* Stack Navigator để quản lý các màn hình */}
        <Stack>
          {/* Nhóm các tab (Home, Search, Save, v.v.) */}
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false, // Ẩn header mặc định
            }}
          />

          {/* Màn hình chi tiết phim với tham số động [id] */}
          <Stack.Screen
            name="movie/[id]"
            options={{
              headerShown: false, // Ẩn header
            }}
          />

          {/* Màn hình Landing (màn hình chào) */}
          <Stack.Screen
            name="Landing/Landing"
            options={{
              headerShown: false, // Ẩn header
            }}
          />

          {/* Màn hình đăng nhập */}
          <Stack.Screen
            name="Login/login"
            options={{
              headerShown: false, // Ẩn header
            }}
          />

          {/* Màn hình đăng ký */}
          <Stack.Screen
            name="Login/signin"
            options={{
              headerShown: false, // Ẩn header
            }}
          />

          {/* Màn hình chỉnh sửa (có thể là chỉnh sửa thông tin người dùng) */}
          <Stack.Screen
            name="Edit/edit"
            options={{
              headerShown: false, // Ẩn header
            }}
          />

          {/* Màn hình đặt lại mật khẩu */}
          <Stack.Screen
            name="Login/resetpassword"
            options={{
              headerShown: false, // Ẩn header
            }}
          />

          {/* Màn hình danh sách phim yêu thích */}
          <Stack.Screen
            name="save"
            options={{
              headerShown: false, // Ẩn header
            }}
          />
        </Stack>
      </>
    </MovieProvider>
  );
}