import { AXIOS_UPLOAD_INSTANCE } from '../api/mutator/custom-instance';
import each, { signParametersToURL } from './signature';

export const uploadImage = (imageFiles: FormData) => {
  const array = signParametersToURL({
    dir: 'common',
    type: 'imageRetOriginal',
  });

  each(array, function (key: string, value: any) {
    imageFiles.append(key, value);
  });

  return AXIOS_UPLOAD_INSTANCE.post<{ data: { imageUrlList?: string[] }; code: string }>(
    '/upload/file.do',
    imageFiles,
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
  );
};
