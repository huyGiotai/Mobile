// Import các thành phần cần thiết từ các thư viện
import { Link } from "expo-router"; // Link từ expo-router để điều hướng đến trang chi tiết phim
import MaskedView from "@react-native-masked-view/masked-view"; // MaskedView để tạo hiệu ứng mask cho số thứ tự
import { View, Text, TouchableOpacity, Image } from "react-native"; // Các thành phần giao diện từ React Native
import { images } from "@/constants/images"; // Import tập hợp các hình ảnh (ví dụ: gradient cho số thứ tự) từ file constants

// Định nghĩa component TrendingCard, nhận các props từ kiểu TrendingCardProps
const TrendingCard = ({
  movie: { movie_id, title, poster_url }, // Đối tượng movie chứa movie_id, title, và poster_url
  index, // Thứ tự của phim trong danh sách (dùng để hiển thị số thứ tự)
}: TrendingCardProps) => {
  return (
    // Link từ expo-router, tạo liên kết đến trang chi tiết phim với URL `/movie/${movie_id}`
    <Link href={`/movie/${movie_id}`} asChild>
      {/* TouchableOpacity làm thẻ bọc để xử lý sự kiện nhấn, tạo hiệu ứng chạm */}
      <TouchableOpacity className="w-32 relative pl-5">
        {/* Hiển thị poster phim bằng thẻ Image */}
        <Image
          source={{ uri: poster_url }} // Sử dụng URL của poster từ props
          className="w-32 h-48 rounded-lg" // Style: chiều rộng 32 đơn vị, chiều cao 48 đơn vị, bo góc
          resizeMode="cover" // Hình ảnh được điều chỉnh để lấp đầy khung, giữ tỷ lệ
        />

        {/* Hiển thị số thứ tự của phim (index + 1) với hiệu ứng gradient */}
        <View className="absolute bottom-9 -left-3.5 px-2 py-1 rounded-full">
          {/* MaskedView để tạo hiệu ứng mask, chỉ hiển thị số thứ tự trong vùng gradient */}
          <MaskedView
            maskElement={
              // Số thứ tự (index + 1) được hiển thị với font đậm, kích thước lớn
              <Text className="font-bold text-white text-6xl">{index + 1}</Text>
            }
          >
            {/* Hình ảnh gradient làm nền cho số thứ tự */}
            <Image
              source={images.rankingGradient} // Gradient từ file constants
              className="size-14" // Kích thước 14x14 đơn vị
              resizeMode="cover" // Hình ảnh lấp đầy khung
            />
          </MaskedView>
        </View>

        {/* Hiển thị tiêu đề phim */}
        <Text
          className="text-sm font-bold mt-2 text-light-200" // Style: kích thước chữ nhỏ, in đậm, margin trên, màu xám nhạt
          numberOfLines={2} // Giới hạn hiển thị 2 dòng, cắt bớt nếu quá dài
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};

// Xuất component để sử dụng ở nơi khác
export default TrendingCard;