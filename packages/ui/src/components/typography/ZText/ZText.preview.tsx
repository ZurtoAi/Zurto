import React from "react";
import { ZText } from "./ZText";

export default {
  title: "Typography/ZText",
  component: ZText,
};

export const BasicText = () => (
  <div style={{ background: "#1a1a1a", padding: "40px", color: "#fff" }}>
    <ZText>Default text with natural font sizing</ZText>
    <ZText size="sm" style={{ marginTop: "16px" }}>
      Small text for secondary information
    </ZText>
    <ZText size="lg" weight={600} style={{ marginTop: "16px" }}>
      Large bold text for emphasis
    </ZText>
  </div>
);

export const ColorVariants = () => (
  <div style={{ background: "#1a1a1a", padding: "40px", color: "#fff" }}>
    <ZText color="dimmed">Dimmed text for less important content</ZText>
    <ZText style={{ color: "#60a5fa", marginTop: "12px" }}>
      Primary blue accent text
    </ZText>
    <ZText style={{ color: "#f87171", marginTop: "12px" }}>
      Error or warning red text
    </ZText>
  </div>
);
