import React, { useState, useEffect } from 'react';

enum SortOrdering { Ascending = 'ascending', Descending = 'descending', Other = 'other' };

type File = { nodeName: string; nodeType: string; added: Date; };
type Directory = { nodeName: string; nodeType: string; files: (File | Directory)[]; added?: undefined; };
type FileNode = File | Directory;
type DirectoryTableProps = {
    caption: string;
    files: FileNode[];
    filterRegex: RegExp;
    filePath: string[];
    openDirectory: (filePath: string[]) => void;
};

const filterNodes = (nodeList: FileNode[], filterRegex: RegExp):FileNode[] => {
    return nodeList.filter(({ nodeName, nodeType }) => {
        const fullName: string = nodeType === 'folder' ? nodeName : `${nodeName}.${nodeType}`;
        return filterRegex.test(fullName); 
    });
};
const sortNames = (nodeArray: FileNode[], shouldInvert: boolean) => {
    const signedFactor = shouldInvert ? -1 : 1;
    return nodeArray.sort((nodeA, nodeB) => signedFactor * nodeA.nodeName.localeCompare(nodeB.nodeName));
};
const sortDates = (nodeArray: FileNode[], shouldInvert: boolean) => {
    const signedFactor = shouldInvert ? -1 : 1;
    return nodeArray.sort((nodeA, nodeB) => {
        /* Value of signedFactor * Infinity keeps nodes without added dates at the bottom. Can be switched to 
         * signedFactor * -Infinity if they should be at the top, or else removed entirely if this behaviour is
         * undesirable. */
        const nodeATime = nodeA.added?.getTime() || signedFactor * Infinity;
        const nodeBTime = nodeB.added?.getTime() || signedFactor * Infinity;
        return signedFactor * (nodeATime - nodeBTime || 0);
    });
};

export const DirectoryTable = ({ caption, files, filterRegex, filePath, openDirectory }: DirectoryTableProps) => {
    const [nodesList, setNodesList] = useState(filterNodes(files, filterRegex));
    const [nameSort, setNameSort] = useState(SortOrdering.Other);
    const [dateSort, setDateSort] = useState(SortOrdering.Other);
    const updateNames = () => {
        const shouldBecomeDescending = nameSort === SortOrdering.Ascending;
        setNodesList(prevList => sortNames(prevList, shouldBecomeDescending));
        setNameSort(shouldBecomeDescending ? SortOrdering.Descending : SortOrdering.Ascending);
        setDateSort(SortOrdering.Other);
    };
    const updateDates = () => {
        /* Always put a filenode with a date above one without, but otherwise leave the order preserved. */
        const shouldBecomeDescending = dateSort === SortOrdering.Ascending;
        setNodesList(prevList => sortDates(prevList, shouldBecomeDescending));
        setDateSort(shouldBecomeDescending ? SortOrdering.Descending : SortOrdering.Ascending);
        setNameSort(SortOrdering.Other);
    };

    useEffect(() => {
        /* Cannot rely on previous state of nodesList, in case there is a subtraction applied to the regex, which means
         * applying a regex to a list with pertinent results already filtered out. Instead, take the files from props
         * and apply the regex to them, then sort them by the order the user set. */
        const filteredFiles = filterNodes(files, filterRegex);
        if (nameSort !== SortOrdering.Other) {
            sortNames(filteredFiles, nameSort === SortOrdering.Descending);
        }
        if (dateSort !== SortOrdering.Other) {
            sortDates(filteredFiles, dateSort === SortOrdering.Descending);
        }
        setNodesList(filteredFiles);
    }, [files, filterRegex]);

    return (
        <table>
            <caption>{caption}</caption>
            <thead>
                <tr>
                    <th scope="col" aria-sort={nameSort}>
                        <button onClick={updateNames}>Name (Click to sort)</button>
                    </th>
                    <th scope="col">Type</th>
                    <th scope="col" aria-sort={dateSort}>
                        <button onClick={updateDates}>Date added (Click to sort)</button>
                    </th>
                    <th scope="col">Link</th>
                </tr>
            </thead>
            <tbody aria-live="polite">
                {nodesList.map(({ nodeName, nodeType, added }) => (
                    /* nodeName.nodeType should be a unique value for a key, as any two files in the same directory
                     * sharing the same name and extension should be forbidden in any UNIX-like system */
                    <tr key={`${nodeName}.${nodeType}`}>
                        <th scope="row">{nodeName}</th>
                        <td>{nodeType}</td>
                        <td>{added?.toLocaleDateString("en-GB") || (<span aria-hidden="true">&mdash;</span>)}</td>
                        <td>{nodeType === 'folder'
                            ? (<button onClick={() => {openDirectory([...filePath, nodeName])}}>Open</button>)
                            : (<span aria-hidden="true">&mdash;</span>)
                        }</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
};
