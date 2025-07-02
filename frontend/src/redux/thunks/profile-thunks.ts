import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/lib/axiosInstance';
import { setAvatar, handleModel, setSalaryAcknowledged, updateBasicInfo, updateSalaryInfo, setProfileDetails } from '../slices/user-slice';
import type { RootState } from '../store';
import type { UserProfile } from '@/types/user'

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
        Salary
      } = res.data;

      dispatch(
        setProfileDetails({
          phone,
          jobTitle,
          address,
          isProfileComplete,
          isSalaryPaid,
          hasSalary,
          Salary
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
      await axios.put(`${API_URL}/basic`, data);
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
      await axios.put(`${API_URL}/salary`, data);
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
      await axios.patch(`${API_URL}/avatar`, { avatar });
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
      await axios.patch(`${API_URL}/status/profile`, { isProfileComplete });
      dispatch(handleModel(isProfileComplete));
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to update profile status');
    }
  }
);

export const setSalaryStatus = createAsyncThunk(
  'user/setSalaryStatus',
  async (isSalaryPaid: boolean, { dispatch, rejectWithValue }) => {
    try {
      await axios.patch(`${API_URL}/status/salary`, { isSalaryPaid });
      dispatch(setSalaryAcknowledged(isSalaryPaid));
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to update salary status');
    }
  }
);
