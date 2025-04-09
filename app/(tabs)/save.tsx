

import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Redirect, router, useRouter } from "expo-router";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import useFetch from "@/services/usefetch";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import TrendingCard from "@/components/TrendingCard";


const Save = () => {
  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "" }));

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  
  
   return (
     <SafeAreaView className="bg-primary flex-1">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />
       <View className="flex justify-center items-center flex-1 flex-col gap-5">
       <ScrollView 
       >
        <TouchableOpacity onPress={() => router.push('/')}> 
          <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
          </TouchableOpacity>
       <Text className="text-lg text-white font-bold mt-5 mb-3"
       style={{ fontSize: 20 }}>
                My List Movies
       </Text>

        <View>
        {trendingMovies && (
              <View className="mt-10">
                <FlatList
                  // horizontal
                  // showsHorizontalScrollIndicator={false}
                  className="mb-4 mt-3"
                  data={trendingMovies}
                  // contentContainerStyle={{
                  //   gap: 26,
                  // }}
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} />
                  )}
                  keyExtractor={(item, index) => `${item.movie_id}-${index}`}
                  ItemSeparatorComponent={() => <View className="w-4" />}
                  
                  numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                // className="mt-2 pb-32"
                scrollEnabled={false}
                  
                  
                />
              </View>
            )}
        
       {/* <FlatList 
                
                data={movies}
                renderItem={({ item }) => (
                  
                  <MovieCard {...item} />)}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                className="mt-2 pb-32"
                scrollEnabled={false}
                
              /> */}
              
              
              </View>
        
        </ScrollView>
        
       </View>
     </SafeAreaView>
   );
  }
  
 

export default Save;
