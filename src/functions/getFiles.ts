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
    const response = await fetch('filepaths.json');
    /* To test the effect of a response error, set this to if (response.ok) */
    if (!response.ok) {
        throw new Error('Unable to fetch files, URL response not OK. Please try again later.');
    }
    let files = [];
    try {
        /* To test the effect of a formatting error, throw an error here. */
        throw new Error();
        files = await response.json();
    } catch (_) {
        throw new Error('Unable to open files, response not correctly formatted. Please contact your administrator.');
    }
    return formatFiles(files) as FileNode[];
};
