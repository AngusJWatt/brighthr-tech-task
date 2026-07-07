import { render, screen, cleanup } from '@testing-library/react'
import { CWDList } from "./CWDList";

describe('CWDList', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders a corresponding series of directories when provided with a current working directory list', () => {
        render(<CWDList currentWorkingDirectory={['dir0', 'dir1']} />);
        const cwdList = screen.getByTestId('cwd-list');
        expect(cwdList).toHaveTextContent('HOME / dir0 / dir1');
        ;
    });

    it('renders only HOME when the list of directories is empty', () => {
        render(<CWDList currentWorkingDirectory={[]} />);
        const cwdList = screen.getByTestId('cwd-list');
        expect(cwdList).toHaveTextContent('HOME');
        expect(cwdList).not.toHaveTextContent('HOME /');
    });

    it.todo('renders all except the last directory as a clickable link');

    it.todo('runs a callback with a new corresponding working directory list when a link is pressed');
});