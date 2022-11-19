import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { signParameters } from '../../utils/signature';

export const AXIOS_INSTANCE = Axios.create({ baseURL: '/procoin' });

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
