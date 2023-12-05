import axios from "axios";

// 全局配置
axios.defaults.timeout = 30000;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.withCredentials = false;

// 请求拦截
axios.interceptors.request.use(
  (request) => {
    return request;
  },
  (error) => {
    console.error("请求失败，请稍后重试");
    return Promise.reject(error);
  },
);

// 响应拦截
axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      const data = error.response?.data;
      console.error("请求失败，请稍后重试：" + data);
    } else {
      console.error("请求失败，请稍后重试:" + error);
    }
    return Promise.reject(error);
  },
);

export default axios;
