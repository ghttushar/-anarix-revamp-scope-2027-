import { InputBaseComponentProps } from '@mui/material/InputBase/InputBase';

export const defaultNumericFieldProps = {
  allowNegative: false,
  decimalScale: 2,
  inputMode: 'decimal',
  thousandSeparator: true,
  valueIsNumericString: true,
  style: { fontSize: 'calc(1.2 * var(--np-rem))' },
} as InputBaseComponentProps;
