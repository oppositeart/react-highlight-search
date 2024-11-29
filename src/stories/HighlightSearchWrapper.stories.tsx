import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { HighlightSearchWrapper } from "../components";

const meta = {
    title: "Example/HighlightSearchWrapper",
    component: HighlightSearchWrapper,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {},
} satisfies Meta<typeof HighlightSearchWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        index: 0,
        searchString: "Hello",
        // onMatchData: (componentIndex, count, sectionElement) => {},
        children: <div>Hello World!</div>,
    },
};
