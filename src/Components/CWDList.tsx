import React from 'react';

type CWDProps = {
    currentWorkingDirectory: string[];
};

export const CWDList = ({ currentWorkingDirectory }: CWDProps) => (
    <p>
        {currentWorkingDirectory.reduce(
            (acc, val) => (<>{acc}&nbsp;/&nbsp;<span>{val}</span></>), 
            <span>HOME</span>
        )}
    </p>
);