import type { FileNode } from "../types";

export const getFiles = async (): Promise<FileNode[]> => {
    const response = await fetch('../../public/fetch');
    const data = await response.json();
    return JSON.parse(data) as FileNode[];
};
