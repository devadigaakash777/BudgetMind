import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/lib/axiosInstance';
import { setAvatar, handleModel, setSalaryAcknowledged, updateBasicInfo, updateSalaryInfo, setProfileDetails } from '../slices/user-slice';
import type { RootState, AppDispatch } from '../store';
import type { UserProfile } from '@/types/user'
import { refetchAllUserData } from './global-refresh';


const API_URL = 'http://localhost:5000/api/profile';

export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.get<UserProfile>(`${API_URL}`);
      const {
        phone,
        jobTitle,
        address,
        isProfileComplete,
        isSalaryPaid,
        hasSalary,
        salary
      } = res.data;
      console.warn(salary);
      dispatch(
        setProfileDetails({
          phone,
          jobTitle,
          address,
          isProfileComplete,
          isSalaryPaid,
          hasSalary,
          salary
        })
      );
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to fetch user profile');
    }
  }
);

export const updateUserBasicInfo = createAsyncThunk(
  'user/updateUserBasicInfo',
  async (
    data: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      city: string;
      state: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const res = await axios.put(`${API_URL}/basic`, data);
      console.debug("updateUserBasicInfo "+res.status);
      dispatch(updateBasicInfo(data));
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to update basic info');
    }
  }
);

export const updateUserSalaryInfo = createAsyncThunk(
  'user/updateUserSalaryInfo',
  async (
    data: {
      jobTitle: string;
      hasSalary: boolean;
      salaryAmount: number;
      salaryDate: number;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const res = await axios.put(`${API_URL}/salary`, data);
      console.debug("updateUserSalaryInfo "+res.status);
      dispatch(updateSalaryInfo(data));
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to update salary info');
    }
  }
);

export const updateUserAvatar = createAsyncThunk(
  'user/updateUserAvatar',
  async (avatar: string, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.patch(`${API_URL}/avatar`, { avatar });
      console.debug("updateUserAvatar "+res.status);
      dispatch(setAvatar(avatar));
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to update avatar');
    }
  }
);

export const setProfileStatus = createAsyncThunk(
  'user/setProfileStatus',
  async (isProfileComplete: boolean, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.patch(`${API_URL}/status/profile`, { "isProfileComplete": isProfileComplete });
      console.debug("setProfileStatus "+res.status);
      await refetchAllUserData(dispatch as AppDispatch);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to update profile status');
    }
  }
);

export const setSalaryStatus = createAsyncThunk(
  'user/setSalaryStatus',
  async (isSalaryPaid: boolean, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.patch(`${API_URL}/status/salary`, { isSalaryPaid });
      console.debug("setSalaryStatus "+res.status);
      dispatch(setSalaryAcknowledged(isSalaryPaid));
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to update salary status');
    }
  }
);

export const calculateBudget = createAsyncThunk(
  'user/calculateBudget',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/calculate`);
      console.debug("calculateBudget "+res.status);
      await refetchAllUserData(dispatch as AppDispatch);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to calculate budget');
    }
  }
);

export const resetAll = createAsyncThunk(
  'user/resetAll',
  async (deleteDailyExpense: boolean, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/reset`, { deleteDailyExpense });
      await refetchAllUserData(dispatch as AppDispatch);
      console.debug("reset status "+res.status);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to reset');
    }
  }
);

export const reAllocateBudget = createAsyncThunk(
  'user/reAllocateBudget',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/re-allocate-budget`);
      await refetchAllUserData(dispatch as AppDispatch);
      console.debug("reset status "+res.status);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to re allocate budget');
    }
  }
);