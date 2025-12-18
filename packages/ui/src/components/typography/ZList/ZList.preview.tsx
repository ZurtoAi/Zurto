import React from "react";
import { ZList } from "./ZList";

export default {
  title: "Typography/ZList",
  component: ZList,
};

export const UnorderedList = () => (
  <div style={{ background: "#1a1a1a", padding: "40px", color: "#fff" }}>
    <ZList>
      <ZList.Item>First feature item</ZList.Item>
      <ZList.Item>Second feature item</ZList.Item>
      <ZList.Item>Third feature item with more detail</ZList.Item>
    </ZList>
  </div>
);

export const OrderedList = () => (
  <div style={{ background: "#1a1a1a", padding: "40px", color: "#fff" }}>
    <ZList type="ordered">
      <ZList.Item>Initialize the project</ZList.Item>
      <ZList.Item>Install dependencies</ZList.Item>
      <ZList.Item>Configure settings</ZList.Item>
      <ZList.Item>Start development</ZList.Item>
    </ZList>
  </div>
);
