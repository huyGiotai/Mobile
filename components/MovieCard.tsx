// Import các thành phần cần thiết từ các thư viện
import { Link } from "expo-router"; // Link từ expo-router để điều hướng đến trang chi tiết phim
import { Text, Image, TouchableOpacity, View } from "react-native"; // Các thành phần giao diện từ React Native
import { icons } from "@/constants/icons"; // Import icons (ví dụ: biểu tượng ngôi sao) từ một file constants

// Định nghĩa component MovieCard, nhận các props từ kiểu Movie
const MovieCard = ({
  id, // ID duy nhất của phim, dùng để điều hướng đến trang chi tiết
  poster_path, // Đường dẫn đến poster của phim (từ API như TMDB)
  title, // Tiêu đề của phim
  vote_average, // Điểm đánh giá trung bình của phim (thang điểm 10)
  release_date, // Ngày phát hành của phim (định dạng chuỗi, ví dụ: "2023-04-26")
}: Movie) => {
  return (
    // Link từ expo-router, tạo liên kết đến trang chi tiết phim với URL `/movie/${id}`
    <Link href={`/movie/${id}`} asChild>
      {/* TouchableOpacity làm thẻ bọc để xử lý sự kiện nhấn, tạo hiệu ứng chạm */}
      <TouchableOpacity className="w-[30%]">
        {/* Hiển thị poster phim bằng thẻ Image */}
        <Image
          source={{
            // Nếu poster_path tồn tại, sử dụng URL từ TMDB API
            // Nếu không, sử dụng hình ảnh placeholder
            uri: poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : "https://placehold.co/600x400/1a1a1a/FFFFFF.png",
          }}
          // Áp dụng style: chiều rộng full, chiều cao 52 đơn vị, bo góc
          className="w-full h-52 rounded-lg"
          resizeMode="cover" // Hình ảnh được điều chỉnh để lấp đầy khung, giữ tỷ lệ
        />

        {/* Hiển thị tiêu đề phim */}
        <Text
          className="text-sm font-bold text-white mt-2" // Style: kích thước chữ nhỏ, in đậm, màu trắng, margin trên
          numberOfLines={1} // Giới hạn hiển thị 1 dòng, cắt bớt nếu quá dài
        >
          {title}
        </Text>

        {/* Hiển thị điểm đánh giá phim */}
        <View className="flex-row items-center justify-start gap-x-1">
          {/* Icon ngôi sao từ file constants */}
          <Image source={icons.star} className="size-4" />
          {/* Hiển thị điểm đánh giá, chuyển từ thang 10 sang thang 5 và làm tròn */}
          <Text className="text-xs text-white font-bold uppercase">
            {Math.round(vote_average / 2)}
          </Text>
        </View>

        {/* Hiển thị năm phát hành và loại nội dung */}
        <View className="flex-row items-center justify-between">
          {/* Lấy năm từ release_date bằng cách cắt chuỗi tại dấu "-" */}
          <Text className="text-xs text-light-300 font-medium mt-1">
            {release_date?.split("-")[0]}
          </Text>
          {/* Hiển thị loại nội dung, mặc định là "Movie" */}
          <Text className="text-xs font-medium text-light-300 uppercase">
            Movie
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

// Xuất component để sử dụng ở nơi khác
export default MovieCard;