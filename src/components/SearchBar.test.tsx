import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event';

import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
    beforeEach(() => {
        cleanup();
    });

    afterAll(() => {
        cleanup();
    });

    it('reflects the value of searchText in the input textbox', async () => {
        const onInputValueChange = jest.fn();
        render(<SearchBar searchText='Hello' onInputValueChange={onInputValueChange} />);
        const input = screen.getByRole('textbox');

        expect(input).toHaveValue('Hello');
    });

    it('takes input from the user which is passed into the callback for filtering files', async () => {
        const onInputValueChange = jest.fn();
        render(<SearchBar searchText='' onInputValueChange={onInputValueChange} />);
        const input = screen.getByRole('textbox');

        fireEvent.change(input, { target: { value: 'Hello' } });
        
        expect(onInputValueChange).toHaveBeenCalledWith('Hello');
    });

    it('passes an empty string into the callback to when the cancel button is clicked', () => {
        const onInputValueChange = jest.fn();
        render(<SearchBar searchText='' onInputValueChange={onInputValueChange} />);
        const closeButton = screen.getByRole('button', { name: 'Remove filter' });

        userEvent.click(closeButton);

        expect(onInputValueChange).toHaveBeenCalledWith('');
    });
});
