// Định nghĩa cấu hình cho TMDB API
export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3", // URL gốc của TMDB API
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY, // Lấy API key từ biến môi trường
  headers: {
    accept: "application/json", // Yêu cầu định dạng JSON cho phản hồi
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`, // Token xác thực Bearer
  },
};

// Hàm lấy danh sách phim dựa trên truy vấn tìm kiếm hoặc danh sách phim phổ biến
export const fetchMovies = async ({
  query, // Từ khóa tìm kiếm (nếu có)
  page = 1, // Số trang, mặc định là 1
}: {
  query: string;
  page?: number;
}): Promise<Movie[]> => {
  // Xác định endpoint dựa trên việc có query hay không
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(
        query
      )}&page=${page}` // Nếu có query, gọi API tìm kiếm
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`; // Nếu không, lấy danh sách phim phổ biến, sắp xếp theo độ phổ biến

  // Gửi yêu cầu GET đến endpoint
  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers, // Sử dụng headers từ TMDB_CONFIG
  });

  // Kiểm tra nếu phản hồi không thành công
  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  // Chuyển đổi phản hồi sang JSON và trả về danh sách phim
  const data = await response.json();
  return data.results;
};

// Hàm lấy chi tiết một bộ phim dựa trên movieId
export const fetchMovieDetails = async (
  movieId: string
): Promise<MovieDetails> => {
  try {
    // Gửi yêu cầu GET đến endpoint chi tiết phim
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers, // Sử dụng headers từ TMDB_CONFIG
      }
    );

    // Kiểm tra nếu phản hồi không thành công
    if (!response.ok) {
      throw new Error(`Failed to fetch movie details: ${response.statusText}`);
    }

    // Chuyển đổi phản hồi sang JSON và trả về dữ liệu chi tiết phim
    const data = await response.json();
    return data;
  } catch (error) {
    // Ghi log lỗi và ném lại lỗi để xử lý ở nơi gọi hàm
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

// Hàm lấy danh sách video (trailer, teaser, v.v.) của một bộ phim
export const fetchMovieVideos = async (
  movieId: string
): Promise<{ key: string; type: string }[]> => {
  // Kiểm tra nếu API key bị thiếu
  if (!TMDB_CONFIG.API_KEY) {
    throw new Error("TMDB API key is missing in environment variables.");
  }

  try {
    // Gửi yêu cầu GET đến endpoint video, ưu tiên ngôn ngữ tiếng Việt
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_CONFIG.API_KEY}&language=vi-VN`
    );

    // Nếu phản hồi không thành công, ghi log và trả về mảng rỗng
    if (!response.ok) {
      console.error(
        `Failed to fetch videos: ${response.status} - ${response.statusText}`
      );
      return [];
    }

    // Chuyển đổi phản hồi sang JSON và trả về danh sách video
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    // Ghi log lỗi và trả về mảng rỗng để tránh crash ứng dụng
    console.error(`Error fetching videos for movie ${movieId}:`, error);
    return [];
  }
};