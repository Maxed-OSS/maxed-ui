import type { Decorator, Preview } from "@storybook/react";
import { createElement } from "react";
// Pull in the optional theme stylesheet so the toolbar theme switcher works.
import "../src/styles.css";

/**
 * A global "theme" toolbar control. Selecting dark/light sets data-mx-theme on
 * the story wrapper, which drives every component's --mx-* tokens.
 */
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme ?? "light";
  const dark = theme === "dark";
  return createElement(
    "div",
    {
      "data-mx-theme": theme,
      style: {
        padding: 24,
        minHeight: "100vh",
        background: dark ? "#141517" : "#ffffff",
        color: dark ? "#e9ecef" : "#212529",
      },
    },
    createElement(Story),
  );
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: "maxed-ui theme",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
