import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserState, User } from '@/types/user';

const initialState: UserState = {
  data: null,
  accessToken: null,
  phone: '8973456898',
  jobTitle: 'Senior Developer',
  address: [
    {
      city: 'Udupi',
      state: 'karnataka',
      country: 'India',
      timezone: 'GMT-7'
    }
  ],
  isProfileComplete: null,
  hasSalary: true,
  Salary: { amount: 10_000, date: 1 }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    handleModel(state, action: PayloadAction<boolean>){
      state.isProfileComplete = action.payload;
    },
    setUser(state, action: PayloadAction<User>) {
      state.data = action.payload;
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    clearUser(state) {
      state.data = null;
      state.accessToken = null;
    },
    setAvatar(state, action: PayloadAction<string>) {
      const avatar = action.payload;
      if(state.data != null){
        state.data.avatar = avatar;
      }
    },
    updateSalaryInfo(
      state,
      action: PayloadAction<{
        jobTitle: string;
        hasSalary: boolean;
        salaryAmount: number;
        salaryDate: number;
      }>
    ) {
      const { jobTitle, hasSalary, salaryAmount, salaryDate } = action.payload;
      state.jobTitle = jobTitle;
      state.hasSalary = hasSalary;
      state.Salary.amount = salaryAmount;
      state.Salary.date = salaryDate;
    },
    updateBasicInfo(
      state,
      action: PayloadAction<{
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        city: string;
        state: string;
      }>
    ) {
      const { firstName, lastName, email, phone, city, state: userState } = action.payload;
      if(state.data != null){
        state.data.firstName = firstName;
        state.data.lastName = lastName;
        state.data.email = email;
      }
      state.phone = phone;
      if (state.address.length > 0) {
        state.address[0].city = city;
        state.address[0].state = userState;
      }
    }
  }
});

export const { handleModel, setAvatar, updateSalaryInfo, updateBasicInfo, setUser, setAccessToken, clearUser } = userSlice.actions;
export default userSlice.reducer;
