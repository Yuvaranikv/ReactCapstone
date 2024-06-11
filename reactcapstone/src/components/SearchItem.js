import React, { useEffect } from 'react';

const SearchItem = ({ userId, search, setSearch, fetchSearchResults }) => {
  useEffect(() => {
    if (userId && search) {
      fetchSearchResults(userId, search);
    }
  }, [userId, search, fetchSearchResults]);

  return (
    <form className='searchForm' onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="search">Search</label>
      {/* <input
        id='search'
        type="text"
        role='searchbox'
        placeholder='Search Items'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      /> */}
    </form>
  );
};

export default SearchItem;
