import { useState, useEffect } from "react";
import { Alert } from "react-native";

export function useAppwrite<T, A extends any[]>(
  callback: (...args: A) => Promise<T>,
  ...args: A
) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await callback(...args);
      setData(response);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [callback]);

  const refresh = () => fetchData();

  return { data, loading, refresh };
}
