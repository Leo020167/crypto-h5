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
        eid: '914b28b19ffc9b3dda4924057b2239a3',
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
