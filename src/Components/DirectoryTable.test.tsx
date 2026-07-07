import { render, screen, cleanup } from '@testing-library/react'
import { Dir } from 'fs';
import { DirectoryTable } from "./DirectoryTable";

describe('DirectoryTable', () => {
    beforeEach(() => {
        cleanup();
    });

    afterAll(() => {
        cleanup();
    });

    it('renders a table with a caption, and headings for name, type, creation date, and a clickable link', () => {
        render(<DirectoryTable caption="Test heading" />);
        expect(screen.getByRole('caption')).toHaveTextContent('Test heading');
        const headings = screen.getAllByRole('columnheader');
        expect(headings.length).toBe(4);
        expect(headings[0]).toHaveTextContent('Name');
        expect(headings[1]).toHaveTextContent('Type');
        expect(headings[2]).toHaveTextContent('Date');
        expect(headings[3]).toHaveTextContent('Click to open');
    });

    it.todo('renders rows with entries that correspond to the columns of the table');

    it.todo('runs a callback when a directory has been clicked with the updated filepath');

    it.todo('runs a callback when a file has been clicked to open the file contents');

    it.todo('sorts names in alphabetical order when the order is unsorted or reversed');

    it.todo('sorts names in reverse-alphabetical order when the order is sorted');

    it.todo('sorts dates in chronological in ical order when the order is unsorted or reversed');

    it.todo('sorts dates in reverse-chronological order when the order is sorted');

    it.todo('marks one column as unsorted when another has been sorted');
})