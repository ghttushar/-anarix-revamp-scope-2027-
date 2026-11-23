import '@tanstack/react-table';
import type { ITableFooterData } from '@legacy/interfaces/advertising/advertising.interface';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterLabel?: string;
    columnSkeleton?: boolean;
  }

  interface TableMeta<TData extends RowData> {
    footerData: ITableFooterData;
    getFooterData: () => ITableFooterData;
    isLoading: boolean;
  }
}
