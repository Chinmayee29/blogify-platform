import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getStoredJson = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
};

const storedUser = getStoredJson('user');
const storedToken = localStorage.getItem('token') || null;

const initialState = {
  user: storedUser,
  token: storedToken,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: ''
};

export const register = createAsyncThunk(
  'auth/register',
  async (payload, thunkAPI) => {
    try {
      const { data } = await axios.post('/api/auth/register', payload);
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || 'Registration failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (payload, thunkAPI) => {
    try {
      const { data } = await axios.post('/api/auth/login', payload);
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || 'Login failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    resetStatus: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = '';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = { _id: action.payload._id, name: action.payload.name, email: action.payload.email };
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(state.user));
        localStorage.setItem('token', state.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Registration failed';
      })
      // login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = '';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = { _id: action.payload._id, name: action.payload.name, email: action.payload.email };
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(state.user));
        localStorage.setItem('token', state.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Login failed';
      });
  }
});

export const { logout, resetStatus } = authSlice.actions;
export default authSlice.reducer;


