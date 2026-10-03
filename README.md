# React Highlight Search

Highlight search matches anywhere inside your React components.

[![npm version](https://img.shields.io/npm/v/react-highlight-search.svg)](https://www.npmjs.com/package/react-highlight-search)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-highlight-search)](https://bundlephobia.com/package/react-highlight-search)
[![license](https://img.shields.io/npm/l/react-highlight-search.svg)](https://github.com/oppositeart/react-highlight-search/blob/main/LICENSE)

Wrap any markup in `HighlightSearchWrapper`, pass a search string, and every match is highlighted, however deeply it is nested.

**[Live demo](https://oppositeart.github.io/react-highlight-search/?path=/docs/example-deep-search-example--docs)** · [Multi-term demo](https://oppositeart.github.io/react-highlight-search/?path=/docs/example-multi-term-search-example--docs) · [Component playground](https://oppositeart.github.io/react-highlight-search/?path=/docs/example-highlightsearchwrapper--docs)

## Features

- **Deep search**: finds text at any nesting level, even when a match crosses element boundaries, e.g. `Hello <b>World</b>`
- **Multiple terms**: highlight several words at once with `searchString={["foo", "bar"]}`
- **Literal matching**: characters like `.`, `(` or `$` are searched as plain text
- **Case-insensitive by default**, with an option to match case
- **Stays in sync**: highlights update automatically when the wrapped content re-renders
- **Access to the highlights**: get the match count and the highlight `<span>` elements, e.g. to scroll to a match
- **Small**: about 4 kB minified (under 2 kB gzipped), zero dependencies, TypeScript types included
- Works with React 16.14 and newer

## Installation

```bash
npm install react-highlight-search
# or
yarn add react-highlight-search
# or
pnpm add react-highlight-search
```

## Quick start

```jsx
import React, { useState } from "react";
import { HighlightSearchWrapper } from "react-highlight-search";

const App = () => {
    const [searchString, setSearchString] = useState("");
    const [matchData, setMatchData] = useState(null);

    return (
        <>
            <input
                value={searchString}
                onChange={e => setSearchString(e.target.value)}
                placeholder="Search..."
            />
            <p>Matches found: {matchData?.matchesFound ?? 0}</p>

            <HighlightSearchWrapper
                searchString={searchString}
                onMatchData={setMatchData}
            >
                <div>
                    Hello World!
                    <ul>
                        <li>Search Me..</li>
                        <li>
                            Search Me Again! <span>Search Me!</span>
                        </li>
                    </ul>
                </div>
            </HighlightSearchWrapper>
        </>
    );
};
```

Every match is wrapped in a `<span class="hlsearch-span-el">`. The package ships a default style for this class (a light blue background). See [Custom highlight style](#custom-highlight-style) to change it.

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `searchString` | `string \| string[]` | (required) | Text to search for. Pass an array to highlight several terms. |
| `children` | `ReactElement` | (required) | Content to search in. |
| `onMatchData` | `(data: OnMatchDataPropsType) => void` | | Called after every search. See [Match data](#match-data). |
| `ignoreCase` | `boolean` | `true` | Ignore letter case when matching. |
| `searchMinLength` | `number` | `1` | Minimum length of a term before it is searched. With several terms, it applies to each term. |
| `spanClassName` | `string` | `"hlsearch-span-el"` | Class name of the highlight `<span>` elements. |
| `index` | `number` | `0` | Returned as `wrapperIndex` in `onMatchData`. Useful with several wrappers on one page. |
| `setTriggerSearch` | `React.Dispatch` | | A state setter that receives a function for running a search manually. See [Running a search manually](#running-a-search-manually). |

## Match data

`onMatchData` receives an object with:

| Field | Type | Description |
| --- | --- | --- |
| `wrapperIndex` | `number` | The `index` prop of the wrapper. |
| `matchesFound` | `number` | Number of matches. |
| `spanElements` | `HTMLSpanElement[] \| null` | The highlight `<span>` elements in document order, or `null` when nothing matched. |

A match that crosses element boundaries is split into one span per text node, so `spanElements` can be longer than `matchesFound`.

The package exports the types `OnMatchDataPropsType` (the object above) and `SearchStringType` (`string | string[]`):

```ts
import type {
    OnMatchDataPropsType,
    SearchStringType,
} from "react-highlight-search";
```

## Recipes

### Multi-term search

```jsx
<HighlightSearchWrapper searchString={["Hello", "Search"]}>
    {content}
</HighlightSearchWrapper>
```

Each term is matched on its own and `matchesFound` is the total for all terms. Duplicate terms are ignored, and when two terms start at the same place, the longer one wins (`"cats"` over `"cat"`). A new array with the same terms on every render does not restart the search, so an inline array is fine.

### Custom highlight style

Override the default class in your CSS:

```css
.hlsearch-span-el {
    background-color: #ffe066;
}
```

or use your own class:

```jsx
<HighlightSearchWrapper searchString={searchString} spanClassName="my-highlight">
    {content}
</HighlightSearchWrapper>
```

### Previous / next match

Match navigation is not built in, but it takes a few lines with `spanElements`:

```jsx
const [matchData, setMatchData] = useState(null);
const [current, setCurrent] = useState(0);

const goTo = step => {
    const spans = matchData?.spanElements;
    if (!spans) return;

    const next = (current + step + spans.length) % spans.length;
    setCurrent(next);
    spans[next].scrollIntoView({ block: "center", behavior: "smooth" });
};

<button onClick={() => goTo(-1)}>Prev</button>
<button onClick={() => goTo(1)}>Next</button>
```

The spans are regular DOM elements, so you can also style the current one or reach its parents with `span.parentElement` or `span.closest(...)`. The [live demo](https://oppositeart.github.io/react-highlight-search/?path=/docs/example-deep-search-example--docs) shows a complete version.

### Several wrappers on one page

Give each wrapper an `index` to tell their results apart:

```jsx
const [results, setResults] = useState({});

const handleMatchData = data =>
    setResults(prev => ({ ...prev, [data.wrapperIndex]: data.matchesFound }));

<HighlightSearchWrapper index={0} searchString={searchString} onMatchData={handleMatchData}>
    {sidebar}
</HighlightSearchWrapper>
<HighlightSearchWrapper index={1} searchString={searchString} onMatchData={handleMatchData}>
    {article}
</HighlightSearchWrapper>
```

### Running a search manually

The search runs automatically when `searchString` or the options change, and again when the wrapped content changes. If you still need to run it yourself, pass a state setter to `setTriggerSearch`. The wrapper stores a search function in it:

```jsx
const [triggerSearch, setTriggerSearch] = useState();

<HighlightSearchWrapper searchString={searchString} setTriggerSearch={setTriggerSearch}>
    {content}
</HighlightSearchWrapper>

// Later, for example in an event handler:
triggerSearch?.("Search Me");
```

## Migrating from 1.x

- **`matchParentElement` was removed** from the `onMatchData` data. Use `spanElements` instead. To get an ancestor element, use `spanElements?.[0]?.closest(...)`.
- **Search strings are matched literally.** Characters like `.`, `*` or `(` used to act as regular expression syntax; now they are plain text. If you relied on regular expressions, change your search strings.
- **No manual re-trigger needed.** The search re-runs on its own when the wrapped content or the options change, so calls to `setTriggerSearch` that only refreshed the highlights can be removed.

## License

[MIT](https://github.com/oppositeart/react-highlight-search/blob/main/LICENSE) © Vladyslav Dotsenko
