import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import App from "./App";
import "./utils/axios"; // Register axios interceptors (JWT auth header)

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
);

