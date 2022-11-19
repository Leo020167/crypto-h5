import { Input } from 'antd-mobile';
import { DownFill } from 'antd-mobile-icons';
import { useState } from 'react';
import styled from 'styled-components';
import { Country } from '../model';
import AreaList from './AreaList';

interface CountryPhoneProps {
  country?: Country;
  onCountryChange?: (country: Country) => void;

  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const CountryName = ({ countryName, onClick }: { countryName: string; onClick: () => void }) => {
  return (
    <div className="mt-6 mb-2 locale pl-2 flex items-center text-sm" onClick={onClick}>
      {countryName}
      <DownFill fontSize={7} className="ml-1" color="#c0c0c0" />
    </div>
  );
};

const CountryPhoneNumber = ({
  country = { code: '+852', name: '香港' },
  onCountryChange,
  value,
  onChange,
  ...rest
}: CountryPhoneProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Container>
      <CountryName countryName={country.name} onClick={() => setOpen(true)} />
      <div className="flex">
        <div
          className="pl-2 flex items-center justify-center text-sm"
          onClick={() => setOpen(true)}
        >
          {country.code} <DownFill fontSize={7} className="ml-1" color="#c0c0c0" />
        </div>
        <div className="bg-[#eeeeee] w-[1px] ml-3"></div>
        <Input {...rest} value={value} onChange={onChange} />
      </div>

      <AreaList
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(area) => {
          onCountryChange?.({ code: area.areaCode, name: area.tcName });
          setOpen(false);
        }}
      />
    </Container>
  );
};

const Container = styled.div`
  .phone {
    .adm-list-item-content-main {
      display: flex;
      width: auto;
      .adm-form-item-label {
        display: flex;
        justify-content: center;
      }
    }
  }
`;

export default CountryPhoneNumber;
