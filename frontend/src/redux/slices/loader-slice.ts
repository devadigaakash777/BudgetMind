import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoaderState {
  isAppLoading: boolean;
}

const initialState: LoaderState = {
  isAppLoading: true
};

const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    setAppLoading(state, action: PayloadAction<boolean>) {
      state.isAppLoading = action.payload;
    }
  }
});

export const { setAppLoading } = loaderSlice.actions;
export default loaderSlice.reducer;
