import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserState } from '@/types/user';

const initialState: UserState = {
  userid: 1,
  firstName: 'Akash',
  lastName: 'Devadiga',
  email: 'akash123@gail.com',
  phone: '8973456898',
  avatar: '/assets/avatar-10.png',
  jobTitle: 'Senior Developer',
  address: [
    {
      city: 'Udupi',
      state: 'karnataka',
      country: 'India',
      timezone: 'GMT-7'
    }
  ],
  hasSalary: true,
  Salary: { amount: 10_000, date: 1 }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAvatar(state, action: PayloadAction<string>) {
      state.avatar = action.payload;
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
      state.firstName = firstName;
      state.lastName = lastName;
      state.email = email;
      state.phone = phone;
      if (state.address.length > 0) {
        state.address[0].city = city;
        state.address[0].state = userState;
      }
    }
  }
});

export const { setAvatar, updateSalaryInfo, updateBasicInfo } = userSlice.actions;
export default userSlice.reducer;
