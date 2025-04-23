import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import MovieCard from "@/components/MovieCard";
import { useMovieContext } from "@/context/MovieContext";

// Component chính của màn hình Save (danh sách phim yêu thích)
export default function Save() {
  // Lấy danh sách phim yêu thích từ MovieContext
  const { savedMovies } = useMovieContext();

  return (
    // SafeAreaView đảm bảo nội dung không bị che bởi notch hoặc thanh trạng thái
    <SafeAreaView className="bg-primary flex-1">
      {/* Hình nền cố định chiếm toàn bộ màn hình, đặt ở dưới cùng (z-0) */}
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      {/* Container chính với bố cục flex, căn giữa nội dung */}
      <View className="flex justify-center items-center flex-1 flex-col gap-5">
        {/* ScrollView chứa nội dung chính, cuộn dọc */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Logo điều hướng về trang chính */}
          <TouchableOpacity onPress={() => router.push("/")}>
            <Image
              source={icons.logo}
              className="w-12 h-10 mt-20 mb-5 mx-auto" // Kích thước và căn giữa
            />
          </TouchableOpacity>

          {/* Tiêu đề danh sách phim yêu thích */}
          <Text
            className="text-lg text-white font-bold mt-5 mb-3"
            style={{ fontSize: 20 }} // Ghi đè font size thành 20
          >
            Danh sách phim yêu thích
          </Text>

          {/* Kiểm tra xem có phim yêu thích hay không */}
          {savedMovies.length > 0 ? (
            // Hiển thị danh sách phim nếu có
            <View className="mt-10">
              <FlatList
                data={savedMovies} // Dữ liệu từ savedMovies
                renderItem={({ item }) => (
                  <MovieCard
                    id={parseInt(item.movie_id)} // Chuyển movie_id từ string sang number
                    title={item.title}
                    poster_path={item.poster_path}
                    vote_average={item.vote_average ?? 0} // Mặc định 0 nếu vote_average là null
                    release_date={item.release_date ?? ""} // Mặc định rỗng nếu release_date là null
                    adult={false} // Giá trị mặc định cho các thuộc tính không có trong savedMovies
                    backdrop_path={""}
                    genre_ids={[]}
                    original_language={""}
                    original_title={""}
                    overview={""}
                    popularity={0}
                    video={false}
                    vote_count={0}
                  />
                )}
                keyExtractor={(item, index) => `${item.movie_id}-${index}`} // Khóa duy nhất
                numColumns={3} // Hiển thị 3 cột
                columnWrapperStyle={{
                  justifyContent: "flex-start", // Căn trái các cột
                  gap: 20, // Khoảng cách giữa các phim
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                scrollEnabled={false} // Vô hiệu hóa cuộn trong FlatList để ScrollView xử lý
              />
            </View>
          ) : (
            // Hiển thị thông báo nếu chưa có phim yêu thích
            <Text className="text-white mt-10">Chưa có phim nào được lưu.</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};