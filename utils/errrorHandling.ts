import axios from "axios";

const errorHandling = (error: unknown): string => {
  let message = "";

  if (axios.isAxiosError(error)) {
    message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return message;
};

export default errorHandling;
