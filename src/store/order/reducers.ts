import * as T from "./types";

const initialState: T.OrderState = {
  orders: [],
};

export const orderReducer = (
  state = initialState,
  action: T.Actions | any
): T.OrderState | any => {
  switch (action.type) {
    case "order/addOrder":
      return {
        ...state,
        orders: [...state.orders, action.payload],
      };
    case "order/delOrder":
      return {
        ...state,
        orders: [],
      };
    default:
      return state;
  }
};
