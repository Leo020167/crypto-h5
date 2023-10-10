const typeTemplate = '${label} ไม่ใช่ ${type} ที่ถูกต้อง';

const th = {
  locale: 'th',
  common: {
    confirm: 'แน่นอน',
    cancel: 'ยกเลิก',
    loading: 'กำลังโหลด',
    close: 'ปิด',
  },
  Calendar: {
    markItems: ['หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'วัน'],
    yearAndMonth: '${year}ปี${month}ดวงจันทร์',
  },
  Cascader: {
    placeholder: 'กรุณาเลือก',
  },
  Dialog: {
    ok: 'ฉันเห็น',
  },
  DatePicker: {
    tillNow: 'จนถึงปัจจุบัน',
  },
  ErrorBlock: {
    default: {
      title: 'เพจพบปัญหาเล็กน้อยบางประการ',
      description: 'จะลองอีกครั้งในภายหลัง',
    },
    busy: {
      title: 'ความแออัดรออยู่ข้างหน้า',
      description: 'ลองรีเฟรชดูครับ',
    },
    disconnected: {
      title: 'เครือข่ายยุ่งนิดหน่อย',
      description: 'เลื่อนนิ้วของคุณเพื่อช่วยแก้ไข',
    },
    empty: {
      title: 'ไม่พบสิ่งที่คุณต้องการ',
      description: 'ค้นหาสิ่งอื่น',
    },
  },
  Form: {
    required: 'ที่จำเป็น',
    optional: 'ไม่จำเป็น',
    defaultValidateMessages: {
      default: 'ข้อผิดพลาดในการตรวจสอบฟิลด์${label}',
      required: 'กรุณาเข้า${label}',
      enum: '${label}จะต้องเป็นหนึ่งในนั้น[${enum}]',
      whitespace: '${label}ไม่สามารถเป็นอักขระ null ได้',
      date: {
        format: '${label}รูปแบบวันที่ไม่ถูกต้อง',
        parse: '${label}ไม่สามารถแปลงเป็นวันที่ได้',
        invalid: '${label}เป็นวันที่ไม่ถูกต้อง',
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
        len: '${label} ต้องเป็นอักขระ ${len}',
        min: '${label} มีความยาวอย่างน้อย ${min} อักขระ',
        max: '${label} สามารถยาวได้ถึง ${max} อักขระ',
        range: '${label} ต้องอยู่ระหว่าง ${min}-${max} อักขระ',
      },
      number: {
        len: '${label} ต้องเท่ากับ ${len}',
        min: 'ค่าต่ำสุดของ ${label} คือ ${min}',
        max: 'ค่าสูงสุดของ ${label} คือ ${max}',
        range: '${label} ต้องอยู่ระหว่าง ${min}-${max}',
      },
      array: {
        len: 'ต้องเป็น ${len}${label}',
        min: 'อย่างน้อย ${min}${label}',
        max: 'สูงสุด ${max}${label}',
        range: 'จำนวน ${label} ต้องอยู่ระหว่าง ${min}-${max}',
      },
      pattern: {
        mismatch: '${label} ไม่ตรงกับรูปแบบ ${pattern}',
      },
    },
  },
  ImageUploader: {
    uploading: 'กำลังอัพโหลด...',
    upload: 'ที่อัพโหลด',
  },
  InfiniteScroll: {
    noMore: 'ไม่มีอีกแล้ว',
    failedToLoad: 'โหลดไม่สำเร็จ',
    retry: 'โหลดซ้ำ',
  },
  Input: {
    clear: 'ชัดเจน',
  },
  Mask: {
    name: 'หน้ากากพื้นหลัง',
  },
  Modal: {
    ok: 'ฉันเห็น',
  },
  PasscodeInput: {
    name: 'กล่องใส่รหัสผ่าน',
  },
  PullToRefresh: {
    pulling: 'ดึงลงเพื่อรีเฟรช',
    canRelease: 'ปล่อยรีเฟรชทันที',
    complete: 'รีเฟรชสำเร็จ',
  },
  SearchBar: {
    name: 'แถบค้นหา',
  },
  Slider: {
    name: 'แถบป้อนข้อมูลแบบเลื่อน',
  },
  Stepper: {
    decrease: 'ลด',
    increase: 'เพิ่มขึ้น',
  },
  Switch: {
    name: 'สวิตช์',
  },
  Selector: {
    name: 'เลือกกลุ่ม',
  },
};

export default th;
