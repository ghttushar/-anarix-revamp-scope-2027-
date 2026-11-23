import { useSetSubHeader } from '@legacy/shell/legacy-sub-header';
import { useEffect } from 'react';

/** Sets the page header strip's title, as anarix-ui's hook of the same name does (via context instead of Redux). */
const useSubHeader = (title: string, pageTitleTooltip: string) => {
  const setSubHeader = useSetSubHeader();
  useEffect(() => {
    setSubHeader({
      title,
      titleTooltip: pageTitleTooltip,
      isDropdownRequired: false,
      dropdownOptions: [],
      goBackButton: false,
    });
  }, [setSubHeader, title, pageTitleTooltip]);
};

export default useSubHeader;
