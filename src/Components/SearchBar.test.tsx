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
            expect(setRegex).toHaveBeenCalledWith(/^(Hello)/i);
        });
    });

    it.todo('escapes regex special characters to prevent accidental regex behaviour');

    it.todo('removes the contents of the search bar and clers the regex when the cancel button is clicked');
});