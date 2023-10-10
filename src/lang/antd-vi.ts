const typeTemplate = '${label} không phải là ${type} hợp lệ';

const vi = {
  locale: 'vi',
  common: {
    confirm: 'Chắc chắn',
    cancel: 'Hủy',
    loading: 'Đang tải',
    close: 'Đóng',
  },
  Calendar: {
    markItems: ['một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'ngày'],
    renderYearAndMonth: (year: number, month: number) => `${year}Năm${month}mặt trăng`,
  },
  Cascader: {
    placeholder: 'xin vui lòng chọn',
  },
  Dialog: {
    ok: 'tôi hiểu rồi',
  },
  DatePicker: {
    tillNow: 'cho đến nay',
  },
  ErrorBlock: {
    default: {
      title: 'Trang gặp một số vấn đề nhỏ',
      description: 'thử lại sau',
    },
    busy: {
      title: 'ùn tắc phía trước',
      description: 'làm mới thử',
    },
    disconnected: {
      title: 'internet hơi bận',
      description: 'Di chuyển ngón tay của bạn để giúp sửa chữa nó',
    },
    empty: {
      title: 'không tìm thấy những gì bạn cần',
      description: 'tìm cái gì khác',
    },
  },
  Form: {
    required: 'yêu cầu',
    optional: 'không bắt buộc',
    defaultValidateMessages: {
      default: 'lỗi xác thực trường${label}',
      required: 'vui lòng nhập${label}',
      enum: '${label}phải là một trong[${enum}]',
      whitespace: '${label}Không thể là một ký tự null',
      date: {
        format: '${label}định dạng ngày tháng hợp lệ',
        parse: '${label}không thể được chuyển đổi thành một ngày',
        invalid: '${label}là một ngày không hợp lệ',
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
        len: '${label} phải là ${len} ký tự',
        min: '${label} phải có ít nhất ${min} ký tự',
        max: '${label} tối đa ${max} ký tự',
        range: '${label} phải nằm trong khoảng từ ${min}-${max} ký tự',
      },
      number: {
        len: '${label} phải bằng ${len}',
        min: 'Giá trị tối thiểu của ${label} là ${min}',
        max: 'Giá trị tối đa của ${label} là ${max}',
        range: '${label} phải nằm trong khoảng từ ${min}-${max}',
      },
      array: {
        len: 'Phải là ${len} ${label}',
        min: 'Ít nhất ${min}${label}',
        max: 'Tối đa ${max} ${label}',
        range: 'Số lượng ${label} phải từ ${min}-${max}',
      },
      pattern: {
        mismatch: '${label} không khớp với mẫu ${pattern}',
      },
    },
  },
  ImageUploader: {
    uploading: 'đang tải lên...',
    upload: 'Tải lên',
  },
  InfiniteScroll: {
    noMore: 'Không còn nữa',
    failedToLoad: 'Không tải được',
    retry: 'Tải lại',
  },
  Input: {
    clear: 'Thông thoáng',
  },
  Mask: {
    name: 'Mặt nạ nền',
  },
  Modal: {
    ok: 'Tôi hiểu rồi',
  },
  PasscodeInput: {
    name: 'Hộp nhập mật khẩu',
  },
  PullToRefresh: {
    pulling: 'Kéo xuống để làm mới',
    canRelease: 'Phát hành làm mới ngay lập tức',
    complete: 'Làm mới thành công',
  },
  SearchBar: {
    name: 'Thanh tìm kiếm',
  },
  Slider: {
    name: 'Thanh đầu vào trượt',
  },
  Stepper: {
    decrease: 'giảm bớt',
    increase: 'Tăng',
  },
  Switch: {
    name: 'công tắc',
  },
  Selector: {
    name: 'Chọn nhóm',
  },
};

export default vi;
