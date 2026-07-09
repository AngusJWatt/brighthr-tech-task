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
            { name: 'Public Holiday policy', type: 'pdf', added: '2016-12-06' },
            { name: 'Expenses', type: 'folder', files: [] },
            { name: 'Cost centres', type: 'csv', added: '2016-08-12' }
        ],
        filePath: ['dir0', 'dir1'],
        openFile: jest.fn(),
        openDirectory: jest.fn(),
        filterRegex: new RegExp("")
    };

    it('renders a table with a caption, and headings for name, type, creation date, and a clickable link', () => {
        render(<DirectoryTable {...sharedTestProps} />);
        
        expect(screen.getByRole('caption')).toHaveTextContent('Test heading');
        
        const headings = screen.getAllByRole('columnheader');
        
        expect(headings.length).toBe(4);
        expect(headings[0]).toHaveTextContent('Name');
        expect(headings[1]).toHaveTextContent('Type');
        expect(headings[2]).toHaveTextContent('Date added');
        expect(headings[3]).toHaveTextContent('Link');
    });

    it('renders rows with entries that correspond to the columns of the table', () => {
        render(<DirectoryTable {...sharedTestProps} />);
        
        const rows = screen.getAllByRole('row');
        
        expect(rows.length).toBe(4);
        
        const file0Elements = within(rows[1]);
        
        expect(file0Elements.getByRole('rowheader')).toHaveTextContent('Public Holiday policy');
        expect(file0Elements.getAllByRole('cell')[0]).toHaveTextContent('pdf');
        expect(file0Elements.getAllByRole('cell')[1]).toHaveTextContent('2016-12-06');
        expect(file0Elements.getAllByRole('cell')[2]).toHaveTextContent('\u2014');
        
        const folderElements = within(rows[2]);
        
        expect(folderElements.getByRole('rowheader')).toHaveTextContent('Expenses');
        expect(folderElements.getAllByRole('cell')[0]).toHaveTextContent('folder');
        expect(folderElements.getAllByRole('cell')[1]).toHaveTextContent('\u2014');
        expect(within(folderElements.getAllByRole('cell')[2]).getByRole('button', { name: 'Open' }));

        const file1Elements = within(rows[3]);
        
        expect(file1Elements.getByRole('rowheader')).toHaveTextContent('Cost centres');
        expect(file1Elements.getAllByRole('cell')[0]).toHaveTextContent('csv');
        expect(file1Elements.getAllByRole('cell')[1]).toHaveTextContent('2016-08-12');
        expect(file0Elements.getAllByRole('cell')[2]).toHaveTextContent('\u2014');
    });

    it('runs a callback when a directory has been clicked with the updated filepath', () => {
        const mockOpenDirectory = jest.fn();
        render(<DirectoryTable {...sharedTestProps} openDirectory={mockOpenDirectory} />);
        
        const directoryButton = within(screen.getAllByRole('row')[2]).getByRole('button');
        
        expect(mockOpenDirectory).not.toHaveBeenCalled();
        
        directoryButton.click();
        
        expect(mockOpenDirectory).toHaveBeenCalledWith(['dir0', 'dir1', 'Expenses']);
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
            expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');

            rows = screen.getAllByRole('row');
            
            expect(within(rows[1]).getByRole('rowheader')).toHaveTextContent('Cost centres');
            expect(within(rows[2]).getByRole('rowheader')).toHaveTextContent('Expenses');
            expect(within(rows[3]).getByRole('rowheader')).toHaveTextContent('Public Holiday policy');
        });
    });

    it('sorts names in reverse-alphabetical order when the order is ascending', async () => {
        render(<DirectoryTable {...sharedTestProps}/>);

        const nameHeader = screen.getByRole('columnheader', { name: 'Name (Click to sort)' });
        const nameButton = screen.getByRole('button', { name: 'Name (Click to sort)' });
        
        userEvent.click(nameButton);
        
        await waitFor(() => {
            expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
        });

        userEvent.click(nameButton);
        
        await waitFor(() => {
            expect(nameHeader).toHaveAttribute('aria-sort', 'descending');

            const rows = screen.getAllByRole('row');

            expect(within(rows[1]).getByRole('rowheader')).toHaveTextContent('Public Holiday policy');
            expect(within(rows[2]).getByRole('rowheader')).toHaveTextContent('Expenses');
            expect(within(rows[3]).getByRole('rowheader')).toHaveTextContent('Cost centres');
        });
    });

    it('sorts dates in chronological order when the order is not ascending', async () => {
        render(<DirectoryTable {...sharedTestProps}/>);

        let rows = screen.getAllByRole('row');
        const dateHeader = screen.getByRole('columnheader', { name: 'Date added (Click to sort)' });
        const dateButton = screen.getByRole('button', { name: 'Date added (Click to sort)' });

        expect(within(rows[1]).getAllByRole('cell')[1]).toHaveTextContent('2016-12-06');
        expect(within(rows[2]).getAllByRole('cell')[1]).toHaveTextContent('\u2014');
        expect(within(rows[3]).getAllByRole('cell')[1]).toHaveTextContent('2016-08-12');

        userEvent.click(dateButton);

        await waitFor(() => {
            expect(dateHeader).toHaveAttribute('aria-sort', 'ascending');

            const rows = screen.getAllByRole('row');

            expect(within(rows[1]).getAllByRole('cell')[1]).toHaveTextContent('2016-08-12');
            expect(within(rows[2]).getAllByRole('cell')[1]).toHaveTextContent('2016-12-06');
            expect(within(rows[3]).getAllByRole('cell')[1]).toHaveTextContent('\u2014');
        });
    });

    it('sorts dates in reverse-chronological order when the order ascending', async () => {
        render(<DirectoryTable {...sharedTestProps}/>);

        const dateHeader = screen.getByRole('columnheader', { name: 'Date added (Click to sort)' });
        const dateButton = screen.getByRole('button', { name: 'Date added (Click to sort)' });

        userEvent.click(dateButton);

        await waitFor(() => {
            expect(dateHeader).toHaveAttribute('aria-sort', 'ascending');
        });

        userEvent.click(dateButton);

        await waitFor(() => {
            expect(dateHeader).toHaveAttribute('aria-sort', 'descending');

            const rows = screen.getAllByRole('row');

            expect(within(rows[1]).getAllByRole('cell')[1]).toHaveTextContent('2016-12-06');
            expect(within(rows[2]).getAllByRole('cell')[1]).toHaveTextContent('2016-08-12');
            expect(within(rows[3]).getAllByRole('cell')[1]).toHaveTextContent('\u2014');
        });
    });

    it('marks one column as unsorted when another has been sorted', async () => {
        render(<DirectoryTable {...sharedTestProps}/>);

        const nameHeader = screen.getByRole('columnheader', { name: 'Name (Click to sort)' });
        const nameButton = screen.getByRole('button', { name: 'Name (Click to sort)' });
        const dateHeader = screen.getByRole('columnheader', { name: 'Date added (Click to sort)' });
        const dateButton = screen.getByRole('button', { name: 'Date added (Click to sort)' });

        expect(nameHeader).toHaveAttribute('aria-sort', 'other');
        expect(dateHeader).toHaveAttribute('aria-sort', 'other');

        userEvent.click(nameButton);

        await waitFor(() => {
            expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
            expect(dateHeader).toHaveAttribute('aria-sort', 'other');
        });

        userEvent.click(dateButton);

        await waitFor(() => {
            expect(nameHeader).toHaveAttribute('aria-sort', 'other');
            expect(dateHeader).toHaveAttribute('aria-sort', 'ascending');
        });

        userEvent.click(nameButton);

        await waitFor(() => {
            expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
            expect(dateHeader).toHaveAttribute('aria-sort', 'other');
        });
    });

    it('filters filenodes according to filterRegex', () => {
        render(<DirectoryTable {...sharedTestProps} filterRegex={new RegExp("Public Holiday policy\.pdf")}/>);
        
        const rows = screen.getAllByRole('row');
        
        expect(rows.length).toBe(2);
        expect(within(rows[1]).getByRole('rowheader')).toHaveTextContent('Public Holiday policy');
    });

    it('respects order of names when applying a regex', async () => {
        const { rerender } = render(
            <DirectoryTable {...sharedTestProps} filterRegex={new RegExp("")}/>
        );
        const nameButton = screen.getByRole('button', { name: 'Name (Click to sort)' });
        const nameHeader = screen.getByRole('columnheader', { name: 'Name (Click to sort)' });


        userEvent.click(nameButton);

        await waitFor(() => {
            expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
        });

        /* Both "Expenses" and "Cost centres" share the substring "en", and would be out-of-order on rendering without
         * any name-ordering applying. */
        rerender(
            <DirectoryTable {...sharedTestProps} filterRegex={new RegExp("en")}/>
        );

        const rows = screen.getAllByRole('row');

        expect(within(rows[1]).getByRole('rowheader')).toHaveTextContent('Cost centres');
        expect(within(rows[2]).getByRole('rowheader')).toHaveTextContent('Expenses');
    });

    it('respects order of dates when applying a regex', async () => {
        const { rerender } = render(
            <DirectoryTable {...sharedTestProps} filterRegex={new RegExp("")}/>
        );
        const dateButton = screen.getByRole('button', { name: 'Name (Click to sort)' });
        const dateHeader = screen.getByRole('columnheader', { name: 'Name (Click to sort)' });


        userEvent.click(dateButton);

        await waitFor(() => {
            expect(dateHeader).toHaveAttribute('aria-sort', 'ascending');
        });

        /* Both "Public Holiday policy" and "Cost centres" share the substring "o", and would be out-of-order on
         * rendering without any date-ordering applied. */
        rerender(
            <DirectoryTable {...sharedTestProps} filterRegex={new RegExp("o")}/>
        );

        const rows = screen.getAllByRole('row');

        expect(within(rows[1]).getAllByRole('cell')[1]).toHaveTextContent('2016-08-12');
        expect(within(rows[2]).getAllByRole('cell')[1]).toHaveTextContent('2016-12-06');
    });
});
