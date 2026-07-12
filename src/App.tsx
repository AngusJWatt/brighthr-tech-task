import React, { useState, useEffect, useRef } from 'react';

import { CWDList } from './components/CWDList';
import { SearchBar } from './components/SearchBar';
import { DirectoryTable } from './components/DirectoryTable';
import { getFiles } from './functions/getFiles';
import type { Directory, FileNode } from './types';

const App = () => {
  const allFiles = useRef<FileNode[]>([]);
  const [cwdFilePath, setCWDFilePath] = useState<string[]>([]);
  const [cwdFiles, setCWDFiles] = useState<FileNode[]>([]);
  const [filterRegex, setFilterRegex] = useState(/^()/i);
  const [searchText, setSearchText] = useState('');
  const [errorText, setErrorText] = useState('');
  const [emptyMessage, setEmptyMessage] = useState('Fetching files, please wait.');
  const onInputValueChange = (inputText: string): void => {
      setSearchText(inputText);
      /* Opted to have case-insensitive searches, can be removed. */
      setFilterRegex(new RegExp(`^(${inputText.replace(/([\*\.\+\*\?\^\$\(\)\[\]\{\}\|\\])/g, "\\$1")})`, "i"));
  };
  const handleDirectoryLinkClick = (updatedFilepath: string[]) => {
    setCWDFilePath(updatedFilepath);
    /* Removes filtering after a link has been clicked, so that filtering is not applied over multiple links. */
    setFilterRegex(/^()/i);
    setSearchText('');
  };

  useEffect(() => {
    getFiles().then(files => {
      allFiles.current = files;
      setCWDFiles(files);
      setEmptyMessage('There are no files in this directory.')
    }).catch(err => {
      setErrorText(err.message)
      setEmptyMessage('Unable to show files.')
    });
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
        {errorText && <div role="alert">{errorText}</div>}
        <CWDList
          labelText="Current directory:"
          rootName="HOME"
          currentWorkingDirectory={cwdFilePath}
          onDirectoryLinkClick={handleDirectoryLinkClick} />
        <SearchBar searchText={searchText} onInputValueChange={onInputValueChange} />
        <DirectoryTable
          caption="List of matching files"
          filterRegex={filterRegex}
          files={cwdFiles}
          filePath={cwdFilePath}
          onDirectoryLinkClick={handleDirectoryLinkClick}
          emptyMessage={emptyMessage}
        />
      </section>
    </div>
  );
}

export default App;
