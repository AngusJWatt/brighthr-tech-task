import { render, screen, cleanup, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event';

import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
    beforeEach(() => {
        cleanup();
    });

    afterAll(() => {
        cleanup();
    });

    it('takes input from the user which is used to generate a regex for filtering files', async () => {
        const setRegex = jest.fn();
        render(<SearchBar setRegex={setRegex}/>);
        const input = screen.getByRole('textbox');

        userEvent.type(input, 'Hello');

        await waitFor(() => {
            expect(input).toHaveValue('Hello');
            expect(setRegex).toHaveBeenCalledWith(/^(Hello)/i);
        });
    });

    it('escapes regex special characters to prevent accidental regex behaviour', async () => {
        const setRegex = jest.fn();
        render(<SearchBar setRegex={setRegex}/>);
        const input = screen.getByRole('textbox');

        userEvent.type(input, 'Me + Pepper (my dog).jpg');

        await waitFor(() => {
            expect(input).toHaveValue('Me + Pepper (my dog).jpg');
            expect(setRegex).toHaveBeenCalledWith(/^(Me \+ Pepper \(my dog\)\.jpg)/i);
        });
    });

    it('removes the contents of the search bar and clears the regex when the cancel button is clicked', async () => {
        const setRegex = jest.fn();
        render(<SearchBar setRegex={setRegex}/>);
        const input = screen.getByRole('textbox');
        const closeButton = screen.getByRole('button', { name: 'Remove filter' });

        userEvent.type(input, 'Hello');

        await waitFor(() => {
            expect(setRegex).toHaveBeenCalledWith(/^(Hello)/i);
            
        });
        
        userEvent.click(closeButton);

        await waitFor(() => {
            expect(input).toHaveValue('');
            expect(setRegex).toHaveBeenCalledWith(/^()/i);
        });
    });
});
