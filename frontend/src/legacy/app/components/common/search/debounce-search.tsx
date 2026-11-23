import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import React from 'react';
import { Search, SearchIconWrapper, StyledInputBase } from './search-clear';

interface ISearchClearProps {
  placeholder?: string;
  searchText: string;
  setSearchText: (value: string) => void;
  height?: string;
}

export default function SearchText({
  placeholder,
  height,
  searchText,
  setSearchText,
}: ISearchClearProps) {
  const handleClearSearch = () => {
    setSearchText('');
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  return (
    <Search
      sx={{
        height: height ? height : 'initial',
        width: 'calc(30 * var(--np-rem))',
        borderRadius: 'calc(0.6 * var(--np-rem))',
      }}
    >
      <SearchIconWrapper>
        <MagnifyingGlassIcon
          size={14}
          weight="bold"
          color="#23232D"
          opacity={'40%'}
        />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder={placeholder ?? 'Search...'}
        value={searchText}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'search' }}
        endAdornment={
          searchText.length > 0 && (
            <h6
              style={{
                color: '#3F4FDA',
                fontWeight: 700,
                cursor: 'pointer',
                marginRight: 'calc(1 * var(--np-rem))',
              }}
              onClick={() => {
                handleClearSearch();
                setSearchText('');
              }}
            >
              Clear
            </h6>
          )
        }
      />
    </Search>
  );
}
