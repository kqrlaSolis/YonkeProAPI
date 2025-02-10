import { POST } from "./axios.js";

export const sendMesssage = async (phone, message) => {
  const request = {
    phone: `+52${phone}`,
    message: message,
  };
  const response = await POST("/messages", request);

  return response.data;
};
