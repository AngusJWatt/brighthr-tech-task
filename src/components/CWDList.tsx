const ROOT_STRING = 'HOME';

type CWDListProps = {
    currentWorkingDirectory: string[];
    setCurrentWorkingDirectory: (updatedWorkingDirectory: string[]) => void;
};

export const CWDList = ({ currentWorkingDirectory, setCurrentWorkingDirectory }: CWDListProps) => (
    <p data-testid="cwd-list">
        {currentWorkingDirectory.length > 0 ?
        currentWorkingDirectory.reduce(
            (acc, val, ind) => {
                const isLink = ind < currentWorkingDirectory.length - 1;
                const Wrapper = isLink ? 'button' : 'span';
                const linkProps = isLink
                    ? { onClick: () => setCurrentWorkingDirectory(currentWorkingDirectory.slice(0, ind + 1)) }
                    : {};
                return (<>{acc}&nbsp;/&nbsp;<Wrapper {...linkProps}>{val}</Wrapper></>)
            }, 
            <button onClick={() => setCurrentWorkingDirectory([])}>{ROOT_STRING}</button>
        ) : ROOT_STRING }
    </p>
);
