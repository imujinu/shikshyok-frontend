// reducers.ts
import { combineReducers } from "@reduxjs/toolkit";
import * as Cl from "./clock";
import * as L from "./login";

// 리듀서를 불러옵니다.
// 각 리듀서의 상태 타입을 정의합니다.
import reviewReducer from "./modules/reviewSlice";
import { orderReducer } from "./order";
import { firstOrderReducer } from "./menupick/reducer";
const rootReducer = combineReducers({
  reviews: reviewReducer,
  clock: Cl.reducer,
  login: L.reducer,
  menu: firstOrderReducer,
  order: orderReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
