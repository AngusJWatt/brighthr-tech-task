import { render, screen, within, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SearchAndTable } from './SearchAndTable';
import * as DirectoryTableModule from './DirectoryTable';

describe('SearchAndTable', () => {
    beforeEach(() => {
        cleanup();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    afterAll(() => {
        cleanup();
    });

    it('filters results in the Directory table to reflect the input into the SearchBar', async () => {
        render(<SearchAndTable tableCaption='Files' openDirectory={jest.fn()} filePath={[]} files={[
            { name: 'Public Holiday policy', type: 'pdf', added: '2016-12-06' },
            { name: 'Expenses', type: 'folder', files: [] },
            { name: 'Cost centres', type: 'csv', added: '2016-08-12' }
        ]} />);
        const input = screen.getByRole('textbox');
        let rows = screen.getAllByRole('row');
        
        expect(rows.length).toBe(4);

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
        render(<SearchAndTable tableCaption='Files' openDirectory={jest.fn()} filePath={[]} files={[]} />);

        const input = screen.getByRole('textbox');

        userEvent.type(input, 'Me + Pepper (my dog).jpg');

        await waitFor(() => {
            expect(input).toHaveValue('Me + Pepper (my dog).jpg');
            expect(mockDirectoryTable).toHaveBeenCalledWith(
                expect.objectContaining({ filterRegex: /^(Me \+ Pepper \(my dog\)\.jpg)/i })
            );
        });
    });
});