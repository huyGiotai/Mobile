import { Client, Databases, ID, Query } from "react-native-appwrite";

// Định nghĩa các biến môi trường cho Appwrite
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!; // ID của cơ sở dữ liệu
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!; // ID của collection lưu lịch sử tìm kiếm
const SAVED_MOVIES_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_MOVIES_COLLECTION_ID!; // ID của collection lưu phim yêu thích

// Khởi tạo Appwrite Client
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Endpoint của Appwrite
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!); // ID dự án Appwrite

// Khởi tạo đối tượng Databases để tương tác với cơ sở dữ liệu
const database = new Databases(client);

// Định nghĩa interface cho phim đã lưu
export interface SavedMovie {
  movie_id: string; // ID duy nhất của phim
  title: string; // Tiêu đề phim
  poster_path: string; // Đường dẫn đến poster phim
}

// Hàm lưu phim vào danh sách yêu thích
export const saveMovie = async (movie: { movie_id: string; title: string; poster_path: string }) => {
  try {
    // Kiểm tra xem phim đã được lưu trong collection SAVED_MOVIES_COLLECTION_ID chưa
    const result = await database.listDocuments(DATABASE_ID, SAVED_MOVIES_COLLECTION_ID, [
      Query.equal("movie_id", movie.movie_id), // Tìm document có movie_id khớp
    ]);

    if (result.documents.length === 0) {
      // Nếu phim chưa được lưu, tạo document mới
      await database.createDocument(DATABASE_ID, SAVED_MOVIES_COLLECTION_ID, ID.unique(), {
        movie_id: movie.movie_id,
        title: movie.title,
        poster_path: movie.poster_path,
      });
    }
  } catch (error) {
    console.error("Error saving movie:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
};

// Hàm xóa phim khỏi danh sách yêu thích
export const unsaveMovie = async (movie_id: string) => {
  try {
    // Tìm document phim trong collection SAVED_MOVIES_COLLECTION_ID
    const result = await database.listDocuments(DATABASE_ID, SAVED_MOVIES_COLLECTION_ID, [
      Query.equal("movie_id", movie_id), // Tìm document có movie_id khớp
    ]);

    if (result.documents.length > 0) {
      // Nếu tìm thấy, xóa document
      await database.deleteDocument(
        DATABASE_ID,
        SAVED_MOVIES_COLLECTION_ID,
        result.documents[0].$id // ID của document
      );
    }
  } catch (error) {
    console.error("Error unsaving movie:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
};

// Hàm lấy danh sách phim yêu thích
export const getSavedMovies = async (): Promise<SavedMovie[]> => {
  try {
    // Lấy tất cả document từ collection SAVED_MOVIES_COLLECTION_ID
    const result = await database.listDocuments(DATABASE_ID, SAVED_MOVIES_COLLECTION_ID);
    return result.documents as unknown as SavedMovie[]; // Ép kiểu dữ liệu về SavedMovie[]
  } catch (error) {
    console.error("Error fetching saved movies:", error);
    return []; // Trả về mảng rỗng nếu có lỗi
  }
};

// Hàm cập nhật số lượt tìm kiếm cho một phim
export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    // Tìm document trong collection COLLECTION_ID với searchTerm khớp
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);

    if (result.documents.length > 0) {
      // Nếu đã có, tăng count lên 1
      const existingMovie = result.documents[0];
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1, // Cập nhật trường count
        }
      );
    } else {
      // Nếu chưa có, tạo document mới
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        title: movie.title,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
};

// Hàm lấy danh sách phim xu hướng (top 5 phim được tìm kiếm nhiều nhất)
export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
  try {
    // Lấy 5 document từ collection COLLECTION_ID, sắp xếp theo count giảm dần
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5), // Giới hạn 5 document
      Query.orderDesc("count"), // Sắp xếp theo count giảm dần
    ]);

    return result.documents as unknown as TrendingMovie[]; // Ép kiểu dữ liệu về TrendingMovie[]
  } catch (error) {
    console.error(error);
    return undefined; // Trả về undefined nếu có lỗi
  }
};