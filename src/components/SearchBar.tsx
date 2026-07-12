type SearchBarProps = {
    searchText: string;
    onInputValueChange: (inputText: string) => void;
};

export const SearchBar = ({ searchText, onInputValueChange }: SearchBarProps) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>): void => {
        const { value } = event.target;
        onInputValueChange(value);
    };

    return (
        <form role="search">
            <label htmlFor="search-bar">Search file name</label>
            <input id="search-bar" type="text" value={searchText} onChange={handleChange}/>
            <input type="button" value="Remove filter" onClick={() => onInputValueChange('')} />
        </form>
    );
};
