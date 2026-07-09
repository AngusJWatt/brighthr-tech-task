import { render, screen, waitFor, within, cleanup } from '@testing-library/react';
import * as getFilesModule from './functions/getFiles';
import * as DirectoryTableModule from './components/DirectoryTable';

import App from './App';
import { FileNode } from './types';
import userEvent from '@testing-library/user-event';

describe('App', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
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

    expect(cwdList).toHaveTextContent('Current directory: HOME');

    await waitFor(() => {
      cwdList = screen.getByTestId('cwd-list');
      rows = screen.getAllByRole('row');

      expect(within(rows[1]).getByRole('rowheader')).toHaveTextContent('Greetings');
    });

    userEvent.click(within(rows[1]).getByRole('button'));

    await waitFor(() => {
      cwdList = screen.getByTestId('cwd-list');
      rows = screen.getAllByRole('row');

      expect(cwdList).toHaveTextContent('Current directory: HOME / Greetings');
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

  it('filters results in the Directory table to reflect the input into the SearchBar', async () => {
    jest.spyOn(getFilesModule, 'getFiles').mockImplementation((): Promise<FileNode[]> => 
      Promise.resolve([
        { name: 'Public Holiday policy', type: 'pdf', added: '2016-12-06' },
        { name: 'Expenses', type: 'folder', files: [] },
        { name: 'Cost centres', type: 'csv', added: '2016-08-12' }
      ])
    );
    render(<App />);
    const input = screen.getByRole('textbox');
    let rows: HTMLElement[] = [];
    
    await waitFor(() => {
      rows = screen.getAllByRole('row');

      expect(rows.length).toBe(4);
    });

    userEvent.type(input, 'C');

    await waitFor(() => {
      let rows = screen.getAllByRole('row');

      expect(rows.length).toBe(2);
      expect(within(rows[1]).getByRole('rowheader')).toHaveTextContent('Cost centres');
    });
  });

  it('escapes regex special characters to prevent accidental regex behaviour', async () => {
    const mockDirectoryTable = jest.fn()
    jest.spyOn(DirectoryTableModule, 'DirectoryTable').mockImplementation(
      (props): any => mockDirectoryTable(props)
    );
    jest.spyOn(getFilesModule, 'getFiles').mockImplementation((): Promise<FileNode[]> => Promise.resolve([]));

    render(<App />);

    const input = screen.getByRole('textbox');

    userEvent.type(input, 'Me + Pepper (my dog).jpg');

    await waitFor(() => {
      expect(input).toHaveValue('Me + Pepper (my dog).jpg');
      expect(mockDirectoryTable).toHaveBeenCalledWith(
        expect.objectContaining({ filterRegex: /^(Me \+ Pepper \(my dog\)\.jpg)/i })
      );
    });
  });

  it('clears the search bar after clicking a new directory link', async () => {
    jest.spyOn(getFilesModule, 'getFiles').mockImplementation((): Promise<FileNode[]> => 
      Promise.resolve([
        { name: 'Public Holiday policy', type: 'pdf', added: '2016-12-06' },
        { name: 'Expenses', type: 'folder', files: [{ name: 'Cost centres', type: 'csv', added: '2016-08-12' }] }
      ])
    );
    render(<App />);

    const searchBar = screen.getByRole('textbox');
    let rows: HTMLElement[] = [];

    await waitFor(() => {
      rows = screen.getAllByRole('row');

      expect(rows.length).toBe(3);
    });

    userEvent.type(searchBar, 'Expenses');

    await waitFor(() => {
      rows = screen.getAllByRole('row');

      expect(searchBar).toHaveValue('Expenses');
      expect(within(rows[1]).getByRole('rowheader')).toHaveTextContent('Expenses');
    });

    const expensesLink = within(rows[1]).getByRole('button');
    userEvent.click(expensesLink);

    await waitFor(() => {
      rows = screen.getAllByRole('row');

      expect(searchBar).toHaveValue('');
      expect(within(rows[1]).getByRole('rowheader')).toHaveTextContent('Cost centres');
    });
  });

  it.todo('shows a message to the user when a directory is empty');

  it.todo('renders an error when there is a problem fetching contents');
});
