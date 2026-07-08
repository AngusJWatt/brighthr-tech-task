import React, { useState } from 'react';

enum ListOrdering { Ascending = 'ascending', Descending = 'descending', Other = 'other' };

type File = { nodeName: string; nodeType: string; added: string; };
type Directory = { 
    nodeName: string;
    nodeType: string;
    files: (File | Directory)[];
    added?: string;
};
type FileNode = File | Directory;
type DirectoryTableProps = {
    caption: string;
    files: FileNode[];
    filePath: string[];
    openFile: (filePath: string[]) => void;
    openDirectory: (filePath: string[]) => void;
};

export const DirectoryTable = ({ caption, files, filePath, openFile, openDirectory }: DirectoryTableProps) => {
    const [nodesList, setNodesList] = useState(files);
    const [nameSort, setNameSort] = useState(ListOrdering.Other);
    const sortNames = () => {
        if (nameSort === ListOrdering.Other || nameSort === ListOrdering.Descending) {
            setNodesList(prevList => prevList.sort((nodeA, nodeB) => nodeA.nodeName.localeCompare(nodeB.nodeName)));
            setNameSort(ListOrdering.Ascending);
        } else {
            setNodesList(prevList => prevList.sort((nodeA, nodeB) => nodeB.nodeName.localeCompare(nodeA.nodeName)));
            setNameSort(ListOrdering.Descending);
        }
    };

    return (
        <table>
            <caption>{caption}</caption>
            <thead>
                <tr>
                    <th scope="col" aria-sorted={nameSort}><button onClick={sortNames}>Name</button></th>
                    <th scope="col">Type</th>
                    <th scope="col">Date added</th>
                    <th scope="col">Click to open</th>
                </tr>
            </thead>
            <tbody aria-live="polite">
                {nodesList.map(({ nodeName, nodeType, added }) => {
                    const onClick = () => nodeType === 'folder'
                        ? openDirectory([...filePath, nodeName])
                        : openFile([...filePath, `${nodeName}.${nodeType}`]);
                    return (
                    /* nodeName.nodeType should be a unique value for a key, as any two files in the same directory
                     * sharing the same name should be forbidden in any UNIX-like system */
                        <tr key={`${nodeName}.${nodeType}`}>
                            <th scope="row">{nodeName}</th>
                            <td>{nodeType}</td>
                            <td>{added || '\u2014'}</td>
                            <td><button onClick={onClick}>Open</button></td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
};
