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




interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const Details = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data: movie, loading } = useFetch(() => fetchMovieDetails(id as string));
  const { savedMovies, saveMovie, unsaveMovie } = useMovieContext();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const isMovieSaved = savedMovies.some((m) => m.movie_id === id);
    setIsSaved(isMovieSaved);
  }, [savedMovies, id]);

  const handleSave = async () => {
    if (!movie) return;

    try {
      if (isSaved) {
        await unsaveMovie(id as string);
        setIsSaved(false);
        Alert.alert("Đã xóa phim", "Phim đã được xóa khỏi danh sách yêu thích.");
      } else {
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
        const youtubeUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
        const supported = await Linking.canOpenURL(youtubeUrl);
        if (supported) {
          await Linking.openURL(youtubeUrl);
          Alert.alert("Đang mở", `Phát trailer của "${movie.title}" trên YouTube.`);
        } else {
          Alert.alert("Lỗi", "Không thể mở YouTube.");
        }
      } else {
        // Fallback: Tìm kiếm trên YouTube
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

  if (loading)
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator />
      </SafeAreaView>
    );

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />

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
          <TouchableOpacity
            onPress={handleSave}
            className="absolute bottom-15 right-5 rounded-full size-14 flex items-center justify-center"
          >
            <Image
              source={isSaved ? icons.save : icons.save}
              className="size-7"
            />
          </TouchableOpacity>
          
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">{movie?.title}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0]} •
            </Text>
            <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />
            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>
            <Text className="text-light-200 text-sm">
              ({movie?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo label="Tổng quan" value={movie?.overview} />
          <MovieInfo
            label="Thể loại"
            value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"}
          />

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

          <MovieInfo
            label="Hãng sản xuất"
            value={
              movie?.production_companies?.map((c) => c.name).join(" • ") ||
              "N/A"
            }
          />
        </View>
      </ScrollView>

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