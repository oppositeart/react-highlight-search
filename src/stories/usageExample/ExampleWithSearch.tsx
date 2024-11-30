import React, { useState, useCallback } from "react";
import { HighlightSearchWrapper } from "../../components";
import { OnMatchDataPropsType } from "../../types";

const ExampleWithSearch = () => {
    const defaultValue = "Search Me";

    const [searchString, setSearchString] = useState<string>(defaultValue);
    const [matchData, setMatchData] = useState<OnMatchDataPropsType>({
        wrapperIndex: 0,
        matchesFound: 0,
        matchParentElement: null,
    });

    const handleInputChange = useCallback((e: any) => {
        setSearchString(e.target.value);
    }, []);

    return (
        <>
            <input defaultValue={defaultValue} onInput={handleInputChange} />
            <div>
                <HighlightSearchWrapper
                    searchString={searchString}
                    onMatchData={setMatchData}
                >
                    <div className={"example-of-nesting-1"}>
                        <div className={"example-of-nesting-2"}>
                            <div className={"example-of-nesting-3"}>
                                <ul>
                                    <li>Search Me!</li>
                                    <li>Search Me Again!</li>
                                    <li>Hello World!</li>
                                    <li>Other text example</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </HighlightSearchWrapper>
            </div>
            <div style={{ width: "350px" }}>
                <div>Wrapper Index: {matchData.wrapperIndex}</div>
                <div>Matches Found: {matchData.matchesFound}</div>
                <div>
                    Match Parent Element:
                    {matchData.matchParentElement
                        ? matchData.matchParentElement.toString()
                        : ""}
                </div>
            </div>
        </>
    );
};

export default ExampleWithSearch;
