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
    parentNode: ParentNode | null;
};

export type SetMatchDataType = (
    componentIndex: number,
    count: number,
    sectionElement: HTMLDivElement | null
) => void;
