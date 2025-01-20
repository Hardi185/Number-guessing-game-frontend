import axios from 'axios';

const API_URL = 'https://guessing-game-server.up.railway.app';

export const resetGame = async () => {
  const response = await axios.post(`${API_URL}/reset`);
  return response.data;
};

export const makeGuess = async (guess, attempts) => {
  const response = await axios.post(`${API_URL}/guess`, null, {
    params: { guess, attempts },
  });
  return response.data;
};
