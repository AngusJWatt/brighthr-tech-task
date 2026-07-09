const ROOT_STRING = 'HOME';

type CWDListProps = {
    currentWorkingDirectory: string[];
    onDirectoryLinkClick: (updatedFilepath: string[]) => void;
    rootName: string;
    labelText: string;
};

export const CWDList = ({ currentWorkingDirectory, onDirectoryLinkClick, rootName, labelText }: CWDListProps) => (
    <p data-testid="cwd-list">
        {labelText}&nbsp;{currentWorkingDirectory.length > 0 ?
        currentWorkingDirectory.reduce(
            (acc, val, ind) => {
                const isLink = ind < currentWorkingDirectory.length - 1;
                const Wrapper = isLink ? 'button' : 'span';
                const linkProps = isLink
                    ? { onClick: () => onDirectoryLinkClick(currentWorkingDirectory.slice(0, ind + 1)) }
                    : {};
                return (<>{acc}&nbsp;/&nbsp;<Wrapper {...linkProps}>{val}</Wrapper></>)
            }, 
            <button onClick={() => onDirectoryLinkClick([])}>{rootName}</button>
        ) : rootName }
    </p>
);
