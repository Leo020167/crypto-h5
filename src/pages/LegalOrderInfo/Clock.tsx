import { ReactComponent as SvgOtcTime } from '../../assets/ic_svg_otc_time_bg.svg';
import Countdown, { CountdownProps } from './CountDown';

type ClockProps = CountdownProps;

const Clock = (props: ClockProps) => {
  return (
    <div className="flex items-center justify-center relative">
      <SvgOtcTime className="w-10 h-10" />
      <span className="text-xs text-[#6175AE] absolute">
        <Countdown {...props} />
      </span>
    </div>
  );
};

export default Clock;
