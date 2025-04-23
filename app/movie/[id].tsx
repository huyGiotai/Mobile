import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants/icons";
import useFetch from "@/services/usefetch";
import { fetchMovieDetails, fetchMovieVideos } from "@/services/api";
import { useMovieContext } from "@/context/MovieContext";
import { useState, useEffect } from "react";

// Interface định nghĩa props cho component MovieInfo
interface MovieInfoProps {
  label: string; // Nhãn của thông tin (ví dụ: "Tổng quan", "Thể loại")
  value?: string | number | null; // Giá trị của thông tin
}

// Component hiển thị thông tin phim theo cặp nhãn-giá trị
const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"} {/* Hiển thị "N/A" nếu giá trị không tồn tại */}
    </Text>
  </View>
);

// Component chính của màn hình chi tiết phim
const Details = () => {
  // Hook để điều hướng giữa các màn hình
  const router = useRouter();
  // Lấy ID phim từ tham số URL
  const { id } = useLocalSearchParams();
  // Hook useFetch để lấy chi tiết phim từ TMDB
  const { data: movie, loading } = useFetch(() => fetchMovieDetails(id as string));
  // Lấy danh sách phim yêu thích và hàm lưu/xóa từ MovieContext
  const { savedMovies, saveMovie, unsaveMovie } = useMovieContext();
  // State kiểm soát trạng thái phim đã được lưu hay chưa
  const [isSaved, setIsSaved] = useState(false);

  // Effect kiểm tra xem phim có trong danh sách yêu thích không
  useEffect(() => {
    const isMovieSaved = savedMovies.some((m) => m.movie_id === id);
    setIsSaved(isMovieSaved);
  }, [savedMovies, id]);

  // Hàm xử lý lưu hoặc xóa phim khỏi danh sách yêu thích
  const handleSave = async () => {
    if (!movie) return;

    try {
      if (isSaved) {
        // Xóa phim nếu đã lưu
        await unsaveMovie(id as string);
        setIsSaved(false);
        Alert.alert("Đã xóa phim", "Phim đã được xóa khỏi danh sách yêu thích.");
      } else {
        // Lưu phim nếu chưa lưu
        await saveMovie({
          movie_id: id as string,
          title: movie.title,
          poster_path: movie.poster_path || "",
          vote_average: movie.vote_average,
          release_date: movie.release_date,
        });
        setIsSaved(true);
        Alert.alert("Đã lưu phim", "Phim đã được lưu thành công!");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu/xóa phim.");
    }
  };

  // Hàm xử lý phát trailer phim trên YouTube
  const handlePlay = async () => {
    if (!movie) {
      Alert.alert("Lỗi", "Không thể tải thông tin phim.");
      return;
    }

    try {
      // Lấy danh sách video từ TMDB
      const videos = await fetchMovieVideos(id as string);
      const trailer = videos.find((video) => video.type === "Trailer");

      if (trailer) {
        // Nếu có trailer, mở link YouTube trực tiếp
        const youtubeUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
        const supported = await Linking.canOpenURL(youtubeUrl);
        if (supported) {
          await Linking.openURL(youtubeUrl);
          Alert.alert("Đang mở", `Phát trailer của "${movie.title}" trên YouTube.`);
        } else {
          Alert.alert("Lỗi", "Không thể mở YouTube.");
        }
      } else {
        // Nếu không có trailer, tìm kiếm trên YouTube
        const searchQuery = encodeURIComponent(`${movie.title} official trailer`);
        const youtubeUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
        const supported = await Linking.canOpenURL(youtubeUrl);
        if (supported) {
          await Linking.openURL(youtubeUrl);
          Alert.alert(
            "Không tìm thấy trailer",
            `Đang tìm kiếm "${movie.title}" trên YouTube.`
          );
        } else {
          Alert.alert("Lỗi", "Không thể mở YouTube.");
        }
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải video.");
    }
  };

  // Hiển thị loading indicator khi đang tải dữ liệu
  if (loading)
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator />
      </SafeAreaView>
    );

  return (
    // Container chính với nền tối và bố cục flex
    <View className="bg-primary flex-1">
      {/* ScrollView chứa nội dung chi tiết phim */}
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          {/* Hình ảnh poster phim */}
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />

          {/* Nút phát trailer */}
          <TouchableOpacity
            onPress={handlePlay}
            className="absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center"
          >
            <Image
              source={icons.play}
              className="w-6 h-7 ml-1"
              resizeMode="stretch"
            />
          </TouchableOpacity>
        </View>

        <View>
          {/* Nút lưu/xóa phim yêu thích */}
          <TouchableOpacity
            onPress={handleSave}
            className="absolute bottom-15 right-5 rounded-full size-14 flex items-center justify-center"
          >
            <Image
              source={isSaved ? icons.save : icons.save} // Icon không thay đổi giữa trạng thái
              className="size-7"
            />
          </TouchableOpacity>
        </View>

        {/* Thông tin chi tiết phim */}
        <View className="flex-col items-start justify-center mt-5 px-5">
          {/* Tiêu đề phim */}
          <Text className="text-white font-bold text-xl">{movie?.title}</Text>
          {/* Năm phát hành và thời lượng */}
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0]} •
            </Text>
            <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
          </View>

          {/* Điểm đánh giá và số lượt bình chọn */}
          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />
            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>
            <Text className="text-light-200 text-sm">
              ({movie?.vote_count} votes)
            </Text>
          </View>

          {/* Tổng quan phim */}
          <MovieInfo label="Tổng quan" value={movie?.overview} />
          {/* Thể loại phim */}
          <MovieInfo
            label="Thể loại"
            value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"}
          />

          {/* Ngân sách và doanh thu */}
          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Ngân sách"
              value={`$${(movie?.budget ?? 0) / 1_000_000} triệu`}
            />
            <MovieInfo
              label="Doanh thu"
              value={`$${Math.round((movie?.revenue ?? 0) / 1_000_000)} triệu`}
            />
          </View>

          {/* Hãng sản xuất */}
          <MovieInfo
            label="Hãng sản xuất"
            value={
              movie?.production_companies?.map((c) => c.name).join(" • ") ||
              "N/A"
            }
          />
        </View>
      </ScrollView>

      {/* Nút quay lại */}
      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Quay lại</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Details;