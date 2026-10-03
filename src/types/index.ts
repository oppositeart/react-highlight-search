export type SearchStringType = string | string[];

export type MatchNodeDataType = {
    index: number;
    node: ChildNode;
    startPos: number;
    endPos: number;
};

export type MatchNodeCombinedDataType = {
    node: ChildNode;
    positionsArr: { startPos: number; endPos: number }[];
};

export type MatchDataControllerType = ({
    index,
    node,
    startPos,
    endPos,
}: MatchNodeDataType) => void;

export type ChangedNodeObjectType = {
    newNodes: ChildNode[];
    oldNode: ChildNode;
    originText: string;
};

export type OnMatchDataPropsType = {
    wrapperIndex: number;
    matchesFound: number;
    // Highlight spans added to the DOM, or null when nothing matched
    spanElements: HTMLSpanElement[] | null;
};

export type OnMatchDataType = (matchData: OnMatchDataPropsType) => void;
