import {
    ChangedNodeObjectType,
    MatchDataControllerType,
    MatchNodeCombinedDataType,
    MatchNodeDataType,
} from "../types/helpers";

// Restores original nodes instead of modified ones
export const restoreOriginNodes = (
    changedNodesObject: ChangedNodeObjectType[] | undefined
) => {
    if (changedNodesObject === undefined) {
        return;
    }

    changedNodesObject.forEach(({ newNodes, oldNode, parentNode }) => {
        const nextSibling = newNodes[newNodes.length - 1].nextSibling || null;
        parentNode?.insertBefore(oldNode, nextSibling);
        newNodes.forEach((node) => {
            node.remove();
        });
    });
};

// Helper to fill node match object
export const initMatchData = () => {
    const matchData: MatchNodeCombinedDataType[] = [];

    const matchDataController: MatchDataControllerType = ({
        index,
        node,
        startPos,
        endPos,
    }: MatchNodeDataType) => {
        if (matchData[index]) {
            matchData[index].positionsArr?.push({
                startPos,
                endPos,
            });
        } else {
            matchData[index] = {
                node,
                positionsArr: [{ startPos, endPos }],
            };
        }
    };

    return { matchData, matchDataController };
};

// Add spans to dom according to node match object
export const addSpans = (
    matchDataArr: MatchNodeCombinedDataType[],
    setOriginNodes: (changedNodesObject: ChangedNodeObjectType[]) => void,
    spanClassName?: string
) => {
    const changedNodesObject: ChangedNodeObjectType[] = [];

    matchDataArr.forEach(({ node, positionsArr }) => {
        const parentNode = node.parentNode;
        const nextSibling = node.nextSibling || null;
        const originText = node.textContent;

        const textParts: string[] = [];

        const addedNodes: ChildNode[] = [];

        positionsArr.forEach(({ startPos, endPos }, i) => {
            if (startPos !== endPos) {
                if (i < 1) {
                    textParts.push(originText?.slice(0, startPos) || "");
                }
                textParts.push(originText?.slice(startPos, endPos) || "");
                textParts.push(
                    originText?.slice(
                        endPos,
                        positionsArr[i + 1]?.startPos || originText.length
                    ) || ""
                );
            }
        });

        node.remove();

        textParts.forEach((text, i) => {
            if (text) {
                let textNode = document.createTextNode(text);

                if (i % 2 !== 0) {
                    const spanNode = document.createElement("span");
                    spanClassName && spanNode.classList.add(spanClassName);
                    spanNode.appendChild(textNode);
                    addedNodes.push(spanNode as ChildNode);
                    parentNode?.insertBefore(spanNode, nextSibling);
                } else {
                    addedNodes.push(textNode as ChildNode);
                    parentNode?.insertBefore(textNode, nextSibling);
                }
            }
        });

        changedNodesObject.push({
            newNodes: addedNodes,
            oldNode: node,
            parentNode: parentNode,
        });
    });

    setOriginNodes(changedNodesObject);
};

// Detect nodes that contain given positions to create node map
export const searchAcrossNodes = (
    textNodes: ChildNode[],
    startPosition: number,
    endPosition: number,
    matchDataController: MatchDataControllerType
) => {
    let searchBeginIndex = 0;
    let searchEndIndex = 0;

    let nodeBeginIndex = -1;
    let nodeEndIndex = -1;

    let relativeStartPosition = 0;
    let relativeEndPosition = 0;

    for (let i = 0; i < textNodes.length; i++) {
        searchEndIndex =
            searchBeginIndex + (textNodes[i]?.textContent?.length || 1) - 1;

        if (
            startPosition >= searchBeginIndex &&
            startPosition <= searchEndIndex
        ) {
            nodeBeginIndex = i;
            relativeStartPosition = startPosition - searchBeginIndex;
        }
        if (endPosition >= searchBeginIndex && endPosition <= searchEndIndex) {
            nodeEndIndex = i;
            relativeEndPosition = endPosition - searchBeginIndex + 1;
        }

        if (nodeBeginIndex === i || nodeEndIndex === i) {
            matchDataController({
                index: i,
                node: textNodes[i],
                startPos: nodeBeginIndex === i ? relativeStartPosition : 0,
                endPos:
                    nodeEndIndex === i
                        ? relativeEndPosition
                        : searchEndIndex + 1,
            });
        }

        searchBeginIndex = searchEndIndex + 1;

        if (nodeEndIndex > -1) {
            break;
        }
    }
};
