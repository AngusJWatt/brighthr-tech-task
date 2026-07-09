import React, { useState } from 'react';

import { SearchBar } from "./SearchBar";
import { DirectoryTable } from "./DirectoryTable";
import type { FileNode } from '../types';

type SearchAndTableProps = {
    tableCaption: string;
    files:FileNode[];
    filePath: string[];
    openDirectory: (filePath: string[]) => void;
};

export const SearchAndTable = ({ tableCaption, files, filePath, openDirectory }: SearchAndTableProps) => {
    const [filterRegex, setFilterRegex] = useState(/^()/i);

    return (
        <>
            <SearchBar setRegex={setFilterRegex} />
            <DirectoryTable caption={tableCaption} filterRegex={filterRegex} files={files} filePath={filePath} openDirectory={openDirectory} />
        </>
    );
};