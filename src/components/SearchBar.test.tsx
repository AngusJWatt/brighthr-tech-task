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

    it('takes input from the user which is passed into a callback for filtering files', async () => {
        const onInputValue = jest.fn();
        render(<SearchBar onInputValue={onInputValue} />);
        const input = screen.getByRole('textbox');

        userEvent.type(input, 'Hello');

        await waitFor(() => {
            expect(input).toHaveValue('Hello');
            expect(onInputValue).toHaveBeenCalledWith('Hello');
        });
    });

    it('removes the contents of the search bar and clears the regex when the cancel button is clicked', async () => {
        const onInputValue = jest.fn();
        render(<SearchBar onInputValue={onInputValue}/>);
        const input = screen.getByRole('textbox');
        const closeButton = screen.getByRole('button', { name: 'Remove filter' });

        userEvent.type(input, 'Hello');

        await waitFor(() => {
            expect(onInputValue).toHaveBeenCalledWith('Hello');
            
        });
        
        userEvent.click(closeButton);

        await waitFor(() => {
            expect(input).toHaveValue('');
            expect(onInputValue).toHaveBeenCalledWith('');
        });
    });
});
