import React, { useState, useEffect } from 'react';

enum SortOrdering { Ascending = 'ascending', Descending = 'descending', Other = 'other' };

type File = { nodeName: string; nodeType: string; added: Date; };
type Directory = { nodeName: string; nodeType: string; files: (File | Directory)[]; added?: Date; };
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
        const fullName = nodeType === 'folder' ? nodeName : `${nodeName}.${nodeType}`;
        return filterRegex.test(fullName); 
    });
};

export const DirectoryTable = ({ caption, files, filterRegex, filePath, openDirectory }: DirectoryTableProps) => {
    const [nodesList, setNodesList] = useState(filterNodes(files, filterRegex));
    const [nameSort, setNameSort] = useState(SortOrdering.Other);
    const [dateSort, setDateSort] = useState(SortOrdering.Other);
    const sortNames = () => {
        if (nameSort !== SortOrdering.Ascending) {
            setNodesList(prevList => prevList.sort((nodeA, nodeB) => nodeA.nodeName.localeCompare(nodeB.nodeName)));
            setNameSort(SortOrdering.Ascending);
        } else {
            setNodesList(prevList => prevList.sort((nodeA, nodeB) => nodeB.nodeName.localeCompare(nodeA.nodeName)));
            setNameSort(SortOrdering.Descending);
        }
        setDateSort(SortOrdering.Other);
    };
    const sortDates = () => {
        /* Always put a filenode with a date above one without, but otherwise leave the order preserved. */
        if (dateSort !== SortOrdering.Ascending) {
            setNodesList(prevList => prevList.sort(
                (nodeA, nodeB) => (nodeA.added?.getTime() || Infinity) - (nodeB.added?.getTime() || Infinity) || 0
            ));
            setDateSort(SortOrdering.Ascending);
        } else {
            setNodesList(prevList => prevList.sort(
                (nodeA, nodeB) => (nodeB.added?.getTime() || -Infinity) - (nodeA.added?.getTime() || -Infinity) || 0
            ));
            setDateSort(SortOrdering.Descending);
        }
        setNameSort(SortOrdering.Other);
    };

    useEffect(() => {
        /* Cannot rely on previous state of nodesList, in case there is a subtraction applied to the regex, which means
         * applying a regex to a list with pertinent results already filtered out. Instead, take the files from props
         * and apply the regex to them, then sort them by the order the user set. */
        const filterFiles = filterNodes(files, filterRegex);
        /* TODO: Refactor sorting function to their own methods so they can be reused rather than
         * duplicated/inverted. */
        if (nameSort !== SortOrdering.Other) {
            if (nameSort === SortOrdering.Ascending) {
                filterFiles.sort((nodeA, nodeB) => nodeA.nodeName.localeCompare(nodeB.nodeName));
            } else {
                filterFiles.sort((nodeA, nodeB) => nodeB.nodeName.localeCompare(nodeA.nodeName));
            }
        } else if (dateSort !== SortOrdering.Other) {
            if (dateSort === SortOrdering.Ascending) {
                filterFiles.sort(
                    (nodeA, nodeB) => (nodeA.added?.getTime() || Infinity) - (nodeB.added?.getTime() || Infinity) || 0
                );
            } else {
                filterFiles.sort(
                    (nodeA, nodeB) => (nodeB.added?.getTime() || -Infinity) - (nodeA.added?.getTime() || -Infinity) || 0
                );
            }
        }
        setNodesList(filterFiles);
    }, [files, filterRegex]);

    return (
        <table>
            <caption>{caption}</caption>
            <thead>
                <tr>
                    <th scope="col" aria-sort={nameSort}>
                        <button onClick={sortNames}>Name (Click to sort)</button>
                    </th>
                    <th scope="col">Type</th>
                    <th scope="col" aria-sort={dateSort}>
                        <button onClick={sortDates}>Date added (Click to sort)</button>
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
