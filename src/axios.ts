import Cookies from "js-cookie";
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { handleError } from "./handleExceptions";

type httpMethod =
  | "get"
  | "delete"
  | "head"
  | "options"
  | "post"
  | "put"
  | "patch";
interface HttpRequestInstance {
  get(url: string, params?: AxiosRequestConfig): Promise<AxiosResponse>;
  delete(url: string, params?: AxiosRequestConfig): Promise<AxiosResponse>;
  put(url: string, params?: AxiosRequestConfig): Promise<AxiosResponse>;
  post(url: string, params?: AxiosRequestConfig): Promise<AxiosResponse>;
  options(url: string, params?: AxiosRequestConfig): Promise<AxiosResponse>;
  head(url: string, params?: AxiosRequestConfig): Promise<AxiosResponse>;
  patch(url: string, params?: AxiosRequestConfig): Promise<AxiosResponse>;
}
export class HttpRequest {
  private HttpRequestInstance!: HttpRequestInstance;
  private methods: httpMethod[];
  constructor(http: AxiosInstance) {
    this.methods = ["get", "delete", "put", "post", "options", "head", "patch"];
    this.methods.forEach((method: httpMethod) => {
      this.HttpRequestInstance[method] = (
        url: string,
        params: AxiosRequestConfig
      ) => {
        const PARAMS =
          ["get", "delete"].indexOf(method) > -1 ? { params } : params;
        return http[method](url, PARAMS);
      };
    });
  }
  get requestMethod() {
    return this.HttpRequestInstance;
  }
}

/**
 * @description 通用http请求配置
 * @param { axiosInstance } [axiosInstance] - axios实例，如果没有传入axios实例，则使用默认axios配置，预设了timeout、request拦截器（Authentication）、response拦截器和业务异常处理
 */
export class Http {
  private Axios: AxiosInstance;
  constructor(axiosInstance?: AxiosInstance) {
    this.Axios = axios.create({
      baseURL: "/api",
      timeout: 120000,
    });
    if (axiosInstance) {
      this.Axios = axiosInstance;
    } else {
      this.Axios.interceptors.request.use(
        (config: AxiosRequestConfig) => {
          if (config.headers) {
            config.headers["authentication"] = Cookies.get("token") || "";
          }
          return config;
        },
        (error: AxiosError) => {
          return Promise.reject(error);
        }
      );
      this.Axios.interceptors.response.use(
        (result: AxiosResponse) => {
          return handleError(result);
        },
        (error: AxiosError) => {
          return handleError(error);
        }
      );
    }
  }
  get axiosInstance() {
    return this.Axios;
  }

  get requestMethod() {
    return new HttpRequest(this.Axios).requestMethod;
  }
}
