// Import các hook cần thiết từ React
import { useState, useEffect } from "react";

// Định nghĩa custom hook useFetch, nhận hai tham số:
// - fetchFunction: Hàm bất đồng bộ trả về Promise với dữ liệu kiểu T
// - autoFetch: Quyết định có tự động gọi fetchFunction khi component mount hay không (mặc định true)
const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
  // State để lưu trữ dữ liệu trả về từ fetchFunction
  const [data, setData] = useState<T | null>(null);
  // State để theo dõi trạng thái loading
  const [loading, setLoading] = useState(false);
  // State để lưuBTC: lưu trữ lỗi nếu có
  const [error, setError] = useState<Error | null>(null);

  // Hàm thực hiện gọi API
  const fetchData = async () => {
    try {
      // Bắt đầu loading, xóa lỗi cũ
      setLoading(true);
      setError(null);

      // Gọi hàm fetchFunction và lưu kết quả vào state
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      // Xử lý lỗi, đảm bảo err là instance của Error
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
    } finally {
      // Kết thúc loading
      setLoading(false);
    }
  };

  // Hàm reset để đặt lại các state về giá trị ban đầu
  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  // useEffect để tự động gọi fetchData khi component mount nếu autoFetch là true
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, []); // Mảng dependencies rỗng: chỉ chạy một lần khi mount

  // Trả về object chứa các state và hàm để sử dụng
  return { data, loading, error, refetch: fetchData, reset };
};

// Xuất hook để sử dụng ở các component khác
export default useFetch;