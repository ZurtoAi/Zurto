import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Zurto UI",
  description:
    "Modern React component library with dark theme and glassmorphism effects",
  lang: "en-US",
  base: "/",
  ignoreDeadLinks: true,

  sitemap: {
    hostname: "https://ui.zurto.app",
  },

  head: [
    ["link", { rel: "icon", href: "/logo-dark.svg" }],
    ["link", { rel: "canonical", href: "https://ui.zurto.app" }],
    ["meta", { name: "theme-color", content: "#c73548" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:url", content: "https://ui.zurto.app" }],
    ["meta", { property: "og:site_name", content: "Zurto UI" }],
    [
      "meta",
      { name: "og:title", content: "Zurto UI - Modern React Components" },
    ],
    [
      "meta",
      {
        name: "og:description",
        content: "Premium dark-theme React component library",
      },
    ],
  ],

  themeConfig: {
    logo: "/logo-dark.svg",
    siteTitle: "Zurto UI",

    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "Components", link: "/components/" },
      { text: "GitHub", link: "https://github.com/zurto/zurto-ui" },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "Introduction",
          items: [
            { text: "Getting Started", link: "/guide/getting-started" },
            { text: "Installation", link: "/guide/installation" },
            { text: "Theming", link: "/guide/theming" },
          ],
        },
      ],
      "/components/": [
        {
          text: "Overview",
          items: [{ text: "All Components", link: "/components/" }],
        },
        {
          text: "Button",
          collapsed: false,
          items: [
            { text: "Overview", link: "/components/button/" },
            { text: "ZButton", link: "/components/button/ZButton" },
            { text: "ZIconButton", link: "/components/button/ZIconButton" },
            { text: "ZButtonGroup", link: "/components/button/ZButtonGroup" },
            { text: "ZCloseButton", link: "/components/button/ZCloseButton" },
          ],
        },
        {
          text: "Form",
          collapsed: false,
          items: [
            { text: "Overview", link: "/components/form/" },
            { text: "ZInput", link: "/components/form/ZInput" },
            { text: "ZTextarea", link: "/components/form/ZTextarea" },
            { text: "ZSelect", link: "/components/form/ZSelect" },
            { text: "ZCheckbox", link: "/components/form/ZCheckbox" },
            { text: "ZSwitch", link: "/components/form/ZSwitch" },
            { text: "ZSlider", link: "/components/form/ZSlider" },
          ],
        },
        {
          text: "Feedback",
          collapsed: false,
          items: [
            { text: "Overview", link: "/components/feedback/" },
            { text: "ZAlert", link: "/components/feedback/ZAlert" },
            { text: "ZBadge", link: "/components/feedback/ZBadge" },
            { text: "ZSpinner", link: "/components/feedback/ZSpinner" },
            { text: "ZProgress", link: "/components/feedback/ZProgress" },
            { text: "ZSkeleton", link: "/components/feedback/ZSkeleton" },
            { text: "ZModal", link: "/components/feedback/ZModal" },
            { text: "ZTooltip", link: "/components/feedback/ZTooltip" },
          ],
        },
        {
          text: "Layout",
          collapsed: false,
          items: [
            { text: "Overview", link: "/components/layout/" },
            { text: "ZCard", link: "/components/layout/ZCard" },
            { text: "ZFlex", link: "/components/layout/ZFlex" },
            { text: "ZGrid", link: "/components/layout/ZGrid" },
            { text: "ZStack", link: "/components/layout/ZStack" },
            { text: "ZDivider", link: "/components/layout/ZDivider" },
          ],
        },
        {
          text: "Navigation",
          collapsed: true,
          items: [
            { text: "Overview", link: "/components/navigation/" },
            { text: "ZTabs", link: "/components/navigation/ZTabs" },
            { text: "ZBreadcrumb", link: "/components/navigation/ZBreadcrumb" },
            { text: "ZPagination", link: "/components/navigation/ZPagination" },
            { text: "ZMenu", link: "/components/navigation/ZMenu" },
          ],
        },
        {
          text: "Data Display",
          collapsed: true,
          items: [
            { text: "Overview", link: "/components/data-display/" },
            { text: "ZTable", link: "/components/data-display/ZTable" },
            { text: "ZAvatar", link: "/components/data-display/ZAvatar" },
            { text: "ZTag", link: "/components/data-display/ZTag" },
            { text: "ZAccordion", link: "/components/data-display/ZAccordion" },
          ],
        },
        {
          text: "Typography",
          collapsed: true,
          items: [
            { text: "Overview", link: "/components/typography/" },
            { text: "ZTitle", link: "/components/typography/ZTitle" },
            { text: "ZText", link: "/components/typography/ZText" },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/zurto/zurto-ui" },
      { icon: "discord", link: "https://discord.gg/zurto" },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2025 Zurto Team",
    },

    search: {
      provider: "local",
    },
  },

  markdown: {
    theme: {
      light: "github-dark",
      dark: "github-dark",
    },
  },
});
