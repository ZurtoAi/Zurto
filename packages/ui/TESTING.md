# Testing Guide

## Setup Complete ✅

zurto-ui now has a complete testing infrastructure:

- **Vitest** - Fast unit testing
- **React Testing Library** - Component testing
- **jest-axe** - Accessibility testing
- **@testing-library/user-event** - User interaction simulation

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm test:ui

# Run tests with coverage
npm test -- --coverage
```

## Test Structure

Tests are located alongside components:

```
src/components/
  button/
    ZButton/
      ZButton.tsx
      ZButton.test.tsx  ← Test file
      ZButton.module.css
```

## Writing Tests

### Basic Component Test

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ZButton } from "./ZButton";

describe("ZButton", () => {
  it("renders correctly", () => {
    render(<ZButton>Click me</ZButton>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
});
```

### Testing User Interactions

```typescript
import userEvent from "@testing-library/user-event";

it("handles clicks", async () => {
  const handleClick = vi.fn();
  const user = userEvent.setup();

  render(<ZButton onClick={handleClick}>Click</ZButton>);
  await user.click(screen.getByText("Click"));

  expect(handleClick).toHaveBeenCalled();
});
```

### Accessibility Testing

```typescript
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

it("has no accessibility violations", async () => {
  const { container } = render(<ZButton>Accessible</ZButton>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Test Files Created

Sample tests have been created for reference:

1. **ZButton.test.tsx** - Button component tests
2. **ZCard.test.tsx** - Card component tests
3. **ZInput.test.tsx** - Input component tests
4. **ZBadge.test.tsx** - Badge component tests
5. **accessibility.test.tsx** - Accessibility test examples

## Next Steps

To add tests for additional components:

1. Create `ComponentName.test.tsx` next to your component
2. Import the component and testing utilities
3. Write tests for rendering, interactions, and accessibility
4. Run `npm test` to verify

## Configuration Files

- **vitest.config.ts** - Vitest configuration
- **src/test/setup.ts** - Test environment setup
- **src/test/utils.tsx** - Custom test utilities

## Best Practices

✅ Test user-visible behavior, not implementation  
✅ Use accessible queries (getByRole, getByLabelText)  
✅ Test keyboard navigation and screen readers  
✅ Keep tests simple and focused  
✅ Mock external dependencies  
✅ Test error states and edge cases

