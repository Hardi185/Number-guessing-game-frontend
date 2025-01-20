import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  attempts: 0,
};

const attemptsSlice = createSlice({
  name: 'attempts',
  initialState,
  reducers: {
    incrementAttempts: (state) => {
      state.attempts += 1;
    },
    resetAttempts: (state) => {
      state.attempts = 0;
    },
  },
});

export const { incrementAttempts, resetAttempts } = attemptsSlice.actions;
export default attemptsSlice.reducer;
