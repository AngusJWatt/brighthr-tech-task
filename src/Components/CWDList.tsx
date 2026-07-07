import React from 'react';

type CWDProps = {
    currentWorkingDirectory: string[];
};

export const CWDList = ({ currentWorkingDirectory }: CWDProps) => (
    <>
        {currentWorkingDirectory.reduce(
            (acc, val) => (<>{acc} / <span>{val}</span></>), 
            <span>HOME</span>
        )}
    </>
);