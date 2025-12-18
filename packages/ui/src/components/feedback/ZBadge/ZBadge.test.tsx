import { describe, it, expect } from "vitest";
import { render, screen } from "@test/utils";
import { ZBadge } from "./ZBadge";

describe("ZBadge", () => {
  it("renders text correctly", () => {
    render(<ZBadge>New</ZBadge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("applies variant styles", () => {
    const { container } = render(<ZBadge variant="success">Success</ZBadge>);
    const badge = container.firstChild;
    expect(badge).toHaveClass("success");
  });

  it("applies size styles", () => {
    const { container } = render(<ZBadge size="lg">Large</ZBadge>);
    const badge = container.firstChild;
    expect(badge).toHaveClass("lg");
  });

  it("renders as dot variant", () => {
    const { container } = render(<ZBadge dot />);
    const badge = container.firstChild;
    expect(badge).toHaveClass("dot");
  });

  it("renders with icon", () => {
    render(
      <ZBadge icon={<span data-testid="badge-icon">★</span>}>Star</ZBadge>
    );
    expect(screen.getByTestId("badge-icon")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<ZBadge className="custom">Test</ZBadge>);
    const badge = container.firstChild;
    expect(badge).toHaveClass("custom");
  });
});
