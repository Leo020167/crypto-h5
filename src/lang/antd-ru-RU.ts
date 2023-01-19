const typeTemplate = '${label}не является допустимым${type}';
const ruRU = {
  locale: 'ru-RU',
  common: {
    confirm: 'ОК',
    cancel: 'Отмена',
    loading: 'загрузка',
  },
  Calendar: {
    markItems: ['один', 'два', 'три', 'четыре', 'пять', 'шесть', 'день'],
    renderYearAndMonth: (year: number, month: number) => `${year}год${month}месяц`,
  },
  Cascader: {
    placeholder: 'пожалуйста, выбери',
  },
  Dialog: {
    ok: 'Я понимаю',
  },
  ErrorBlock: {
    default: {
      title: 'На странице возникли небольшие проблемы',
      description: 'попробуй позже',
    },
    busy: {
      title: 'Заторы впереди',
      description: 'обновить попытку',
    },
    disconnected: {
      title: 'Интернет немного занят',
      description: 'Подвигайте пальцами, чтобы исправить это',
    },
    empty: {
      title: 'не нашел то что нужно',
      description: 'искать что-то еще',
    },
  },
  Form: {
    required: 'обязательный',
    optional: 'необязательный',
    defaultValidateMessages: {
      default: 'ошибка проверки поля${label}',
      required: 'Пожалуйста входите${label}',
      enum: '${label}должен быть одним из[${enum}]',
      whitespace: '${label}Не может быть нулевым символом',
      date: {
        format: '${label}Неверный формат даты',
        parse: '${label}нельзя преобразовать в дату',
        invalid: '${label}неверная дата',
      },
      types: {
        string: typeTemplate,
        method: typeTemplate,
        array: typeTemplate,
        object: typeTemplate,
        number: typeTemplate,
        date: typeTemplate,
        boolean: typeTemplate,
        integer: typeTemplate,
        float: typeTemplate,
        regexp: typeTemplate,
        email: typeTemplate,
        url: typeTemplate,
        hex: typeTemplate,
      },
      string: {
        len: '${label}должен быть${len}символы',
        min: '${label}наименее${min}символы',
        max: '${label}наиболее${max}символы',
        range: '${label}Должен быть в${min}-${max}между персонажами',
      },
      number: {
        len: '${label}должно быть равно${len}',
        min: '${label}Минимальное значение${min}',
        max: '${label}Максимальное значение${max}',
        range: '${label}Должен быть в${min}-${max}между',
      },
      array: {
        len: 'должен быть${len}индивидуальный${label}',
        min: 'наименее${min}индивидуальный${label}',
        max: 'наиболее${max}индивидуальный${label}',
        range: '${label}количествоДолжен быть в${min}-${max}между',
      },
      pattern: {
        mismatch: '${label}не соответствует образцу${pattern}',
      },
    },
  },
  ImageUploader: {
    uploading: 'загрузка...',
  },
  InfiniteScroll: {
    noMore: 'больше не надо',
  },
  Mask: {
    name: 'маскирующий слой',
  },
  Modal: {
    ok: 'Я понимаю',
  },
  PullToRefresh: {
    pulling: 'Потяните вниз, чтобы обновить',
    canRelease: 'немедленно обновить обновление',
    complete: 'Обновить успешно',
  },
};
export default ruRU;
