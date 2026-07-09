import { render, screen, waitFor, cleanup } from '@testing-library/react';
import * as getFilesModule from './functions/getFiles';

import App from './App';
import { FileNode } from './types';

describe('App', () => {
  beforeEach(() => {
        cleanup();
    });

    afterAll(() => {
        jest.restoreAllMocks();
        cleanup();
    });

  it('fetches data from the mocked API and populates the table with its first layer of files', async () => {
    jest.spyOn(getFilesModule, 'getFiles').mockImplementation((): Promise<FileNode[]> => 
      Promise.resolve([
        { type: 'doc', name: 'Christmas party', added: '2017-12-02' },
        { type: 'folder', name: 'Greetings', files: [
          { type: 'mov', name: 'Welcome to the company!', added: '2015-04-24' }
        ]}
      ])
    );
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByRole('row').length).toBe(3);
    });
  });

  it.todo('renders the table corresponding to a directory when its button is clicked');

  it.todo('clears the search bar after clicking a new directory link, ');

  it.todo('shows a message to the user when a directory is empty');

  it.todo('renders an error when there is a problem fetching contents');
});
