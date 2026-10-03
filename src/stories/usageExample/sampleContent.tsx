import React, { memo, useCallback, useEffect, useState } from "react";

import { SearchStringType } from "../../types";

// Sample markup shared by the examples: rendered plain, rendered with its
// tags shown (HTML preview) and printed in the code snippet
export type SampleNode = {
    tag: "div" | "ul" | "li" | "span" | "h4";
    className?: string;
    children: (string | SampleNode)[];
};

export const SAMPLE_CONTENT: SampleNode = {
    tag: "div",
    className: "example-of-nesting-1",
    children: [
        "Hello World!",
        {
            tag: "div",
            className: "example-of-nesting-2",
            children: [
                "Other text example",
                {
                    tag: "div",
                    className: "example-of-nesting-3",
                    children: [
                        "Search Me!",
                        {
                            tag: "ul",
                            children: [
                                { tag: "li", children: ["Search Me.."] },
                                {
                                    tag: "li",
                                    children: [
                                        "Search Me Again! ",
                                        {
                                            tag: "span",
                                            children: ["Search Me!"],
                                        },
                                    ],
                                },
                                { tag: "li", children: ["Hello World!"] },
                                {
                                    tag: "li",
                                    children: [
                                        {
                                            tag: "div",
                                            children: [
                                                {
                                                    tag: "h4",
                                                    children: [
                                                        "Other text example",
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};

const openTag = ({ tag, className }: SampleNode) =>
    className ? `<${tag} className={"${className}"}>` : `<${tag}>`;

const closeTag = ({ tag }: SampleNode) => `</${tag}>`;

// Nested divs with a class name are indented in the plain view
const plainClassName = ({ className }: SampleNode, depth: number) =>
    [className, className && depth > 0 ? "margin-left-25" : ""]
        .filter(Boolean)
        .join(" ") || undefined;

const renderPlain = (node: SampleNode, depth = 0): React.ReactNode =>
    React.createElement(
        node.tag,
        { className: plainClassName(node, depth) },
        ...node.children.map((child, i) =>
            typeof child === "string" ? (
                child
            ) : (
                <React.Fragment key={i}>
                    {renderPlain(child, depth + 1)}
                </React.Fragment>
            ),
        ),
    );

// Elements with a class name, lists and spans show their tags outside
// themselves; the rest (li, h4, plain div) show them inside
const hasOuterTags = ({ tag, className }: SampleNode) =>
    Boolean(className) || tag === "ul" || tag === "span";

const renderPreview = (node: SampleNode, depth = 1): React.ReactNode => {
    const tagLabel = (text: string) => (
        <div className={`highlight-nesting-${depth}`}>{text}</div>
    );

    const children = node.children.map((child, i) => {
        if (typeof child === "string") {
            const next = node.children[i + 1];
            // Break the line before a block that starts with its own tag label
            const breakAfter =
                typeof next === "object" &&
                hasOuterTags(next) &&
                next.tag !== "span";

            return (
                <React.Fragment key={i}>
                    {child}
                    {breakAfter && <br />}
                </React.Fragment>
            );
        }
        return (
            <React.Fragment key={i}>
                {renderPreview(child, depth + 1)}
            </React.Fragment>
        );
    });

    const indent =
        node.tag === "div" || node.tag === "h4" ? "margin-left-25" : "";
    const className =
        [node.className, indent].filter(Boolean).join(" ") || undefined;

    if (hasOuterTags(node)) {
        return (
            <>
                {tagLabel(openTag(node))}
                {React.createElement(node.tag, { className }, ...children)}
                {tagLabel(closeTag(node))}
            </>
        );
    }

    return React.createElement(
        node.tag,
        { className },
        tagLabel(openTag(node)),
        ...children,
        tagLabel(closeTag(node)),
    );
};

export const SampleContent = memo(({ showHtml }: { showHtml?: boolean }) => (
    <>
        {showHtml ? renderPreview(SAMPLE_CONTENT) : renderPlain(SAMPLE_CONTENT)}
    </>
));
SampleContent.displayName = "SampleContent";

const INDENT = "    ";

const printNode = (node: SampleNode, depth: number): string[] => {
    const pad = INDENT.repeat(depth);

    return [
        pad + openTag(node),
        ...node.children.flatMap(child =>
            typeof child === "string"
                ? [pad + INDENT + child.trim()]
                : printNode(child, depth + 1),
        ),
        pad + closeTag(node),
    ];
};

// Code snippet that matches what the example currently shows
export const buildCodeSnippet = (
    searchString: SearchStringType,
    ignoreCase: boolean,
) =>
    [
        'import React, { useState } from "react";',
        'import { HighlightSearchWrapper } from "react-highlight-search";',
        "",
        "const [matchData, setMatchData] = useState(null);",
        "",
        "<HighlightSearchWrapper",
        `${INDENT}searchString={${JSON.stringify(searchString)}}`,
        `${INDENT}ignoreCase={${ignoreCase}}`,
        `${INDENT}onMatchData={setMatchData}`,
        ">",
        ...printNode(SAMPLE_CONTENT, 1),
        "</HighlightSearchWrapper>",
    ].join("\n");

const ACTIVE_CLASS_NAME = "active-match";

// Prev / Next buttons that walk through the highlighted spans
export const MatchNavigator = memo(
    ({ spanElements }: { spanElements: HTMLSpanElement[] | null }) => {
        const [activeIndex, setActiveIndex] = useState(0);

        // Start from the first span after every search
        useEffect(() => {
            setActiveIndex(0);
        }, [spanElements]);

        useEffect(() => {
            const span = spanElements?.[activeIndex];
            span?.classList.add(ACTIVE_CLASS_NAME);

            return () => {
                span?.classList.remove(ACTIVE_CLASS_NAME);
            };
        }, [spanElements, activeIndex]);

        const goTo = useCallback(
            (step: number) => {
                if (!spanElements?.length) {
                    return;
                }
                const nextIndex =
                    (activeIndex + step + spanElements.length) %
                    spanElements.length;

                setActiveIndex(nextIndex);
                spanElements[nextIndex].scrollIntoView({
                    block: "center",
                    behavior: "smooth",
                });
            },
            [activeIndex, spanElements],
        );

        const count = spanElements?.length || 0;

        return (
            <div className="match-navigator">
                <button
                    type="button"
                    disabled={!count}
                    onClick={() => goTo(-1)}
                >
                    Prev
                </button>
                <span className="match-position">
                    {count ? `${activeIndex + 1} of ${count}` : "0 of 0"}
                </span>
                <button type="button" disabled={!count} onClick={() => goTo(1)}>
                    Next
                </button>
            </div>
        );
    },
);
MatchNavigator.displayName = "MatchNavigator";
