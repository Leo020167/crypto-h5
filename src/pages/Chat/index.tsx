import { range } from 'lodash-es';
import { Virtuoso } from 'react-virtuoso';
import { useFindOtcChatList, useGetCustomerService } from '../../api/endpoints/transformer';
import Screen from '../../components/Screen';

const Chat = () => {
  const b = useGetCustomerService({});
  const a = useFindOtcChatList({});
  return (
    <Screen headerTitle="綫上客服">
      <div className="h-full flex flex-col">
        <Virtuoso
          className="flex-1"
          data={range(1000)}
          itemContent={(index, rowData) => {
            return (
              <div style={{ padding: 5 }}>
                {index} - {rowData}
              </div>
            );
          }}
        />
        <div>1323</div>
      </div>
    </Screen>
  );
};

export default Chat;
