import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Định nghĩa interface cho phim đã lưu
export interface SavedMovie {
  movie_id: string; // ID duy nhất của phim
  title: string; // Tiêu đề phim
  poster_path: string; // Đường dẫn đến poster phim
  vote_average?: number; // Điểm đánh giá trung bình (tùy chọn)
  release_date?: string; // Ngày phát hành (tùy chọn)
}

// Định nghĩa interface cho Context
interface MovieContextType {
  savedMovies: SavedMovie[]; // Danh sách phim đã lưu
  saveMovie: (movie: SavedMovie) => Promise<void>; // Hàm lưu phim
  unsaveMovie: (movie_id: string) => Promise<void>; // Hàm xóa phim
}

// Tạo Context với giá trị mặc định là undefined
const MovieContext = createContext<MovieContextType | undefined>(undefined);

// Component Provider bọc ứng dụng để cung cấp Context
export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State lưu trữ danh sách phim đã lưu
  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([]);

  // Effect để tải danh sách phim từ AsyncStorage khi component khởi tạo
  useEffect(() => {
    const loadSavedMovies = async () => {
      try {
        // Lấy dữ liệu từ AsyncStorage với key "savedMovies"
        const savedMovies = await AsyncStorage.getItem("savedMovies");
        if (savedMovies) {
          // Parse JSON và cập nhật state nếu có dữ liệu
          setSavedMovies(JSON.parse(savedMovies));
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách phim:", error);
      }
    };
    loadSavedMovies();
  }, []); // Chỉ chạy một lần khi component mount

  // Hàm lưu phim vào danh sách
  const saveMovie = async (movie: SavedMovie) => {
    try {
      // Lấy danh sách phim hiện tại từ AsyncStorage
      const savedMovies = await AsyncStorage.getItem("savedMovies");
      const movies: SavedMovie[] = savedMovies ? JSON.parse(savedMovies) : [];
      // Kiểm tra phim chưa tồn tại trong danh sách
      if (!movies.some((m) => m.movie_id === movie.movie_id)) {
        movies.push(movie); // Thêm phim mới
        // Lưu danh sách mới vào AsyncStorage
        await AsyncStorage.setItem("savedMovies", JSON.stringify(movies));
        // Cập nhật state Context
        setSavedMovies(movies);
      }
    } catch (error) {
      console.error("Lỗi khi lưu phim:", error);
      throw error; // Ném lỗi để xử lý ở nơi gọi
    }
  };

  // Hàm xóa phim khỏi danh sách
  const unsaveMovie = async (movie_id: string) => {
    try {
      // Lấy danh sách phim hiện tại từ AsyncStorage
      const savedMovies = await AsyncStorage.getItem("savedMovies");
      let movies: SavedMovie[] = savedMovies ? JSON.parse(savedMovies) : [];
      // Lọc bỏ phim có movie_id tương ứng
      movies = movies.filter((m) => m.movie_id !== movie_id);
      // Lưu danh sách mới vào AsyncStorage
      await AsyncStorage.setItem("savedMovies", JSON.stringify(movies));
      // Cập nhật state Context
      setSavedMovies(movies);
    } catch (error) {
      console.error("Lỗi khi xóa phim:", error);
      throw error; // Ném lỗi để xử lý ở nơi gọi
    }
  };

  // Cung cấp Context với các giá trị savedMovies, saveMovie, unsaveMovie
  return (
    <MovieContext.Provider value={{ savedMovies, saveMovie, unsaveMovie }}>
      {children}
    </MovieContext.Provider>
  );
};

// Hook tùy chỉnh để sử dụng Context
export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (!context) {
    // Ném lỗi nếu hook được gọi ngoài MovieProvider
    throw new Error("useMovieContext phải được dùng trong MovieProvider");
  }
  return context;
};