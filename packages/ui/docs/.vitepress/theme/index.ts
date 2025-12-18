import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import "./clean-theme.css";

// Custom components
import Demo from "./components/Demo.vue";
import PropsTable from "./components/PropsTable.vue";
import ColorSwatch from "./components/ColorSwatch.vue";
import CodeToggle from "./components/CodeToggle.vue";
import CategoryCard from "./components/CategoryCard.vue";
import ComponentGrid from "./components/ComponentGrid.vue";
import ReactPlayground from "./components/ReactPlayground.vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register global components
    app.component("Demo", Demo);
    app.component("PropsTable", PropsTable);
    app.component("ColorSwatch", ColorSwatch);
    app.component("CodeToggle", CodeToggle);
    app.component("CategoryCard", CategoryCard);
    app.component("ComponentGrid", ComponentGrid);
    app.component("ReactPlayground", ReactPlayground);
  },
} satisfies Theme;
