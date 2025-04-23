import { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

import { images } from "@/constants/images";
import { icons } from "@/constants/icons";

import useFetch from "@/services/usefetch";
import { fetchMovies } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";

import SearchBar from "@/components/SearchBar";
import MovieDisplayCard from "@/components/MovieCard";
import { router } from "expo-router";

// Component chính của màn hình Search
export default function Search() {
  // State lưu trữ từ khóa tìm kiếm
  const [searchQuery, setSearchQuery] = useState("");

  // Hook useFetch để lấy danh sách phim dựa trên từ khóa
  const {
    data: movies = [], // Mặc định là mảng rỗng để tránh lỗi null
    loading, // Trạng thái đang tải
    error, // Lỗi nếu có
    refetch: loadMovies, // Hàm gọi lại API
    reset, // Hàm reset trạng thái
  } = useFetch(() => fetchMovies({ query: searchQuery }), false); // autoFetch = false để không gọi API khi mount

  // Hàm xử lý thay đổi văn bản trong thanh tìm kiếm
  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  // Effect để thực hiện tìm kiếm với debouncing (trì hoãn 500ms)
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        // Chỉ gọi API nếu từ khóa không rỗng
        await loadMovies();
        // Cập nhật số lượt tìm kiếm nếu có kết quả
        if (movies?.length! > 0 && movies?.[0]) {
          await updateSearchCount(searchQuery, movies[0]);
        }
      } else {
        // Reset dữ liệu và trạng thái nếu từ khóa rỗng
        reset();
      }
    }, 500);

    // Cleanup timeout khi component unmount hoặc searchQuery thay đổi
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    // Container chính với nền tối và bố cục flex
    <View className="flex-1 bg-primary">
      {/* Hình nền cố định chiếm toàn bộ màn hình, đặt ở dưới cùng (z-0) */}
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      {/* FlatList hiển thị kết quả tìm kiếm */}
      <FlatList
        className="px-5" // Padding hai bên
        data={movies as Movie[]} // Dữ liệu phim từ API
        keyExtractor={(item) => item.id.toString()} // Khóa duy nhất cho mỗi phim
        renderItem={({ item }) => <MovieDisplayCard {...item} />} // Component hiển thị phim
        numColumns={3} // Hiển thị 3 cột
        columnWrapperStyle={{
          justifyContent: "flex-start", // Căn trái các cột
          gap: 16, // Khoảng cách giữa các phim
          marginVertical: 16, // Khoảng cách trên/dưới mỗi hàng
        }}
        contentContainerStyle={{ paddingBottom: 100 }} // Padding dưới để tránh bị che
        // Header của FlatList chứa logo, thanh tìm kiếm, và trạng thái
        ListHeaderComponent={
          <>
            {/* Logo điều hướng về trang chính */}
            <View className="w-full flex-row justify-center mt-20 items-center">
              <TouchableOpacity onPress={() => router.push("/")}>
                <Image source={icons.logo} className="w-12 h-10" />
              </TouchableOpacity>
            </View>

            {/* Thanh tìm kiếm */}
            <View className="my-5">
              <SearchBar
                placeholder="Search for a movie"
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </View>

            {/* Hiển thị loading indicator khi đang tải */}
            {loading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}

            {/* Hiển thị thông báo lỗi nếu có */}
            {error && (
              <Text className="text-red-500 px-5 my-3">
                Error: {error.message}
              </Text>
            )}

            {/* Hiển thị tiêu đề kết quả tìm kiếm khi có kết quả */}
            {!loading &&
              !error &&
              searchQuery.trim() &&
              movies?.length! > 0 && (
                <Text className="text-xl text-white font-bold">
                  Search Results for{" "}
                  <Text className="text-accent">{searchQuery}</Text>
                </Text>
              )}
          </>
        }
        // Component hiển thị khi danh sách rỗng
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {searchQuery.trim()
                  ? "No movies found"
                  : "Start typing to search for movies"}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};