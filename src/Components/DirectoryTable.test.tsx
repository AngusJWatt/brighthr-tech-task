import { render, screen, within, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DirectoryTable } from "./DirectoryTable";

describe('DirectoryTable', () => {
    beforeEach(() => {
        cleanup();
    });

    afterAll(() => {
        cleanup();
    });

    const sharedTestProps = { 
        caption: 'Test heading',
        files: [
            { nodeName: 'Public Holiday policy', nodeType: 'pdf', added: '2016-12-06' },
            { nodeName: 'Expenses', nodeType: 'folder', files: [] }
        ],
        filePath: ['dir0', 'dir1'],
        openFile: jest.fn(),
        openDirectory: jest.fn()
    };

    it('renders a table with a caption, and headings for name, type, creation date, and a clickable link', () => {
        render(<DirectoryTable {...sharedTestProps} />);
        expect(screen.getByRole('caption')).toHaveTextContent('Test heading');
        const headings = screen.getAllByRole('columnheader');
        expect(headings.length).toBe(4);
        expect(headings[0]).toHaveTextContent('Name');
        expect(headings[1]).toHaveTextContent('Type');
        expect(headings[2]).toHaveTextContent('Date added');
        expect(headings[3]).toHaveTextContent('Click to open');
    });

    it('renders rows with entries that correspond to the columns of the table', () => {
        render(<DirectoryTable {...sharedTestProps} />);
        const rows = screen.getAllByRole('row');
        expect(rows.length).toBe(3);
        const fileElements = within(rows[1]);
        expect(fileElements.getByRole('rowheader')).toHaveTextContent('Public Holiday policy');
        expect(fileElements.getAllByRole('cell')[0]).toHaveTextContent('pdf');
        expect(fileElements.getAllByRole('cell')[1]).toHaveTextContent('2016-12-06');
        const folderElements = within(rows[2]);
        expect(folderElements.getByRole('rowheader')).toHaveTextContent('Expenses');
        expect(folderElements.getAllByRole('cell')[0]).toHaveTextContent('folder');
        expect(folderElements.getAllByRole('cell')[1]).toHaveTextContent('\u2014');
    });

    it('runs a callback when a directory has been clicked with the updated filepath', () => {
        const mockOpenDirectory = jest.fn();
        render(<DirectoryTable {...sharedTestProps} openDirectory={mockOpenDirectory} />);
        const directoryButton = within(screen.getAllByRole('row')[2]).getByRole('button');
        expect(mockOpenDirectory).not.toHaveBeenCalled();
        directoryButton.click();
        expect(mockOpenDirectory).toHaveBeenCalledWith(['dir0', 'dir1', 'Expenses']);
    });

    it('runs a callback when a file has been clicked with the filepath to open the file contents', () => {
        const mockOpenFile = jest.fn();
        render(<DirectoryTable {...sharedTestProps} openFile={mockOpenFile} />);
        const fileButton = within(screen.getAllByRole('row')[1]).getByRole('button');
        expect(mockOpenFile).not.toHaveBeenCalled();
        fileButton.click();
        expect(mockOpenFile).toHaveBeenCalledWith(['dir0', 'dir1', 'Public Holiday policy.pdf']);
    });

    it('sorts names in alphabetical order when the order is unsorted or reversed', async () => {
        render(<DirectoryTable {...sharedTestProps}/>);
        let rows = screen.getAllByRole('row');
        const nameButton = screen.getByRole('button', { name: 'Name' });
        expect(within(rows[1]).getByRole('rowheader')).toHaveTextContent('Public Holiday policy');
        expect(within(rows[2]).getByRole('rowheader')).toHaveTextContent('Expenses');
        userEvent.click(nameButton);
        await waitFor(() => {
            rows = screen.getAllByRole('row');
            expect(within(rows[1]).getByRole('rowheader')).toHaveTextContent('Expenses');
            expect(within(rows[2]).getByRole('rowheader')).toHaveTextContent('Public Holiday policy');
        });
    });

    it('sorts names in reverse-alphabetical order when the order is sorted', async () => {
        let rows;
        render(<DirectoryTable {...sharedTestProps}/>);
        const nameButton = screen.getByRole('button', { name: 'Name' });
        userEvent.click(nameButton);
        await waitFor(() => {
            rows = screen.getAllByRole('row');
            expect(within(rows[1]).getByRole('rowheader')).toHaveTextContent('Expenses');
            expect(within(rows[2]).getByRole('rowheader')).toHaveTextContent('Public Holiday policy');
        });
        userEvent.click(nameButton);
        await waitFor(() => {
            rows = screen.getAllByRole('row');
            expect(within(rows[1]).getByRole('rowheader')).toHaveTextContent('Public Holiday policy');
            expect(within(rows[2]).getByRole('rowheader')).toHaveTextContent('Expenses');
        });
    });

    it.todo('sorts dates in chronological order when the order is unsorted or reversed');

    it.todo('sorts dates in reverse-chronological order when the order is sorted');

    it.todo('marks one column as unsorted when another has been sorted');
});
