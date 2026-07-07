import { render, screen, cleanup } from '@testing-library/react'
import { CWDList } from "./CWDList";

describe('CWDList', () => {
    beforeEach(() => {
        cleanup();
    });

    afterAll(() => {
        cleanup();
    })

    it('renders a corresponding series of directories when provided with a current working directory list', () => {
        render(<CWDList currentWorkingDirectory={['dir0', 'dir1']} setCurrentWorkingDirectory={jest.fn()} />);
        const cwdList = screen.getByTestId('cwd-list');
        expect(cwdList).toHaveTextContent('HOME / dir0 / dir1');
        ;
    });

    it('renders only HOME when the list of directories is empty', () => {
        render(<CWDList currentWorkingDirectory={[]} setCurrentWorkingDirectory={jest.fn()} />);
        const cwdList = screen.getByTestId('cwd-list');
        expect(cwdList).toHaveTextContent('HOME');
        expect(cwdList).not.toHaveTextContent('HOME /');
    });

    it('renders all except the last directory as a clickable link', () => {
        render(<CWDList currentWorkingDirectory={['dir0', 'dir1']} setCurrentWorkingDirectory={jest.fn()} />);
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBe(2);
        expect(buttons[0]).toHaveTextContent('HOME');
        expect(buttons[1]).toHaveTextContent('dir0');
    });

    it('runs a callback with a new corresponding working directory list when a link is pressed', () => {
        const mockSetCurrentWorkingDirectory = jest.fn();
        render(<CWDList 
            currentWorkingDirectory={['dir0', 'dir1']}
            setCurrentWorkingDirectory={mockSetCurrentWorkingDirectory}
        />);
        const [homeButton, dir0Button] = screen.getAllByRole('button');
        expect(mockSetCurrentWorkingDirectory).not.toHaveBeenCalled();
        homeButton.click();
        expect(mockSetCurrentWorkingDirectory).toHaveBeenCalledTimes(1);
        expect(mockSetCurrentWorkingDirectory).toHaveBeenCalledWith([]);
        dir0Button.click();
        expect(mockSetCurrentWorkingDirectory).toHaveBeenCalledTimes(2);
        expect(mockSetCurrentWorkingDirectory).toHaveBeenCalledWith(['dir0']);
    });
});