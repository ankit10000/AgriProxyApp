import { useState } from 'react';
import Toast from 'react-native-toast-message';

interface UseApiMutationOptions {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  showToast?: boolean;
}

interface UseApiMutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData | null>;
  loading: boolean;
  error: string | null;
  data: TData | null;
}

export function useApiMutation<TData = any, TVariables = any>(
  apiFunction: (variables: TVariables) => Promise<TData>,
  options: UseApiMutationOptions = {}
): UseApiMutationResult<TData, TVariables> {
  const { successMessage, errorMessage, onSuccess, onError, showToast = true } = options;

  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (variables: TVariables): Promise<TData | null> => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await apiFunction(variables);
      setData(result);

      if (successMessage && showToast) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: successMessage,
          position: 'top',
        });
      }

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
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

      if (onError) {
        onError(errorMsg);
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    mutate,
    loading,
    error,
    data,
  };
}