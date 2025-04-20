import { Client, Databases, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const SAVED_MOVIES_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_MOVIES_COLLECTION_ID!;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

// Hàm lưu phim vào danh sách yêu thích
export const saveMovie = async (movie: { movie_id: string; title: string; poster_path: string }) => {
  try {
    // Kiểm tra xem phim đã được lưu chưa
    const result = await database.listDocuments(DATABASE_ID, SAVED_MOVIES_COLLECTION_ID, [
      Query.equal("movie_id", movie.movie_id),
    ]);

    if (result.documents.length === 0) {
      // Nếu chưa lưu, tạo document mới
      await database.createDocument(DATABASE_ID, SAVED_MOVIES_COLLECTION_ID, ID.unique(), {
        movie_id: movie.movie_id,
        title: movie.title,
        poster_path: movie.poster_path,
      });
    }
  } catch (error) {
    console.error("Error saving movie:", error);
    throw error;
  }
};

// Hàm xóa phim khỏi danh sách yêu thích
export const unsaveMovie = async (movie_id: string) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, SAVED_MOVIES_COLLECTION_ID, [
      Query.equal("movie_id", movie_id),
    ]);

    if (result.documents.length > 0) {
      await database.deleteDocument(
        DATABASE_ID,
        SAVED_MOVIES_COLLECTION_ID,
        result.documents[0].$id
      );
    }
  } catch (error) {
    console.error("Error unsaving movie:", error);
    throw error;
  }
};

// Hàm lấy danh sách phim yêu thích
export const getSavedMovies = async (): Promise<SavedMovie[]> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, SAVED_MOVIES_COLLECTION_ID);
    return result.documents as unknown as SavedMovie[];
  } catch (error) {
    console.error("Error fetching saved movies:", error);
    return [];
  }
};

// Các hàm hiện có (giữ nguyên)
export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
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
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

// Định nghĩa interface cho SavedMovie
export interface SavedMovie {
  movie_id: string;
  title: string;
  poster_path: string;
}