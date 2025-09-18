import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  posts: [],
  post: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: ''
};

export const getPosts = createAsyncThunk('posts/getAll', async (_, thunkAPI) => {
  try {
    const { data } = await axios.get('/api/posts');
    return data;
  } catch (error) {
    const message = error?.response?.data?.message || error?.message || 'Failed to fetch posts';
    return thunkAPI.rejectWithValue(message);
  }
});

export const getPostById = createAsyncThunk('posts/getById', async (id, thunkAPI) => {
  try {
    const { data } = await axios.get(`/api/posts/${id}`);
    return data;
  } catch (error) {
    const message = error?.response?.data?.message || error?.message || 'Failed to fetch post';
    return thunkAPI.rejectWithValue(message);
  }
});

export const createPost = createAsyncThunk('posts/create', async (payload, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    const { data } = await axios.post('/api/posts', payload, {
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    });
    return data;
  } catch (error) {
    const message = error?.response?.data?.message || error?.message || 'Failed to create post';
    return thunkAPI.rejectWithValue(message);
  }
});

export const deletePost = createAsyncThunk('posts/delete', async (id, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    await axios.delete(`/api/posts/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    });
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
        state.isError = false;
        state.isSuccess = false;
        state.message = '';
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = action.payload;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to fetch posts';
      })
      // getPostById
      .addCase(getPostById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = '';
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.post = action.payload;
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to fetch post';
      })
      // createPost
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = '';
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
        state.message = action.payload || 'Failed to create post';
      })
      // deletePost
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = '';
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
        state.message = action.payload || 'Failed to delete post';
      });
  }
});

export const { resetStatus } = postSlice.actions;
export default postSlice.reducer;


