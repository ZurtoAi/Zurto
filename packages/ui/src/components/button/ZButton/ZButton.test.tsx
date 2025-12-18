import { describe, it, expect } from "vitest";
import { render, screen } from "@test/utils";
import { ZButton } from "./ZButton";
import userEvent from "@testing-library/user-event";

describe("ZButton", () => {
  it("renders correctly", () => {
    render(<ZButton>Click me</ZButton>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("handles click events", async () => {
    let clicked = false;
    const user = userEvent.setup();

    render(
      <ZButton
        onClick={() => {
          clicked = true;
        }}
      >
        Click
      </ZButton>
    );

    await user.click(screen.getByText("Click"));
    expect(clicked).toBe(true);
  });

  it("applies variant styles", () => {
    const { container } = render(<ZButton variant="primary">Primary</ZButton>);
    const button = container.querySelector("button");
    expect(button?.className).toContain("primary");
  });

  it("applies size styles", () => {
    const { container } = render(<ZButton size="lg">Large</ZButton>);
    const button = container.querySelector("button");
    expect(button?.className).toContain("lg");
  });

  it("can be disabled", () => {
    render(<ZButton disabled>Disabled</ZButton>);
    const button = screen.getByText("Disabled");
    expect(button).toBeDisabled();
  });

  it("renders with icon", () => {
    render(
      <ZButton icon={<span data-testid="test-icon">Icon</span>}>
        With Icon
      </ZButton>
    );
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });
});
