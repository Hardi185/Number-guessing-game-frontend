import { configureStore } from '@reduxjs/toolkit';
import attemptsReducer from './attemptsSlice';
import scoreReducer from './scoreSlice';

const store = configureStore({
  reducer: {
    attempts: attemptsReducer,
    score: scoreReducer
  },
});

export default store;
