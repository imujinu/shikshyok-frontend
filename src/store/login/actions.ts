import type * as T from "./types";

export const setLoginId = (payload: string): T.SetLoginIdAction => ({
  type: "@auth/setLoginId",
  payload,
});

export const setUserId = (payload: number): T.SetIdAction => ({
  type: "@auth/setUserId",
  payload,
});

export const setNickname = (payload: string): T.SetNicknameAction => ({
  type: "@auth/setNickname",
  payload,
});

export const setType = (payload: string): T.SetTypeAction => ({
  type: "@auth/setType",
  payload,
});

export const setPhoneNumber = (payload: string): T.SetPhoneNumberAction => ({
  type: "@auth/setPhoneNumber",
  payload,
});

export const setLogout = (): T.SetLogoutAction => ({
  type: "@auth/setLogout",
  payload: null,
});

export const setShopId = (payload: number): T.setShopIdAction => ({
  type: "@auth/setShopId",
  payload,
});

export const setShopOwnerLoginId = (
  payload: string
): T.setShopOwnerLoginIdAction => ({
  type: "@auth/setShopOwnerLoginId",
  payload,
});
