import axios from 'axios';
import { signParameters } from './signature';

const BASE_URL = '/procoin'; // TODO env

const instance = axios.create({
  baseURL: BASE_URL,
});

export const apiPost = (
  url: string,
  data: any,
): Promise<{ code: string; msg: string; data: any }> => {
  const formData = new FormData();
  const json = signParameters(data);

  for (const i in json) {
    formData.append(i, json[i]);
  }

  return new Promise((resolve, reject) => {
    instance
      .post(url, formData, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      .then((res) => {
        const data: { code: string; msg: string; data: any } = res.data;

        if (data.code !== '200') {
          if (data.code === '40009') {
            // store.default.dispatch('removeCurrentUserInfo')
            // router.default.push({path: '/user/authentication'})
          } else if (data.code === '40090') {
            //实名验证
            // router.default.push({path: '/user/authentication'})
          }

          // Toast.show(data.msg);
        }

        resolve(data);
      })
      .catch(function (error) {
        console.log(error);
        // Message({
        //   message: '网络错误,请检查',
        //   type: 'warning',
        //   duration: 3 * 1000
        // });
        reject();
      });
  });
};

export default instance;
