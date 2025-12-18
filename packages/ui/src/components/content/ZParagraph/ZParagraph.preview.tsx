import React from "react";
import { ZParagraph } from "./ZParagraph";

export default {
  title: "Content/ZParagraph",
  component: ZParagraph,
};

export const StandardParagraph = () => (
  <div
    style={{
      background: "#1a1a1a",
      padding: "40px",
      color: "#fff",
      maxWidth: "600px",
    }}
  >
    <ZParagraph>
      This is a standard paragraph with default styling. It maintains proper
      spacing and readability for longer content blocks.
    </ZParagraph>
    <ZParagraph style={{ marginTop: "16px" }}>
      Multiple paragraphs can be stacked together to create flowing text content
      that's easy to read and understand.
    </ZParagraph>
  </div>
);
