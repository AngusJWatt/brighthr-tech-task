import React, { useState, useEffect } from 'react';

import { SearchAndTable } from './components/SearchAndTable';
import { getFiles } from './functions/getFiles';
import type { FileNode } from './types';

function App() {
  const [cwdFiles, setCWDFiles] = useState([] as FileNode[]);

  useEffect(() => {
    getFiles().then(files => {
      setCWDFiles(files);
    }).catch(e => console.error(e));
  }, []);

  return (
    <div className="App">
      <h1>Angi Watt's BrightHR File Reader</h1>
      <section>
        <SearchAndTable tableCaption="" filePath={[]} files={cwdFiles} openDirectory={() => {}}/>
      </section>
    </div>
  );
}

export default App;
