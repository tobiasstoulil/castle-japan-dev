import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Analytics } from "@vercel/analytics/react";

ReactDOM.createRoot(document.getElementById("ui")).render(
  // <React.StrictMode>
  <HelmetProvider>
    <Analytics />
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </HelmetProvider>
  // </React.StrictMode>
);
