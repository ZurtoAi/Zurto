import React from "react";
import { ZHighlight } from "./ZHighlight";

export default {
  title: "Typography/ZHighlight",
  component: ZHighlight,
};

export const SearchHighlight = () => (
  <div style={{ background: "#1a1a1a", padding: "40px", color: "#fff" }}>
    <ZHighlight highlight="React">
      React is a JavaScript library for building user interfaces
    </ZHighlight>
    <div style={{ marginTop: "16px" }}>
      <ZHighlight highlight={["TypeScript", "type-safe"]}>
        TypeScript provides type-safe development with powerful tooling
      </ZHighlight>
    </div>
  </div>
);
