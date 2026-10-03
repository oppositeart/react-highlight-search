import React, { memo, useCallback, useEffect, useRef } from "react";

import {
    ChangedNodeObjectType,
    OnMatchDataType,
    SearchStringType,
} from "../types";

import {
    addSpans,
    escapeRegExp,
    initMatchData,
    restoreOriginNodes,
    searchAcrossNodes,
} from "../helpers";

import "./styles.css";

type PageSearchWrapperProps = {
    searchString: SearchStringType;
    setTriggerSearch?: React.Dispatch<
        React.SetStateAction<((text: SearchStringType) => void) | undefined>
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
    const lastSearchRef = useRef<SearchStringType | undefined>(undefined);

    const setMatchDataFn = useCallback(
        (count: number, spanElements: HTMLSpanElement[] = []) => {
            onMatchDataRef.current?.({
                wrapperIndex: index,
                matchesFound: count,
                spanElements: count ? spanElements : null,
            });
        },
        [index],
    );

    const highlightText = useCallback(
        (text: SearchStringType) => {
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

            const minLength =
                searchMinLength > 0 ? searchMinLength : SEARCH_MIN_LENGTH;

            // Accept one term or several, skipping terms that are too short
            const terms = (Array.isArray(text) ? text : [text]).filter(
                term => typeof term === "string" && term.length >= minLength,
            );

            if (!terms.length) {
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

            // Match the terms literally ("." or "(" are plain characters).
            // Longer terms go first, so "cats" wins over "cat" at the same spot.
            const pattern = Array.from(new Set(terms))
                .sort((a, b) => b.length - a.length)
                .map(escapeRegExp)
                .join("|");
            const regexp = new RegExp(pattern, ignoreCase ? "ig" : "g");
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
            // Add spans to selected nodes
            const spanElements = addSpans(
                matchData,
                setOriginNodes,
                spanClassName,
            );

            setMatchDataFn(matchCount, spanElements);
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
        (text: SearchStringType) => {
            lastSearchRef.current = text;
            highlightText(text);
            // Ignore DOM changes made by the search itself
            observerRef.current?.takeRecords();
        },
        [highlightText],
    );

    const searchTextRef = useRef(searchText);
    searchTextRef.current = searchText;

    // Compare terms by value, so a new array with the same terms
    // on every render doesn't re-run the search
    const searchKey =
        searchString === undefined ? undefined : JSON.stringify(searchString);

    // Run search if user input or search options are changed
    useEffect(() => {
        if (searchKey !== undefined) {
            searchText(JSON.parse(searchKey));
        }
    }, [searchKey, searchText]);

    // Re-run the last search when the wrapped content changes
    useEffect(() => {
        const container = ref.current;

        if (!container || typeof MutationObserver === "undefined") {
            return;
        }

        const observer = new MutationObserver(records => {
            if (!lastSearchRef.current?.length && !originNodesRef.current) {
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
        setTriggerSearch?.(() => (text: SearchStringType) => searchText(text));
    }, [setTriggerSearch, searchText]);

    return (
        <div>
            <div ref={ref}>{children}</div>
        </div>
    );
};

export default memo(HighlightSearchWrapper);
