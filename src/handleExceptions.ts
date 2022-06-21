import Cookies from "js-cookie";
import { AxiosResponse, AxiosError } from "axios";
export interface apiResponse<T> {
  code: number;
  data: T;
  msg: string;
  time: number;
  total?: number;
}
// 处理异常
export const handleError = (res: AxiosResponse | AxiosError) =>
  new Promise((resolve, reject) => {
    if (res instanceof AxiosError) {
      const { status } = res.response || {};
      switch (status) {
        case 401:
          reject("请重新登录");
          Cookies.remove("token");
          break;
        case 403:
          reject("您没有相关权限");
          break;
        case 500:
          reject("服务器繁忙");
          break;
        default:
          reject("未知错误");
      }
    } else {
      const { data } = res;
      data.code === 200 ? resolve(data) : reject(data);
    }
  });
