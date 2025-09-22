import type * as T from "./types";

export const addMenu = (payload: T.MenuState): T.AddMenuAction => ({
  type: "menu/addMenu",
  payload,
});

export const delMenu = (payload: T.MenuState): T.DelMenuAction => ({
  type: "menu/delMenu",
  payload,
});
