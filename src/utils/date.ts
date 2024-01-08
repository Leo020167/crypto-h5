import moment from 'moment';

export const stringDateFormat = (value?: string, format = 'YYYY-MM-DD HH:mm') => {
  if (value) {
    return moment(new Date(Number(value) * 1000)).format(format);
  }
  return '-';
};
