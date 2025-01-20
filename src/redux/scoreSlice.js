import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  score: 0, // Initial score
};

const scoreSlice = createSlice({
  name: 'score',
  initialState,
  reducers: {
    setScore: (state, action) => {
      state.score = action.payload; // Update score
    },
    resetScore: (state) => {
      state.score = 0; // Reset score to default
    },
  },
});

export const { setScore, resetScore } = scoreSlice.actions;
export default scoreSlice.reducer;
