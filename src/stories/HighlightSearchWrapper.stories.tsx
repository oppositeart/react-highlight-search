import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { HighlightSearchWrapper } from "../components";

const meta = {
    title: "Example/HighlightSearchWrapper",
    component: HighlightSearchWrapper,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        searchString: {
            control: "object",
            description:
                'The text to search for. Pass an array to highlight several terms at once, e.g. `["str1", "str2"]`.',
        },
        ignoreCase: {
            control: "boolean",
            description: "Ignore case sensitive of the search string.",
        },
        searchMinLength: {
            control: { type: "number", min: 1 },
            description:
                "The minimum length of text required to start the search.",
        },
        spanClassName: {
            control: "text",
            description:
                "Class name applied to the <span> elements added to the DOM for highlighting text.",
        },
        index: {
            control: "number",
            description: "Index value returned in the onMatchData callback.",
        },
        onMatchData: {
            description:
                "Callback with `{ wrapperIndex, matchesFound, spanElements }` after each search.",
        },
        setTriggerSearch: {
            control: false,
            description: "The function to trigger search manually.",
        },
        children: {
            control: false,
        },
    },
    // Logs every onMatchData call in the Actions panel
    args: {
        onMatchData: fn(),
    },
} satisfies Meta<typeof HighlightSearchWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        index: 0,
        searchString: "Hello",
        children: <div>Hello World!</div>,
    },
};

export const MultipleTerms: Story = {
    args: {
        searchString: ["Hello", "World"],
        children: <div>Hello World! Hello again, wide World.</div>,
    },
};

export const CaseSensitive: Story = {
    args: {
        searchString: "hello",
        ignoreCase: false,
        children: <div>Hello hello HELLO</div>,
    },
};

export const SpecialCharacters: Story = {
    args: {
        searchString: "1.5 (beta)",
        children: (
            <div>
                Version 1.5 (beta) is out. Version 125 beta is not a match.
            </div>
        ),
    },
};

export const NestedElements: Story = {
    args: {
        searchString: "quick brown fox",
        children: (
            <div>
                The <b>quick</b> <i>brown</i> fox jumps over the lazy dog.
            </div>
        ),
    },
};
