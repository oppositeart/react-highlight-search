import type { Meta, StoryObj } from "@storybook/react";
import ExampleWithSearch from "./ExampleWithSearch";

const meta = {
    title: "Example/Deep Search Example",
    component: ExampleWithSearch,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {},
} satisfies Meta<typeof ExampleWithSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {},
};
