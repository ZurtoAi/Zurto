import fs from "fs";
import path from "path";

const docsPath = "./docs/components";

// Component preview definitions with HTML/CSS representations
const componentPreviews = {
  // BUTTONS
  ZButton: {
    preview: `<button style="padding: 10px 20px; background: linear-gradient(135deg, #c73548, #df3e53); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">Click Me</button>`,
    code: `import { ZButton } from 'zurto-ui';

function Example() {
  return (
    <ZButton onClick={() => alert('Clicked!')}>
      Click Me
    </ZButton>
  );
}`,
    variants: [
      {
        name: "Primary",
        style: "background: linear-gradient(135deg, #c73548, #df3e53);",
      },
      {
        name: "Secondary",
        style:
          "background: transparent; border: 2px solid #c73548; color: #c73548;",
      },
      { name: "Ghost", style: "background: transparent; color: #c73548;" },
      { name: "Danger", style: "background: #ef4444;" },
    ],
    props: [
      ["variant", "string", "primary", "Button style variant"],
      ["size", "string", "md", "Button size (sm, md, lg)"],
      ["disabled", "boolean", "false", "Disable the button"],
      ["loading", "boolean", "false", "Show loading spinner"],
      ["leftIcon", "ReactNode", "-", "Icon on the left"],
      ["rightIcon", "ReactNode", "-", "Icon on the right"],
      ["onClick", "function", "-", "Click handler"],
    ],
  },
  ZIconButton: {
    preview: `<button style="width: 40px; height: 40px; background: linear-gradient(135deg, #c73548, #df3e53); color: white; border: none; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center;">⚡</button>`,
    code: `import { ZIconButton } from 'zurto-ui';
import { Settings } from 'lucide-react';

function Example() {
  return <ZIconButton icon={<Settings />} aria-label="Settings" />;
}`,
    props: [
      ["icon", "ReactNode", "-", "Icon element to display"],
      ["variant", "string", "primary", "Button style variant"],
      ["size", "string", "md", "Button size"],
      ["aria-label", "string", "-", "Accessibility label (required)"],
    ],
  },
  ZButtonGroup: {
    preview: `<div style="display: inline-flex; gap: 0;"><button style="padding: 8px 16px; background: #c73548; color: white; border: none; border-radius: 8px 0 0 8px; cursor: pointer;">Left</button><button style="padding: 8px 16px; background: #c73548; color: white; border: none; cursor: pointer;">Center</button><button style="padding: 8px 16px; background: #c73548; color: white; border: none; border-radius: 0 8px 8px 0; cursor: pointer;">Right</button></div>`,
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
      ["orientation", "string", "horizontal", "horizontal or vertical"],
      ["attached", "boolean", "true", "Attach buttons together"],
    ],
  },
  ZCloseButton: {
    preview: `<button style="width: 32px; height: 32px; background: transparent; color: #888; border: none; border-radius: 6px; cursor: pointer; font-size: 18px; display: inline-flex; align-items: center; justify-content: center;">✕</button>`,
    code: `import { ZCloseButton } from 'zurto-ui';

function Example() {
  return <ZCloseButton onClick={() => console.log('Close')} />;
}`,
    props: [
      ["size", "string", "md", "Button size"],
      ["onClick", "function", "-", "Click handler"],
    ],
  },

  // FORM INPUTS
  ZInput: {
    preview: `<input type="text" placeholder="Enter your name..." style="padding: 12px 16px; background: #1a1a1a; border: 1px solid #333; border-radius: 8px; color: white; font-size: 14px; width: 280px; outline: none;" />`,
    code: `import { ZInput } from 'zurto-ui';

function Example() {
  return (
    <ZInput
      placeholder="Enter your name..."
      onChange={(e) => console.log(e.target.value)}
    />
  );
}`,
    props: [
      ["placeholder", "string", "-", "Placeholder text"],
      ["value", "string", "-", "Controlled value"],
      ["onChange", "function", "-", "Change handler"],
      ["disabled", "boolean", "false", "Disable input"],
      ["error", "boolean", "false", "Show error state"],
      ["leftIcon", "ReactNode", "-", "Icon on left"],
      ["rightIcon", "ReactNode", "-", "Icon on right"],
    ],
  },
  ZTextarea: {
    preview: `<textarea placeholder="Enter your message..." style="padding: 12px 16px; background: #1a1a1a; border: 1px solid #333; border-radius: 8px; color: white; font-size: 14px; width: 280px; height: 100px; resize: vertical; outline: none; font-family: inherit;"></textarea>`,
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
      ["rows", "number", "4", "Number of visible rows"],
      ["resize", "string", "vertical", "Resize behavior"],
    ],
  },
  ZSelect: {
    preview: `<select style="padding: 12px 16px; background: #1a1a1a; border: 1px solid #333; border-radius: 8px; color: white; font-size: 14px; width: 280px; cursor: pointer;"><option>Select an option...</option><option>Option 1</option><option>Option 2</option></select>`,
    code: `import { ZSelect } from 'zurto-ui';

function Example() {
  return (
    <ZSelect placeholder="Select an option...">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </ZSelect>
  );
}`,
    props: [
      ["placeholder", "string", "-", "Placeholder text"],
      ["value", "string", "-", "Selected value"],
      ["onChange", "function", "-", "Change handler"],
      ["options", "array", "-", "Options array"],
    ],
  },
  ZCheckbox: {
    preview: `<label style="display: inline-flex; align-items: center; gap: 8px; color: white; cursor: pointer;"><input type="checkbox" checked style="width: 18px; height: 18px; accent-color: #c73548; cursor: pointer;" /><span>Accept terms and conditions</span></label>`,
    code: `import { ZCheckbox } from 'zurto-ui';

function Example() {
  return (
    <ZCheckbox label="Accept terms and conditions" />
  );
}`,
    props: [
      ["label", "string", "-", "Checkbox label"],
      ["checked", "boolean", "false", "Checked state"],
      ["onChange", "function", "-", "Change handler"],
      ["disabled", "boolean", "false", "Disable checkbox"],
    ],
  },
  ZRadio: {
    preview: `<div style="display: flex; flex-direction: column; gap: 8px;"><label style="display: inline-flex; align-items: center; gap: 8px; color: white; cursor: pointer;"><input type="radio" name="demo" checked style="width: 18px; height: 18px; accent-color: #c73548;" /><span>Option A</span></label><label style="display: inline-flex; align-items: center; gap: 8px; color: white; cursor: pointer;"><input type="radio" name="demo" style="width: 18px; height: 18px; accent-color: #c73548;" /><span>Option B</span></label></div>`,
    code: `import { ZRadio, ZRadioGroup } from 'zurto-ui';

function Example() {
  return (
    <ZRadioGroup name="options" defaultValue="a">
      <ZRadio value="a" label="Option A" />
      <ZRadio value="b" label="Option B" />
    </ZRadioGroup>
  );
}`,
    props: [
      ["label", "string", "-", "Radio label"],
      ["value", "string", "-", "Radio value"],
      ["name", "string", "-", "Group name"],
    ],
  },
  ZSwitch: {
    preview: `<label style="display: inline-flex; align-items: center; gap: 12px; cursor: pointer;"><div style="width: 44px; height: 24px; background: #c73548; border-radius: 12px; position: relative;"><div style="width: 20px; height: 20px; background: white; border-radius: 50%; position: absolute; top: 2px; right: 2px; transition: 0.2s;"></div></div><span style="color: white;">Enable notifications</span></label>`,
    code: `import { ZSwitch } from 'zurto-ui';

function Example() {
  return (
    <ZSwitch label="Enable notifications" defaultChecked />
  );
}`,
    props: [
      ["label", "string", "-", "Switch label"],
      ["checked", "boolean", "false", "Checked state"],
      ["onChange", "function", "-", "Change handler"],
    ],
  },
  ZSlider: {
    preview: `<div style="width: 280px;"><input type="range" min="0" max="100" value="60" style="width: 100%; accent-color: #c73548; cursor: pointer;" /></div>`,
    code: `import { ZSlider } from 'zurto-ui';

function Example() {
  return <ZSlider min={0} max={100} defaultValue={60} />;
}`,
    props: [
      ["min", "number", "0", "Minimum value"],
      ["max", "number", "100", "Maximum value"],
      ["value", "number", "-", "Current value"],
      ["step", "number", "1", "Step increment"],
    ],
  },

  // FEEDBACK
  ZAlert: {
    preview: `<div style="padding: 16px; background: rgba(199, 53, 72, 0.15); border: 1px solid #c73548; border-radius: 8px; color: #ff6b7a; display: flex; align-items: center; gap: 12px;"><span style="font-size: 18px;">⚠️</span><span>This is an important alert message!</span></div>`,
    code: `import { ZAlert } from 'zurto-ui';

function Example() {
  return (
    <ZAlert type="warning" title="Warning">
      This is an important alert message!
    </ZAlert>
  );
}`,
    variants: [
      {
        name: "Info",
        style:
          "background: rgba(59, 130, 246, 0.15); border-color: #3b82f6; color: #60a5fa;",
      },
      {
        name: "Success",
        style:
          "background: rgba(34, 197, 94, 0.15); border-color: #22c55e; color: #4ade80;",
      },
      {
        name: "Warning",
        style:
          "background: rgba(234, 179, 8, 0.15); border-color: #eab308; color: #facc15;",
      },
      {
        name: "Error",
        style:
          "background: rgba(239, 68, 68, 0.15); border-color: #ef4444; color: #f87171;",
      },
    ],
    props: [
      ["type", "string", "info", "Alert type (info, success, warning, error)"],
      ["title", "string", "-", "Alert title"],
      ["closable", "boolean", "false", "Show close button"],
    ],
  },
  ZBadge: {
    preview: `<span style="display: inline-flex; align-items: center; padding: 4px 10px; background: linear-gradient(135deg, #c73548, #df3e53); color: white; border-radius: 9999px; font-size: 12px; font-weight: 600;">New</span>`,
    code: `import { ZBadge } from 'zurto-ui';

function Example() {
  return <ZBadge>New</ZBadge>;
}`,
    props: [
      ["variant", "string", "primary", "Badge variant"],
      ["size", "string", "md", "Badge size"],
    ],
  },
  ZToast: {
    preview: `<div style="padding: 16px 20px; background: #1a1a1a; border: 1px solid #333; border-radius: 8px; color: white; display: flex; align-items: center; gap: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.5);"><span style="color: #22c55e;">✓</span><span>Successfully saved!</span></div>`,
    code: `import { toast } from 'zurto-ui';

function Example() {
  const showToast = () => {
    toast.success('Successfully saved!');
  };
  
  return <button onClick={showToast}>Show Toast</button>;
}`,
    props: [
      ["message", "string", "-", "Toast message"],
      ["type", "string", "info", "Toast type"],
      ["duration", "number", "3000", "Auto-dismiss duration"],
    ],
  },
  ZModal: {
    preview: `<div style="padding: 24px; background: #1a1a1a; border: 1px solid #333; border-radius: 12px; max-width: 400px;"><div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;"><h3 style="margin: 0; color: white; font-size: 18px;">Modal Title</h3><button style="background: none; border: none; color: #888; cursor: pointer; font-size: 18px;">✕</button></div><p style="color: #aaa; margin: 0 0 20px 0;">This is the modal content. You can put anything here.</p><div style="display: flex; gap: 12px; justify-content: flex-end;"><button style="padding: 8px 16px; background: transparent; border: 1px solid #333; border-radius: 6px; color: white; cursor: pointer;">Cancel</button><button style="padding: 8px 16px; background: #c73548; border: none; border-radius: 6px; color: white; cursor: pointer;">Confirm</button></div></div>`,
    code: `import { ZModal, ZButton } from 'zurto-ui';
import { useState } from 'react';

function Example() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <ZButton onClick={() => setOpen(true)}>Open Modal</ZButton>
      <ZModal open={open} onClose={() => setOpen(false)} title="Modal Title">
        <p>This is the modal content.</p>
      </ZModal>
    </>
  );
}`,
    props: [
      ["open", "boolean", "false", "Control modal visibility"],
      ["onClose", "function", "-", "Close handler"],
      ["title", "string", "-", "Modal title"],
      ["size", "string", "md", "Modal size"],
    ],
  },
  ZSpinner: {
    preview: `<div style="width: 32px; height: 32px; border: 3px solid #333; border-top-color: #c73548; border-radius: 50%; animation: spin 1s linear infinite;"></div><style>@keyframes spin { to { transform: rotate(360deg); } }</style>`,
    code: `import { ZSpinner } from 'zurto-ui';

function Example() {
  return <ZSpinner size="md" />;
}`,
    props: [
      ["size", "string", "md", "Spinner size (sm, md, lg)"],
      ["color", "string", "primary", "Spinner color"],
    ],
  },
  ZProgress: {
    preview: `<div style="width: 280px; height: 8px; background: #333; border-radius: 4px; overflow: hidden;"><div style="width: 65%; height: 100%; background: linear-gradient(90deg, #c73548, #df3e53);"></div></div>`,
    code: `import { ZProgress } from 'zurto-ui';

function Example() {
  return <ZProgress value={65} />;
}`,
    props: [
      ["value", "number", "0", "Progress value (0-100)"],
      ["showLabel", "boolean", "false", "Show percentage label"],
    ],
  },
  ZSkeleton: {
    preview: `<div style="display: flex; flex-direction: column; gap: 12px; width: 280px;"><div style="height: 16px; background: linear-gradient(90deg, #222 25%, #333 50%, #222 75%); border-radius: 4px; animation: shimmer 1.5s infinite;"></div><div style="height: 16px; width: 80%; background: linear-gradient(90deg, #222 25%, #333 50%, #222 75%); border-radius: 4px;"></div><div style="height: 16px; width: 60%; background: linear-gradient(90deg, #222 25%, #333 50%, #222 75%); border-radius: 4px;"></div></div>`,
    code: `import { ZSkeleton } from 'zurto-ui';

function Example() {
  return (
    <div>
      <ZSkeleton width="100%" height={16} />
      <ZSkeleton width="80%" height={16} />
      <ZSkeleton width="60%" height={16} />
    </div>
  );
}`,
    props: [
      ["width", "string | number", "100%", "Skeleton width"],
      ["height", "string | number", "20px", "Skeleton height"],
      ["circle", "boolean", "false", "Make it circular"],
    ],
  },
  ZTooltip: {
    preview: `<div style="position: relative; display: inline-block;"><button style="padding: 8px 16px; background: #c73548; color: white; border: none; border-radius: 6px; cursor: pointer;">Hover me</button><div style="position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 8px; padding: 6px 12px; background: #333; color: white; border-radius: 4px; font-size: 12px; white-space: nowrap;">Tooltip content</div></div>`,
    code: `import { ZTooltip, ZButton } from 'zurto-ui';

function Example() {
  return (
    <ZTooltip content="Tooltip content">
      <ZButton>Hover me</ZButton>
    </ZTooltip>
  );
}`,
    props: [
      ["content", "ReactNode", "-", "Tooltip content"],
      ["position", "string", "top", "Tooltip position"],
      ["delay", "number", "200", "Show delay in ms"],
    ],
  },

  // LAYOUT
  ZCard: {
    preview: `<div style="padding: 24px; background: #1a1a1a; border: 1px solid #333; border-radius: 12px; max-width: 300px;"><h3 style="margin: 0 0 8px 0; color: white; font-size: 18px;">Card Title</h3><p style="margin: 0; color: #aaa; font-size: 14px; line-height: 1.5;">This is a card component with some example content inside.</p></div>`,
    code: `import { ZCard } from 'zurto-ui';

function Example() {
  return (
    <ZCard>
      <h3>Card Title</h3>
      <p>This is a card component with some example content inside.</p>
    </ZCard>
  );
}`,
    props: [
      ["padding", "string", "md", "Card padding"],
      ["shadow", "boolean", "true", "Show shadow"],
      ["hoverable", "boolean", "false", "Hover effect"],
    ],
  },
  ZDivider: {
    preview: `<div style="width: 280px; height: 1px; background: linear-gradient(90deg, transparent, #333, transparent);"></div>`,
    code: `import { ZDivider } from 'zurto-ui';

function Example() {
  return <ZDivider />;
}`,
    props: [
      ["orientation", "string", "horizontal", "Divider orientation"],
      ["label", "string", "-", "Center label text"],
    ],
  },
  ZFlex: {
    preview: `<div style="display: flex; gap: 12px; align-items: center;"><div style="padding: 16px 24px; background: #c73548; border-radius: 6px; color: white;">Item 1</div><div style="padding: 16px 24px; background: #c73548; border-radius: 6px; color: white;">Item 2</div><div style="padding: 16px 24px; background: #c73548; border-radius: 6px; color: white;">Item 3</div></div>`,
    code: `import { ZFlex } from 'zurto-ui';

function Example() {
  return (
    <ZFlex gap={12} align="center">
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
    </ZFlex>
  );
}`,
    props: [
      ["direction", "string", "row", "Flex direction"],
      ["gap", "number", "0", "Gap between items"],
      ["align", "string", "stretch", "Align items"],
      ["justify", "string", "flex-start", "Justify content"],
    ],
  },
  ZGrid: {
    preview: `<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;"><div style="padding: 24px; background: #222; border-radius: 6px; color: white; text-align: center;">1</div><div style="padding: 24px; background: #222; border-radius: 6px; color: white; text-align: center;">2</div><div style="padding: 24px; background: #222; border-radius: 6px; color: white; text-align: center;">3</div><div style="padding: 24px; background: #222; border-radius: 6px; color: white; text-align: center;">4</div><div style="padding: 24px; background: #222; border-radius: 6px; color: white; text-align: center;">5</div><div style="padding: 24px; background: #222; border-radius: 6px; color: white; text-align: center;">6</div></div>`,
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
      ["columns", "number", "1", "Number of columns"],
      ["gap", "number", "0", "Gap between items"],
    ],
  },
  ZStack: {
    preview: `<div style="display: flex; flex-direction: column; gap: 12px;"><div style="padding: 16px; background: #222; border-radius: 6px; color: white;">Stack Item 1</div><div style="padding: 16px; background: #222; border-radius: 6px; color: white;">Stack Item 2</div><div style="padding: 16px; background: #222; border-radius: 6px; color: white;">Stack Item 3</div></div>`,
    code: `import { ZStack } from 'zurto-ui';

function Example() {
  return (
    <ZStack gap={12}>
      <div>Stack Item 1</div>
      <div>Stack Item 2</div>
      <div>Stack Item 3</div>
    </ZStack>
  );
}`,
    props: [
      ["gap", "number", "0", "Gap between items"],
      ["align", "string", "stretch", "Align items"],
    ],
  },

  // NAVIGATION
  ZTabs: {
    preview: `<div><div style="display: flex; gap: 0; border-bottom: 1px solid #333;"><button style="padding: 12px 24px; background: transparent; border: none; border-bottom: 2px solid #c73548; color: #c73548; cursor: pointer; font-weight: 500;">Tab 1</button><button style="padding: 12px 24px; background: transparent; border: none; border-bottom: 2px solid transparent; color: #888; cursor: pointer;">Tab 2</button><button style="padding: 12px 24px; background: transparent; border: none; border-bottom: 2px solid transparent; color: #888; cursor: pointer;">Tab 3</button></div><div style="padding: 20px; color: #aaa;">Tab 1 content</div></div>`,
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
      ["defaultValue", "string", "-", "Default selected tab"],
      ["value", "string", "-", "Controlled selected tab"],
      ["onChange", "function", "-", "Tab change handler"],
    ],
  },
  ZBreadcrumb: {
    preview: `<nav style="display: flex; align-items: center; gap: 8px; color: #888; font-size: 14px;"><a href="#" style="color: #888; text-decoration: none;">Home</a><span>/</span><a href="#" style="color: #888; text-decoration: none;">Products</a><span>/</span><span style="color: white;">Details</span></nav>`,
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
    props: [["separator", "ReactNode", "/", "Separator between items"]],
  },
  ZPagination: {
    preview: `<div style="display: flex; gap: 4px; align-items: center;"><button style="padding: 8px 12px; background: #222; border: 1px solid #333; border-radius: 6px; color: #888; cursor: pointer;">←</button><button style="padding: 8px 12px; background: #222; border: 1px solid #333; border-radius: 6px; color: white; cursor: pointer;">1</button><button style="padding: 8px 12px; background: #c73548; border: none; border-radius: 6px; color: white; cursor: pointer;">2</button><button style="padding: 8px 12px; background: #222; border: 1px solid #333; border-radius: 6px; color: white; cursor: pointer;">3</button><button style="padding: 8px 12px; background: #222; border: 1px solid #333; border-radius: 6px; color: white; cursor: pointer;">→</button></div>`,
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
      ["total", "number", "-", "Total items count"],
      ["pageSize", "number", "10", "Items per page"],
      ["current", "number", "1", "Current page"],
      ["onChange", "function", "-", "Page change handler"],
    ],
  },
  ZMenu: {
    preview: `<div style="background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 8px; width: 200px;"><div style="padding: 10px 12px; color: white; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 10px;">📄 New File</div><div style="padding: 10px 12px; color: white; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 10px;">📁 Open Folder</div><div style="height: 1px; background: #333; margin: 8px 0;"></div><div style="padding: 10px 12px; color: #888; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 10px;">⚙️ Settings</div></div>`,
    code: `import { ZMenu, ZMenuItem, ZMenuDivider } from 'zurto-ui';

function Example() {
  return (
    <ZMenu>
      <ZMenuItem icon="📄">New File</ZMenuItem>
      <ZMenuItem icon="📁">Open Folder</ZMenuItem>
      <ZMenuDivider />
      <ZMenuItem icon="⚙️">Settings</ZMenuItem>
    </ZMenu>
  );
}`,
    props: [["onSelect", "function", "-", "Selection handler"]],
  },
  ZDropdown: {
    preview: `<div style="position: relative; display: inline-block;"><button style="padding: 10px 16px; background: #222; border: 1px solid #333; border-radius: 8px; color: white; cursor: pointer; display: flex; align-items: center; gap: 8px;">Options <span>▼</span></button></div>`,
    code: `import { ZDropdown, ZDropdownItem } from 'zurto-ui';

function Example() {
  return (
    <ZDropdown trigger={<button>Options</button>}>
      <ZDropdownItem onClick={() => {}}>Edit</ZDropdownItem>
      <ZDropdownItem onClick={() => {}}>Delete</ZDropdownItem>
    </ZDropdown>
  );
}`,
    props: [
      ["trigger", "ReactNode", "-", "Dropdown trigger element"],
      ["placement", "string", "bottom-start", "Dropdown placement"],
    ],
  },

  // DATA DISPLAY
  ZTable: {
    preview: `<table style="width: 100%; border-collapse: collapse;"><thead><tr style="border-bottom: 1px solid #333;"><th style="padding: 12px; text-align: left; color: #888; font-weight: 500;">Name</th><th style="padding: 12px; text-align: left; color: #888; font-weight: 500;">Email</th><th style="padding: 12px; text-align: left; color: #888; font-weight: 500;">Role</th></tr></thead><tbody><tr style="border-bottom: 1px solid #222;"><td style="padding: 12px; color: white;">John Doe</td><td style="padding: 12px; color: #aaa;">john@example.com</td><td style="padding: 12px; color: #aaa;">Admin</td></tr><tr style="border-bottom: 1px solid #222;"><td style="padding: 12px; color: white;">Jane Smith</td><td style="padding: 12px; color: #aaa;">jane@example.com</td><td style="padding: 12px; color: #aaa;">User</td></tr></tbody></table>`,
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
      ["columns", "array", "-", "Column definitions"],
      ["data", "array", "-", "Table data"],
      ["striped", "boolean", "false", "Striped rows"],
      ["hoverable", "boolean", "true", "Hover effect"],
    ],
  },
  ZAvatar: {
    preview: `<div style="display: flex; gap: 12px; align-items: center;"><div style="width: 40px; height: 40px; background: linear-gradient(135deg, #c73548, #df3e53); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">JD</div><div style="width: 40px; height: 40px; background: #333; border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden;"><img src="https://i.pravatar.cc/40" style="width: 100%; height: 100%; object-fit: cover;" /></div></div>`,
    code: `import { ZAvatar } from 'zurto-ui';

function Example() {
  return (
    <>
      <ZAvatar name="John Doe" />
      <ZAvatar src="https://example.com/avatar.jpg" />
    </>
  );
}`,
    props: [
      ["src", "string", "-", "Image source URL"],
      ["name", "string", "-", "Name for initials fallback"],
      ["size", "string", "md", "Avatar size"],
    ],
  },
  ZTag: {
    preview: `<div style="display: flex; gap: 8px;"><span style="padding: 4px 12px; background: rgba(199, 53, 72, 0.2); color: #ff6b7a; border-radius: 9999px; font-size: 13px;">React</span><span style="padding: 4px 12px; background: rgba(59, 130, 246, 0.2); color: #60a5fa; border-radius: 9999px; font-size: 13px;">TypeScript</span><span style="padding: 4px 12px; background: rgba(34, 197, 94, 0.2); color: #4ade80; border-radius: 9999px; font-size: 13px;">Vue</span></div>`,
    code: `import { ZTag } from 'zurto-ui';

function Example() {
  return (
    <>
      <ZTag color="red">React</ZTag>
      <ZTag color="blue">TypeScript</ZTag>
      <ZTag color="green">Vue</ZTag>
    </>
  );
}`,
    props: [
      ["color", "string", "gray", "Tag color"],
      ["closable", "boolean", "false", "Show close button"],
    ],
  },
  ZAccordion: {
    preview: `<div style="border: 1px solid #333; border-radius: 8px; overflow: hidden;"><div style="border-bottom: 1px solid #333;"><button style="width: 100%; padding: 16px; background: #1a1a1a; border: none; color: white; text-align: left; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">What is Zurto UI? <span>▼</span></button><div style="padding: 16px; background: #111; color: #aaa;">Zurto UI is a modern React component library.</div></div><div><button style="width: 100%; padding: 16px; background: #1a1a1a; border: none; color: white; text-align: left; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">How do I install it? <span>▶</span></button></div></div>`,
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
      ["defaultIndex", "number", "-", "Default open index"],
    ],
  },
  ZCode: {
    preview: `<pre style="padding: 16px; background: #0d1117; border-radius: 8px; overflow-x: auto;"><code style="color: #e6edf3; font-family: monospace; font-size: 14px;"><span style="color: #ff7b72;">const</span> <span style="color: #79c0ff;">greeting</span> = <span style="color: #a5d6ff;">'Hello World'</span>;</code></pre>`,
    code: `import { ZCode } from 'zurto-ui';

function Example() {
  return (
    <ZCode language="javascript">
      {\`const greeting = 'Hello World';\`}
    </ZCode>
  );
}`,
    props: [
      ["language", "string", "-", "Code language"],
      ["showLineNumbers", "boolean", "false", "Show line numbers"],
      ["copyable", "boolean", "true", "Show copy button"],
    ],
  },
  ZList: {
    preview: `<ul style="list-style: none; padding: 0; margin: 0; border: 1px solid #333; border-radius: 8px; overflow: hidden;"><li style="padding: 12px 16px; border-bottom: 1px solid #333; color: white; display: flex; align-items: center; gap: 12px;"><span>📄</span> Document 1</li><li style="padding: 12px 16px; border-bottom: 1px solid #333; color: white; display: flex; align-items: center; gap: 12px;"><span>📄</span> Document 2</li><li style="padding: 12px 16px; color: white; display: flex; align-items: center; gap: 12px;"><span>📄</span> Document 3</li></ul>`,
    code: `import { ZList, ZListItem } from 'zurto-ui';

function Example() {
  return (
    <ZList>
      <ZListItem icon="📄">Document 1</ZListItem>
      <ZListItem icon="📄">Document 2</ZListItem>
      <ZListItem icon="📄">Document 3</ZListItem>
    </ZList>
  );
}`,
    props: [
      ["bordered", "boolean", "true", "Show borders"],
      ["hoverable", "boolean", "true", "Hover effect"],
    ],
  },

  // ANIMATION
  ZFadeIn: {
    preview: `<div style="padding: 20px; background: linear-gradient(135deg, #c73548, #df3e53); border-radius: 8px; color: white; text-align: center; animation: fadeIn 0.5s ease-out;">Fading in...</div><style>@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }</style>`,
    code: `import { ZFadeIn } from 'zurto-ui';

function Example() {
  return (
    <ZFadeIn duration={500}>
      <div>Fading in...</div>
    </ZFadeIn>
  );
}`,
    props: [
      ["duration", "number", "300", "Animation duration in ms"],
      ["delay", "number", "0", "Animation delay"],
    ],
  },
  ZSlideIn: {
    preview: `<div style="padding: 20px; background: linear-gradient(135deg, #c73548, #df3e53); border-radius: 8px; color: white; text-align: center; animation: slideIn 0.5s ease-out;">Sliding in...</div><style>@keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }</style>`,
    code: `import { ZSlideIn } from 'zurto-ui';

function Example() {
  return (
    <ZSlideIn direction="up" duration={500}>
      <div>Sliding in...</div>
    </ZSlideIn>
  );
}`,
    props: [
      ["direction", "string", "up", "Slide direction (up, down, left, right)"],
      ["duration", "number", "300", "Animation duration"],
    ],
  },
  ZPulse: {
    preview: `<div style="padding: 20px; background: linear-gradient(135deg, #c73548, #df3e53); border-radius: 8px; color: white; text-align: center; animation: pulse 2s ease-in-out infinite;">Pulsing...</div><style>@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }</style>`,
    code: `import { ZPulse } from 'zurto-ui';

function Example() {
  return (
    <ZPulse>
      <div>Pulsing...</div>
    </ZPulse>
  );
}`,
    props: [["duration", "number", "2000", "Pulse duration"]],
  },

  // TYPOGRAPHY
  ZTitle: {
    preview: `<h1 style="margin: 0; color: white; font-size: 32px; font-weight: 700; line-height: 1.2;">Welcome to Zurto UI</h1>`,
    code: `import { ZTitle } from 'zurto-ui';

function Example() {
  return <ZTitle>Welcome to Zurto UI</ZTitle>;
}`,
    props: [["level", "number", "1", "Heading level (1-6)"]],
  },
  ZText: {
    preview: `<p style="margin: 0; color: #aaa; font-size: 16px; line-height: 1.6;">This is a paragraph of text using the ZText component. It supports various styles and weights.</p>`,
    code: `import { ZText } from 'zurto-ui';

function Example() {
  return (
    <ZText>
      This is a paragraph of text using the ZText component.
    </ZText>
  );
}`,
    props: [
      ["size", "string", "md", "Text size"],
      ["weight", "string", "normal", "Font weight"],
      ["color", "string", "-", "Text color"],
    ],
  },
  ZHeading: {
    preview: `<h2 style="margin: 0; color: white; font-size: 24px; font-weight: 600;">Section Heading</h2>`,
    code: `import { ZHeading } from 'zurto-ui';

function Example() {
  return <ZHeading level={2}>Section Heading</ZHeading>;
}`,
    props: [["level", "number", "2", "Heading level (1-6)"]],
  },
  ZBlockquote: {
    preview: `<blockquote style="margin: 0; padding: 16px 20px; border-left: 4px solid #c73548; background: rgba(199, 53, 72, 0.1); color: #aaa; font-style: italic;">"The best way to predict the future is to create it."</blockquote>`,
    code: `import { ZBlockquote } from 'zurto-ui';

function Example() {
  return (
    <ZBlockquote>
      "The best way to predict the future is to create it."
    </ZBlockquote>
  );
}`,
    props: [["cite", "string", "-", "Citation source"]],
  },
  ZKbd: {
    preview: `<div style="display: flex; gap: 8px; align-items: center; color: #aaa;"><kbd style="padding: 4px 8px; background: #222; border: 1px solid #444; border-radius: 4px; color: white; font-family: monospace; font-size: 13px;">Ctrl</kbd> + <kbd style="padding: 4px 8px; background: #222; border: 1px solid #444; border-radius: 4px; color: white; font-family: monospace; font-size: 13px;">C</kbd></div>`,
    code: `import { ZKbd } from 'zurto-ui';

function Example() {
  return (
    <>
      <ZKbd>Ctrl</ZKbd> + <ZKbd>C</ZKbd>
    </>
  );
}`,
    props: [],
  },
};

// Default component template (for components without specific previews)
function getDefaultPreview(name) {
  return `<div style="padding: 20px; background: #1a1a1a; border: 1px solid #333; border-radius: 8px; color: #aaa; text-align: center;">${name.replace(
    "Z",
    ""
  )} Component</div>`;
}

function getDefaultCode(name) {
  return `import { ${name} } from 'zurto-ui';

function Example() {
  return (
    <${name}>
      Content here
    </${name}>
  );
}`;
}

// Categories
const categories = {
  button: [
    "ZButton",
    "ZIconButton",
    "ZButtonGroup",
    "ZActionIcon",
    "ZCloseButton",
    "ZBackButton",
    "ZDownloadButton",
    "ZPrintButton",
    "ZFullscreenButton",
    "ZFileButton",
    "ZCopyButton",
    "ZShareButton",
  ],
  form: [
    "ZInput",
    "ZTextarea",
    "ZSelect",
    "ZCheckbox",
    "ZRadio",
    "ZSwitch",
    "ZSlider",
    "ZRangeSlider",
    "ZNumberInput",
    "ZPasswordInput",
    "ZSearchInput",
    "ZDatePicker",
    "ZTimePicker",
    "ZColorPicker",
    "ZFileInput",
    "ZAutocomplete",
    "ZForm",
    "ZFormField",
    "ZLabel",
    "ZFieldError",
  ],
  feedback: [
    "ZAlert",
    "ZBanner",
    "ZToast",
    "ZNotification",
    "ZModal",
    "ZDialog",
    "ZDrawer",
    "ZPopover",
    "ZTooltip",
    "ZProgress",
    "ZSpinner",
    "ZSkeleton",
    "ZLoadingOverlay",
  ],
  layout: [
    "ZContainer",
    "ZGrid",
    "ZFlex",
    "ZStack",
    "ZDivider",
    "ZSpacer",
    "ZCard",
    "ZBox",
    "ZCenter",
    "ZAspectRatio",
  ],
  navigation: [
    "ZNavbar",
    "ZSidebar",
    "ZTabs",
    "ZBreadcrumb",
    "ZPagination",
    "ZStepper",
    "ZMenu",
    "ZDropdown",
    "ZLink",
    "ZAnchor",
  ],
  "data-display": [
    "ZTable",
    "ZList",
    "ZBadge",
    "ZTag",
    "ZChip",
    "ZAvatar",
    "ZImage",
    "ZIcon",
    "ZCode",
    "ZHighlight",
    "ZAccordion",
    "ZCollapse",
    "ZTimeline",
  ],
  animation: [
    "ZFadeIn",
    "ZSlideIn",
    "ZScale",
    "ZBounce",
    "ZFlip",
    "ZRotate",
    "ZShake",
    "ZPulse",
    "ZFloat",
    "ZAnimate",
  ],
  typography: [
    "ZTitle",
    "ZText",
    "ZHeading",
    "ZParagraph",
    "ZBlockquote",
    "ZMark",
    "ZKbd",
    "ZAbbr",
  ],
  media: ["ZVideo", "ZAudio", "ZEmbed", "ZCarousel", "ZGallery", "ZLightbox"],
  interactive: [
    "ZDraggable",
    "ZDroppable",
    "ZResizable",
    "ZSortable",
    "ZScrollArea",
    "ZInfiniteScroll",
  ],
};

// Generate component doc with preview
function createComponentDoc(name, category) {
  const component = componentPreviews[name];
  const preview = component?.preview || getDefaultPreview(name);
  const code = component?.code || getDefaultCode(name);
  const props = component?.props || [
    ["children", "ReactNode", "-", "Component content"],
    ["className", "string", "-", "Additional CSS classes"],
  ];

  let propsTable = `| Prop | Type | Default | Description |
|------|------|---------|-------------|
`;
  props.forEach(([prop, type, def, desc]) => {
    propsTable += `| \`${prop}\` | \`${type}\` | \`${def}\` | ${desc} |\n`;
  });

  // Build variants section if available
  let variantsSection = "";
  if (component?.variants) {
    variantsSection = `
## Variants

<div style="display: flex; flex-wrap: wrap; gap: 12px; padding: 20px; background: var(--vp-c-bg-soft); border-radius: 8px; margin: 16px 0;">
${component.variants
  .map((v) => {
    const baseStyle =
      "padding: 10px 20px; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;";
    return `  <button style="${baseStyle} ${v.style}">${v.name}</button>`;
  })
  .join("\n")}
</div>
`;
  }

  return `# ${name}

${name.replace("Z", "")} component from zurto-ui.

## Preview

<CodeToggle code="${code.replace(/"/g, "&quot;").replace(/\n/g, "&#10;")}">
  <div style="display: flex; justify-content: center; align-items: center; min-height: 80px; padding: 24px;">
    ${preview}
  </div>
</CodeToggle>

## Import

\`\`\`typescript
import { ${name} } from 'zurto-ui';
\`\`\`
${variantsSection}
## Props

${propsTable}

## Sizes

<div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center; padding: 20px; background: var(--vp-c-bg-soft); border-radius: 8px; margin: 16px 0;">
  <button style="padding: 6px 12px; background: #c73548; color: white; border: none; border-radius: 6px; font-size: 12px;">Small</button>
  <button style="padding: 10px 20px; background: #c73548; color: white; border: none; border-radius: 8px; font-size: 14px;">Medium</button>
  <button style="padding: 14px 28px; background: #c73548; color: white; border: none; border-radius: 10px; font-size: 16px;">Large</button>
</div>

\`\`\`tsx
<${name} size="sm">Small</${name}>
<${name} size="md">Medium</${name}>
<${name} size="lg">Large</${name}>
\`\`\`

## Accessibility

- ✅ Proper ARIA attributes included
- ✅ Keyboard navigation support  
- ✅ Screen reader friendly
- ✅ Focus visible indicators
`;
}

// Create category index
function createCategoryIndex(category, components) {
  const title = category
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  let content = `# ${title} Components

Explore **${components.length}** ${title.toLowerCase()} components.

## Components

| Component | Description |
|-----------|-------------|
`;

  components.forEach((comp) => {
    content += `| [${comp}](/components/${category}/${comp}) | ${comp.replace(
      "Z",
      ""
    )} component |\n`;
  });

  return content;
}

// Main execution
console.log("🔄 Regenerating component documentation with previews...\n");

Object.entries(categories).forEach(([category, components]) => {
  const categoryPath = path.join(docsPath, category);

  if (!fs.existsSync(categoryPath)) {
    fs.mkdirSync(categoryPath, { recursive: true });
  }

  // Create category index
  fs.writeFileSync(
    path.join(categoryPath, "index.md"),
    createCategoryIndex(category, components)
  );

  // Create component docs with previews
  let createdCount = 0;
  components.forEach((comp) => {
    fs.writeFileSync(
      path.join(categoryPath, `${comp}.md`),
      createComponentDoc(comp, category)
    );
    createdCount++;
  });

  console.log(`✓ ${category}/ - ${createdCount} components`);
});

console.log("\n✅ Documentation with previews generated!");
console.log("📍 Run: npm run docs:dev");
