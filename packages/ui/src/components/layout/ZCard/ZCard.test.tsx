import { describe, it, expect } from "vitest";
import { render, screen } from "@test/utils";
import { ZCard } from "./ZCard";

describe("ZCard", () => {
  it("renders children correctly", () => {
    render(<ZCard>Card Content</ZCard>);
    expect(screen.getByText("Card Content")).toBeInTheDocument();
  });

  it("applies variant styles", () => {
    const { container } = render(<ZCard variant="elevated">Test</ZCard>);
    const card = container.firstChild;
    expect(card).toHaveClass("elevated");
  });

  it("applies padding prop", () => {
    const { container } = render(<ZCard padding="lg">Test</ZCard>);
    const card = container.firstChild;
    expect(card).toHaveClass("padding-lg");
  });

  it("renders with hover effect", () => {
    const { container } = render(<ZCard hoverable>Test</ZCard>);
    const card = container.firstChild;
    expect(card).toHaveClass("hoverable");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<ZCard ref={ref as any}>Test</ZCard>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies custom className", () => {
    const { container } = render(<ZCard className="custom-class">Test</ZCard>);
    const card = container.firstChild;
    expect(card).toHaveClass("custom-class");
  });
});
