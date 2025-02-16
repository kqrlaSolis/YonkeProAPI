import { POST } from "./axios.js";

export const sendMessage = async (phone, message) => {
  const request = {
    token: process.env.WHATSAPP_TOKEN,
    to: `+52${phone}`,
    body: message,
  };
  console.log({ request });
  const response = await POST("/messages/chat", request)
    .catch((error) => {
      console.error("Error:", error);
      return false;
    })
    .then((res) => {
      console.log({ res });
      return true;
    });

  return response;
};
