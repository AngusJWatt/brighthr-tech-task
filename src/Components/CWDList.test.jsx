import { render, screen } from '@testing-library/react'
import { CWDList } from "./CWDList";

describe('CWDList', () => {
    it('renders a corresponding series of directories when provided with a current working directory list', () => {
        render(<CWDList currentWorkingDirectory={['dir0', 'dir1']}/>);
        expect(screen.getByText('HOME / dir0 / dir1'));
    });
});