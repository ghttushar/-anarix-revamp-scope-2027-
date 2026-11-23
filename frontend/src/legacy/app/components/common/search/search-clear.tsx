import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';
import { getSearchPlaceholder } from '@legacy/utils/advertising.utils';

export const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 'none',
  border: '1px solid #dadceb',
  backgroundColor: '#ffffff',
  height: 'calc(2.5 * var(--np-rem))',
  marginLeft: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  // color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(0.5, 1, 0.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: 'calc(1 * var(--np-rem))',
    fontWeight: 500,
    [theme.breakpoints.up('sm')]: {
      width: 'calc(20 * var(--np-rem))',
    },
  },
}));

interface ISearchClearProps {
  initialRows: any[];
  title: string;
  setUpdatedRows: (data: any[]) => void;
  height?: string;
  width?: string;
  customSearchHandler: (searchText: string) => void;
  setSearchValue?: (searchText: string) => void;
  customStyles?: React.CSSProperties;
  clearSearchEvent?: string;
}

export default function SearchClear({
  initialRows,
  title,
  setUpdatedRows,
  height,
  width,
  setSearchValue,
  customSearchHandler,
  customStyles,
  clearSearchEvent,
}: ISearchClearProps) {
  const [searchText, setSearchText] = useState<string>('');
  const [searchPlaceholder, setSearchPlaceholder] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchText(value);
    if (setSearchValue) {
      setSearchValue(value);
    }

    if (value) {
      customSearchHandler(value);
    } else {
      setUpdatedRows(initialRows);
    }
  };

  const handleClearSearch = () => {
    handleChange({
      target: { value: '' },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  useEffect(() => {
    setSearchText('');
    if (setSearchValue) {
      setSearchValue('');
    }
    setSearchPlaceholder(getSearchPlaceholder(title));
  }, [title, setSearchValue]);

  useEffect(() => {
    if (searchText.length > 0 && initialRows.length > 0) {
      customSearchHandler(searchText);
    }
  }, [initialRows]);

  useEffect(() => {
    if (clearSearchEvent) {
      window.addEventListener(clearSearchEvent, handleClearSearch);
      return () => {
        window.removeEventListener(clearSearchEvent, handleClearSearch);
      };
    }
  }, [clearSearchEvent]);

  return (
    <Search
      sx={{
        height: 'calc(3 * var(--np-rem))',
        width: width ? width : 'calc(30 * var(--np-rem))',
        borderRadius: 'calc(0.4 * var(--np-rem))',
        ...customStyles,
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
        placeholder={searchPlaceholder}
        value={searchText}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'search' }}
        endAdornment={
          searchText.trim().length > 0 && (
            <h6
              style={{
                color: '#3F4FDA',
                fontWeight: 700,
                cursor: 'pointer',
                marginRight: 'calc(1 * var(--np-rem))',
              }}
              onClick={handleClearSearch}
            >
              Clear
            </h6>
          )
        }
      />
    </Search>
  );
}
