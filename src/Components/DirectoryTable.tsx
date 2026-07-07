import React from 'react';

type FileProps = { nodeName: string; nodeType: string; added: string; };
type DirectoryProps = { 
    nodeName: string;
    nodeType: string;
    added?: string;
    files: (FileProps | DirectoryProps)[]
};
type NodeProps = FileProps | DirectoryProps;
type DirectoryTableProps = { caption: string; files: NodeProps[] };

const DirectoryTableRow = ({ nodeName, nodeType, added }: NodeProps) => {
    return (
        <tr>
            <th scope="row">{nodeName}</th>
            <td>{nodeType}</td>
            <td>{added || '\u2014'}</td>
            <td><button>Open</button></td>
        </tr>
    );
};

export const DirectoryTable = ({ caption, files }: DirectoryTableProps) => {
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
                {files.map(({ nodeName, nodeType, ...pathNode}) => (
                    /* nodeName.nodeType should be a unique value for a key, as any two files in the same directory
                     * sharing the same name should be forbidden in any UNIX-like system */
                    <DirectoryTableRow
                        nodeName={nodeName} nodeType={nodeType} {...pathNode} key={`${nodeName}.${nodeType}`}
                    />
                ))}
            </tbody>
        </table>
    )
};