import ReactDOM from "react-dom/client";
import App from "./App";
import App2 from "./App2";
import "../src/index.css";
import { Provider } from "react-redux";
import { store, persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
    <App />
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App2 />
      </PersistGate>
    </Provider>
  </> 
);
