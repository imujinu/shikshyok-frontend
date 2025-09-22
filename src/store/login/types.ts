import type { Action } from "redux";

// State 타입 정의
export type AuthState = {
  loginId: string | null;
  id: number | null;
  nickname: string | null;
  type: string | null;
  phoneNumber: string | null;
  shopId: number | null;
  shopOwnerLoginId: string | null;
};

// Action 타입 정의
export type SetLoginIdAction = Action<"@auth/setLoginId"> & {
  payload: string;
};

export type SetIdAction = Action<"@auth/setUserId"> & {
  payload: number;
};

export type SetNicknameAction = Action<"@auth/setNickname"> & {
  payload: string;
};

export type SetTypeAction = Action<"@auth/setType"> & {
  payload: string;
};

export type SetLogoutAction = Action<"@auth/setLogout"> & {
  payload: null;
};

export type SetPhoneNumberAction = Action<"@auth/setPhoneNumber"> & {
  payload: string;
};

export type setShopIdAction = Action<"@auth/setShopId"> & {
  payload: number;
};

export type setShopOwnerLoginIdAction = Action<"@auth/setShopOwnerLoginId"> & {
  payload: string;
};

// 전체 액션 타입 정의
export type Actions =
  | SetLoginIdAction
  | SetIdAction
  | SetNicknameAction
  | SetTypeAction
  | SetLogoutAction
  | SetPhoneNumberAction
  | setShopIdAction
  | setShopOwnerLoginIdAction;
