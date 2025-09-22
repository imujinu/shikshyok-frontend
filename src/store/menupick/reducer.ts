import * as T from "./types";

const initialState: T.MenuState = {
  items: [],
  price: [],
};

export const firstOrderReducer = (
  state = initialState,
  action: T.Actions | any
): T.MenuState => {
  switch (action.type) {
    case "menu/addMenu":
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case "menu/delMenu":
      const { orderIndex, itemIndex } = action.payload;

      // 새로운 배열을 생성하여 불변성 유지
      const updatedItems = state.items.map((order, idx) => {
        if (idx === orderIndex) {
          // 해당 orderIndex를 찾으면, 그 안의 items와 price 배열을 수정
          const updatedOrder = {
            ...order,
            items: order.items.filter((item, i) => i !== itemIndex),
            price: order.price.filter((price, i) => i !== itemIndex),
          };
          return updatedOrder;
        }
        return order; // orderIndex와 일치하지 않으면 원본 상태 유지
      });

      return {
        ...state,
        items: updatedItems,
      };

    case "menu/resetMenu":
      return {
        ...state,
        items: [],
      };
    default:
      return state;
  }
};
