import axios from "axios";

const base_url = "https://api.wali.chat/v1";

const axios_instance = axios.create({
  baseURL: base_url,
  timeout: 0,
  headers: {
   'Token': '25c6b3832fdb2b79b85ee7f933b7f1542e1f138bf6ad2a463aba8e1b3b153a71f200ccfed848e117', 
    'Content-Type': 'application/json'
  }
});


export const POST = async (url, data) => { //funcion para hacer peticiones POST a la API
  return axios_instance
    .post(url, data)
    .then((res) => res.data)
    .catch((error) => Promise.reject(error));
}
