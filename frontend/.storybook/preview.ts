import type { Preview } from "@storybook/react";
import "flatpickr/dist/themes/light.css";
import "bootstrap/dist/css/bootstrap.css";
import "@/scss/custom.scss";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
