
# React-Highlight-Search

React Highlight Search is an *out-of-the-box solution for deep text search* through the DOM tree. It provides a lightweight and fast ReactJS component *(19.8 kB, reduced to 6.9 kB gzip)*, built with Vanilla JS and featuring zero dependencies.

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

[Live Demo](https://oppositeart.github.io/react-highlight-search/?path=/docs/example-deep-search-example--docs)

Implementing deep search through a nested DOM is incredibly simple with the react-highlight-search package.

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
              Hello World!
              <div className={"example-of-nesting-2}>
                  Other text example
                  <div className={"example-of-nesting-3}>
                      Search Me!
                      <ul>
                          <li>Search Me..</li>
                          <li>
                              Search Me Again!
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
| setTriggerSearch  | No | Function | undefined | The function to trigger search manually.
| searchMinLength  | No | number | 1 | The minimum length of text required to start the search.
| onMatchData  | No | Function | undefined | Callback function triggered on a successful search.
| spanClassName  | No | string | "hlsearch-span-el" | Class name applied to the <span> elements added to the DOM for highlighting text.
| index  | No | number | 0 | Index value returned in the onMatchData callback. Useful for managing multiple components.

# License

MIT Licensed. Copyright (c) Vladyslav Dotsenko 2025.

_________