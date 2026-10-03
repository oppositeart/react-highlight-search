import React, { memo, useCallback, useEffect, useRef } from "react";

import { ChangedNodeObjectType, OnMatchDataType } from "../types";

import {
    addSpans,
    escapeRegExp,
    initMatchData,
    restoreOriginNodes,
    searchAcrossNodes,
} from "../helpers";

import "./styles.css";

type PageSearchWrapperProps = {
    searchString: string;
    setTriggerSearch?: React.Dispatch<
        React.SetStateAction<((text: string) => void) | undefined>
    >;
    searchMinLength?: number;
    onMatchData?: OnMatchDataType;
    children: React.ReactElement | JSX.Element;
    spanClassName?: string;
    ignoreCase?: boolean;
    index?: number;
};

const SEARCH_MIN_LENGTH = 1;

const HighlightSearchWrapper = ({
    searchString,
    setTriggerSearch,
    searchMinLength = SEARCH_MIN_LENGTH,
    onMatchData,
    children,
    spanClassName = "hlsearch-span-el",
    ignoreCase = true,
    index = 0,
}: PageSearchWrapperProps) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const ref = useRef<HTMLDivElement>(null);

    // Kept in a ref so back-to-back searches always restore the latest nodes
    const originNodesRef = useRef<ChangedNodeObjectType[] | undefined>(undefined);

    const setOriginNodes = useCallback(
        (changedNodesObject: ChangedNodeObjectType[] | undefined) => {
            originNodesRef.current = changedNodesObject;
        },
        [],
    );

    // Latest callback in a ref, so an inline onMatchData doesn't re-run the search
    const onMatchDataRef = useRef(onMatchData);
    onMatchDataRef.current = onMatchData;

    // Watches the wrapped DOM so highlights follow changes made by React
    const observerRef = useRef<MutationObserver | undefined>(undefined);
    const observedRecordsRef = useRef<MutationRecord[]>([]);
    const lastSearchRef = useRef<string | undefined>(undefined);

    const setMatchDataFn = useCallback(
        (count: number) => {
            onMatchDataRef.current?.({
                wrapperIndex: index,
                matchesFound: count,
                matchParentElement: count ? parentRef.current : null,
            });
        },
        [index],
    );

    const highlightText = useCallback(
        (text: string) => {
            setMatchDataFn(0);

            // Text nodes React has rewritten since the last search
            const records = [
                ...observedRecordsRef.current,
                ...(observerRef.current?.takeRecords() || []),
            ];
            observedRecordsRef.current = [];

            const externallyChangedNodes = new Set<Node>(
                records
                    .filter(({ type }) => type === "characterData")
                    .map(({ target }) => target),
            );

            // Restore original Node elements before each search
            restoreOriginNodes(originNodesRef.current, externallyChangedNodes);
            setOriginNodes(undefined);

            if (
                text?.length <
                (searchMinLength > 0 ? searchMinLength : SEARCH_MIN_LENGTH)
            ) {
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

            // Match the search string literally ("." or "(" are plain characters)
            const regexp = new RegExp(
                escapeRegExp(text),
                ignoreCase ? "ig" : "g",
            );
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
        [
            ignoreCase,
            searchMinLength,
            setMatchDataFn,
            setOriginNodes,
            spanClassName,
        ],
    );

    const searchText = useCallback(
        (text: string) => {
            lastSearchRef.current = text;
            highlightText(text);
            // Ignore DOM changes made by the search itself
            observerRef.current?.takeRecords();
        },
        [highlightText],
    );

    const searchTextRef = useRef(searchText);
    searchTextRef.current = searchText;

    // Run search if user input or search options are changed
    useEffect(() => {
        if (searchString !== undefined) {
            searchText(searchString);
        }
    }, [searchString, searchText]);

    // Re-run the last search when the wrapped content changes
    useEffect(() => {
        const container = ref.current;

        if (!container || typeof MutationObserver === "undefined") {
            return;
        }

        const observer = new MutationObserver(records => {
            if (!lastSearchRef.current && !originNodesRef.current) {
                return;
            }
            observedRecordsRef.current.push(...records);
            searchTextRef.current(lastSearchRef.current || "");
        });

        observer.observe(container, {
            childList: true,
            characterData: true,
            subtree: true,
        });
        observerRef.current = observer;

        return () => {
            observer.disconnect();
            observerRef.current = undefined;
        };
    }, []);

    useEffect(() => {
        setTriggerSearch?.(() => (text: string) => searchText(text));
    }, [setTriggerSearch, searchText]);

    return (
        <div ref={parentRef}>
            <div ref={ref}>{children}</div>
        </div>
    );
};

export default memo(HighlightSearchWrapper);
