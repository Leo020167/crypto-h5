import md5 from 'js-md5';
import { UserInfo } from '../api/model';
import { User } from '../model';
import { useAuthStore } from '../stores/auth';

const apiSecret = 'C2AE585AB6814937960DF0E0A22DF3FD';
const apiKey = '2CE2BA19C7CA4937AD18BC1AFEE034E8';

// 通过字面量方式实现的函数each
const each = function (object: any, callback: any) {
  const type = (function () {
    switch (object.constructor) {
      case Object:
        return 'Object';
      case Array:
        return 'Array';
      case NodeList:
        return 'NodeList';
      default:
        return 'null';
    }
  })();
  // 为数组或类数组时, 返回: index, value
  if (type === 'Array' || type === 'NodeList') {
    // 由于存在类数组NodeList, 所以不能直接调用every方法
    [].every.call(object, function (v, i) {
      return callback.call(v, i, v) === false ? false : true;
    });
  }
  // 为对象格式时,返回:key, value
  else if (type === 'Object') {
    for (const i in object) {
      if (callback.call(object[i], i, object[i]) === false) {
        break;
      }
    }
  }
};

export default each;

export function signParameters(json: any = {}) {
  let array: any = [];
  if (!json.platform) {
    json['platform'] = 'web';
  }
  json['apiKey'] = apiKey;
  json['timestamp'] = +new Date();

  let user: UserInfo | undefined = undefined;
  try {
    user = useAuthStore.getState().userInfo;
  } catch (error) {
    /* empty */
  }

  let token: string | undefined = '';
  try {
    token = useAuthStore.getState().token;
  } catch (error) {
    /* empty */
  }

  if (user && token) {
    json['token'] = token;
    json['userId'] = user.userId;
  } else {
    json['token'] = '';
    json['userId'] = '';
  }

  each(json, function (key: string) {
    array[array.length] = key;
  });
  array = array.filter((v: string) => v !== 'sign');
  array.sort();
  let sign = '';
  let value;

  each(array, function (i: number, key: string) {
    value = json[key];
    if (value !== '' && value !== null) {
      sign = sign + value;
    }
  });

  sign = sign + apiSecret;

  json['sign'] = md5(sign).toUpperCase();
  return json;
}

export function signParametersToURL(json: any) {
  const array: any = [];
  if (!json.platform) {
    json['platform'] = 'web';
  }
  json['apiKey'] = apiKey;

  let user: User | null = null;
  try {
    user = JSON.parse(localStorage.getItem('user') ?? '');
  } catch (error) {
    /* empty */
  }

  let token = '';
  try {
    token = JSON.parse(localStorage.getItem('token') ?? '');
  } catch (error) {
    /* empty */
  }

  if (user && token) {
    json['token'] = token;
    json['userId'] = user.userId ? user.userId : '';
  } else {
    json['token'] = '';
    json['userId'] = '';
  }
  each(json, function (key: string) {
    array[array.length] = key;
  });

  array.sort();
  let sign = '';
  let value;

  each(array, function (key: string) {
    value = json[key];
    if (value !== '' && value !== null) {
      sign = sign + value;
    }
  });
  sign = sign + apiSecret;
  json['sign'] = md5(sign).toUpperCase();
  return json;
}
