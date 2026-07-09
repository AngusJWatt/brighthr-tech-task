import React, { useState, useEffect, useRef } from 'react';

import { CWDList } from './components/CWDList';
import { SearchAndTable } from './components/SearchAndTable';
import { getFiles } from './functions/getFiles';
import type { Directory, FileNode } from './types';

function App() {
  const allFiles = useRef([] as FileNode[]);
  const [cwdFilePath, setCWDFilePath] = useState([] as string[]);
  const [cwdFiles, setCWDFiles] = useState([] as FileNode[]);

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
        <CWDList currentWorkingDirectory={cwdFilePath} setCurrentWorkingDirectory={setCWDFilePath} />
        <SearchAndTable tableCaption="" filePath={[]} files={cwdFiles} openDirectory={setCWDFilePath}/>
      </section>
    </div>
  );
}

export default App;
