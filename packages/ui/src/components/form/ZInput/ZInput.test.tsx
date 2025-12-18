import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@test/utils";
import { ZInput } from "./ZInput";
import userEvent from "@testing-library/user-event";

describe("ZInput", () => {
  it("renders correctly", () => {
    render(<ZInput placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("handles input changes", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<ZInput onChange={handleChange} />);
    const input = screen.getByRole("textbox");

    await user.type(input, "Hello");
    expect(handleChange).toHaveBeenCalled();
  });

  it("shows label when provided", () => {
    render(<ZInput label="Username" />);
    expect(screen.getByText("Username")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<ZInput error="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("can be disabled", () => {
    render(<ZInput disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("supports different sizes", () => {
    const { container } = render(<ZInput size="lg" />);
    const input = container.querySelector("input");
    expect(input?.className).toContain("lg");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<ZInput ref={ref as any} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
