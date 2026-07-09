import { render, screen, cleanup } from '@testing-library/react'
import { CWDList } from "./CWDList";

describe('CWDList', () => {
    beforeEach(() => {
        cleanup();
    });

    afterAll(() => {
        cleanup();
    });

    it('renders a corresponding series of directories when provided with a current working directory list', () => {
        render(<CWDList 
            currentWorkingDirectory={['dir0', 'dir1']}
            onDirectoryLinkClick={jest.fn()}
            rootName="HOME"
            labelText="CWD:"
        />);
        const cwdList = screen.getByTestId('cwd-list');
        expect(cwdList).toHaveTextContent('HOME / dir0 / dir1');
        ;
    });

    it('renders only rootName when the list of directories is empty', () => {
        render(<CWDList
            currentWorkingDirectory={[]}
            onDirectoryLinkClick={jest.fn()}
            rootName="HOME"
            labelText="CWD:"
        />);
        const cwdList = screen.getByTestId('cwd-list');
        expect(cwdList).toHaveTextContent('CWD: HOME');
        expect(cwdList).not.toHaveTextContent('CWD: HOME /');
    });

    it('renders all except the last directory as a clickable link', () => {
        render(<CWDList
            currentWorkingDirectory={['dir0', 'dir1']}
            onDirectoryLinkClick={jest.fn()}
            rootName="HOME"
            labelText="CWD:"
        />);
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBe(2);
        expect(buttons[0]).toHaveTextContent('HOME');
        expect(buttons[1]).toHaveTextContent('dir0');
    });

    it('runs a callback with a new corresponding working directory list when a link is pressed', () => {
        const mockOnDirectoryLinkClick = jest.fn();
        render(<CWDList
            labelText="CWD:"
            rootName="HOME"
            currentWorkingDirectory={['dir0', 'dir1']}
            onDirectoryLinkClick={mockOnDirectoryLinkClick}
        />);
        const [homeButton, dir0Button] = screen.getAllByRole('button');
        expect(mockOnDirectoryLinkClick).not.toHaveBeenCalled();
        homeButton.click();
        expect(mockOnDirectoryLinkClick).toHaveBeenCalledTimes(1);
        expect(mockOnDirectoryLinkClick).toHaveBeenCalledWith([]);
        dir0Button.click();
        expect(mockOnDirectoryLinkClick).toHaveBeenCalledTimes(2);
        expect(mockOnDirectoryLinkClick).toHaveBeenCalledWith(['dir0']);
    });
});
