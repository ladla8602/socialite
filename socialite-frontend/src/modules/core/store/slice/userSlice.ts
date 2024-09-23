import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../store';

export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string | null;
  roleId: string;
  isVerified: boolean;
  addedBy: string | null;
  role: string;
  refreshToken: string | null;
  accessToken: string | null;
}

interface UserState {
  authToken: any;
  user: UserData | null;
  forgotEmail: string;
  openModal: boolean;
  isAuthorized: boolean;
}

const initialState: UserState = {
  user: {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    roleId: '',
    isVerified: true,
    addedBy: '',
    refreshToken: '',
    accessToken: '',
    role: '',
  },
  forgotEmail: '',
  openModal: false,
  isAuthorized: false,
  authToken: undefined,
};

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setForgotEmail(state, action) {
      state.forgotEmail = action.payload;
    },
    setOpenModal(state, action) {
      state.openModal = action.payload;
    },
    setAuthToken(state, action) {
      state.isAuthorized = action.payload;
    },
    resetUserState() {
      return initialState;
    },
  },
});
export const { setUser, setForgotEmail, setOpenModal, setAuthToken, resetUserState } = userSlice.actions;
export const userSelector = (state: RootState) => state.userData;
export default userSlice.reducer;
