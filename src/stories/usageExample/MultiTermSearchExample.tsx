import React, { useState, useCallback, useMemo, memo } from "react";
import { CopyBlock, dracula } from "react-code-blocks";

import { HighlightSearchWrapper } from "../../components";
import { OnMatchDataPropsType } from "../../types";

import {
    MatchNavigator,
    SampleContent,
    buildCodeSnippet,
} from "./sampleContent";

import "./styles.css";

// Split comma-separated input into trimmed, non-empty terms
const parseTerms = (value: string) =>
    value
        .split(",")
        .map(term => term.trim())
        .filter(Boolean);

const MultiTermSearchExample = () => {
    const defaultValue = "Search, World, example";

    const [inputValue, setInputValue] = useState<string>(defaultValue);
    const [ignoreCase, setIgnoreCase] = useState<boolean>(true);
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
                <h3>Multi-term search</h3>
                <p>
                    Pass an array of strings to highlight several terms at once.
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
                            value={inputValue}
                            className="search-input"
                            aria-label="Search terms, separated by commas"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="control-box">
                        <div className="header">Options</div>
                        <div>
                            <label htmlFor="ignoreCaseMulti">Ignore case</label>
                            <input
                                type="checkbox"
                                id="ignoreCaseMulti"
                                checked={ignoreCase}
                                onChange={e => setIgnoreCase(e.target.checked)}
                            />
                        </div>
                    </div>
                </div>
                <MatchNavigator spanElements={matchData.spanElements} />
                <HighlightSearchWrapper
                    searchString={terms}
                    ignoreCase={ignoreCase}
                    onMatchData={setMatchData}
                >
                    <SampleContent />
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
                        {terms.length > 0 && !matchData.matchesFound && (
                            <div className="no-matches">No matches</div>
                        )}
                    </div>
                </div>
            </div>
            <div className="code-block">
                <CopyBlock
                    language={"jsx"}
                    text={buildCodeSnippet(terms, ignoreCase)}
                    showLineNumbers={true}
                    theme={dracula}
                    codeBlock
                />
            </div>
        </>
    );
};

export default memo(MultiTermSearchExample);
