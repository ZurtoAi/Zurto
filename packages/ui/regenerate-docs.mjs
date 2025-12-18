import fs from "fs";
import path from "path";

const docsPath = "./docs/components";

// Component categories mapping
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

// Create clean doc template
function createComponentDoc(name, category) {
  return `# ${name}

A reusable ${name.replace("Z", "")} component from zurto-ui.

## Import

\`\`\`typescript
import { ${name} } from 'zurto-ui';
\`\`\`

## Basic Usage

\`\`\`tsx
<${name}>
  Content here
</${name}>
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`children\` | \`ReactNode\` | - | Component content |
| \`className\` | \`string\` | - | Additional CSS classes |
| \`style\` | \`CSSProperties\` | - | Inline styles |

## Variants

\`\`\`tsx
<${name} variant="primary">Primary</${name}>
<${name} variant="secondary">Secondary</${name}>
\`\`\`

## Sizes

\`\`\`tsx
<${name} size="sm">Small</${name}>
<${name} size="md">Medium</${name}>
<${name} size="lg">Large</${name}>
\`\`\`

## Accessibility

- Proper ARIA attributes included
- Keyboard navigation support
- Screen reader friendly
`;
}

// Create category index
function createCategoryIndex(category, components) {
  const title = category
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  let content = `# ${title} Components

Explore ${components.length} ${title.toLowerCase()} components.

## Components

`;

  components.forEach((comp) => {
    content += `- [${comp}](/components/${category}/${comp}) - ${comp.replace(
      "Z",
      ""
    )} component\n`;
  });

  return content;
}

// Regenerate all docs
console.log("Regenerating component documentation...\n");

Object.entries(categories).forEach(([category, components]) => {
  const categoryPath = path.join(docsPath, category);

  // Ensure directory exists
  if (!fs.existsSync(categoryPath)) {
    fs.mkdirSync(categoryPath, { recursive: true });
  }

  // Create category index
  fs.writeFileSync(
    path.join(categoryPath, "index.md"),
    createCategoryIndex(category, components)
  );
  console.log(`✓ Created ${category}/index.md`);

  // Create component docs
  components.forEach((comp) => {
    fs.writeFileSync(
      path.join(categoryPath, `${comp}.md`),
      createComponentDoc(comp, category)
    );
  });
  console.log(`  ✓ Created ${components.length} component docs`);
});

console.log("\n✅ Documentation regenerated successfully!");
console.log("Run `npm run docs:dev` to preview.");
