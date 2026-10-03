import {
    ChangedNodeObjectType,
    MatchDataControllerType,
    MatchNodeCombinedDataType,
    MatchNodeDataType,
} from "../types";

// Restores original text instead of highlighted parts
export const restoreOriginNodes = (
    changedNodesObject: ChangedNodeObjectType[] | undefined,
    externallyChangedNodes?: Set<Node>,
) => {
    if (changedNodesObject === undefined) {
        return;
    }

    changedNodesObject.forEach(({ newNodes, oldNode, originText }) => {
        newNodes.forEach(node => {
            node.remove();
        });
        // Text React has written since highlighting is newer, so keep it
        if (!externallyChangedNodes?.has(oldNode)) {
            oldNode.textContent = originText;
        }
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

// Add spans to dom according to node match object.
// The original text node stays in place holding the text after the last match,
// so React can still update, move or remove the node it rendered.
export const addSpans = (
    matchDataArr: MatchNodeCombinedDataType[],
    setOriginNodes: (changedNodesObject: ChangedNodeObjectType[]) => void,
    spanClassName?: string,
) => {
    const changedNodesObject: ChangedNodeObjectType[] = [];

    matchDataArr.forEach(({ node, positionsArr }) => {
        const parentNode = node.parentNode;
        const originText = node.textContent || "";

        const addedNodes: ChildNode[] = [];

        let lastPos = 0;

        positionsArr.forEach(({ startPos, endPos }) => {
            if (startPos === endPos) {
                return;
            }

            const textBefore = originText.slice(lastPos, startPos);

            if (textBefore) {
                const textNode = document.createTextNode(textBefore);
                addedNodes.push(textNode);
                parentNode?.insertBefore(textNode, node);
            }

            const spanNode = document.createElement("span");
            spanClassName && spanNode.classList.add(spanClassName);
            spanNode.appendChild(
                document.createTextNode(originText.slice(startPos, endPos)),
            );
            addedNodes.push(spanNode as ChildNode);
            parentNode?.insertBefore(spanNode, node);

            lastPos = endPos;
        });

        node.textContent = originText.slice(lastPos);

        changedNodesObject.push({
            newNodes: addedNodes,
            oldNode: node,
            originText,
        });
    });

    setOriginNodes(changedNodesObject);
};

// Escape RegExp special characters so the search string is matched literally
export const escapeRegExp = (text: string) =>
    text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Detect nodes that contain given positions to create node map
export const searchAcrossNodes = (
    textNodes: ChildNode[],
    startPosition: number,
    endPosition: number,
    matchDataController: MatchDataControllerType,
) => {
    let nodeStart = 0;

    for (let i = 0; i < textNodes.length; i++) {
        const nodeLength = textNodes[i]?.textContent?.length || 0;
        const nodeEnd = nodeStart + nodeLength;

        // Mark every non-empty node the match overlaps, including middle ones
        if (
            nodeLength &&
            startPosition < nodeEnd &&
            endPosition >= nodeStart
        ) {
            matchDataController({
                index: i,
                node: textNodes[i],
                startPos: Math.max(startPosition - nodeStart, 0),
                endPos: Math.min(endPosition - nodeStart + 1, nodeLength),
            });
        }

        if (endPosition < nodeEnd) {
            break;
        }

        nodeStart = nodeEnd;
    }
};
