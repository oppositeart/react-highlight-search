
# React-Highlight-Search

React Highlight Search is a lightweight and fast ReactJS component *(15.5 kB > 5.7 kB gzip)*, built with Vanilla JS and featuring 0 dependencies, designed for deep text search through the DOM tree.

# Installation

The easiest way to install **react-highlight-search** is by using either npm or yarn commands:
```
npm install react-highlight-search
```
or
```
yarn add react-highlight-search
```

# Basic Usage in React App

In the current version, all search text must be at the same nesting level. Refer to the example below.

```
import React, { useState, useCallback } from "react";
import { HighlightSearchWrapper } from "react-highlight-search";

const ExampleWithSearch = () => {
  const [searchString, setSearchString] = useState(""); // Controlled string to search for
  const [matchData, setMatchData] = useState({
    wrapperIndex: 0,
    matchesFound: 0,
    matchParentElement: null,
  }); // Search data returned by the component

  const handleInputChange = useCallback((e) => {
    setSearchString(e.target.value);
  }, []);

  return (
    <>
      <input onInput={handleInputChange} />
      <div>
        <HighlightSearchWrapper
          searchString={searchString} // Pass the search string
          onMatchData={setMatchData} // Pass the function to update search data on a successful search
        >
          <div className={"example-of-nesting-1"}>
            <div className={"example-of-nesting-2"}>
              <div className={"example-of-nesting-3"}>
                <ul>
                  // Search text must be at the same nesting level
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

      // Block shows example of the search result data
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
```

# Props

| Name  | Required | Type | Default | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| searchString  | Yes | string | undefined | The text to search for.
| searchMinLength  | No | number | 1 | The minimum length of text required to start the search.
| onMatchData  | No | Function | undefined | Callback function triggered on a successful search.
| spanClassName  | No | string | "highlightsearch-selected-element" | Class name applied to the <span> elements added to the DOM for highlighting text.
| index  | No | number | 0 | Index value returned in the onMatchData callback. Useful for managing multiple components.

# License

MIT Licensed. Copyright (c) Vladyslav Dotsenko 2024.

_________