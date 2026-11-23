import CustomBadge from '@legacy/app/components/common/custom-badge/custom-badge';
import Dropdown, { type IDropdownItem } from '@legacy/app/components/common/dropdown/dropdown';
import InfoIcon from '@legacy/app/components/common/info-icon/info-icon';
import styles from '@legacy/app/components/common/sub-header/sub-header.module.scss';
import CustomDateRangePickerWrapper from '@legacy/app/components/shared/custom-daterange-picker/custom-date-range-picker-wrapper';
import { DropdownLabelEnum } from '@legacy/enums/index.enums';
import type { TimezoneEnum } from '@legacy/enums/timezone.enums';
import { TooltipPlacement } from '@legacy/enums/tooltip-texts.enums';
import type { IDateRange } from '@legacy/interfaces/serp.interface';
import { createContext, useContext, useState, type ReactNode } from 'react';

/**
 * The page header strip from anarix-ui (`common/sub-header`): page title, its info tooltip and the header dropdowns.
 * In anarix-ui the strip also carried the Aan button, notification bell and profile menu; in this app those live in
 * the app's own shell, so only the page's part of the strip is kept. Pages set it through a context instead of Redux.
 */
export interface ISubHeaderDataItem {
  selectedItem: IDropdownItem<string>;
  setSelectedItem: (value: IDropdownItem<string>) => void;
  label: string;
  options: IDropdownItem<string>[];
  prefixElement?: JSX.Element;
  flagElement?: JSX.Element;
  disabled?: boolean;
  /** Date range items (label DATE_RANGE): the custom range and its setter. */
  customDateRange?: IDateRange;
  handleSetCustomDateRangeForModal?: (dateRange: IDateRange) => void;
  timeZone?: TimezoneEnum;
}

export interface ISubHeaderProps {
  title: string;
  titleTooltip: string;
  isDropdownRequired?: boolean;
  dropdownOptions: ISubHeaderDataItem[];
  goBackButton?: boolean;
  defaultPreset?: IDropdownItem<string>;
  selectedCustomDateRange?: IDateRange;
}

type SetSubHeader = (options: ISubHeaderProps) => void;

const SubHeaderContext = createContext<{ options: ISubHeaderProps | null; setOptions: SetSubHeader } | null>(null);

export function LegacySubHeaderProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ISubHeaderProps | null>(null);
  return <SubHeaderContext.Provider value={{ options, setOptions }}>{children}</SubHeaderContext.Provider>;
}

/** The replacement for anarix-ui's `dispatch(setSubheaderOptions(...))`. */
export function useSetSubHeader(): SetSubHeader {
  const ctx = useContext(SubHeaderContext);
  if (!ctx) throw new Error('useSetSubHeader must be used inside LegacySubHeaderProvider');
  return ctx.setOptions;
}

const getTitleCaseString = (value: string) =>
  value
    .split(' ')
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : word))
    .join(' ');

export function LegacySubHeader() {
  const ctx = useContext(SubHeaderContext);
  const options = ctx?.options;
  if (!options) return null;
  const { title, titleTooltip, isDropdownRequired = false, dropdownOptions, defaultPreset, selectedCustomDateRange } = options;

  return (
    <div
      className={styles.subHeader}
      style={{ marginTop: 'calc(-0.2 * var(--np-rem))', height: 'auto', width: '100%', transition: 'width 0.2s ease-in', backgroundColor: '#f5f6f8' }}
      data-test="sub-header"
    >
      <div className={styles.subHeaderContent}>
        <div data-test="page-name" className={styles.subHeaderTitle}>
          <span className="flex">
            <CustomBadge
              badgeContent={'Beta'}
              invisible={true}
              customBadgeStyles={{ width: 'fit-content', right: 'calc(1.5 * var(--np-rem))', padding: 'calc(0.4 * var(--np-rem))' }}
            >
              {title}
            </CustomBadge>
            {title ? (
              <InfoIcon
                title={titleTooltip || title}
                position={TooltipPlacement.Right}
                customIconStyles={{ height: 'auto', width: 'calc(1.6 * var(--np-rem))' }}
              />
            ) : null}
          </span>
          <span className={styles.subHeaderSubTitle}></span>
        </div>
        <div className={styles.subHeaderFilter}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 'calc(0.8 * var(--np-rem))' }}>
            {isDropdownRequired
              ? dropdownOptions.map((item, index) =>
                  item.label === DropdownLabelEnum.DATE_RANGE && item.handleSetCustomDateRangeForModal ? (
                    <CustomDateRangePickerWrapper
                      key={`${item.label}-${index}`}
                      title={'Date Range'}
                      handleDateChange={item.setSelectedItem}
                      setCustomDateRange={item.handleSetCustomDateRangeForModal}
                      rangeOptions={item.options}
                      dropShadow={true}
                      height="calc(3.2 * var(--np-rem))"
                      defaultPreset={defaultPreset}
                      selectedCustomDateRange={selectedCustomDateRange}
                      timeZone={item.timeZone}
                    />
                  ) : (
                  <div key={`${item.label}-${index}`} data-test={`marketplace-header-${item.label}`} className={styles.singleDropdown}>
                    <Dropdown
                      label={getTitleCaseString(item.label)}
                      options={item.options}
                      selected={item.selectedItem}
                      onSelect={item.setSelectedItem}
                      width={item.label === DropdownLabelEnum.AD_TYPE ? 'calc(16 * var(--np-rem))' : 'calc(24 * var(--np-rem))'}
                      height="calc(3.2 * var(--np-rem))"
                      customDateRange={{ startDate: '', endDate: '' }}
                      prefixElement={item.prefixElement}
                      flagElement={item.flagElement}
                      dropShadow={true}
                      disabled={item.disabled}
                    />
                  </div>
                  )
                )
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}
