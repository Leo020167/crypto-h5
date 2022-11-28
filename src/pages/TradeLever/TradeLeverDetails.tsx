import { Input, Selector } from 'antd-mobile';
import { Link } from 'react-router-dom';
import Select, { StylesConfig } from 'react-select';
import styled from 'styled-components';

const options = [
  { value: 'chocolate', label: '市價委托' },
  { value: 'strawberry', label: '限價委托' },
];

const colourStyles: StylesConfig = {
  container: (styles) => ({ ...styles, padding: 0 }),
  control: (styles) => ({
    ...styles,
    borderColor: '#ececec',
    boxShadow: '',
    borderRadius: 0,
    padding: 0,
  }),
  option: (styles, { isSelected }) => {
    return {
      ...styles,
      color: '#727fa5',
      backgroundColor: isSelected ? '#d9d8dd' : undefined,
    };
  },
  input: (styles) => ({ ...styles }),
  singleValue: (styles) => ({ ...styles, color: '#666175ae' }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (styles) => ({ ...styles, paddingLeft: 0 }),
  valueContainer: (styles) => ({ ...styles, paddingRight: 0 }),
};

const TradeLeverDetails = () => {
  return (
    <Container>
      <div className="flex text-sm">
        <Select options={options} styles={colourStyles} className="flex-1" placeholder="請選擇" />
        <Select
          options={options}
          styles={colourStyles}
          className="flex-1 ml-2"
          placeholder="請選擇"
        />
      </div>

      <div className="flex items-center justify-center text-xs text-[#666175ae] h-10 mt-2 bg-[#f2f2f2]">
        以當前最優價格交易
      </div>

      <Selector
        className="mt-2 text-xs"
        columns={4}
        options={[
          { label: '10', value: 10 },
          { label: '20', value: 20 },
          { label: '50', value: 50 },
          { label: '100', value: 100 },
        ]}
        showCheckMark={false}
      />

      <div className="mt-2 flex items-center border border-[#efefef] h-10 px-2 rounded-sm">
        <Input
          type="number"
          className="text-sm font-bold"
          placeholder="請輸入手數"
          maxLength={18}
        />
        <span className="text-[#666175ae]">手</span>
      </div>

      <div className="mt-1 text-xs flex items-center justify-between">
        <div>
          <div className="text-[#6175ae]">可開%s手</div>
          <div className="text-[#666175ae] mt-3">開倉保證金 %s USDT</div>
        </div>

        <Link to="" className="bg-[#6175ae] text-white px-3 py-1">
          划轉
        </Link>
      </div>

      <div>
        <a className="flex items-center justify-center h-12 bg-[#e2214e] text-white mt-4 text-sm">
          看漲(做多)
        </a>
      </div>
    </Container>
  );
};

const Container = styled.div`
  .adm-input-element {
    &::placeholder {
      color: #c8c8c8;
    }
  }
  .adm-selector {
    --padding: 8px 12px;
    .adm-selector-item {
      color: #666175ae;
      background-color: #fff;
      border: 1px solid #f0f0f1;

      &.adm-selector-item-active {
        color: #fff;
        background-color: #6175ae;
      }
    }
  }
`;

export default TradeLeverDetails;
