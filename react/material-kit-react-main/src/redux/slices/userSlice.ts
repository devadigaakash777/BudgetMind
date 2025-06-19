import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  firstName: 'Akash',
  lastName: 'Devadiga',
  email: 'akash123@gail.com',
  phone: '8973456898',
  avatar: '/assets/avatar-10.png',
  jobTitle: 'Senior Developer',
  city: 'Udupi',
  state: 'Karnataka',
  country: 'India',
  timezone: 'GMT-7',
  hasSalary: true,
  Salary: { amount: 500000, date: 1 },
  threshold: 0
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSalary(state, action) {
      state.Salary = action.payload;
    },
    setThreshold(state, action) {
      state.threshold = action.payload;
    },
    setHasSalary(state, action) {
      state.hasSalary = action.payload;
    }
  },
});

export const { setSalary, setThreshold, setHasSalary } = userSlice.actions;
export default userSlice.reducer;