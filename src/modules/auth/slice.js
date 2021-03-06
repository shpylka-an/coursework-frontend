import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { authApi } from './api'
import Http from '../../utils/Http'

export const login = createAsyncThunk(
  'auth/login',
  async ({ credentials }, thunkAPI) => {
    try {
      const response = await authApi.login(credentials)
      const { accessToken, user } = response.data
      localStorage.setItem('token', accessToken)
      Http.defaults.headers.common.Authorization = `Bearer ${accessToken}`

      return user
    } catch (err) {
      let error = err
      if (!error.response) {
        throw err
      }
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)

export const authCheck = createAsyncThunk(
  'auth/check',
  async (arg, thunkAPI) => {
    if (localStorage.getItem('token')) {
      try {
        const response = await authApi.me()
        return response.data
      } catch (err) {
        return thunkAPI.rejectWithValue(false)
      }
    }

    return thunkAPI.rejectWithValue(false)
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async ({ registerData }, thunkAPI) => {
    try {
      const response = await authApi.register(registerData)
      const { accessToken, user } = response.data
      localStorage.setItem('token', accessToken)

      return user
    } catch (err) {
      let error = err
      if (!error.response) {
        throw err
      }
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token')
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    currentUser: null,
    errors: null,
    isLoading: true,
  },
  reducers: {},
  extraReducers: {
    [login.pending]: (state) => {
      state.isLoading = true
    },
    [login.fulfilled]: (state, action) => {
      state.currentUser = action.payload
      state.isLoading = false
      state.isLoggedIn = true
    },
    [login.rejected]: (state, action) => {
      state.isLoading = false
      state.errors = action.payload
    },
    [authCheck.fulfilled]: (state, action) => {
      state.isLoggedIn = true
      state.isLoading = false
      state.currentUser = action.payload
    },
    [authCheck.rejected]: (state) => {
      state.isLoggedIn = false
      state.isLoading = false
    },
    [register.pending]: (state) => {
      state.isLoading = true
    },
    [register.fulfilled]: (state, action) => {
      state.isLoading = false
      state.currentUser = action.payload
      state.isLoggedIn = true
    },
    [register.rejected]: (state, action) => {
      state.isLoading = false
      state.errors = action.payload
    },
    [logout.fulfilled]: (state) => {
      state.isLoggedIn = false
      state.currentUser = null
    },
  },
})

export default authSlice.reducer
// eslint-disable-next-line
export const {} = authSlice.actions
