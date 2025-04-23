import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Redirect, useRouter } from "expo-router";

import useFetch from "@/services/usefetch";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import TrendingCard from "@/components/TrendingCard";

// Component chính của màn hình Home
export default function Index() {
  // Hook để điều hướng giữa các màn hình
  const router = useRouter();

  // Hook useFetch để lấy danh sách phim xu hướng từ Appwrite
  const {
    data: trendingMovies, // Dữ liệu phim xu hướng
    loading: trendingLoading, // Trạng thái đang tải
    error: trendingError, // Lỗi nếu có
  } = useFetch(getTrendingMovies);

  // Hook useFetch để lấy danh sách phim mới nhất từ TMDB
  const {
    data: movies, // Dữ liệu phim mới nhất
    loading: moviesLoading, // Trạng thái đang tải
    error: moviesError, // Lỗi nếu có
  } = useFetch(() => fetchMovies({ query: "" }));

  return (
    // Container chính với nền tối và bố cục flex
    <View className="flex-1 bg-primary">
      {/* Hình nền cố định chiếm toàn bộ màn hình, đặt ở dưới cùng (z-0) */}
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      {/* ScrollView chứa nội dung chính, cuộn dọc */}
      <ScrollView
        className="flex-1 px-5" // Padding hai bên
        showsVerticalScrollIndicator={false} // Ẩn thanh cuộn
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }} // Đảm bảo nội dung đầy đủ
      >
        {/* Logo điều hướng về trang chính */}
        <TouchableOpacity onPress={() => router.push('/')}>
          <Image
            source={icons.logo}
            className="w-12 h-10 mt-20 mb-5 mx-auto" // Kích thước và căn giữa
          />
        </TouchableOpacity>

        {/* Hiển thị trạng thái tải hoặc lỗi */}
        {moviesLoading || trendingLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center" // Căn giữa khi đang tải
          />
        ) : moviesError || trendingError ? (
          <Text className="text-white text-center mt-10">
            Error: {moviesError?.message || trendingError?.message}
          </Text>
        ) : (
          // Nội dung chính khi dữ liệu sẵn sàng
          <View className="flex-1 mt-5">
            {/* Thanh tìm kiếm, chuyển hướng đến màn hình search khi nhấn */}
            <SearchBar
              onPress={() => {
                router.push("/search");
              }}
              placeholder="Search for a movie"
            />

            {/* Danh sách phim xu hướng */}
            {trendingMovies && (
              <View className="mt-10">
                <Text className="text-lg text-white font-bold mb-3">
                  Trending Movies
                </Text>
                <FlatList
                  horizontal // Cuộn ngang
                  showsHorizontalScrollIndicator={false} // Ẩn thanh cuộn ngang
                  className="mb-4 mt-3"
                  data={trendingMovies}
                  contentContainerStyle={{
                    gap: 26, // Khoảng cách giữa các thẻ phim
                  }}
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} /> // Hiển thị phim xu hướng
                  )}
                  keyExtractor={(item, index) => `${item.movie_id}-${index}`} // Khóa duy nhất
                  ItemSeparatorComponent={() => <View className="w-4" />} // Khoảng cách giữa các item
                />
              </View>
            )}

            {/* Danh sách phim mới nhất */}
            <>
              <Text className="text-lg text-white font-bold mt-5 mb-3">
                Latest Movies
              </Text>

              <FlatList
                data={movies}
                renderItem={({ item }) => <MovieCard {...item} />} // Hiển thị phim mới nhất
                keyExtractor={(item, index) => `${item.id}-${index}`} // Khóa duy nhất
                numColumns={3} // Hiển thị 3 cột
                columnWrapperStyle={{
                  justifyContent: "flex-start", // Căn trái các cột
                  gap: 20, // Khoảng cách giữa các phim
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                className="mt-2 pb-32" // Padding dưới để tránh bị che
                scrollEnabled={false} // Vô hiệu hóa cuộn trong FlatList để ScrollView xử lý
              />
            </>
          </View>
        )}
      </ScrollView>
    </View>
  );
};