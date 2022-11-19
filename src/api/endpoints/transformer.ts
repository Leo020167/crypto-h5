/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * API Title
 * OpenAPI spec version: 1.0
 */
import { useQuery, useMutation } from '@tanstack/react-query';
import type {
  UseQueryOptions,
  UseMutationOptions,
  QueryFunction,
  MutationFunction,
  UseQueryResult,
  QueryKey,
} from '@tanstack/react-query';
import type {
  CommonResponse,
  InviteBuyBody,
  InviteHomeResponse,
  InviteHomeBody,
  DepositWithdrawGetInfoResponse,
  DepositWithdrawGetInfoBody,
  HomeMyResponse,
  HomeMyBody,
  UserInfoResponse,
  UserInfoBody,
} from '../model';
import { customInstance } from '../mutator/custom-instance';
import type { ErrorType } from '../mutator/custom-instance';

/**
 * 購買邀請碼
 */
export const inviteBuy = (inviteBuyBody: InviteBuyBody) => {
  return customInstance<CommonResponse>({
    url: `/invite/buy.do`,
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: inviteBuyBody,
  });
};

export type InviteBuyMutationResult = NonNullable<Awaited<ReturnType<typeof inviteBuy>>>;
export type InviteBuyMutationBody = InviteBuyBody;
export type InviteBuyMutationError = ErrorType<unknown>;

export const useInviteBuy = <TError = ErrorType<unknown>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof inviteBuy>>,
    TError,
    { data: InviteBuyBody },
    TContext
  >;
}) => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof inviteBuy>>,
    { data: InviteBuyBody }
  > = (props) => {
    const { data } = props ?? {};

    return inviteBuy(data);
  };

  return useMutation<
    Awaited<ReturnType<typeof inviteBuy>>,
    TError,
    { data: InviteBuyBody },
    TContext
  >(mutationFn, mutationOptions);
};

/**
 * 獲取邀請碼頁面
 */
export const inviteHome = (inviteHomeBody: InviteHomeBody) => {
  return customInstance<InviteHomeResponse>({
    url: `/invite/home.do`,
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: inviteHomeBody,
  });
};

export const getInviteHomeQueryKey = (inviteHomeBody: InviteHomeBody) => [
  `/invite/home.do`,
  inviteHomeBody,
];

export type InviteHomeQueryResult = NonNullable<Awaited<ReturnType<typeof inviteHome>>>;
export type InviteHomeQueryError = ErrorType<unknown>;

export const useInviteHome = <
  TData = Awaited<ReturnType<typeof inviteHome>>,
  TError = ErrorType<unknown>,
>(
  inviteHomeBody: InviteHomeBody,
  options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof inviteHome>>, TError, TData> },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getInviteHomeQueryKey(inviteHomeBody);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof inviteHome>>> = () =>
    inviteHome(inviteHomeBody);

  const query = useQuery<Awaited<ReturnType<typeof inviteHome>>, TError, TData>(
    queryKey,
    queryFn,
    queryOptions,
  ) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
};

/**
 * 获取充币信息
 */
export const depositWithdrawGetInfo = (depositWithdrawGetInfoBody: DepositWithdrawGetInfoBody) => {
  return customInstance<DepositWithdrawGetInfoResponse>({
    url: `/depositeWithdraw/getInfo.do`,
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: depositWithdrawGetInfoBody,
  });
};

export const getDepositWithdrawGetInfoQueryKey = (
  depositWithdrawGetInfoBody: DepositWithdrawGetInfoBody,
) => [`/depositeWithdraw/getInfo.do`, depositWithdrawGetInfoBody];

export type DepositWithdrawGetInfoQueryResult = NonNullable<
  Awaited<ReturnType<typeof depositWithdrawGetInfo>>
>;
export type DepositWithdrawGetInfoQueryError = ErrorType<unknown>;

export const useDepositWithdrawGetInfo = <
  TData = Awaited<ReturnType<typeof depositWithdrawGetInfo>>,
  TError = ErrorType<unknown>,
>(
  depositWithdrawGetInfoBody: DepositWithdrawGetInfoBody,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof depositWithdrawGetInfo>>, TError, TData>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getDepositWithdrawGetInfoQueryKey(depositWithdrawGetInfoBody);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof depositWithdrawGetInfo>>> = () =>
    depositWithdrawGetInfo(depositWithdrawGetInfoBody);

  const query = useQuery<Awaited<ReturnType<typeof depositWithdrawGetInfo>>, TError, TData>(
    queryKey,
    queryFn,
    queryOptions,
  ) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
};

/**
 * 我的頁面信息
 */
export const homeMy = (homeMyBody: HomeMyBody) => {
  return customInstance<HomeMyResponse>({
    url: `/home/my.do`,
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: homeMyBody,
  });
};

export type HomeMyMutationResult = NonNullable<Awaited<ReturnType<typeof homeMy>>>;
export type HomeMyMutationBody = HomeMyBody;
export type HomeMyMutationError = ErrorType<unknown>;

export const useHomeMy = <TError = ErrorType<unknown>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof homeMy>>,
    TError,
    { data: HomeMyBody },
    TContext
  >;
}) => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<Awaited<ReturnType<typeof homeMy>>, { data: HomeMyBody }> = (
    props,
  ) => {
    const { data } = props ?? {};

    return homeMy(data);
  };

  return useMutation<Awaited<ReturnType<typeof homeMy>>, TError, { data: HomeMyBody }, TContext>(
    mutationFn,
    mutationOptions,
  );
};

/**
 * 獲取我的頁面信息
 */
export const userInfo = (userInfoBody: UserInfoBody) => {
  return customInstance<UserInfoResponse>({
    url: `/user/info.do`,
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: userInfoBody,
  });
};

export type UserInfoMutationResult = NonNullable<Awaited<ReturnType<typeof userInfo>>>;
export type UserInfoMutationBody = UserInfoBody;
export type UserInfoMutationError = ErrorType<unknown>;

export const useUserInfo = <TError = ErrorType<unknown>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof userInfo>>,
    TError,
    { data: UserInfoBody },
    TContext
  >;
}) => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof userInfo>>,
    { data: UserInfoBody }
  > = (props) => {
    const { data } = props ?? {};

    return userInfo(data);
  };

  return useMutation<
    Awaited<ReturnType<typeof userInfo>>,
    TError,
    { data: UserInfoBody },
    TContext
  >(mutationFn, mutationOptions);
};
