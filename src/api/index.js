import axios from "@/utils/request";
import jsonpAdapter from "axios-jsonp";

/**
 * 获取天气
 * https://api.oioweb.cn/doc/weather/GetWeather
 */
export const getWeather = () => {
  return axios({
    method: "GET",
    url: "https://api.oioweb.cn/api/weather/GetWeather",
  });
};

/**
 * 获取搜索建议
 * https://suggestion.baidu.com
 * @param {String} keyWord - 搜索关键字
 */
export const getSearchSuggestions = async (keyWord) => {
  try {
    const response = await axios({
      url: `https://suggestion.baidu.com/su?wd=${keyWord}&cb=json`,
      adapter: jsonpAdapter,
      callbackParamName: "cb",
    });
    return response.s;
  } catch (error) {
    console.error("处理搜索建议发生错误：", error);
    return null;
  }
};
