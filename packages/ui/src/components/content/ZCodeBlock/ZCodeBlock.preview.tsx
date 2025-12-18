import React from "react";
import { ZCodeBlock } from "./ZCodeBlock";

export default {
  title: "Content/ZCodeBlock",
  component: ZCodeBlock,
};

export const JavaScriptExample = () => (
  <div style={{ background: "#1a1a1a", padding: "40px" }}>
    <ZCodeBlock language="javascript">{`const greeting = (name) => {
  return \`Hello, \${name}!\`;
};

console.log(greeting('World'));`}</ZCodeBlock>
  </div>
);

export const TypeScriptExample = () => (
  <div style={{ background: "#1a1a1a", padding: "40px" }}>
    <ZCodeBlock language="typescript">{`interface User {
  id: string;
  name: string;
}

const users: User[] = [];`}</ZCodeBlock>
  </div>
);
