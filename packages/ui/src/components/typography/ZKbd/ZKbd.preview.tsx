import React from "react";
import { ZKbd } from "./ZKbd";

export default {
  title: "Typography/ZKbd",
  component: ZKbd,
};

export const KeyboardShortcuts = () => (
  <div style={{ background: "#1a1a1a", padding: "40px", color: "#fff" }}>
    <p style={{ fontSize: "15px", marginBottom: "12px" }}>
      Press <ZKbd>Ctrl</ZKbd> + <ZKbd>C</ZKbd> to copy
    </p>
    <p style={{ fontSize: "15px", marginBottom: "12px" }}>
      Press <ZKbd>Ctrl</ZKbd> + <ZKbd>V</ZKbd> to paste
    </p>
    <p style={{ fontSize: "15px" }}>
      Press <ZKbd>Ctrl</ZKbd> + <ZKbd>Shift</ZKbd> + <ZKbd>P</ZKbd> to open
      command palette
    </p>
  </div>
);
