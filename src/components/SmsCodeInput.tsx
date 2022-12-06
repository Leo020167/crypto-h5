import { Input, Toast } from 'antd-mobile';
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useInterval } from 'react-use';
import { getSms } from '../utils/api';
import SwipeImageValidator from './SwipeImageValidator';

interface SmsCodeInputProps {
  phoneNumber: string;
  countryCode: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

interface CountdownAction {
  start: () => void;
  stop: () => void;
  restart: () => void;
}
// eslint-disable-next-line react/display-name
const Countdown = forwardRef<
  CountdownAction,
  {
    onClick?: (status: 'stopped' | 'started') => void;
  }
>(({ onClick }, ref) => {
  const [isDirty, setDirty] = useState(false);
  const [status, setStatus] = useState<'stopped' | 'started'>('stopped');
  const [countdown, setCountdown] = useState<number>(60);

  useImperativeHandle(ref, () => ({
    start: () => {
      setStatus('started');
    },
    stop: () => {
      setCountdown(60);
      setStatus('stopped');
    },
    restart: () => {
      setCountdown(60);
      setStatus('started');
    },
  }));

  const intl = useIntl();

  useInterval(
    () => {
      const newValue = countdown - 1;

      if (!newValue) {
        setStatus('stopped');

        if (!isDirty) {
          setDirty(true);
        }
      }

      setCountdown(newValue);
    },
    status === 'started' ? 1000 : null,
  );

  const renderText = () => {
    if (isDirty && status === 'stopped') {
      return intl.formatMessage({ defaultMessage: '重新获取', id: '8p3RD/' });
    }

    if (status === 'stopped') {
      return intl.formatMessage({ defaultMessage: '获取验证码', id: 'ypMY0M' });
    }

    return intl.formatMessage({ defaultMessage: '剩余{countdown}秒', id: 'vOLb7H' }, { countdown });
  };

  return (
    <a
      className=" border-[#FF6B1B] border-2 rounded text-[#FF6B1B] text-sm px-2 py-1"
      onClick={() => onClick?.(status)}
    >
      {renderText()}
    </a>
  );
});

const SmsCodeInput = ({
  value,
  onChange,
  phoneNumber,
  countryCode,
  ...rest
}: SmsCodeInputProps) => {
  const [open, setOpen] = useState(false);

  const countdownRef = useRef<CountdownAction>(null);

  const intl = useIntl();

  const handleSuccess = useCallback(
    (locationx: number, dragImgKey: string) => {
      getSms({
        countryCode,
        dragImgKey,
        locationx,
        sendAddr: phoneNumber,
        type: 1,
      });

      setOpen(false);

      if (phoneNumber) {
        const phone = phoneNumber.substring(0, 3) + '****' + phoneNumber.substring(7);
        Toast.show(
          intl.formatMessage(
            {
              defaultMessage: '短信验证码已经发送至{phone}',
              id: 'YcfcO0',
            },
            { phone },
          ),
        );
      }
      countdownRef.current?.restart();
    },
    [countryCode, intl, phoneNumber],
  );

  return (
    <div className="flex items-center">
      <Input {...rest} className="flex-1" value={value} onChange={onChange} />
      <Countdown
        ref={countdownRef}
        onClick={(status) => {
          if (status === 'started') return;

          if (!phoneNumber || !phoneNumber.trim().length) {
            Toast.show(
              intl.formatMessage({
                defaultMessage: '请输入手机号',
                id: 'KBVp8X',
              }),
            );
            return;
          }
          setOpen(true);
        }}
      />
      <SwipeImageValidator open={open} onClose={() => setOpen(false)} onSuccess={handleSuccess} />
    </div>
  );
};

export default SmsCodeInput;
