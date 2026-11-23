import { getCountryFlagIcon } from '@legacy/utils';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import React, { useEffect, useState } from 'react';
import ImgComponent from '../img-component/img-component';
import InfoIcon from '../info-icon/info-icon';
import { IDropdownItem } from './dropdown';
import {
  paperPropsNewStyles,
  paperPropsOldStyles,
  selectNewStyles,
  selectOldStyles,
} from './dropdown-styles';
import {
  customPaperStyle,
  inputLabelStyles,
  selectStyles,
} from './searchable-dropdown-styles';

export interface IDropdownProps<T> {
  options: IDropdownItem<T>[];
  label: string;
  labelStyles?: React.CSSProperties;
  labelTooltipTitle?: string;
  selected: IDropdownItem<T>;
  onSelect: (option: IDropdownItem<T>) => void;
  width?: string;
  height?: string;
  customFilterOptions?: (
    options: IDropdownItem<T>[],
    inputValue: string
  ) => IDropdownItem<T>[];
  showImg?: boolean;
  isDisabled?: boolean;
  dropShadow?: boolean;
  stopPropagation?: boolean;
  fontWeight?: string | number;
  isNewDesign?: boolean;
}

const SearchableDropdown = <T,>(props: IDropdownProps<T>) => {
  const {
    options,
    label,
    selected,
    onSelect,
    width,
    height = 'calc(3.1 * var(--np-rem))',
    labelStyles,
    labelTooltipTitle,
    customFilterOptions,
    showImg = false,
    isDisabled = false,
    dropShadow = false,
    stopPropagation = true,
    fontWeight,
    isNewDesign = false,
  } = props;
  const [selectedOption, setSelectedOption] =
    useState<IDropdownItem<T>>(selected);

  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    setSelectedOption(selected);
  }, [selected]);

  const handleChange = (
    e: React.SyntheticEvent<Element, Event>,
    value: IDropdownItem<T> | null
  ) => {
    if (!value) return;
    const selectedValue = value;
    onSelect(selectedValue);
  };

  const handleCustomFilterOptions = (
    options: IDropdownItem<T>[],
    inputValue: string
  ) => {
    if (customFilterOptions) {
      return customFilterOptions(options, inputValue);
    }

    return options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  return (
    <div
      style={{ width: width ? width : '100%' }}
      data-test="searchable-dropdown"
      onClick={(e) => (stopPropagation ? e.stopPropagation() : undefined)}
    >
      <InputLabel sx={inputLabelStyles} style={labelStyles}>
        {label}
        {labelTooltipTitle && <InfoIcon title={labelTooltipTitle as string} />}
      </InputLabel>
      <FormControl
        sx={{
          m: 1,
          minWidth: '100%',
          margin: 'calc(0 * var(--np-rem))',
          '& .Mui-disabled': {
            cursor: 'not-allowed',
          },
        }}
      >
        <Autocomplete
          id="searchable-dropdown"
          value={selectedOption}
          title={selectedOption.label}
          options={options}
          filterOptions={(options, { inputValue }) =>
            handleCustomFilterOptions(options, inputValue)
          }
          onChange={handleChange}
          disabled={isDisabled}
          sx={{
            ...selectStyles,
            '& .MuiOutlinedInput-notchedOutline': isNewDesign
              ? {
                  border: '0.5px solid #acacac !important',
                }
              : {
                  border:
                    dropShadow === false
                      ? '1px solid #dadceb !important'
                      : '1px solid white !important',
                  '&:hover': {
                    border: '1px solid #464646 !important',
                  },
                },
            '&:hover .MuiOutlinedInput-notchedOutline': isNewDesign
              ? {
                  border: '0.5px solid transparent !important',
                }
              : {},
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': isNewDesign
              ? {
                  border: '0.5px solid transparent !important',
                }
              : {},
            '& .MuiAutocomplete-inputRoot': {
              padding: 'calc(0 * var(--np-rem))',
              margin: 'calc(0 * var(--np-rem))',
              boxShadow: dropShadow
                ? 'calc(0 * var(--np-rem)) calc(0.2 * var(--np-rem)) calc(0.4 * var(--np-rem)) calc(0 * var(--np-rem)) rgba(0, 0, 0, 0.1)'
                : 'none',

              flex: '1 1 auto',
              color: '#000000',
              height: 'calc(3.2 * var(--np-rem))',
              width: width ? width : '100%',
              fontSize: 'calc(1.2 * var(--np-rem))',
              fontWeight: isNewDesign ? '400 !important' : fontWeight,
              ...(isNewDesign ? selectNewStyles : selectOldStyles),
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              sx={{
                '& .MuiOutlinedInput-input': {
                  marginLeft: showImg === true ? 'calc(1.6 * var(--np-rem))' : 'initial',
                  fontWeight: isNewDesign ? '400 !important' : fontWeight,
                },
                background: 'white',
                borderRadius: isNewDesign ? '8px' : 'calc(0.4 * var(--np-rem))',
                height,
              }}
              InputProps={{
                ...params.InputProps,
                startAdornment: [
                  showImg === true ? (
                    <div
                      style={{
                        height: 'calc(1 * var(--np-rem))',
                        position: 'absolute',
                        left: 'calc(1 * var(--np-rem))',
                      }}
                    >
                      <ImgComponent
                        imageURL={getCountryFlagIcon(
                          selectedOption.tooltipText ?? ''
                        )}
                        alt={selectedOption.label}
                        customStyles={{
                          padding: '0 calc(1 * var(--np-rem)) 0 0',
                          height: 'calc(1 * var(--np-rem))',
                        }}
                      />
                    </div>
                  ) : null,
                ],
              }}
            />
          )}
          PaperComponent={({ children }) => {
            return (
              <div
                style={{
                  ...customPaperStyle,
                  ...(isNewDesign ? paperPropsNewStyles : paperPropsOldStyles),
                }}
              >
                {children}
              </div>
            );
          }}
          renderOption={(props, option) => (
            <li {...props}>
              {showImg === true ? (
                <ImgComponent
                  imageURL={getCountryFlagIcon(option.tooltipText ?? '')}
                  alt={option.label}
                  customStyles={{
                    padding: '0 calc(1 * var(--np-rem)) 0 0',
                    height: 'calc(1 * var(--np-rem))',
                  }}
                />
              ) : null}
              {option.label}
            </li>
          )}
          inputValue={inputValue}
          onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
          data-test="searchable-dropdown-option"
        />
      </FormControl>
    </div>
  );
};

export default SearchableDropdown;
