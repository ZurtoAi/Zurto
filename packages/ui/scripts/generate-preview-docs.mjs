/**
 * ============================================
 * AUTOMATIC COMPONENT PREVIEW GENERATOR
 * ============================================
 *
 * Scans src/components and generates live previews automatically
 * No manual MD file creation needed
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Component example structure
// {
//   name: string;
//   category: string;
//   path: string;
//   examples: Array<{ title: string, code: string }>;
// }

// Scan all component directories
function scanComponents() {
  const componentsDir = path.join(__dirname, "..", "src", "components");
  const categories = fs
    .readdirSync(componentsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const components = [];

  for (const category of categories) {
    const categoryPath = path.join(componentsDir, category);
    const componentDirs = fs
      .readdirSync(categoryPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory());

    for (const componentDir of componentDirs) {
      const componentName = componentDir.name;
      const componentPath = path.join(categoryPath, componentName);

      // Look for example files or stories
      const examplesPath = path.join(componentPath, "examples");
      const examples = [];

      if (fs.existsSync(examplesPath)) {
        const exampleFiles = fs
          .readdirSync(examplesPath)
          .filter((f) => f.endsWith(".tsx") || f.endsWith(".jsx"));

        for (const exampleFile of exampleFiles) {
          const code = fs.readFileSync(
            path.join(examplesPath, exampleFile),
            "utf-8"
          );
          const title = exampleFile
            .replace(/\.(tsx|jsx)$/, "")
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())
            .trim();

          examples.push({ title, code });
        }
      } else {
        // Generate basic example from component props
        examples.push(generateBasicExample(componentName));
      }

      components.push({
        name: componentName,
        category,
        path: componentPath,
        examples,
      });
    }
  }

  return components;
}

// Generate basic example if no examples exist
function generateBasicExample(componentName) {
  return {
    title: "Basic Usage",
    code: `<${componentName}>
  Example Content
</${componentName}>`,
  };
}

// Generate markdown for a component
function generateComponentMarkdown(component) {
  const { name, category, examples } = component;

  return `# ${name}

${examples
  .map(
    (example, index) => `
## ${example.title}

<ComponentPreview>
${example.code}
</ComponentPreview>

${index < examples.length - 1 ? "---\n" : ""}
`
  )
  .join("\n")}

## Props

See component TypeScript definitions for full prop list.

## API Reference

\`\`\`tsx
import { ${name} } from '@zurto/ui';
\`\`\`
`;
}

// Generate all component docs
function generateAllDocs() {
  console.log("🔍 Scanning components...");
  const components = scanComponents();
  console.log(`✅ Found ${components.length} components`);

  const docsDir = path.join(__dirname, "..", "docs", "components");

  for (const component of components) {
    const categoryDir = path.join(docsDir, component.category);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }

    const mdPath = path.join(categoryDir, `${component.name}.md`);
    const mdContent = generateComponentMarkdown(component);
    fs.writeFileSync(mdPath, mdContent);
    console.log(`📝 Generated: ${component.category}/${component.name}.md`);
  }

  console.log(
    `\n✨ Generated documentation for ${components.length} components!`
  );
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllDocs();
}

export { scanComponents, generateComponentMarkdown, generateAllDocs };
