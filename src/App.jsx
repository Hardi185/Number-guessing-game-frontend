import './App.css'
import React, { useState, useRef } from 'react';
import Game from './components/game';
import NavBar from './components/navBar'

function App() {
  const gameResetRef = useRef(null);

  //will be set in Game
  const setResetFunction = (resetFunc) => {
    gameResetRef.current = resetFunc;
  };

  //will work when clicking from navbar
  const handleResetGrid = () => {
    if (gameResetRef.current) {
      gameResetRef.current(); // Call the reset function in the Game component
    }
  };

  return (
    <>
      <NavBar handleResetGrid={handleResetGrid} />
      <Game onReset={setResetFunction}  />
    </>
  );

}

export default App
