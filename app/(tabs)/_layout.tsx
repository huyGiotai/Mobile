import { Tabs } from "expo-router";
import { ImageBackground, Image, Text, View } from "react-native";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

// Component TabIcon để hiển thị biểu tượng và tiêu đề cho mỗi tab
// Nhận các props: focused (trạng thái tab được chọn), icon (hình ảnh biểu tượng), title (tiêu đề tab)
function TabIcon({ focused, icon, title }: any) {
  // Khi tab được chọn (focused), hiển thị nền highlight với biểu tượng và tiêu đề
  if (focused) {
    return (
      <ImageBackground
        source={images.highlight} // Hình nền highlight khi tab được chọn
        className="flex flex-row w-full flex-1 min-w-[112px] min-h-14 mt-4 justify-center items-center rounded-full overflow-hidden"
        // Sử dụng Tailwind để tạo bố cục flex-row, căn giữa, và bo góc
      >
        <Image
          source={icon} // Biểu tượng của tab
          tintColor="#151312" // Màu biểu tượng khi được chọn
          className="size-5" // Kích thước 5 (khoảng 20px)
        />
        <Text className="text-secondary text-base font-semibold ml-2">
          {title} {/* Tiêu đề tab, hiển thị khi được chọn */}
        </Text>
      </ImageBackground>
    );
  }

  // Khi tab không được chọn, chỉ hiển thị biểu tượng
  return (
    <View className="size-full justify-center items-center mt-4 rounded-full">
      {/* Sử dụng View với Tailwind để căn giữa biểu tượng */}
      <Image
        source={icon} // Biểu tượng của tab
        tintColor="#A8B5DB" // Màu biểu tượng khi không được chọn
        className="size-5" // Kích thước 5 (khoảng 20px)
      />
    </View>
  );
}

// Component chính định nghĩa bố cục điều hướng tab
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false, // Ẩn nhãn mặc định của tab
        tabBarItemStyle: {
          width: "100%", // Mỗi tab chiếm toàn bộ chiều rộng
          height: "100%", // Mỗi tab chiếm toàn bộ chiều cao
          justifyContent: "center", // Căn giữa nội dung theo chiều dọc
          alignItems: "center", // Căn giữa nội dung theo chiều ngang
        },
        tabBarStyle: {
          backgroundColor: "#0F0D23", // Màu nền của thanh tab
          borderRadius: 50, // Bo góc thanh tab
          marginHorizontal: 20, // Khoảng cách hai bên
          marginBottom: 36, // Khoảng cách phía dưới
          height: 52, // Chiều cao thanh tab
          position: "absolute", // Đặt vị trí tuyệt đối để nổi lên trên nội dung
          overflow: "hidden", // Ẩn nội dung tràn ra ngoài
          borderWidth: 1, // Viền thanh tab
          borderColor: "#0F0D23", // Màu viền
        },
      }}
    >
      {/* Tab Home */}
      <Tabs.Screen
        name="index" // Tên route (liên kết với file index.tsx)
        options={{
          title: "index", // Tiêu đề (không hiển thị do tabBarShowLabel: false)
          headerShown: false, // Ẩn header
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Home" />
            // Sử dụng TabIcon với biểu tượng home và tiêu đề Home
          ),
        }}
      />

      {/* Tab Search */}
      <Tabs.Screen
        name="search" // Tên route (liên kết với file search.tsx)
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} title="Search" />
          ),
        }}
      />

      {/* Tab Save */}
      <Tabs.Screen
        name="save" // Tên route (liên kết với file save.tsx)
        options={{
          title: "Save",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.save} title="Save" />
          ),
        }}
      />

      {/* Tab Profile */}
      <Tabs.Screen
        name="profile" // Tên route (liên kết với file profile.tsx)
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.person} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
}