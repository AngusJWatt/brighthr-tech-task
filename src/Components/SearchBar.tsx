import React, { useState } from 'react';

type SearchBarProps = { setRegex: (regex: RegExp) => void; };

export const SearchBar = ({ setRegex }: SearchBarProps) => {
    const [inputText, setInputText] = useState('');
    const handleChange = (event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        const { value } = event.target;
        /* Opted to have case-insensitive searches, can be removed. */
        setRegex(new RegExp(`^(${value})`, "i"));
        setInputText(value);
    };

    return (
        <form role="search">
            <label htmlFor="search-bar">Search file name</label>
            <input id="search-bar" type="text" value={inputText} onChange={handleChange}/>
        </form>
    );
};
