import React, { useState, useCallback, useEffect, memo } from "react";
import { CopyBlock, dracula } from "react-code-blocks";

import { HighlightSearchWrapper } from "../../components";
import { usePrevious } from "../../hooks";
import { OnMatchDataPropsType } from "../../types";

import "./styles.css";

const CODE_BLOCK = `import React from "react";
import { HighlightSearchWrapper } from "react-highlight-search";

<HighlightSearchWrapper searchString={"Search Me"}>
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

const ExampleWithSearch = () => {
    const defaultValue = "Search Me";

    const [searchString, setSearchString] = useState<string>(defaultValue);
    const [triggerSearch, setTriggerSearch] =
        useState<(text: string) => void>();
    const [matchData, setMatchData] = useState<OnMatchDataPropsType>({
        wrapperIndex: 0,
        matchesFound: 0,
        matchParentElement: null,
    });

    const [showHtml, setShowHtml] = useState<boolean>(false);

    const prevShowHtml = usePrevious(showHtml);

    useEffect(() => {
        if (prevShowHtml !== showHtml) {
            triggerSearch?.(searchString);
        }
    }, [showHtml, searchString, triggerSearch, prevShowHtml]);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchString(e.target.value);
        },
        [],
    );

    return (
        <>
            <div className="main-wrapper">
                <p>
                    <h3>Check it out!</h3> Implementing deep search through a
                    nested DOM is incredibly simple with the
                    react-highlight-search package.
                </p>
                <div>
                    <p>
                        To check the search functionality, type in the input
                        field below.
                    </p>
                    <p>Use the radio buttons to toggle the HTML preview.</p>
                </div>
                <div className="controls">
                    <div>
                        <input
                            defaultValue={defaultValue}
                            className="search-input"
                            onInput={handleInputChange}
                        />
                    </div>
                    <div className="control-show-html">
                        <div className="header">HTML Preview</div>
                        <div>
                            <label htmlFor="showHtml">Yes</label>
                            <input
                                type="radio"
                                id="showHtml"
                                name="displayOption"
                                onClick={() => setShowHtml(true)}
                            />
                            <label htmlFor="hideHtml">No</label>
                            <input
                                type="radio"
                                id="hideHtml"
                                name="displayOption"
                                onClick={() => setShowHtml(false)}
                                defaultChecked
                            />
                        </div>
                    </div>
                </div>
                <HighlightSearchWrapper
                    searchString={searchString}
                    setTriggerSearch={setTriggerSearch}
                    onMatchData={setMatchData}
                >
                    {showHtml ? (
                        <>
                            <div className="highlight-nesting-1">
                                {'<div className={"example-of-nesting-1"}>'}
                            </div>
                            <div
                                className={
                                    "example-of-nesting-1 margin-left-25"
                                }
                            >
                                Hello World!
                                <br />
                                <div className="highlight-nesting-2">
                                    {'<div className={"example-of-nesting-2"}>'}
                                </div>
                                <div
                                    className={
                                        "example-of-nesting-2 margin-left-25"
                                    }
                                >
                                    Other text example
                                    <br />
                                    <div className="highlight-nesting-3">
                                        {
                                            '<div className={"example-of-nesting-3"}>'
                                        }
                                    </div>
                                    <div
                                        className={
                                            "example-of-nesting-3 margin-left-25"
                                        }
                                    >
                                        Search Me!
                                        <br />
                                        <div className="highlight-nesting-4 margin-left-25">
                                            {"<ul>"}
                                        </div>
                                        <ul>
                                            <li>
                                                <div className="highlight-nesting-5">
                                                    {"<li>"}
                                                </div>
                                                Search Me..
                                                <div className="highlight-nesting-5">
                                                    {"</li>"}
                                                </div>
                                            </li>
                                            <li>
                                                <div className="highlight-nesting-5">
                                                    {"<li>"}
                                                </div>
                                                Search Me Again!{" "}
                                                <div className="highlight-nesting-6">
                                                    {"<span>"}
                                                </div>
                                                <span>Search Me!</span>
                                                <div className="highlight-nesting-6">
                                                    {"</span>"}
                                                </div>
                                                <div className="highlight-nesting-5">
                                                    {"</li>"}
                                                </div>
                                            </li>
                                            <li>
                                                <div className="highlight-nesting-5">
                                                    {"<li>"}
                                                </div>
                                                Hello World!{" "}
                                                <div className="highlight-nesting-5">
                                                    {"</li>"}
                                                </div>
                                            </li>
                                            <li>
                                                <div className="highlight-nesting-5">
                                                    {"<li>"}
                                                </div>
                                                <div className="margin-left-25">
                                                    <div className="highlight-nesting-6">
                                                        {"<div>"}
                                                    </div>
                                                    <h4
                                                        className={
                                                            "example-h4 margin-left-25"
                                                        }
                                                    >
                                                        <div className="highlight-nesting-7">
                                                            {"<h4>"}
                                                        </div>
                                                        Other text example
                                                        <div className="highlight-nesting-7">
                                                            {"</h4>"}
                                                        </div>
                                                    </h4>
                                                    <div className="highlight-nesting-6">
                                                        {"</div>"}
                                                    </div>
                                                </div>
                                                <div className="highlight-nesting-5">
                                                    {"</li>"}
                                                </div>
                                            </li>
                                        </ul>
                                        <div className="highlight-nesting-4">
                                            {"</ul>"}
                                        </div>
                                    </div>
                                    <div className="highlight-nesting-3">
                                        {"</div>"}
                                    </div>
                                </div>
                                <div className="highlight-nesting-2">
                                    {"</div>"}
                                </div>
                            </div>
                            <div className="highlight-nesting-1">
                                {"</div>"}
                            </div>
                        </>
                    ) : (
                        <div className={"example-of-nesting-1"}>
                            Hello World!
                            <div
                                className={
                                    "example-of-nesting-2 margin-left-25"
                                }
                            >
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
                                            Search Me Again!{" "}
                                            <span>Search Me!</span>
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
                    )}
                </HighlightSearchWrapper>
                <div className="returned-data">
                    <div className="header">Returned Data</div>
                    <div>
                        <div>Wrapper Index: {matchData.wrapperIndex}</div>
                        <div>Matches Found: {matchData.matchesFound}</div>
                        <div>
                            Match Parent Element:
                            {matchData.matchParentElement
                                ? matchData.matchParentElement.toString()
                                : ""}
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

export default memo(ExampleWithSearch);
