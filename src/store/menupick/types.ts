import { Action } from "redux";

export interface firstOrder {
  orderType: string;
  loginId: string | null;
  orderTime: Date;
  orderNumber: string;
  contactNumber: string | null;
  shopName: any;
  shopLoginId: any;
  items: string[];
  price: string[];
}
export interface MenuState {
  items: firstOrder[];
  price: firstOrder[];
}

export type AddMenuAction = Action<"menu/addMenu"> & {
  payload: MenuState;
};

export type DelMenuAction = Action<"menu/delMenu"> & {
  payload: MenuState;
};

export type Actions = AddMenuAction | DelMenuAction;
