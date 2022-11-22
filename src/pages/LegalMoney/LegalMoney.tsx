import { NavBar, Swiper, SwiperRef } from 'antd-mobile';
import { useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import ic_legal_money_0 from '../../assets/ic_legal_money_0.png';
import ic_legal_money_1 from '../../assets/ic_legal_money_1.png';
import LegalMoneyQuick from './LegalMoneyQuick';

interface SwitchProps {
  index: 0 | 1;
  onChange: (index: 0 | 1) => void;
}
const Switch = ({ index, onChange }: SwitchProps) => {
  const styles: React.CSSProperties = useMemo(
    () => ({
      width: 140,
      height: 28,
      backgroundImage: `url(${index === 1 ? ic_legal_money_1 : ic_legal_money_0})`,
      backgroundSize: '100% 100%',
    }),
    [index],
  );

  return (
    <div style={styles} className="flex items-center justify-around text-xs bg-no-repeat">
      <a
        onClick={() => onChange(0)}
        className={`${index === 0 ? 'text-[#6175AE]' : 'text-white'} `}
      >
        快捷区
      </a>
      <a
        onClick={() => onChange(1)}
        className={`${index === 1 ? 'text-[#6175AE]' : 'text-white'} `}
      >
        自选区
      </a>
    </div>
  );
};

const LegalMoney = () => {
  const history = useHistory();

  const [index, setIndex] = useState<0 | 1>(0);

  const ref = useRef<SwiperRef>(null);

  return (
    <Container className="h-screen bg-white flex flex-col">
      <div className="bg-[#6175AE]">
        <NavBar
          className="text-white"
          onBack={() => history.goBack()}
          right={
            <div>
              <Switch
                index={index}
                onChange={(value) => {
                  setIndex(value);
                  ref.current?.swipeTo(value);
                }}
              ></Switch>
            </div>
          }
        />
      </div>
      <Swiper ref={ref} indicator={() => null} className="flex-1" allowTouchMove={false}>
        <Swiper.Item key={1}>
          <LegalMoneyQuick />
        </Swiper.Item>
        <Swiper.Item key={2}>2</Swiper.Item>
      </Swiper>
    </Container>
  );
};

const Container = styled.div`
  .adm-nav-bar {
    border: 0;
  }
  .adm-swiper-item {
    display: flex;
    flex-direction: column;
  }
`;

export default LegalMoney;
