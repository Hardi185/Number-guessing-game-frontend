import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { incrementAttempts, resetAttempts } from '../redux/attemptsSlice';
import { makeGuess } from '../services/gameService';
import { MESSAGES } from '../constants/messages';
import { setScore } from '../redux/scoreSlice';
import winImg from '../assets/win-img.png'
import outOfMoves from '../assets/out-of-moves-img.png'
import tooHigh from '../assets/too-high-img.png'
import tooLow from '../assets/too-low-img.png'
import littleHigh from '../assets/little-high-img.png'
import littleLow from '../assets/little-low-img.png'

function Game({onReset }) {
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const [guess, setGuess] = useState('');
  const [selectedNumbers, setSelectedNumbers] = useState(new Set());
  const [correctNumber, setCorrectNumber] = useState(null); // Track the correct number
  const [gameOver, setGameOver] = useState(false); // Track if the game is over
  const attempts = useSelector((state) => state.attempts.attempts);
  const dispatch = useDispatch();

  const getMessageImage = (message) => {
  
    // Convert message to lowercase for case-insensitive comparison
    const lowerCaseMessage = message.toLowerCase();
  
    if (lowerCaseMessage.includes(MESSAGES.CORRECT_GUESS.toLowerCase())) {
      return winImg; // Path to the win image
    }
    if (lowerCaseMessage === MESSAGES.GAME_OVER.toLowerCase()) {
      return outOfMoves; // Path to the out-of-moves image
    }
    if (lowerCaseMessage.includes(MESSAGES.TOO_HIGH.toLowerCase())) {
      return tooHigh; // Path to the too-high image
    }
    if (lowerCaseMessage.includes(MESSAGES.TOO_LOW.toLowerCase())) {
      return tooLow; // Path to the too-low image
    }
    if (lowerCaseMessage.includes(MESSAGES.LITTLE_HIGH.toLowerCase())) {
      return littleHigh; // Path to the little-high image
    }
    if (lowerCaseMessage.includes(MESSAGES.LITTLE_LOW.toLowerCase())) {
      return littleLow; // Path to the little-low image
    }
    
    return null; // No image for other messages
  };
  

  const handleNumberClick = async (number) => {
    // If the number has already been selected, do nothing
    if (selectedNumbers.has(number) || gameOver) return;

    setGuess(number.toString());
    setSelectedNumbers((prev) => new Set(prev).add(number)); // Mark the number as selected
    dispatch(incrementAttempts());

    const response = await makeGuess(number, parseInt(attempts));
    if (response) {
      setMessage(response.message);
      setShowPopup(true); // Show the popup
      dispatch(setScore(response.score));
    }

    if (response.message.includes(MESSAGES.CORRECT_GUESS)) {
      setCorrectNumber(number); // Mark the correct number
      setGameOver(true); // End the game
    }

    if (response.message === MESSAGES.GAME_OVER) {
      setGameOver(true); // End the game if the user runs out of attempts
      dispatch(resetAttempts());
    }
  };

  // Reset game state
  const handleReset = () => {
    setSelectedNumbers(new Set());
    setCorrectNumber(null);
    setMessage('');
    setGuess('');
    setGameOver(false); // Reset game state
  };

  // Pass the reset function to the parent
  onReset(handleReset);

  const imageSrc = message
  ? getMessageImage(message) // Pass the updated `message` value directly
  : null;

  // Manage the modal timeout using useEffect
  useEffect(() => {
    let timer;
    if (showPopup) {
      timer = setTimeout(() => {
        setShowPopup(false); // Hide popup after 5 seconds
      }, 5000);
    }
    // Clear timeout if the popup is closed manually or if message changes
    return () => clearTimeout(timer);
  }, [showPopup, message]); // Trigger useEffect when showPopup or message changes

  return (
    <div>
      {/* Popup Modal */}
      {showPopup && (
       <div
       className="fixed top-0 left-0 w-full h-auto bg-black bg-opacity-80 z-50 flex items-center justify-center"
       style={{ height: '100vh' }}
       onClick={() => setShowPopup(false)} // Allow closing the popup by clicking anywhere
     >
       <div
         className="relative w-full max-w-3xl flex items-center p-6"
         style={{
           maxHeight: '300px',
           borderRadius: '12px',
           background: 'white',
           boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
           border: '6px solid', // Border with gradient animation
           borderImage: 'linear-gradient(45deg, #ff6ec4, #7873f5) 1',
           animation: 'borderAnimation 3s linear infinite',
         }}
       >
         {/* Image Section */}
         {imageSrc && (
           <div
             className="flex-shrink-0 w-[200px] h-[200px] absolute -left-8 -top-8 z-10"
             style={{ margin: '-20px' }}
           >
             <img
               src={imageSrc}
               alt="Message visual"
               className="w-full h-full object-contain"
             />
           </div>
         )}
     
         {/* Message Section */}
         <div className="flex-grow text-end px-6">
           <p className="text-2xl font-bold text-gray-700">{message}</p>
         </div>
       </div>
     </div>
     
      )}

      {/* Number Grid */}
      <div className="container mx-auto text-center my-8">
        <div className="grid grid-cols-10 gap-2">
          {Array.from({ length: 100 }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => handleNumberClick(number)}
              className={`text-black font-bold py-2 rounded border ${
                gameOver
                  ? 'bg-gray-400 cursor-not-allowed'
                  : correctNumber === number
                  ? 'bg-green-500 cursor-not-allowed'
                  : selectedNumbers.has(number)
                  ? 'bg-red-500 cursor-not-allowed'
                  : 'bg-gray-200 hover:bg-blue-500'
              }`}
              disabled={gameOver || selectedNumbers.has(number) || correctNumber === number}
            >
              {correctNumber === number ? '✔' : selectedNumbers.has(number) ? '✖' : number}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Game;
