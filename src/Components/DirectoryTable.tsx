import React from 'react';

type FileProps = { nodeName: string; nodeType: string; added: string; };
type DirectoryProps = { 
    nodeName: string;
    nodeType: string;
    files: (FileProps | DirectoryProps)[];
    added?: string;
};
type NodeProps = FileProps | DirectoryProps;
type DirectoryTableProps = {
    caption: string;
    files: NodeProps[];
    filePath: string[];
    openFile: (filePath: string[]) => void;
    openDirectory: (filePath: string[]) => void;
};

export const DirectoryTable = ({ caption, files, filePath, openFile, openDirectory }: DirectoryTableProps) => {
    return (
        <table>
            <caption>{caption}</caption>
            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">Date added</th>
                    <th scope="col">Click to open</th>
                </tr>
            </thead>
            <tbody>
                {files.map(({ nodeName, nodeType, added }) => {
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