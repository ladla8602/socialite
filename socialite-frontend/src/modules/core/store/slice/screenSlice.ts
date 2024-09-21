import { createSlice } from '@reduxjs/toolkit';

interface UserState {
  screenName: string;
}

const initialState: UserState = {
  screenName: '',
};
export const screenSlice = createSlice({
  name: 'screenName',
  initialState,
  reducers: {
    setScreenData: (state, action) => {
      state.screenName = action.payload;
    },
  },
});
export const { setScreenData } = screenSlice.actions;
export default screenSlice.reducer;
