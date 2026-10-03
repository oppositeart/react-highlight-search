import type { Meta, StoryObj } from "@storybook/react";
import MultiTermSearchExample from "./MultiTermSearchExample";

const meta = {
    title: "Example/Multi-Term Search Example",
    component: MultiTermSearchExample,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {},
} satisfies Meta<typeof MultiTermSearchExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {},
};
