import React from "react";
import { ZMark } from "./ZMark";

export default {
  title: "Content/ZMark",
  component: ZMark,
};

export const HighlightedText = () => (
  <div style={{ background: "#1a1a1a", padding: "40px", color: "#fff" }}>
    <p style={{ fontSize: "15px", lineHeight: "1.6" }}>
      The <ZMark>highlighted text</ZMark> draws attention to important
      information.
    </p>
    <p style={{ fontSize: "15px", lineHeight: "1.6", marginTop: "16px" }}>
      Use <ZMark color="yellow">custom colors</ZMark> to differentiate between
      types of highlights.
    </p>
  </div>
);
