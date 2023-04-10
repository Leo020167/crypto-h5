import { reverse } from 'lodash-es';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { QuoteReal } from '../../market/model';

const MinuteDetail = ({ real }: { real?: QuoteReal }) => {
  const sells = useMemo(() => {
    const result = real?.sells ?? [];
    return reverse([...result]);
  }, [real?.sells]);

  const intl = useIntl();

  return (
    <Container className="my-4 flex flex-col text-xs text-[#626073]">
      <div className="flex items-center gap-2">
        <div className="flex flex-1">
          <div className="ml-2 flex-1">
            {intl.formatMessage({ defaultMessage: '數量(手)', id: '+ZvENE' })}
          </div>
          <div className="text-right">
            {intl.formatMessage({ defaultMessage: '買入價', id: 'v2G+NV' })}
          </div>
        </div>
        <div className="flex flex-1">
          <div>{intl.formatMessage({ defaultMessage: '賣出價', id: 'JuFr3z' })}</div>
          <div className="mr-2 flex-1 text-right">
            {intl.formatMessage({ defaultMessage: '數量(手)', id: '+ZvENE' })}
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="w-1/2">
          {real?.buys?.map((v, i) => (
            <div className="relative flex items-center py-1" key={i}>
              <div
                className="absolute h-full"
                style={{
                  width: `${(Number(v.amount ?? 0) / Number(v.total ?? 1)) * 100}%`,
                  backgroundColor: `rgba(226,33,78,.3)`,
                }}
              />
              <span className="z-10 ml-2 flex-1 text-white">{v.amount}</span>
              <span className="z-10 mr-1 text-[#e2214e]">{v.price}</span>
            </div>
          ))}
        </div>
        <div className="w-1/2">
          {sells.map((v, i) => (
            <div className="relative flex items-center py-1" key={i}>
              <div
                className="absolute right-0 h-full"
                style={{
                  width: `${(Number(v.amount ?? 0) / Number(v.total ?? 1)) * 100}%`,
                  backgroundColor: `rgba(0,173,136,.3)`,
                }}
              />
              <span className="z-10 ml-1 flex-1 text-[#00ad88]">{v.price}</span>
              <span className="z-10 mr-2 text-white">{v.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  .adm-progress-bar-trail {
    height: 100%;
  }
`;

export default MinuteDetail;
