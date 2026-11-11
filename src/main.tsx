import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import "./styles/index.css";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Production HTML is pre-rendered at build time; dev renders from scratch.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
