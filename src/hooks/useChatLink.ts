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
        eid: 'bddc07a2a2af8729822e70d4f153ed8a',
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
