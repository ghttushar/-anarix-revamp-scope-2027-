import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { IDropdownItem } from '@legacy/app/components/common/dropdown/dropdown';
import type { IRootState } from '@legacy/redux/store';

/**
 * The slice of anarix-ui's auth state the ported pages read: the advertising account picked in the page header's
 * Marketplace dropdown, and whether the Jiva chatbot is open (never, in this app — it has its own Aan panel).
 */
interface IAuthState {
  isChatbotOpen: boolean;
  advertisingAccount: { selected: IDropdownItem<string>; options: IDropdownItem<string>[] };
}

const initialState: IAuthState = {
  isChatbotOpen: false,
  advertisingAccount: { selected: { label: '', value: '' }, options: [] },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAdvertisingAccount: (state, action: PayloadAction<{ selected: IDropdownItem<string>; options: IDropdownItem<string>[] }>) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      state.advertisingAccount = action.payload as any;
    },
  },
});

export const { setAdvertisingAccount } = authSlice.actions;
export const selectIsChatbotOpen = (state: IRootState) => state.auth.isChatbotOpen;
export const selectAdvertisingAccount = (state: IRootState) => state.auth.advertisingAccount.selected;
export const selectAdvertisingAccountOptions = (state: IRootState) => state.auth.advertisingAccount.options;

export default authSlice.reducer;
