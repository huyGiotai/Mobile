
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Định nghĩa interface cho phim đã lưu
export interface SavedMovie {
  movie_id: string;
  title: string;
  poster_path: string;
  vote_average?: number;
  release_date?: string;
}

// Định nghĩa interface cho Context
interface MovieContextType {
  savedMovies: SavedMovie[];
  saveMovie: (movie: SavedMovie) => Promise<void>;
  unsaveMovie: (movie_id: string) => Promise<void>;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([]);

  // Lấy danh sách phim từ AsyncStorage khi khởi tạo
  useEffect(() => {
    const loadSavedMovies = async () => {
      try {
        const savedMovies = await AsyncStorage.getItem("savedMovies");
        if (savedMovies) {
          setSavedMovies(JSON.parse(savedMovies));
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách phim:", error);
      }
    };
    loadSavedMovies();
  }, []);

  // Lưu phim
  const saveMovie = async (movie: SavedMovie) => {
    try {
      const savedMovies = await AsyncStorage.getItem("savedMovies");
      const movies: SavedMovie[] = savedMovies ? JSON.parse(savedMovies) : [];
      if (!movies.some((m) => m.movie_id === movie.movie_id)) {
        movies.push(movie);
        await AsyncStorage.setItem("savedMovies", JSON.stringify(movies));
        setSavedMovies(movies); // Cập nhật trạng thái Context
      }
    } catch (error) {
      console.error("Lỗi khi lưu phim:", error);
      throw error;
    }
  };

  // Xóa phim
  const unsaveMovie = async (movie_id: string) => {
    try {
      const savedMovies = await AsyncStorage.getItem("savedMovies");
      let movies: SavedMovie[] = savedMovies ? JSON.parse(savedMovies) : [];
      movies = movies.filter((m) => m.movie_id !== movie_id);
      await AsyncStorage.setItem("savedMovies", JSON.stringify(movies));
      setSavedMovies(movies); // Cập nhật trạng thái Context
    } catch (error) {
      console.error("Lỗi khi xóa phim:", error);
      throw error;
    }
  };

  return (
    <MovieContext.Provider value={{ savedMovies, saveMovie, unsaveMovie }}>
      {children}
    </MovieContext.Provider>
  );
};

// Hook để sử dụng Context
export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovieContext phải được dùng trong MovieProvider");
  }
  return context;
};
