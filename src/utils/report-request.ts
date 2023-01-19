import axios, { AxiosRequestConfig } from 'axios';
import moment from 'moment';
import { Md5 } from 'ts-md5';

let no = 1;
const instance = axios.create({
  baseURL: 'https://acooly.cn',
});

const accessKey = '23011814432200340007';
const secretKey = '9ca84266b574379f7d8045f20fc870e7';

// 设置报文头和公共参数
function setHeader(config: any) {
  no++;

  const params = {
    requestNo: moment().format('YYYYMMDDHHmmssSSSS') + no,
    version: '1.0',
    partnerId: accessKey,
  };
  config.params
    ? (config.params = { ...config.params, ...params })
    : (config.data = { ...config.data, ...params });

  const headers = {
    'x-api-accesskey': accessKey,
    'x-api-signType': 'MD5',
    'x-api-sign': getSign(config.data, secretKey),
  };
  config.headers = { ...config.headers, ...headers };
}

function getSign(data: any, secretKey: any) {
  const waitForSignString = JSON.stringify(data);
  const signString = waitForSignString + secretKey;
  return Md5.hashStr(signString);
}

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    setHeader(config);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default instance;
