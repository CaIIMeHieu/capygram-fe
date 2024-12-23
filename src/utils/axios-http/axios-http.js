/* eslint-disable */
import { refreshToken } from "@/api/authApi/auth";
import axios from "axios";

//tao ra instance axios cho cac request khong can token
const createAxiosInstance = (baseURL) => {
  return axios.create({
    baseURL,
    headers: {
      "ngrok-skip-browser-warning": "69420",
    },
  });
};

const createAuthInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    headers: {
      "ngrok-skip-browser-warning": "69420",
    },
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response.status === 500) {
        try {
          const data = await refreshToken();

          console.log(data);
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);

          // gắn accessToken cho instance
          instance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${data.accessToken}`;
          //thực hiện request bị lỗi
          return instance;
        } catch (error) {
          console.error(error);
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const publicInstance = createAxiosInstance(import.meta.env.VITE_APP_URL_BE);
const authInstance = createAuthInstance(import.meta.env.VITE_APP_URL_BE);
const postInstance = createAuthInstance(import.meta.env.VITE_APP_URL_BE_POST);
const graphInstance = createAuthInstance(import.meta.env.VITE_APP_URL_BE_GRAPH);
const newsFeedInstance = createAuthInstance(
  import.meta.env.VITE_APP_URL_BE_NEWSFEED
);
const chatInstance = createAuthInstance(import.meta.env.VITE_APP_URL_BE_CHAT);

const request = (instance, config) => {
  return instance({
    ...config,
    headers: {
      "ngrok-skip-browser-warning": "69420",
    },
  });
};

const requestWithToken = (instance, config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Bạn cần phải đăng nhập để thực hiện chức năng này!");
  }
  return instance({
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
      "ngrok-skip-browser-warning": "69420", // Thêm header ở đây
    },
  });
};

export {
  request,
  requestWithToken,
  authInstance,
  publicInstance,
  postInstance,
  graphInstance,
  newsFeedInstance,
  chatInstance,
};
