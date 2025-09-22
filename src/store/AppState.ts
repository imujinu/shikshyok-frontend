import * as Clock from "./clock";
import * as Order from "./order";
import * as Login from "./login";
export interface AppState {
  clock: Clock.State;
  order: Order.OrderState;
  login: Login.AuthState;
}
