import { useState } from "react";
import { parseApiError, type ApiErrorType } from "../utils/apiError";

export default function useApiError() {
  const [error, setErrors] = useState<ApiErrorType | null>(null);

  const clearError = () => setErrors(null);

  const handleError = (err: unknown) => {
    const parsedError = parseApiError(err);

    setErrors(parsedError);

    return parsedError;
  };

  return {
    error,
    clearError,
    handleError,
  };
}
