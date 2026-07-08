import React, { useState } from 'react';

type SearchBarProps = { setRegex: (regex: RegExp) => void; };

export const SearchBar = ({ setRegex }: SearchBarProps) => {
    const [inputText, setInputText] = useState('');
    const handleChange = (event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        const { value } = event.target;
        /* Opted to have case-insensitive searches, can be removed. */
        setRegex(new RegExp(`^(${value.replace(/([\*\.\+\*\?\^\$\(\)\[\]\{\}\|\\])/g, "\\$1")})`, "i"));
        setInputText(value);
    };
    const removeFilter = () => {
        setRegex(/^()/i);
        setInputText('');
    };

    return (
        <form role="search">
            <label htmlFor="search-bar">Search file name</label>
            <input id="search-bar" type="text" value={inputText} onChange={handleChange}/>
            <input type="button" value="Remove filter" onClick={removeFilter} />
        </form>
    );
};
