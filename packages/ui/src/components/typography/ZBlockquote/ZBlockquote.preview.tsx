import React from "react";
import { ZBlockquote } from "./ZBlockquote";

export default {
  title: "Typography/ZBlockquote",
  component: ZBlockquote,
};

export const BasicQuote = () => (
  <div style={{ background: "#1a1a1a", padding: "40px", color: "#fff" }}>
    <ZBlockquote cite="— Steve Jobs">
      Design is not just what it looks like and feels like. Design is how it
      works.
    </ZBlockquote>
  </div>
);

export const InfoQuote = () => (
  <div style={{ background: "#1a1a1a", padding: "40px", color: "#fff" }}>
    <ZBlockquote icon="ℹ️" color="blue">
      This feature requires authentication. Please log in to continue.
    </ZBlockquote>
  </div>
);
