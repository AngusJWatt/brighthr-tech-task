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
            { nodeName: 'Public Holiday policy', nodeType: 'pdf', added: new Date(Date.UTC(2016, 11, 6)) },
            { nodeName: 'Expenses', nodeType: 'folder', files: [] },
            { nodeName: 'Cost centres', nodeType: 'csv', added: new Date(2016, 7, 12) },
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
        expect(headings[3]).toHaveTextContent('Open contents');
    });

    it('renders rows with entries that correspond to the columns of the table', () => {
        render(<DirectoryTable {...sharedTestProps} />);
        
        const rows = screen.getAllByRole('row');
        
        expect(rows.length).toBe(4);
        
        const file0Elements = within(rows[1]);
        
        expect(file0Elements.getByRole('rowheader')).toHaveTextContent('Public Holiday policy');
        expect(file0Elements.getAllByRole('cell')[0]).toHaveTextContent('pdf');
        expect(file0Elements.getAllByRole('cell')[1]).toHaveTextContent('06/12/2016');
        
        const folderElements = within(rows[2]);
        
        expect(folderElements.getByRole('rowheader')).toHaveTextContent('Expenses');
        expect(folderElements.getAllByRole('cell')[0]).toHaveTextContent('folder');
        expect(folderElements.getAllByRole('cell')[1]).toHaveTextContent('\u2014');

         const file1Elements = within(rows[3]);
        
        expect(file1Elements.getByRole('rowheader')).toHaveTextContent('Cost centres');
        expect(file1Elements.getAllByRole('cell')[0]).toHaveTextContent('csv');
        expect(file1Elements.getAllByRole('cell')[1]).toHaveTextContent('12/08/2016');
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

    it('sorts names in alphabetical order when the order is not ascending', async () => {
        
        render(<DirectoryTable {...sharedTestProps}/>);
        
        let rows = screen.getAllByRole('row');
        const nameHeader = screen.getByRole('columnheader', { name: 'Name (Click to sort)' });
        const nameButton = screen.getByRole('button', { name: 'Name (Click to sort)' });
        
        expect(nameHeader).toHaveAttribute('aria-sort', 'other');
        expect(within(rows[1]).getByRole('rowheader')).toHaveTextContent('Public Holiday policy');
        expect(within(rows[2]).getByRole('rowheader')).toHaveTextContent('Expenses');
        expect(within(rows[3]).getByRole('rowheader')).toHaveTextContent('Cost centres');
        
        userEvent.click(nameButton);
        
        await waitFor(() => {    
            rows = screen.getAllByRole('row');
            
            expect(within(rows[1]).getByRole('rowheader')).toHaveTextContent('Cost centres');
            expect(within(rows[2]).getByRole('rowheader')).toHaveTextContent('Expenses');
            expect(within(rows[3]).getByRole('rowheader')).toHaveTextContent('Public Holiday policy');
            expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
        });
    });

    it('sorts names in reverse-alphabetical order when the order is ascending', async () => {
        render(<DirectoryTable {...sharedTestProps}/>);
        
        let rows;
        const nameHeader = screen.getByRole('columnheader', { name: 'Name (Click to sort)' });
        const nameButton = screen.getByRole('button', { name: 'Name (Click to sort)' });
        
        userEvent.click(nameButton);
        
        await waitFor(() => {
            expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
        });

        userEvent.click(nameButton);
        
        await waitFor(() => {
            rows = screen.getAllByRole('row');

            expect(within(rows[1]).getByRole('rowheader')).toHaveTextContent('Public Holiday policy');
            expect(within(rows[2]).getByRole('rowheader')).toHaveTextContent('Expenses');
            expect(within(rows[3]).getByRole('rowheader')).toHaveTextContent('Cost centres');
            expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
        });
    });

    it('sorts dates in chronological order when the order is not ascending', async () => {
        render(<DirectoryTable {...sharedTestProps}/>);

        let rows = screen.getAllByRole('row');
        const dateHeader = screen.getByRole('columnheader', { name: 'Date added (Click to sort)' });
        const dateButton = screen.getByRole('button', { name: 'Date added (Click to sort)' });
        
        expect(dateHeader).toHaveAttribute('aria-sort', 'other');
        expect(within(rows[1]).getAllByRole('cell')[1]).toHaveTextContent('06/12/2016');
        expect(within(rows[2]).getAllByRole('cell')[1]).toHaveTextContent('\u2014');
        expect(within(rows[3]).getAllByRole('cell')[1]).toHaveTextContent('12/08/2016');

        userEvent.click(dateButton);

        await waitFor(() => {
            rows = screen.getAllByRole('row');

            expect(within(rows[1]).getAllByRole('cell')[1]).toHaveTextContent('12/08/2016');
            expect(within(rows[2]).getAllByRole('cell')[1]).toHaveTextContent('06/12/2016');
            expect(within(rows[3]).getAllByRole('cell')[1]).toHaveTextContent('\u2014');
            expect(dateHeader).toHaveAttribute('aria-sort', 'ascending');
        });
    });

    it.todo('sorts dates in reverse-chronological order when the order ascending');

    it.todo('marks one column as unsorted when another has been sorted');
});
