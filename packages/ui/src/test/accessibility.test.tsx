import { describe, it, expect } from "vitest";
import { render } from "@test/utils";
import { axe, toHaveNoViolations } from "jest-axe";
import { ZButton } from "../button/ZButton/ZButton";
import { ZInput } from "../form/ZInput/ZInput";
import { ZCard } from "../layout/ZCard/ZCard";
import { ZBadge } from "../feedback/ZBadge/ZBadge";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("Accessibility Tests", () => {
  it("ZButton should have no accessibility violations", async () => {
    const { container } = render(<ZButton>Click me</ZButton>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("ZInput with label should have no accessibility violations", async () => {
    const { container } = render(<ZInput label="Username" id="username" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("ZCard should have no accessibility violations", async () => {
    const { container } = render(
      <ZCard>
        <h2>Card Title</h2>
        <p>Card content goes here</p>
      </ZCard>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("ZBadge should have no accessibility violations", async () => {
    const { container } = render(<ZBadge>New</ZBadge>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Disabled button should have proper aria attributes", () => {
    const { container } = render(<ZButton disabled>Disabled</ZButton>);
    const button = container.querySelector("button");
    expect(button).toHaveAttribute("disabled");
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  it("Form input should be properly labeled", () => {
    const { container } = render(<ZInput label="Email" id="email" required />);
    const input = container.querySelector("input");
    const label = container.querySelector("label");

    expect(label).toHaveAttribute("for", "email");
    expect(input).toHaveAttribute("id", "email");
    expect(input).toHaveAttribute("required");
  });
});
