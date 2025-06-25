// previewSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type PreviewState = Record<string, any>; // fully dynamic

const initialState: PreviewState = {};

const previewSlice = createSlice({
  name: 'preview',
  initialState,
  reducers: {
    setPreview: (state, action: PayloadAction<PreviewState>) => {
      return { ...state, ...action.payload };
    },
    clearPreview: () => ({})
  }
});

export const { setPreview, clearPreview } = previewSlice.actions;
export default previewSlice.reducer;
