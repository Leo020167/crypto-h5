import { ReactComponent as SvgOtcTime } from '../../assets/ic_svg_otc_time_bg.svg';
import Countdown, { CountdownProps } from '../../components/Countdown';

type ClockProps = CountdownProps;

const Clock = (props: ClockProps) => {
  return (
    <div className="relative flex items-center justify-center">
      <SvgOtcTime className="h-10 w-10" />
      <span className="absolute text-xs text-[#6175AE]">
        <Countdown {...props} />
      </span>
    </div>
  );
};

export default Clock;
