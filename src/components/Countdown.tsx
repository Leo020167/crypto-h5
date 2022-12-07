import moment, { Moment } from 'moment';
import { useRef, useState } from 'react';
import { useInterval } from 'react-use';

export interface CountdownProps {
  className?: string;
  time?: string;
  onFinish: () => void;
}

const Countdown = ({ time, onFinish }: CountdownProps) => {
  const [count, setCount] = useState<number>(Number(time ?? 0));
  const ref = useRef<Moment>(moment().startOf('day').add(count, 'second'));

  useInterval(
    () => {
      const newCount = count - 1;
      setCount(newCount);

      if (newCount === 0) {
        ref.current = moment().startOf('day');
        onFinish();
      } else {
        ref.current.subtract(1, 'second');
      }
    },
    count > 0 ? 1000 : null,
  );

  return <span>{ref.current.format('mm:ss')}</span>;
};

export default Countdown;
