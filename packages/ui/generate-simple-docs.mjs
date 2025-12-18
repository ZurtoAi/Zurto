import fs from "fs";
import path from "path";

const docsPath = "./docs/components";

// Simplified component definitions (no complex HTML that breaks Vue)
const components = {
  // BUTTONS
  ZButton: {
    category: "button",
    description: "Primary button component with variants and sizes",
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
};

// Generate simple component doc using CodeToggle (simpler, works)
function createComponentDoc(name, comp) {
  // Single-line friendly code for attribute
  const codeOneLine = comp.code.replace(/\n/g, "&#10;").replace(/"/g, "&quot;");

  let propsTable = `| Prop | Type | Default | Description |
|------|------|---------|-------------|
`;
  comp.props.forEach(([prop, type, def, desc]) => {
    propsTable += `| \`${prop}\` | \`${type}\` | \`${def}\` | ${desc} |\n`;
  });

  return `# ${name}

${comp.description}

## Example

<CodeToggle code="${codeOneLine}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

\`\`\`tsx
import { ${name} } from 'zurto-ui';
\`\`\`

## Usage

\`\`\`tsx
${comp.code}
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
console.log("🚀 Generating documentation with CodeToggle...\n");

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
