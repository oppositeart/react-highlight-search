import React, { memo, useCallback, useEffect, useRef, useState } from "react";

import { usePrevious } from "../hooks";

import { ChangedNodeObjectType, OnMatchDataType } from "../types";

import {
    addSpans,
    initMatchData,
    restoreOriginNodes,
    searchAcrossNodes,
} from "../helpers";

import "./styles.css";

type PageSearchWrapperProps = {
    index: number;
    searchString: string;
    searchMinLength?: number;
    onMatchData?: OnMatchDataType;
    children: React.ReactElement | JSX.Element;
    spanClassName?: string;
};

const HighlightSearchWrapper = ({
    index,
    searchString,
    searchMinLength = 1,
    onMatchData,
    children,
    spanClassName = "highlightsearch-selected-element",
}: PageSearchWrapperProps) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const ref = useRef<HTMLDivElement>(null);

    const [originNodes, setOriginNodes] = useState<ChangedNodeObjectType[]>();

    const prevSearchString = usePrevious(searchString);

    const setMatchDataFn = useCallback(
        (count: number) => {
            onMatchData?.(index, count, count ? parentRef.current : null);
        },
        [index, onMatchData],
    );

    const searchText = useCallback(
        (text: string) => {
            setMatchDataFn(0);

            // Restore original Node elements before each search
            restoreOriginNodes(originNodes);

            if (text?.length < (searchMinLength > 0 ? searchMinLength : 1)) {
                return;
            }

            const textNodes: ChildNode[] | undefined = [];

            // Extract text from nodes
            const extractText = (nodes: NodeListOf<ChildNode> | undefined) => {
                nodes?.forEach(node => {
                    if (node.nodeType === node.ELEMENT_NODE) {
                        extractText(node.childNodes);
                    } else if (node.nodeType === node.TEXT_NODE) {
                        textNodes.push(node);
                    }
                });
            };

            extractText(ref.current?.childNodes);

            if (!textNodes.length) {
                return;
            }

            // Combine text to one string
            let textCombined = "";

            textNodes.forEach((node: ChildNode) => {
                textCombined += node.textContent;
            });

            const regexp = new RegExp(text, "ig");
            const matches = textCombined.matchAll(regexp);

            let matchCount = 0;

            const { matchData, matchDataController } = initMatchData();

            // Iterate trough matches to make node map
            for (const match of matches) {
                if (match.index === undefined) {
                    return;
                }

                matchCount++;

                searchAcrossNodes(
                    textNodes,
                    match.index,
                    match.index + match[0].length - 1,
                    matchDataController,
                );
            }
            setMatchDataFn(matchCount);

            // Add spans to selected nodes
            addSpans(matchData, setOriginNodes, spanClassName);
        },
        [originNodes, setMatchDataFn],
    );

    // Run search if user input is changed
    useEffect(() => {
        if (searchString !== undefined && searchString !== prevSearchString) {
            searchText(searchString);
        }
    }, [prevSearchString, searchString, searchText]);

    return (
        <div ref={parentRef}>
            <div ref={ref}>{children}</div>
        </div>
    );
};

export default memo(HighlightSearchWrapper);
