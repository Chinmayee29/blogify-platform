import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api'; // Changed from axios

const initialState = {
  posts: [],
  post: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: ''
};

// NOTE: We need to pass the token for protected routes
const getConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const getPosts = createAsyncThunk('posts/getAll', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/api/posts'); // Changed from axios
    return data;
  } catch (error) {
    const message = error?.response?.data?.message || error?.message || 'Failed to fetch posts';
    return thunkAPI.rejectWithValue(message);
  }
});

export const getPostById = createAsyncThunk('posts/getById', async (id, thunkAPI) => {
  try {
    const { data } = await api.get(`/api/posts/${id}`); // Changed from axios
    return data;
  } catch (error) {
    const message = error?.response?.data?.message || error?.message || 'Failed to fetch post';
    return thunkAPI.rejectWithValue(message);
  }
});

export const createPost = createAsyncThunk('posts/create', async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const { data } = await api.post('/api/posts', payload, getConfig(token)); // Changed from axios
    return data;
  } catch (error) {
    const message = error?.response?.data?.message || error?.message || 'Failed to create post';
    return thunkAPI.rejectWithValue(message);
  }
});

export const deletePost = createAsyncThunk('posts/delete', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    await api.delete(`/api/posts/${id}`, getConfig(token)); // Changed from axios
    return id;
  } catch (error) {
    const message = error?.response?.data?.message || error?.message || 'Failed to delete post';
    return thunkAPI.rejectWithValue(message);
  }
});

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // getPosts
      .addCase(getPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = action.payload;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // getPostById
      .addCase(getPostById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.post = action.payload;
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // createPost
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts.unshift(action.payload);
        state.post = action.payload;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // deletePost
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const deletedId = action.payload;
        state.posts = state.posts.filter((p) => p._id !== deletedId);
        if (state.post && state.post._id === deletedId) {
          state.post = null;
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { resetStatus } = postSlice.actions;
export default postSlice.reducer;