import type { Directory, FileNode } from "../types";

const formatFiles = (filenodes: FileNode[]) => 
    filenodes.reduce((acc, val): FileNode[] => {
        /* Determine that the filenode is a JS object, rather than any other data type, otherwise dispose of it */
        if (typeof val !== 'object' || Array.isArray(val)) {
            return acc;
        }
        if (!val.name) {
            return acc;
        }
        if (val.type === 'folder') {
            if (!Array.isArray((val as Directory).files)) {
                return acc;
            }
            return [...acc, { ...val, files: formatFiles((val as Directory).files) } as Directory];
        }
        return [...acc, val];
    }, [] as FileNode[]);

export const getFiles = async (): Promise<FileNode[]> => {
    const response = await fetch('../../public/fetch');
    if (!response.ok) {
        throw new Error('Unable to fetch files');
    }
    let files = [];
    try {
        const data = await response.json();
        files = JSON.parse(data);
    } catch (_) {
        throw new Error('Response not correctly formatted');
    }
    if (!Array.isArray(files)) {
        throw new Error('Response not correctly formatted');
    }
    return formatFiles(files) as FileNode[];
};
