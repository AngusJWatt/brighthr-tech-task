import { render, screen, waitFor, within, cleanup } from '@testing-library/react';
import * as getFilesModule from './functions/getFiles';

import App from './App';
import { FileNode } from './types';
import userEvent from '@testing-library/user-event';

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
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBe(3);
      expect(within(rows[1]).getByRole('rowheader')).toHaveTextContent('Christmas party');
      expect(within(rows[2]).getByRole('rowheader')).toHaveTextContent('Greetings');
    });
  });

  it('renders the table and current path corresponding to a directory when its button is clicked', async () => {
    jest.spyOn(getFilesModule, 'getFiles').mockImplementation((): Promise<FileNode[]> => 
      Promise.resolve([
        { type: 'folder', name: 'Greetings', files: [
          { type: 'mov', name: 'Welcome to the company!', added: '2015-04-24' }
        ]}
      ])
    );
    render(<App />);
    let cwdList = screen.getByTestId('cwd-list');
    let rows: HTMLElement[] = [];

    expect(cwdList).toHaveTextContent('HOME');

    await waitFor(() => {
      cwdList = screen.getByTestId('cwd-list');
      rows = screen.getAllByRole('row');

      expect(within(rows[1]).getByRole('rowheader')).toHaveTextContent('Greetings');
    });

    userEvent.click(within(rows[1]).getByRole('button'));

    await waitFor(() => {
      cwdList = screen.getByTestId('cwd-list');
      rows = screen.getAllByRole('row');

      expect(cwdList).toHaveTextContent('HOME / Greetings');
      expect(within(rows[1]).getByRole('rowheader')).toHaveTextContent('Welcome to the company!');
    });

    userEvent.click(within(cwdList).getByRole('button'));

    await waitFor(() => {
      cwdList = screen.getByTestId('cwd-list');
      rows = screen.getAllByRole('row');

      expect(cwdList).toHaveTextContent('HOME');
      expect(within(rows[1]).getByRole('rowheader')).toHaveTextContent('Greetings');
    });
  });

  it.todo('clears the search bar after clicking a new directory link, ');

  it.todo('shows a message to the user when a directory is empty');

  it.todo('renders an error when there is a problem fetching contents');
});
