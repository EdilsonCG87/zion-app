function SearchBar({ search, setSearch }) {
return (
<div className="search-container">

<span className="search-icon">
        🔍
</span>

<input
        type="text"
        placeholder="Buscar canción..."
        className="search-input"
        value={search}
        onChange={(e) =>
setSearch(e.target.value)
        }
/>

</div>
);
}

export default SearchBar;