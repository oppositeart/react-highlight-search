import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { HighlightSearchWrapper } from "../components";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: "Example/HighlightSearchWrapper",
    component: HighlightSearchWrapper,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: "centered",
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {},
} satisfies Meta<typeof HighlightSearchWrapper>;


export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
     index: 0,
      searchString: 'Hello',
      // setMatchData: (componentIndex, count, sectionElement) => {},
      children: <div>Hello World!</div>,
    },
  };
