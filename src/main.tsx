import React from "react";
import ReactDOM from "react-dom/client";
import LeagueOfBarrage from "./components/LeagueOfBarrage";
import App from "./components/react/App";
import "./style.css";
import { store } from "./store";
import { Provider } from "react-redux";

window.game = new LeagueOfBarrage();

ReactDOM.createRoot(document.getElementById("info")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
