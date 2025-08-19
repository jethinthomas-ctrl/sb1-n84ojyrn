import React from "react";
import ReactDOM from "react-dom/client";

const root = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <div style={{ padding: "40px", fontFamily: "monospace" }}>
      ✅ React Mounted!
    </div>
  </React.StrictMode>
);
