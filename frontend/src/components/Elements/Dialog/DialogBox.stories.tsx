import { Meta } from "@storybook/react";
import type { StoryFn } from "@storybook/react";

import { DialogBox, DialogProps } from "./DialogBox";
import { Button } from "..";

const meta: Meta = {
  title: "Example/Dialog",
  component: DialogBox,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: StoryFn<DialogProps> = (props) => <DialogBox {...props} />;
export const Primary = Template.bind({});
Primary.args = {
  title: "Modal"
};

export const WithCustomButtons = Template.bind({});
WithCustomButtons.args = {
  title: "Title",
  triggerButton: <Button>Open</Button>,
  confirmButton: <Button>Save</Button>,
  footerBtnPosition: "right",
};
