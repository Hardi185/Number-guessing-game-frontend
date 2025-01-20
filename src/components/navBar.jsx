import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import { resetGame } from '../services/gameService';
import { resetScore } from '../redux/scoreSlice';
import { resetAttempts } from '../redux/attemptsSlice';
import { useDispatch, useSelector } from 'react-redux';

function Navbar({ handleResetGrid }) {
  const attempts = useSelector((state) => state.attempts.attempts);
  const dispatch = useDispatch();

  // New state for progress bar value
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Update progress based on attempts
    // Full green (1000) for 1 attempt, reducing by 100 for each additional attempt
    if (attempts === 0) {
      setProgress(0);
    } else {
      setProgress(Math.max(0, 1000 - (attempts - 1) * 100));
    }
  }, [attempts]);

  const handleResetGame = async () => {
    const response = await resetGame();
    dispatch(resetAttempts());
    dispatch(resetScore());
    handleResetGrid();
  };

  return (
    <nav className="bg-blue-500 text-white sticky top-0 shadow-md z-50 w-full">
      <div className="w-full px-4 py-2 flex justify-between items-center">
        {/* Logo and Game Name */}
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Game Logo" className="h-10 w-10" />
          <h1 className="text-xl font-bold">Guess Genius</h1>
        </div>

        {/* Attempts and Score */}
        <div className="flex items-center space-x-6">
          <p className="text-lg">Attempts: {attempts} / 10</p>
          <div className="w-full px-4 py-2">
            <div className="bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: `${(progress / 1000) * 100}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-gray-400 mt-1">Score: {progress}</p>
          </div>
          <button
            onClick={handleResetGame}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Reset Game
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
