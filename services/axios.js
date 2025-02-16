import axios from "axios";

const base_url = "https://api.ultramsg.com/instance107474";

const axios_instance = axios.create({
  baseURL: base_url,
  timeout: 0,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});


export const POST = async (url, data) => { //funcion para hacer peticiones POST a la API
  return axios_instance
    .post(url, data)
    .then((res) => res.data)
    .catch((error) => Promise.reject(error));
};
