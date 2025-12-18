import React from "react";
import { ZCode } from "./ZCode";

export default {
  title: "Typography/ZCode",
  component: ZCode,
};

export const InlineCode = () => (
  <div style={{ background: "#1a1a1a", padding: "40px", color: "#fff" }}>
    <p style={{ fontSize: "15px", lineHeight: "1.6" }}>
      Use <ZCode>npm install</ZCode> to install dependencies, then run{" "}
      <ZCode>npm start</ZCode> to begin.
    </p>
    <p style={{ fontSize: "15px", lineHeight: "1.6", marginTop: "16px" }}>
      The <ZCode>useState</ZCode> hook manages state in functional components.
    </p>
  </div>
);
