import React, { useState, useCallback, useMemo, memo } from "react";
import { CopyBlock, dracula } from "react-code-blocks";

import { HighlightSearchWrapper } from "../../components";
import { OnMatchDataPropsType } from "../../types";

import "./styles.css";

const CODE_BLOCK = `import React from "react";
import { HighlightSearchWrapper } from "react-highlight-search";

<HighlightSearchWrapper searchString={["Search", "World", "example"]}>
    <div className={"example-of-nesting-1"}>
        Hello World!
        <div className={"example-of-nesting-2"}>
            Other text example
            <div className={"example-of-nesting-3"}>
                Search Me!
                <ul>
                    <li>Search Me..</li>
                    <li>
                        Search Me Again! <span>Search Me!</span>
                    </li>
                    <li>Hello World!</li>
                    <li>
                        <div>
                            <h4>Other text example</h4>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</HighlightSearchWrapper>`;

// Split comma-separated input into trimmed, non-empty terms
const parseTerms = (value: string) =>
    value
        .split(",")
        .map(term => term.trim())
        .filter(Boolean);

const MultiTermSearchExample = () => {
    const defaultValue = "Search, World, example";

    const [inputValue, setInputValue] = useState<string>(defaultValue);
    const [matchData, setMatchData] = useState<OnMatchDataPropsType>({
        wrapperIndex: 0,
        matchesFound: 0,
        spanElements: null,
    });

    const terms = useMemo(() => parseTerms(inputValue), [inputValue]);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.target.value);
        },
        [],
    );

    return (
        <>
            <div className="main-wrapper">
                <p>
                    <h3>Multi-term search</h3> Pass an array of strings to
                    highlight several terms at once.
                </p>
                <div>
                    <p>
                        Type terms separated by commas in the input field below.
                        Each term is highlighted on its own.
                    </p>
                </div>
                <div className="controls">
                    <div>
                        <input
                            defaultValue={defaultValue}
                            className="search-input"
                            onInput={handleInputChange}
                        />
                    </div>
                </div>
                <HighlightSearchWrapper
                    searchString={terms}
                    onMatchData={setMatchData}
                >
                    <div className={"example-of-nesting-1"}>
                        Hello World!
                        <div className={"example-of-nesting-2 margin-left-25"}>
                            Other text example
                            <div
                                className={
                                    "example-of-nesting-3 margin-left-25"
                                }
                            >
                                Search Me!
                                <ul>
                                    <li>Search Me..</li>
                                    <li>
                                        Search Me Again! <span>Search Me!</span>
                                    </li>
                                    <li>Hello World!</li>
                                    <li>
                                        <div>
                                            <h4>Other text example</h4>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </HighlightSearchWrapper>
                <div className="returned-data">
                    <div className="header">Returned Data</div>
                    <div>
                        <div>Search Terms: {JSON.stringify(terms)}</div>
                        <div>Wrapper Index: {matchData.wrapperIndex}</div>
                        <div>Matches Found: {matchData.matchesFound}</div>
                        <div>
                            Span Elements:{" "}
                            {matchData.spanElements?.length ?? "null"}
                        </div>
                    </div>
                </div>
            </div>
            <div className="code-block">
                <CopyBlock
                    language={"jsx"}
                    text={CODE_BLOCK}
                    showLineNumbers={true}
                    theme={dracula}
                    codeBlock
                />
            </div>
        </>
    );
};

export default memo(MultiTermSearchExample);
