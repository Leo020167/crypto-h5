import { Toast } from 'antd-mobile';
import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useAuthStore } from '../../stores/auth';
import { signParameters } from '../../utils/signature';

// http://market.piglobalexchanges.com 正式域名

export const AXIOS_INSTANCE = Axios.create({
  baseURL: '/procoin-market',
});

AXIOS_INSTANCE.interceptors.response.use(
  (config) => {
    if (Number(config.data.code) !== 200) {
      Toast.show(config.data.msg);
    }

    if (config.data.code === 40009) {
      useAuthStore.setState({ token: undefined, userInfo: undefined });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();

  const formData = new FormData();
  const json = signParameters(config.data);

  for (const i in json) {
    formData.append(i, json[i]);
  }

  const promise = AXIOS_INSTANCE({
    ...config,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: formData,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled by Vue Query');
  };

  return promise;
};

export default customInstance;

export type ErrorType<Error> = AxiosError<Error>;
