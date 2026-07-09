import React, { useState } from 'react';

type SearchBarProps = { onInputValue: (inputValue: string) => void; };

export const SearchBar = ({ onInputValue }: SearchBarProps) => {
    const [inputText, setInputText] = useState('');
    const handleChange = (event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        const { value } = event.target;
        onInputValue(value);
        setInputText(value);
    };
    const removeFilter = () => {
        onInputValue('');
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
