import { useAppDispatch, useAppSelector } from '@legacy/redux/hooks';
import { selectAppliedFilters, setAppliedFilters } from '@legacy/redux/slices/filters/filter.slice';
import { checkIsEqual } from '@legacy/utils/advertising.utils';
import { getStoredLsFilters } from '@legacy/utils/row-filter.utils';
import { useEffect, useMemo } from 'react';

/**
 * anarix-ui's SyncFilters: loads the page's saved row filters into the store before the page renders. (The
 * Impact Analysis metric sync it also did there doesn't apply to the pages ported here.)
 */
const SyncFilters: React.FC<{
  children: React.ReactNode;
  selectedNavTitle: string;
}> = ({ children, selectedNavTitle }) => {
  const dispatch = useAppDispatch();
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const storedFilters = getStoredLsFilters(selectedNavTitle);

  const areFiltersEqual = useMemo(
    () => checkIsEqual(storedFilters, appliedFilters),
    [appliedFilters, storedFilters]
  );

  useEffect(() => {
    if (!areFiltersEqual) {
      dispatch(setAppliedFilters(storedFilters));
    }
  }, [dispatch, storedFilters, areFiltersEqual]);

  return areFiltersEqual ? <>{children}</> : null;
};

export default SyncFilters;
