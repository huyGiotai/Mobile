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

const Save = () => {
  const { savedMovies } = useMovieContext();

  return (
    <SafeAreaView className="bg-primary flex-1">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />
      <View className="flex justify-center items-center flex-1 flex-col gap-5">
        <ScrollView>
          <TouchableOpacity onPress={() => router.push("/")}>
            <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
          </TouchableOpacity>
          <Text
            className="text-lg text-white font-bold mt-5 mb-3"
            style={{ fontSize: 20 }}
          >
            Danh sách phim yêu thích
          </Text>

          {savedMovies.length > 0 ? (
            <View className="mt-10">
              <FlatList
                data={savedMovies}
                renderItem={({ item }) => (
                  <MovieCard
                    id={parseInt(item.movie_id)} // Chuyển string thành number
                    title={item.title}
                    poster_path={item.poster_path}
                    vote_average={item.vote_average ?? 0}
                    release_date={item.release_date ?? ""} adult={false} backdrop_path={""} genre_ids={[]} original_language={""} original_title={""} overview={""} popularity={0} video={false} vote_count={0}                  />
                )}
                keyExtractor={(item, index) => `${item.movie_id}-${index}`}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                scrollEnabled={false}
              />
            </View>
          ) : (
            <Text className="text-white mt-10">Chưa có phim nào được lưu.</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Save;