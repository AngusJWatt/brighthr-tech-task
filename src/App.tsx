import React, { useState, useEffect, useRef } from 'react';

import { CWDList } from './components/CWDList';
import { SearchBar } from './components/SearchBar';
import { DirectoryTable } from './components/DirectoryTable';
import { getFiles } from './functions/getFiles';
import type { Directory, FileNode } from './types';

function App() {
  const allFiles = useRef([] as FileNode[]);
  const [cwdFilePath, setCWDFilePath] = useState([] as string[]);
  const [cwdFiles, setCWDFiles] = useState([] as FileNode[]);
  const [filterRegex, setFilterRegex] = useState(/^()/i);
  const onInputValue = (inputText: string) => {
      /* Opted to have case-insensitive searches, can be removed. */
      setFilterRegex(new RegExp(`^(${inputText.replace(/([\*\.\+\*\?\^\$\(\)\[\]\{\}\|\\])/g, "\\$1")})`, "i"));
  };

  useEffect(() => {
    getFiles().then(files => {
      allFiles.current = files;
      setCWDFiles(files);
    }).catch(e => console.error(e));
  }, []);

  useEffect(() => {
    const updatedDirContents = cwdFilePath.reduce((acc, val) => {
      const dirIndex = acc.findIndex(filenode => filenode.type === 'folder' && filenode.name === val)
      return (acc[dirIndex] as Directory).files;
    }, allFiles.current)
    setCWDFiles(updatedDirContents);
  }, [cwdFilePath]);

  return (
    <div className="App">
      <h1>Angi Watt's BrightHR File Reader</h1>
      <section>
        <CWDList labelText="Current directory:" rootName="HOME"  currentWorkingDirectory={cwdFilePath} setCurrentWorkingDirectory={setCWDFilePath} />
        <SearchBar onInputValue={onInputValue} />
        <DirectoryTable
          caption="List of matching files"
          filterRegex={filterRegex}
          files={cwdFiles}
          filePath={cwdFilePath}
          openDirectory={setCWDFilePath}
        />
      </section>
    </div>
  );
}

export default App;
