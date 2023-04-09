import { ImageUploaderProps } from 'antd-mobile';
import { first } from 'lodash-es';
import { useIntl } from 'react-intl';
import { uploadImage } from '../utils';

export const useImageUploaderProps = () => {
  const intl = useIntl();
  const props: ImageUploaderProps = {
    upload: async (file: File) => {
      const formData = new FormData();
      formData.append('imageFiles', file);

      const res = await uploadImage(formData);

      if (res.data.code !== '200') {
        throw Error(intl.formatMessage({ defaultMessage: '上傳失敗，請重試', id: 'gqB7Z3' }));
      }

      const item = first(res.data.data?.imageUrlList) as string;

      return {
        key: item,
        url: item,
        thumbnailUrl: item,
      };
    },
  };
  return props;
};
