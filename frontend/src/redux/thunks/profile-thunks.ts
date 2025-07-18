import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/lib/axios-instance';
import { setAvatar, setSalaryAcknowledged, updateBasicInfo, updateSalaryInfo, setProfileDetails } from '../slices/user-slice';
import type { AppDispatch } from '../store';
import type { UserProfile } from '@/types/user'
import { refetchAllUserData } from './global-refresh';
import { config } from '@/config';


const API_URL = `${config.apiBaseUrl}/profile`;

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
    } catch {
      return rejectWithValue('Failed to fetch user profile');
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
      dispatch(updateBasicInfo(data));
      console.debug(res);
    } catch {
      return rejectWithValue('Failed to update basic info');
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
      console.debug("salary info "+res.status);
      dispatch(updateSalaryInfo(data));
    } catch {
      return rejectWithValue('Failed to update salary info');
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
    } catch {
      return rejectWithValue('Failed to update avatar');
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
    } catch {
      return rejectWithValue('Failed to update profile status');
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
    } catch {
      return rejectWithValue('Failed to update salary status');
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
    } catch {
      return rejectWithValue('Failed to calculate budget');
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
    } catch {
      return rejectWithValue('Failed to reset');
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
    } catch {
      return rejectWithValue('Failed to re allocate budget');
    }
  }
);