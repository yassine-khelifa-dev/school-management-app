import axios, { isAxiosError } from "axios";

export type ApiErrorType = {
  status?: number;
  type: "backend" | "network" | "axios" | "frontend" | "cancelled";
  message: string;
};

export function parseApiError(err: unknown): ApiErrorType {
  if (axios.isCancel(err)) {
    return {
      type: "cancelled",
      message: "Request cancelled",
    };
  }

  if (isAxiosError(err)) {
    if (err.response) {
      const status = err.response.status;

      if (status >= 500) {
        return {
          type: "backend",
          status,
          message:
            "An unexpected server error occurred. Please try again later.",
        };
      }

      return {
        type: "backend",
        status,
        message: err.response.data?.message ?? "Backend error",
      };
    }

    if (err.request) {
      return {
        type: "network",
        message: "Unable to reach the server.",
      };
    }

    return {
      type: "axios",
      message: err.message || "Request error.",
    };
  }

  if (err instanceof Error) {
    return {
      type: "frontend",
      message: err.message,
    };
  }

  return {
    type: "frontend",
    message: "Something went wrong.",
  };
}
