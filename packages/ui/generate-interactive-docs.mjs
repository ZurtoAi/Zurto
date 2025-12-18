import fs from "fs";
import path from "path";

const docsPath = "./docs/components";

// Component definitions with interactive HTML previews (no inline <style> tags)
const components = {
  // BUTTONS
  ZButton: {
    category: "button",
    description: "Primary button component with variants and sizes",
    preview: `<div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
      <button style="padding: 10px 20px; background: linear-gradient(135deg, #c73548, #df3e53); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">Primary</button>
      <button style="padding: 10px 20px; background: transparent; color: #c73548; border: 2px solid #c73548; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">Secondary</button>
      <button style="padding: 10px 20px; background: transparent; color: #888; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">Ghost</button>
    </div>`,
    code: `import { ZButton } from 'zurto-ui';

function Example() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <ZButton variant="primary">Primary</ZButton>
      <ZButton variant="secondary">Secondary</ZButton>
      <ZButton variant="ghost">Ghost</ZButton>
    </div>
  );
}`,
    props: [
      [
        "variant",
        "'primary' | 'secondary' | 'ghost' | 'danger'",
        "'primary'",
        "Button style variant",
      ],
      ["size", "'sm' | 'md' | 'lg'", "'md'", "Button size"],
      ["disabled", "boolean", "false", "Disable the button"],
      ["loading", "boolean", "false", "Show loading spinner"],
      ["leftIcon", "ReactNode", "-", "Icon before text"],
      ["rightIcon", "ReactNode", "-", "Icon after text"],
      ["onClick", "() => void", "-", "Click handler"],
    ],
  },
  ZIconButton: {
    category: "button",
    description: "Icon-only button for toolbars and actions",
    preview: `<div style="display: flex; gap: 12px; justify-content: center;">
      <button style="width: 40px; height: 40px; background: linear-gradient(135deg, #c73548, #df3e53); color: white; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px;">⚡</button>
      <button style="width: 40px; height: 40px; background: #222; color: white; border: 1px solid #333; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px;">⚙️</button>
      <button style="width: 40px; height: 40px; background: transparent; color: #888; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px;">🔔</button>
    </div>`,
    code: `import { ZIconButton } from 'zurto-ui';
import { Settings, Bell, Zap } from 'lucide-react';

function Example() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <ZIconButton icon={<Zap />} variant="primary" />
      <ZIconButton icon={<Settings />} variant="outline" />
      <ZIconButton icon={<Bell />} variant="ghost" />
    </div>
  );
}`,
    props: [
      ["icon", "ReactNode", "-", "Icon element (required)"],
      [
        "variant",
        "'primary' | 'outline' | 'ghost'",
        "'primary'",
        "Button variant",
      ],
      ["size", "'sm' | 'md' | 'lg'", "'md'", "Button size"],
      ["aria-label", "string", "-", "Accessibility label (required)"],
    ],
  },
  ZButtonGroup: {
    category: "button",
    description: "Group multiple buttons together",
    preview: `<div style="display: flex; justify-content: center;">
      <div style="display: inline-flex;">
        <button style="padding: 10px 16px; background: #c73548; color: white; border: none; border-radius: 8px 0 0 8px; cursor: pointer;">Left</button>
        <button style="padding: 10px 16px; background: #c73548; color: white; border: none; border-left: 1px solid rgba(255,255,255,0.2); cursor: pointer;">Center</button>
        <button style="padding: 10px 16px; background: #c73548; color: white; border: none; border-left: 1px solid rgba(255,255,255,0.2); border-radius: 0 8px 8px 0; cursor: pointer;">Right</button>
      </div>
    </div>`,
    code: `import { ZButtonGroup, ZButton } from 'zurto-ui';

function Example() {
  return (
    <ZButtonGroup>
      <ZButton>Left</ZButton>
      <ZButton>Center</ZButton>
      <ZButton>Right</ZButton>
    </ZButtonGroup>
  );
}`,
    props: [
      [
        "orientation",
        "'horizontal' | 'vertical'",
        "'horizontal'",
        "Group direction",
      ],
      ["attached", "boolean", "true", "Remove gaps between buttons"],
    ],
  },
  ZCloseButton: {
    category: "button",
    description: "Close button for modals and dismissible content",
    preview: `<div style="display: flex; gap: 16px; justify-content: center; align-items: center;">
      <button style="width: 32px; height: 32px; background: transparent; color: #666; border: none; border-radius: 6px; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">✕</button>
      <button style="width: 24px; height: 24px; background: transparent; color: #666; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center;">✕</button>
    </div>`,
    code: `import { ZCloseButton } from 'zurto-ui';

function Example() {
  return (
    <>
      <ZCloseButton size="md" onClick={() => console.log('Close')} />
      <ZCloseButton size="sm" />
    </>
  );
}`,
    props: [
      ["size", "'sm' | 'md' | 'lg'", "'md'", "Button size"],
      ["onClick", "() => void", "-", "Click handler"],
    ],
  },

  // FORM INPUTS
  ZInput: {
    category: "form",
    description: "Text input field with validation support",
    preview: `<div style="display: flex; flex-direction: column; gap: 12px; max-width: 300px; margin: 0 auto;">
      <input type="text" placeholder="Enter your name..." style="padding: 12px 16px; background: #1a1a1a; border: 1px solid #333; border-radius: 8px; color: white; font-size: 14px; outline: none; width: 100%;" onfocus="this.style.borderColor='#c73548'" onblur="this.style.borderColor='#333'" />
      <input type="text" placeholder="With error" style="padding: 12px 16px; background: #1a1a1a; border: 1px solid #ef4444; border-radius: 8px; color: white; font-size: 14px; outline: none; width: 100%;" />
    </div>`,
    code: `import { ZInput } from 'zurto-ui';

function Example() {
  return (
    <>
      <ZInput placeholder="Enter your name..." />
      <ZInput placeholder="With error" error />
    </>
  );
}`,
    props: [
      ["placeholder", "string", "-", "Placeholder text"],
      ["value", "string", "-", "Controlled value"],
      ["onChange", "(e) => void", "-", "Change handler"],
      ["error", "boolean", "false", "Show error state"],
      ["disabled", "boolean", "false", "Disable input"],
      ["leftIcon", "ReactNode", "-", "Icon on left"],
      ["rightIcon", "ReactNode", "-", "Icon on right"],
    ],
  },
  ZTextarea: {
    category: "form",
    description: "Multi-line text input",
    preview: `<div style="max-width: 300px; margin: 0 auto;">
      <textarea placeholder="Enter your message..." style="padding: 12px 16px; background: #1a1a1a; border: 1px solid #333; border-radius: 8px; color: white; font-size: 14px; width: 100%; height: 100px; resize: vertical; outline: none; font-family: inherit;" onfocus="this.style.borderColor='#c73548'" onblur="this.style.borderColor='#333'"></textarea>
    </div>`,
    code: `import { ZTextarea } from 'zurto-ui';

function Example() {
  return (
    <ZTextarea 
      placeholder="Enter your message..." 
      rows={4}
    />
  );
}`,
    props: [
      ["placeholder", "string", "-", "Placeholder text"],
      ["rows", "number", "4", "Visible rows"],
      [
        "resize",
        "'none' | 'vertical' | 'horizontal' | 'both'",
        "'vertical'",
        "Resize behavior",
      ],
    ],
  },
  ZSelect: {
    category: "form",
    description: "Dropdown select input",
    preview: `<div style="max-width: 300px; margin: 0 auto;">
      <select style="padding: 12px 16px; background: #1a1a1a; border: 1px solid #333; border-radius: 8px; color: white; font-size: 14px; width: 100%; cursor: pointer; outline: none;">
        <option value="">Select an option...</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </select>
    </div>`,
    code: `import { ZSelect } from 'zurto-ui';

function Example() {
  return (
    <ZSelect placeholder="Select an option...">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
      <option value="3">Option 3</option>
    </ZSelect>
  );
}`,
    props: [
      ["placeholder", "string", "-", "Placeholder option"],
      ["value", "string", "-", "Selected value"],
      ["onChange", "(value) => void", "-", "Change handler"],
      ["options", "Array<{label, value}>", "-", "Options array"],
    ],
  },
  ZCheckbox: {
    category: "form",
    description: "Checkbox input with label",
    preview: `<div style="display: flex; flex-direction: column; gap: 12px; max-width: 300px; margin: 0 auto;">
      <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; color: white;">
        <input type="checkbox" checked style="width: 18px; height: 18px; accent-color: #c73548; cursor: pointer;" />
        <span>Accept terms and conditions</span>
      </label>
      <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; color: white;">
        <input type="checkbox" style="width: 18px; height: 18px; accent-color: #c73548; cursor: pointer;" />
        <span>Subscribe to newsletter</span>
      </label>
    </div>`,
    code: `import { ZCheckbox } from 'zurto-ui';

function Example() {
  return (
    <>
      <ZCheckbox label="Accept terms and conditions" defaultChecked />
      <ZCheckbox label="Subscribe to newsletter" />
    </>
  );
}`,
    props: [
      ["label", "string", "-", "Checkbox label"],
      ["checked", "boolean", "false", "Checked state"],
      ["onChange", "(checked) => void", "-", "Change handler"],
      ["disabled", "boolean", "false", "Disable checkbox"],
    ],
  },
  ZSwitch: {
    category: "form",
    description: "Toggle switch for boolean values",
    preview: `<div style="display: flex; flex-direction: column; gap: 16px; max-width: 300px; margin: 0 auto;">
      <label style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
        <div style="width: 44px; height: 24px; background: #c73548; border-radius: 12px; position: relative; transition: 0.2s;">
          <div style="width: 20px; height: 20px; background: white; border-radius: 50%; position: absolute; top: 2px; right: 2px;"></div>
        </div>
        <span style="color: white;">Notifications enabled</span>
      </label>
      <label style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
        <div style="width: 44px; height: 24px; background: #333; border-radius: 12px; position: relative;">
          <div style="width: 20px; height: 20px; background: #666; border-radius: 50%; position: absolute; top: 2px; left: 2px;"></div>
        </div>
        <span style="color: #888;">Dark mode</span>
      </label>
    </div>`,
    code: `import { ZSwitch } from 'zurto-ui';

function Example() {
  return (
    <>
      <ZSwitch label="Notifications enabled" defaultChecked />
      <ZSwitch label="Dark mode" />
    </>
  );
}`,
    props: [
      ["label", "string", "-", "Switch label"],
      ["checked", "boolean", "false", "Checked state"],
      ["onChange", "(checked) => void", "-", "Change handler"],
    ],
  },
  ZSlider: {
    category: "form",
    description: "Range slider input",
    preview: `<div style="max-width: 300px; margin: 0 auto; padding: 10px 0;">
      <input type="range" min="0" max="100" value="65" style="width: 100%; accent-color: #c73548; cursor: pointer; height: 6px;" />
      <div style="display: flex; justify-content: space-between; color: #888; font-size: 12px; margin-top: 8px;">
        <span>0</span>
        <span>65</span>
        <span>100</span>
      </div>
    </div>`,
    code: `import { ZSlider } from 'zurto-ui';

function Example() {
  return (
    <ZSlider 
      min={0} 
      max={100} 
      defaultValue={65}
      showValue
    />
  );
}`,
    props: [
      ["min", "number", "0", "Minimum value"],
      ["max", "number", "100", "Maximum value"],
      ["value", "number", "-", "Current value"],
      ["step", "number", "1", "Step increment"],
      ["showValue", "boolean", "false", "Show current value"],
    ],
  },

  // FEEDBACK
  ZAlert: {
    category: "feedback",
    description: "Alert messages for user feedback",
    preview: `<div style="display: flex; flex-direction: column; gap: 12px; max-width: 400px; margin: 0 auto;">
      <div style="padding: 14px 16px; background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 8px; color: #60a5fa; display: flex; align-items: center; gap: 10px;">
        <span>ℹ️</span> This is an info alert
      </div>
      <div style="padding: 14px 16px; background: rgba(34, 197, 94, 0.15); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 8px; color: #4ade80; display: flex; align-items: center; gap: 10px;">
        <span>✓</span> Success! Your changes have been saved.
      </div>
      <div style="padding: 14px 16px; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; color: #f87171; display: flex; align-items: center; gap: 10px;">
        <span>⚠️</span> Error: Something went wrong.
      </div>
    </div>`,
    code: `import { ZAlert } from 'zurto-ui';

function Example() {
  return (
    <>
      <ZAlert type="info">This is an info alert</ZAlert>
      <ZAlert type="success">Success! Your changes have been saved.</ZAlert>
      <ZAlert type="error">Error: Something went wrong.</ZAlert>
    </>
  );
}`,
    props: [
      [
        "type",
        "'info' | 'success' | 'warning' | 'error'",
        "'info'",
        "Alert type",
      ],
      ["title", "string", "-", "Alert title"],
      ["closable", "boolean", "false", "Show close button"],
      ["onClose", "() => void", "-", "Close handler"],
    ],
  },
  ZBadge: {
    category: "feedback",
    description: "Small status indicator badges",
    preview: `<div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
      <span style="padding: 4px 10px; background: linear-gradient(135deg, #c73548, #df3e53); color: white; border-radius: 9999px; font-size: 12px; font-weight: 600;">New</span>
      <span style="padding: 4px 10px; background: rgba(34, 197, 94, 0.2); color: #4ade80; border-radius: 9999px; font-size: 12px; font-weight: 600;">Active</span>
      <span style="padding: 4px 10px; background: rgba(234, 179, 8, 0.2); color: #facc15; border-radius: 9999px; font-size: 12px; font-weight: 600;">Pending</span>
      <span style="padding: 4px 10px; background: rgba(107, 114, 128, 0.2); color: #9ca3af; border-radius: 9999px; font-size: 12px; font-weight: 600;">Archived</span>
    </div>`,
    code: `import { ZBadge } from 'zurto-ui';

function Example() {
  return (
    <>
      <ZBadge color="primary">New</ZBadge>
      <ZBadge color="success">Active</ZBadge>
      <ZBadge color="warning">Pending</ZBadge>
      <ZBadge color="gray">Archived</ZBadge>
    </>
  );
}`,
    props: [
      [
        "color",
        "'primary' | 'success' | 'warning' | 'error' | 'gray'",
        "'primary'",
        "Badge color",
      ],
      ["size", "'sm' | 'md' | 'lg'", "'md'", "Badge size"],
    ],
  },
  ZSpinner: {
    category: "feedback",
    description: "Loading spinner indicator",
    preview: `<div style="display: flex; gap: 24px; justify-content: center; align-items: center;">
      <div style="width: 24px; height: 24px; border: 3px solid #333; border-top-color: #c73548; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      <div style="width: 32px; height: 32px; border: 3px solid #333; border-top-color: #c73548; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      <div style="width: 40px; height: 40px; border: 4px solid #333; border-top-color: #c73548; border-radius: 50%; animation: spin 1s linear infinite;"></div>
    </div>`,
    code: `import { ZSpinner } from 'zurto-ui';

function Example() {
  return (
    <>
      <ZSpinner size="sm" />
      <ZSpinner size="md" />
      <ZSpinner size="lg" />
    </>
  );
}`,
    props: [
      ["size", "'sm' | 'md' | 'lg'", "'md'", "Spinner size"],
      ["color", "string", "'primary'", "Spinner color"],
    ],
  },
  ZProgress: {
    category: "feedback",
    description: "Progress bar indicator",
    preview: `<div style="display: flex; flex-direction: column; gap: 16px; max-width: 300px; margin: 0 auto;">
      <div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px;">
          <span style="color: white;">Progress</span>
          <span style="color: #888;">65%</span>
        </div>
        <div style="width: 100%; height: 8px; background: #333; border-radius: 4px; overflow: hidden;">
          <div style="width: 65%; height: 100%; background: linear-gradient(90deg, #c73548, #df3e53);"></div>
        </div>
      </div>
      <div style="width: 100%; height: 8px; background: #333; border-radius: 4px; overflow: hidden;">
        <div style="width: 30%; height: 100%; background: linear-gradient(90deg, #c73548, #df3e53);"></div>
      </div>
    </div>`,
    code: `import { ZProgress } from 'zurto-ui';

function Example() {
  return (
    <>
      <ZProgress value={65} showLabel />
      <ZProgress value={30} />
    </>
  );
}`,
    props: [
      ["value", "number", "0", "Progress value (0-100)"],
      ["showLabel", "boolean", "false", "Show percentage label"],
      ["size", "'sm' | 'md' | 'lg'", "'md'", "Bar height"],
    ],
  },
  ZSkeleton: {
    category: "feedback",
    description: "Loading placeholder skeleton",
    preview: `<div style="display: flex; flex-direction: column; gap: 12px; max-width: 300px; margin: 0 auto;">
      <div style="height: 16px; background: linear-gradient(90deg, #222 0%, #333 50%, #222 100%); background-size: 200% 100%; border-radius: 4px; animation: shimmer 1.5s infinite;"></div>
      <div style="height: 16px; width: 80%; background: linear-gradient(90deg, #222 0%, #333 50%, #222 100%); background-size: 200% 100%; border-radius: 4px; animation: shimmer 1.5s infinite;"></div>
      <div style="height: 16px; width: 60%; background: linear-gradient(90deg, #222 0%, #333 50%, #222 100%); background-size: 200% 100%; border-radius: 4px; animation: shimmer 1.5s infinite;"></div>
    </div>`,
    code: `import { ZSkeleton } from 'zurto-ui';

function Example() {
  return (
    <>
      <ZSkeleton width="100%" height={16} />
      <ZSkeleton width="80%" height={16} />
      <ZSkeleton width="60%" height={16} />
    </>
  );
}`,
    props: [
      ["width", "string | number", "'100%'", "Skeleton width"],
      ["height", "string | number", "20", "Skeleton height"],
      ["circle", "boolean", "false", "Make circular"],
    ],
  },
  ZModal: {
    category: "feedback",
    description: "Modal dialog overlay",
    preview: `<div style="max-width: 400px; margin: 0 auto; padding: 24px; background: #1a1a1a; border: 1px solid #333; border-radius: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 style="margin: 0; color: white; font-size: 18px;">Modal Title</h3>
        <button style="background: none; border: none; color: #666; cursor: pointer; font-size: 20px;">✕</button>
      </div>
      <p style="color: #aaa; margin: 0 0 20px 0; line-height: 1.5;">This is the modal content. You can put any content here including forms, images, or other components.</p>
      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button style="padding: 10px 16px; background: transparent; border: 1px solid #333; border-radius: 6px; color: white; cursor: pointer;">Cancel</button>
        <button style="padding: 10px 16px; background: #c73548; border: none; border-radius: 6px; color: white; cursor: pointer;">Confirm</button>
      </div>
    </div>`,
    code: `import { ZModal, ZButton } from 'zurto-ui';
import { useState } from 'react';

function Example() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <ZButton onClick={() => setOpen(true)}>Open Modal</ZButton>
      <ZModal 
        open={open} 
        onClose={() => setOpen(false)}
        title="Modal Title"
      >
        <p>This is the modal content.</p>
        <ZButton onClick={() => setOpen(false)}>Confirm</ZButton>
      </ZModal>
    </>
  );
}`,
    props: [
      ["open", "boolean", "false", "Control visibility"],
      ["onClose", "() => void", "-", "Close handler"],
      ["title", "string", "-", "Modal title"],
      ["size", "'sm' | 'md' | 'lg' | 'xl'", "'md'", "Modal width"],
    ],
  },
  ZTooltip: {
    category: "feedback",
    description: "Tooltip on hover",
    preview: `<div style="display: flex; justify-content: center; padding: 40px 0;">
      <div style="position: relative; display: inline-block;">
        <button style="padding: 10px 20px; background: #c73548; color: white; border: none; border-radius: 8px; cursor: pointer;">Hover me</button>
        <div style="position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); padding: 6px 12px; background: #333; color: white; border-radius: 6px; font-size: 12px; white-space: nowrap;">Tooltip text</div>
      </div>
    </div>`,
    code: `import { ZTooltip, ZButton } from 'zurto-ui';

function Example() {
  return (
    <ZTooltip content="Tooltip text">
      <ZButton>Hover me</ZButton>
    </ZTooltip>
  );
}`,
    props: [
      ["content", "ReactNode", "-", "Tooltip content"],
      [
        "position",
        "'top' | 'bottom' | 'left' | 'right'",
        "'top'",
        "Tooltip position",
      ],
      ["delay", "number", "200", "Show delay (ms)"],
    ],
  },

  // LAYOUT
  ZCard: {
    category: "layout",
    description: "Container card with shadow",
    preview: `<div style="max-width: 320px; margin: 0 auto; padding: 24px; background: #1a1a1a; border: 1px solid #333; border-radius: 12px;">
      <h3 style="margin: 0 0 8px 0; color: white; font-size: 18px;">Card Title</h3>
      <p style="margin: 0; color: #aaa; font-size: 14px; line-height: 1.5;">This is a card component with some example content. Cards are great for grouping related information.</p>
    </div>`,
    code: `import { ZCard } from 'zurto-ui';

function Example() {
  return (
    <ZCard>
      <h3>Card Title</h3>
      <p>This is a card component with some example content.</p>
    </ZCard>
  );
}`,
    props: [
      ["padding", "'none' | 'sm' | 'md' | 'lg'", "'md'", "Card padding"],
      ["shadow", "boolean", "true", "Show shadow"],
      ["hoverable", "boolean", "false", "Hover effect"],
    ],
  },
  ZFlex: {
    category: "layout",
    description: "Flexbox container",
    preview: `<div style="display: flex; gap: 12px; justify-content: center;">
      <div style="padding: 20px 30px; background: #c73548; border-radius: 8px; color: white;">1</div>
      <div style="padding: 20px 30px; background: #c73548; border-radius: 8px; color: white;">2</div>
      <div style="padding: 20px 30px; background: #c73548; border-radius: 8px; color: white;">3</div>
    </div>`,
    code: `import { ZFlex } from 'zurto-ui';

function Example() {
  return (
    <ZFlex gap={12} justify="center">
      <div>1</div>
      <div>2</div>
      <div>3</div>
    </ZFlex>
  );
}`,
    props: [
      ["direction", "'row' | 'column'", "'row'", "Flex direction"],
      ["gap", "number", "0", "Gap between items"],
      ["align", "string", "'stretch'", "Align items"],
      ["justify", "string", "'flex-start'", "Justify content"],
      ["wrap", "boolean", "false", "Allow wrapping"],
    ],
  },
  ZGrid: {
    category: "layout",
    description: "CSS Grid container",
    preview: `<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; max-width: 320px; margin: 0 auto;">
      <div style="padding: 20px; background: #222; border-radius: 8px; color: white; text-align: center;">1</div>
      <div style="padding: 20px; background: #222; border-radius: 8px; color: white; text-align: center;">2</div>
      <div style="padding: 20px; background: #222; border-radius: 8px; color: white; text-align: center;">3</div>
      <div style="padding: 20px; background: #222; border-radius: 8px; color: white; text-align: center;">4</div>
      <div style="padding: 20px; background: #222; border-radius: 8px; color: white; text-align: center;">5</div>
      <div style="padding: 20px; background: #222; border-radius: 8px; color: white; text-align: center;">6</div>
    </div>`,
    code: `import { ZGrid } from 'zurto-ui';

function Example() {
  return (
    <ZGrid columns={3} gap={12}>
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>5</div>
      <div>6</div>
    </ZGrid>
  );
}`,
    props: [
      ["columns", "number | string", "1", "Number of columns"],
      ["gap", "number", "0", "Gap between items"],
      ["rowGap", "number", "-", "Row gap (overrides gap)"],
      ["columnGap", "number", "-", "Column gap (overrides gap)"],
    ],
  },
  ZStack: {
    category: "layout",
    description: "Vertical stack layout",
    preview: `<div style="display: flex; flex-direction: column; gap: 12px; max-width: 200px; margin: 0 auto;">
      <div style="padding: 16px; background: #222; border-radius: 8px; color: white;">Item 1</div>
      <div style="padding: 16px; background: #222; border-radius: 8px; color: white;">Item 2</div>
      <div style="padding: 16px; background: #222; border-radius: 8px; color: white;">Item 3</div>
    </div>`,
    code: `import { ZStack } from 'zurto-ui';

function Example() {
  return (
    <ZStack gap={12}>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
    </ZStack>
  );
}`,
    props: [
      ["gap", "number", "0", "Gap between items"],
      [
        "align",
        "'stretch' | 'start' | 'center' | 'end'",
        "'stretch'",
        "Alignment",
      ],
    ],
  },
  ZDivider: {
    category: "layout",
    description: "Horizontal or vertical divider",
    preview: `<div style="max-width: 300px; margin: 0 auto;">
      <p style="color: white; margin: 0 0 16px 0;">Content above</p>
      <div style="height: 1px; background: linear-gradient(90deg, transparent, #333, transparent);"></div>
      <p style="color: white; margin: 16px 0 0 0;">Content below</p>
    </div>`,
    code: `import { ZDivider } from 'zurto-ui';

function Example() {
  return (
    <>
      <p>Content above</p>
      <ZDivider />
      <p>Content below</p>
    </>
  );
}`,
    props: [
      [
        "orientation",
        "'horizontal' | 'vertical'",
        "'horizontal'",
        "Divider direction",
      ],
      ["label", "string", "-", "Center label"],
    ],
  },

  // NAVIGATION
  ZTabs: {
    category: "navigation",
    description: "Tabbed navigation",
    preview: `<div style="max-width: 400px; margin: 0 auto;">
      <div style="display: flex; border-bottom: 1px solid #333;">
        <button style="padding: 12px 24px; background: transparent; border: none; border-bottom: 2px solid #c73548; color: #c73548; cursor: pointer; font-weight: 500;">Tab 1</button>
        <button style="padding: 12px 24px; background: transparent; border: none; border-bottom: 2px solid transparent; color: #888; cursor: pointer;">Tab 2</button>
        <button style="padding: 12px 24px; background: transparent; border: none; border-bottom: 2px solid transparent; color: #888; cursor: pointer;">Tab 3</button>
      </div>
      <div style="padding: 20px 0; color: #aaa;">Tab 1 content goes here</div>
    </div>`,
    code: `import { ZTabs, ZTabList, ZTab, ZTabPanels, ZTabPanel } from 'zurto-ui';

function Example() {
  return (
    <ZTabs defaultValue="tab1">
      <ZTabList>
        <ZTab value="tab1">Tab 1</ZTab>
        <ZTab value="tab2">Tab 2</ZTab>
        <ZTab value="tab3">Tab 3</ZTab>
      </ZTabList>
      <ZTabPanels>
        <ZTabPanel value="tab1">Tab 1 content</ZTabPanel>
        <ZTabPanel value="tab2">Tab 2 content</ZTabPanel>
        <ZTabPanel value="tab3">Tab 3 content</ZTabPanel>
      </ZTabPanels>
    </ZTabs>
  );
}`,
    props: [
      ["defaultValue", "string", "-", "Default tab"],
      ["value", "string", "-", "Controlled value"],
      ["onChange", "(value) => void", "-", "Tab change handler"],
    ],
  },
  ZBreadcrumb: {
    category: "navigation",
    description: "Breadcrumb navigation",
    preview: `<nav style="display: flex; align-items: center; gap: 8px; color: #888; font-size: 14px; justify-content: center;">
      <a href="#" style="color: #888; text-decoration: none;">Home</a>
      <span>/</span>
      <a href="#" style="color: #888; text-decoration: none;">Products</a>
      <span>/</span>
      <span style="color: white;">Details</span>
    </nav>`,
    code: `import { ZBreadcrumb, ZBreadcrumbItem } from 'zurto-ui';

function Example() {
  return (
    <ZBreadcrumb>
      <ZBreadcrumbItem href="/">Home</ZBreadcrumbItem>
      <ZBreadcrumbItem href="/products">Products</ZBreadcrumbItem>
      <ZBreadcrumbItem>Details</ZBreadcrumbItem>
    </ZBreadcrumb>
  );
}`,
    props: [["separator", "ReactNode", "'/'", "Separator element"]],
  },
  ZPagination: {
    category: "navigation",
    description: "Page navigation",
    preview: `<div style="display: flex; gap: 4px; justify-content: center;">
      <button style="padding: 8px 12px; background: #222; border: 1px solid #333; border-radius: 6px; color: #888; cursor: pointer;">←</button>
      <button style="padding: 8px 12px; background: #222; border: 1px solid #333; border-radius: 6px; color: white; cursor: pointer;">1</button>
      <button style="padding: 8px 12px; background: #c73548; border: none; border-radius: 6px; color: white; cursor: pointer;">2</button>
      <button style="padding: 8px 12px; background: #222; border: 1px solid #333; border-radius: 6px; color: white; cursor: pointer;">3</button>
      <button style="padding: 8px 12px; background: #222; border: 1px solid #333; border-radius: 6px; color: white; cursor: pointer;">→</button>
    </div>`,
    code: `import { ZPagination } from 'zurto-ui';

function Example() {
  return (
    <ZPagination 
      total={100}
      pageSize={10}
      current={2}
      onChange={(page) => console.log(page)}
    />
  );
}`,
    props: [
      ["total", "number", "-", "Total items"],
      ["pageSize", "number", "10", "Items per page"],
      ["current", "number", "1", "Current page"],
      ["onChange", "(page) => void", "-", "Page change handler"],
    ],
  },
  ZMenu: {
    category: "navigation",
    description: "Dropdown menu",
    preview: `<div style="max-width: 200px; margin: 0 auto; background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 8px;">
      <div style="padding: 10px 12px; color: white; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 10px;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">📄 New File</div>
      <div style="padding: 10px 12px; color: white; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 10px;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">📁 Open</div>
      <div style="height: 1px; background: #333; margin: 8px 0;"></div>
      <div style="padding: 10px 12px; color: #888; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 10px;">⚙️ Settings</div>
    </div>`,
    code: `import { ZMenu, ZMenuItem, ZMenuDivider } from 'zurto-ui';

function Example() {
  return (
    <ZMenu>
      <ZMenuItem icon="📄">New File</ZMenuItem>
      <ZMenuItem icon="📁">Open</ZMenuItem>
      <ZMenuDivider />
      <ZMenuItem icon="⚙️" disabled>Settings</ZMenuItem>
    </ZMenu>
  );
}`,
    props: [["onSelect", "(item) => void", "-", "Selection handler"]],
  },

  // DATA DISPLAY
  ZTable: {
    category: "data-display",
    description: "Data table component",
    preview: `<div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; min-width: 300px;">
        <thead>
          <tr style="border-bottom: 1px solid #333;">
            <th style="padding: 12px; text-align: left; color: #888; font-weight: 500;">Name</th>
            <th style="padding: 12px; text-align: left; color: #888; font-weight: 500;">Email</th>
            <th style="padding: 12px; text-align: left; color: #888; font-weight: 500;">Role</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #222;">
            <td style="padding: 12px; color: white;">John Doe</td>
            <td style="padding: 12px; color: #aaa;">john@example.com</td>
            <td style="padding: 12px; color: #aaa;">Admin</td>
          </tr>
          <tr>
            <td style="padding: 12px; color: white;">Jane Smith</td>
            <td style="padding: 12px; color: #aaa;">jane@example.com</td>
            <td style="padding: 12px; color: #aaa;">User</td>
          </tr>
        </tbody>
      </table>
    </div>`,
    code: `import { ZTable } from 'zurto-ui';

const columns = [
  { key: 'name', title: 'Name' },
  { key: 'email', title: 'Email' },
  { key: 'role', title: 'Role' },
];

const data = [
  { name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
];

function Example() {
  return <ZTable columns={columns} data={data} />;
}`,
    props: [
      ["columns", "Array<Column>", "-", "Column definitions"],
      ["data", "Array<Row>", "-", "Table data"],
      ["striped", "boolean", "false", "Striped rows"],
      ["hoverable", "boolean", "true", "Hover effect"],
    ],
  },
  ZAvatar: {
    category: "data-display",
    description: "User avatar with fallback",
    preview: `<div style="display: flex; gap: 16px; justify-content: center; align-items: center;">
      <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #c73548, #df3e53); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">JD</div>
      <div style="width: 48px; height: 48px; background: #333; border-radius: 50%; overflow: hidden;">
        <img src="https://i.pravatar.cc/48?img=3" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>
      <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #3b82f6, #60a5fa); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 18px;">AB</div>
    </div>`,
    code: `import { ZAvatar } from 'zurto-ui';

function Example() {
  return (
    <>
      <ZAvatar name="John Doe" size="sm" />
      <ZAvatar src="https://example.com/avatar.jpg" size="md" />
      <ZAvatar name="Alice Brown" size="lg" color="blue" />
    </>
  );
}`,
    props: [
      ["src", "string", "-", "Image URL"],
      ["name", "string", "-", "Name for initials"],
      ["size", "'sm' | 'md' | 'lg' | 'xl'", "'md'", "Avatar size"],
      ["color", "string", "'primary'", "Background color"],
    ],
  },
  ZTag: {
    category: "data-display",
    description: "Colored tag labels",
    preview: `<div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
      <span style="padding: 4px 12px; background: rgba(199, 53, 72, 0.2); color: #ff6b7a; border-radius: 9999px; font-size: 13px;">React</span>
      <span style="padding: 4px 12px; background: rgba(59, 130, 246, 0.2); color: #60a5fa; border-radius: 9999px; font-size: 13px;">TypeScript</span>
      <span style="padding: 4px 12px; background: rgba(34, 197, 94, 0.2); color: #4ade80; border-radius: 9999px; font-size: 13px;">Vue</span>
      <span style="padding: 4px 12px; background: rgba(168, 85, 247, 0.2); color: #c084fc; border-radius: 9999px; font-size: 13px;">Svelte</span>
    </div>`,
    code: `import { ZTag } from 'zurto-ui';

function Example() {
  return (
    <>
      <ZTag color="red">React</ZTag>
      <ZTag color="blue">TypeScript</ZTag>
      <ZTag color="green">Vue</ZTag>
      <ZTag color="purple">Svelte</ZTag>
    </>
  );
}`,
    props: [
      ["color", "string", "'gray'", "Tag color"],
      ["closable", "boolean", "false", "Show close button"],
      ["onClose", "() => void", "-", "Close handler"],
    ],
  },
  ZAccordion: {
    category: "data-display",
    description: "Collapsible content sections",
    preview: `<div style="border: 1px solid #333; border-radius: 8px; overflow: hidden; max-width: 400px; margin: 0 auto;">
      <div style="border-bottom: 1px solid #333;">
        <button style="width: 100%; padding: 16px; background: #1a1a1a; border: none; color: white; text-align: left; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-size: 15px;">What is Zurto UI? <span>▼</span></button>
        <div style="padding: 16px; background: #111; color: #aaa; font-size: 14px; line-height: 1.5;">Zurto UI is a modern React component library with dark theme and glassmorphism effects.</div>
      </div>
      <div>
        <button style="width: 100%; padding: 16px; background: #1a1a1a; border: none; color: white; text-align: left; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-size: 15px;">How do I install it? <span>▶</span></button>
      </div>
    </div>`,
    code: `import { ZAccordion, ZAccordionItem } from 'zurto-ui';

function Example() {
  return (
    <ZAccordion>
      <ZAccordionItem title="What is Zurto UI?">
        Zurto UI is a modern React component library.
      </ZAccordionItem>
      <ZAccordionItem title="How do I install it?">
        npm install zurto-ui
      </ZAccordionItem>
    </ZAccordion>
  );
}`,
    props: [
      ["allowMultiple", "boolean", "false", "Allow multiple open"],
      ["defaultIndex", "number | number[]", "-", "Default open item(s)"],
    ],
  },

  // TYPOGRAPHY
  ZTitle: {
    category: "typography",
    description: "Title/heading component",
    preview: `<div style="text-align: center;">
      <h1 style="margin: 0 0 8px 0; color: white; font-size: 32px; font-weight: 700;">Main Title</h1>
      <h2 style="margin: 0; color: #aaa; font-size: 20px; font-weight: 400;">Subtitle text here</h2>
    </div>`,
    code: `import { ZTitle } from 'zurto-ui';

function Example() {
  return (
    <>
      <ZTitle level={1}>Main Title</ZTitle>
      <ZTitle level={2} color="muted">Subtitle text here</ZTitle>
    </>
  );
}`,
    props: [
      ["level", "1 | 2 | 3 | 4 | 5 | 6", "1", "Heading level"],
      ["color", "'default' | 'muted' | 'primary'", "'default'", "Text color"],
    ],
  },
  ZText: {
    category: "typography",
    description: "Body text component",
    preview: `<div style="max-width: 400px; margin: 0 auto;">
      <p style="margin: 0 0 12px 0; color: white; font-size: 16px; line-height: 1.6;">This is regular body text with default styling.</p>
      <p style="margin: 0; color: #888; font-size: 14px; line-height: 1.5;">This is smaller muted text, perfect for secondary information.</p>
    </div>`,
    code: `import { ZText } from 'zurto-ui';

function Example() {
  return (
    <>
      <ZText>This is regular body text.</ZText>
      <ZText size="sm" color="muted">Smaller muted text.</ZText>
    </>
  );
}`,
    props: [
      ["size", "'xs' | 'sm' | 'md' | 'lg' | 'xl'", "'md'", "Text size"],
      [
        "weight",
        "'normal' | 'medium' | 'semibold' | 'bold'",
        "'normal'",
        "Font weight",
      ],
      ["color", "string", "-", "Text color"],
    ],
  },
};

// Category metadata
const categoryMeta = {
  button: {
    title: "Button",
    icon: "🔘",
    description: "Interactive button components",
  },
  form: { title: "Form", icon: "📝", description: "Form inputs and controls" },
  feedback: {
    title: "Feedback",
    icon: "💬",
    description: "Alerts, modals, and notifications",
  },
  layout: {
    title: "Layout",
    icon: "📐",
    description: "Layout and container components",
  },
  navigation: {
    title: "Navigation",
    icon: "🧭",
    description: "Navigation and menu components",
  },
  "data-display": {
    title: "Data Display",
    icon: "📊",
    description: "Tables, lists, and data visualization",
  },
  typography: {
    title: "Typography",
    icon: "🔤",
    description: "Text and heading components",
  },
  animation: {
    title: "Animation",
    icon: "✨",
    description: "Animation and transition components",
  },
  media: {
    title: "Media",
    icon: "🖼️",
    description: "Images, video, and media components",
  },
  interactive: {
    title: "Interactive",
    icon: "👆",
    description: "Drag, drop, and interactive components",
  },
};

// Generate component doc with ReactPlayground
function createComponentDoc(name, comp) {
  const escapedCode = comp.code
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  let propsTable = `| Prop | Type | Default | Description |
|------|------|---------|-------------|
`;
  comp.props.forEach(([prop, type, def, desc]) => {
    propsTable += `| \`${prop}\` | \`${type}\` | \`${def}\` | ${desc} |\n`;
  });

  return `# ${name}

${comp.description}

## Preview

<ReactPlayground 
  code="${escapedCode}"
  preview="${comp.preview.replace(/"/g, "&quot;").replace(/\n/g, " ")}"
/>

## Import

\`\`\`typescript
import { ${name} } from 'zurto-ui';
\`\`\`

## Props

${propsTable}

## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
`;
}

// Create category index
function createCategoryIndex(category, components) {
  const meta = categoryMeta[category] || {
    title: category,
    icon: "📦",
    description: "",
  };

  return `# ${meta.icon} ${meta.title} Components

${meta.description}

## Components (${components.length})

| Component | Description |
|-----------|-------------|
${components
  .map(
    (c) =>
      `| [${c.name}](/components/${category}/${c.name}) | ${c.description} |`
  )
  .join("\n")}
`;
}

// Main execution
console.log("🚀 Generating interactive documentation...\n");

// Group components by category
const byCategory = {};
Object.entries(components).forEach(([name, comp]) => {
  if (!byCategory[comp.category]) byCategory[comp.category] = [];
  byCategory[comp.category].push({ name, ...comp });
});

// Generate files
Object.entries(byCategory).forEach(([category, comps]) => {
  const categoryPath = path.join(docsPath, category);

  if (!fs.existsSync(categoryPath)) {
    fs.mkdirSync(categoryPath, { recursive: true });
  }

  // Category index
  fs.writeFileSync(
    path.join(categoryPath, "index.md"),
    createCategoryIndex(category, comps)
  );

  // Component docs
  comps.forEach((comp) => {
    fs.writeFileSync(
      path.join(categoryPath, `${comp.name}.md`),
      createComponentDoc(comp.name, comp)
    );
  });

  console.log(`✓ ${category}/ - ${comps.length} components`);
});

// Create main components index
const totalCount = Object.keys(components).length;
const mainIndex = `# All Components

Browse all **${totalCount}** components in zurto-ui.

## Categories

${Object.entries(byCategory)
  .map(([cat, comps]) => {
    const meta = categoryMeta[cat] || { title: cat, icon: "📦" };
    return `### [${meta.icon} ${meta.title}](/components/${cat}/) (${
      comps.length
    })
${comps
  .slice(0, 5)
  .map((c) => `- [${c.name}](/components/${cat}/${c.name})`)
  .join("\n")}
${
  comps.length > 5
    ? `- [View all ${comps.length} components →](/components/${cat}/)`
    : ""
}
`;
  })
  .join("\n")}
`;

fs.writeFileSync(path.join(docsPath, "index.md"), mainIndex);

console.log(`\n✅ Generated ${totalCount} component docs!`);
console.log("📍 Run: npm run docs:dev");
