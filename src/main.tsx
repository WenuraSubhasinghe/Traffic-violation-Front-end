import React from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const rootContainer = document.getElementById("root");
const root = createRoot(rootContainer!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
