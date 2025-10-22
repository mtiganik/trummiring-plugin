import './App.css'
import React from 'react'
import ReactDOM from "react-dom/client";
import App from './App.tsx'

function mount() {
  const container = document.getElementById("trummiring-root");
  if (!container) return;

  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}
