import { render, screen } from '@testing-library/react'
import { CWDList } from "./CWDList";

describe('CWDList', () => {
    it('renders a corresponding series of directories when provided with a current working directory list', () => {
        render(<CWDList currentWorkingDirectory={['dir0', 'dir1']} />);
        expect(screen.queryByText('HOME / dir0 / dir1'));
    });

    it.todo('renders only HOME when the list of directories is empty');

    it.todo('renders all except the last directory as a clickable link');

    it.todo('runs a callback with a new corresponding working directory list when a link is pressed');
});