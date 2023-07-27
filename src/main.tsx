import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import {SongsProvider} from "./context/songsContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SongsProvider>
        <App />
    </SongsProvider>
  </React.StrictMode>
);
