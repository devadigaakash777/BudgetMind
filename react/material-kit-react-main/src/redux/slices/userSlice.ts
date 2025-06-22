import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  firstName: 'Akash',
  lastName: 'Devadiga',
  email: 'akash123@gail.com',
  phone: '8973456898',
  avatar: '/assets/avatar-10.png',
  jobTitle: 'Senior Developer',
  address: [
    {
      city: 'Udupi',
      state: 'Karnataka',
      country: 'India',
      timezone: 'GMT-7',
    }
  ],
  hasSalary: true,
  Salary: { amount: 500000, date: 1 },
  threshold: 0
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAvatar(state, action) {
      state.avatar = action.payload;
    },
    setThreshold(state, action) {
      state.threshold = action.payload;
    },
    setHasSalary(state, action) {
      state.hasSalary = action.payload;
    },
    updateBasicInfo(state, action) {
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
  },
});

export const { setAvatar, setThreshold, setHasSalary, updateBasicInfo } = userSlice.actions;
export default userSlice.reducer;
