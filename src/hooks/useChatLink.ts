import queryString from 'query-string';
import { useAuthStore } from '../stores/auth';

export const useChatLink = () => {
  const auth = useAuthStore();
  const userInfo = auth.userInfo;
  const metadata = userInfo
    ? JSON.stringify({
        userId: userInfo?.userId,
        userName: userInfo?.userName,
        phone: userInfo?.phone,
        email: userInfo?.email,
        inviteName: userInfo?.inviteName,
        agencyCode: userInfo?.agencyCode,
      })
    : null;

  return (
    `https://chat.ichatlink.net/widget/standalone.html?` +
    queryString.stringify(
      {
        eid: '8b926d40eb1e1074e5a3012d394451df',
        clientid: userInfo?.userId,
        language: 'en',
        metadata,
      },
      {
        encode: false,
        skipEmptyString: true,
        skipNull: true,
      },
    )
  );
};
