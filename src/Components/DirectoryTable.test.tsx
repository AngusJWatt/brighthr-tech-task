import { render, screen, within, cleanup } from '@testing-library/react'
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
        ]
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

    it.todo('runs a callback when a directory has been clicked with the updated filepath');

    it.todo('runs a callback when a file has been clicked to open the file contents');

    it.todo('sorts names in alphabetical order when the order is unsorted or reversed');

    it.todo('sorts names in reverse-alphabetical order when the order is sorted');

    it.todo('sorts dates in chronological in ical order when the order is unsorted or reversed');

    it.todo('sorts dates in reverse-chronological order when the order is sorted');

    it.todo('marks one column as unsorted when another has been sorted');
})