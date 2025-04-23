import { View, TextInput, Image } from "react-native";

import { icons } from "@/constants/icons";

// Interface định nghĩa props cho SearchBar
interface Props {
  placeholder: string; // Văn bản placeholder cho ô nhập
  value?: string; // Giá trị hiện tại của ô nhập
  onChangeText?: (text: string) => void; // Hàm xử lý khi văn bản thay đổi
  onPress?: () => void; // Hàm xử lý khi ô nhập được nhấn
}

// Component thanh tìm kiếm với biểu tượng và ô nhập văn bản
const SearchBar = ({ placeholder, value, onChangeText, onPress }: Props) => {
  return (
    // Container chính với bố cục flex-row, nền tối, bo góc
    <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
      {/* Biểu tượng tìm kiếm */}
      <Image
        source={icons.search} // Icon tìm kiếm từ constants
        className="w-5 h-5" // Kích thước icon
        resizeMode="contain" // Giữ tỷ lệ icon
        tintColor="#AB8BFF" // Màu tím nhạt cho icon
      />
      {/* Ô nhập văn bản */}
      <TextInput
        onPress={onPress} // Xử lý sự kiện nhấn ô nhập
        placeholder={placeholder} // Văn bản placeholder
        value={value} // Giá trị hiện tại
        onChangeText={onChangeText} // Xử lý thay đổi văn bản
        className="flex-1 ml-2 text-white" // Chiếm không gian còn lại, margin trái, chữ trắng
        placeholderTextColor="#A8B5DB" // Màu xám tím cho placeholder
      />
    </View>
  );
};

export default SearchBar;