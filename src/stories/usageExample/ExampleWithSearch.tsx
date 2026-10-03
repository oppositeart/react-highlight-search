import React, { useState, useCallback, memo } from "react";
import { CopyBlock, dracula } from "react-code-blocks";

import { HighlightSearchWrapper } from "../../components";
import { OnMatchDataPropsType } from "../../types";

import {
    HtmlPreviewToggle,
    MatchNavigator,
    SampleContent,
    buildCodeSnippet,
} from "./sampleContent";

import "./styles.css";

const ExampleWithSearch = () => {
    const defaultValue = "Search Me";

    const [searchString, setSearchString] = useState<string>(defaultValue);
    const [ignoreCase, setIgnoreCase] = useState<boolean>(true);
    const [matchData, setMatchData] = useState<OnMatchDataPropsType>({
        wrapperIndex: 0,
        matchesFound: 0,
        spanElements: null,
    });

    const [showHtml, setShowHtml] = useState<boolean>(false);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchString(e.target.value);
        },
        [],
    );

    return (
        <>
            <div className="main-wrapper">
                <h3>Check it out!</h3>
                <p>
                    Implementing deep search through a nested DOM is incredibly
                    simple with the react-highlight-search package.
                </p>
                <div>
                    <p>
                        To check the search functionality, type in the input
                        field below.
                    </p>
                </div>
                <div className="controls">
                    <div>
                        <input
                            value={searchString}
                            className="search-input"
                            aria-label="Search text"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="control-box">
                        <div className="header">Options</div>
                        <div>
                            <label htmlFor="ignoreCase">Ignore case</label>
                            <input
                                type="checkbox"
                                id="ignoreCase"
                                checked={ignoreCase}
                                onChange={e => setIgnoreCase(e.target.checked)}
                            />
                        </div>
                    </div>
                </div>
                <HtmlPreviewToggle
                    idPrefix="deepSearch"
                    showHtml={showHtml}
                    setShowHtml={setShowHtml}
                />
                <MatchNavigator spanElements={matchData.spanElements} />
                <HighlightSearchWrapper
                    searchString={searchString}
                    ignoreCase={ignoreCase}
                    onMatchData={setMatchData}
                >
                    <SampleContent showHtml={showHtml} />
                </HighlightSearchWrapper>
                <div className="returned-data">
                    <div className="header">Returned Data</div>
                    <div>
                        <div>Wrapper Index: {matchData.wrapperIndex}</div>
                        <div>Matches Found: {matchData.matchesFound}</div>
                        <div>
                            Span Elements:{" "}
                            {matchData.spanElements?.length ?? "null"}
                        </div>
                        {searchString && !matchData.matchesFound && (
                            <div className="no-matches">No matches</div>
                        )}
                    </div>
                </div>
            </div>
            <div className="code-block">
                <CopyBlock
                    language={"jsx"}
                    text={buildCodeSnippet(searchString, ignoreCase)}
                    showLineNumbers={true}
                    theme={dracula}
                    codeBlock
                />
            </div>
        </>
    );
};

export default memo(ExampleWithSearch);
