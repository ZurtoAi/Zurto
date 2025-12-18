import React from "react";
import { ZTitle } from "./ZTitle";

export default {
  title: "Typography/ZTitle",
  component: ZTitle,
};

export const Hierarchy = () => (
  <div style={{ background: "#1a1a1a", padding: "40px", color: "#fff" }}>
    <ZTitle order={1}>H1 Main Page Title</ZTitle>
    <ZTitle order={2} style={{ marginTop: "24px" }}>
      H2 Section Heading
    </ZTitle>
    <ZTitle order={3} style={{ marginTop: "20px" }}>
      H3 Subsection Heading
    </ZTitle>
    <ZTitle order={4} style={{ marginTop: "16px" }}>
      H4 Component Title
    </ZTitle>
  </div>
);

export const StyledTitles = () => (
  <div style={{ background: "#1a1a1a", padding: "40px", color: "#fff" }}>
    <ZTitle order={2} style={{ color: "#60a5fa", marginBottom: "16px" }}>
      Primary Accent Title
    </ZTitle>
    <ZTitle order={3} weight={300}>
      Light Weight Title
    </ZTitle>
  </div>
);
