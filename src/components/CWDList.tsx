const ROOT_STRING = 'HOME';

type CWDListProps = {
    currentWorkingDirectory: string[];
    setCurrentWorkingDirectory: (updatedWorkingDirectory: string[]) => void;
    rootName: string;
    labelText: string;
};

export const CWDList = ({ currentWorkingDirectory, setCurrentWorkingDirectory, rootName, labelText }: CWDListProps) => (
    <p data-testid="cwd-list">
        {labelText}&nbsp;{currentWorkingDirectory.length > 0 ?
        currentWorkingDirectory.reduce(
            (acc, val, ind) => {
                const isLink = ind < currentWorkingDirectory.length - 1;
                const Wrapper = isLink ? 'button' : 'span';
                const linkProps = isLink
                    ? { onClick: () => setCurrentWorkingDirectory(currentWorkingDirectory.slice(0, ind + 1)) }
                    : {};
                return (<>{acc}&nbsp;/&nbsp;<Wrapper {...linkProps}>{val}</Wrapper></>)
            }, 
            <button onClick={() => setCurrentWorkingDirectory([])}>{rootName}</button>
        ) : rootName }
    </p>
);
