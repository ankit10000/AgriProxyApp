import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';

interface UseApiQueryOptions {
  successMessage?: string;
  errorMessage?: string;
  enabled?: boolean;
  showToast?: boolean;
}

interface UseApiQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useApiQuery<T>(
  apiFunction: () => Promise<T>,
  options: UseApiQueryOptions = {}
): UseApiQueryResult<T> {
  const { successMessage, errorMessage, enabled = true, showToast = true } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction();
      setData(result);

      if (successMessage && showToast) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: successMessage,
          position: 'top',
        });
      }
    } catch (err: any) {
      const errorMsg = errorMessage || err?.message || 'Something went wrong';
      setError(errorMsg);

      if (showToast) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMsg,
          position: 'top',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}