import { useState } from "react";
import confetti from "canvas-confetti";
import "./App.css";

import Square from "./components/Square";
import { turns } from "./constants";
import { checkWinner } from "./logic/board";
import Winner from "./components/Winner";

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem("board");
    if (boardFromStorage) return JSON.parse(boardFromStorage);
    return Array(9).fill(null);
  });
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem("turn");
    if (turnFromStorage) return turnFromStorage;
    return turns.X;
  });
  // A ?? B  Mira si A es null o undefenided

  // Null es que no hay ganador, false es que hay un empate
  const [winner, setWinner] = useState(null);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(turns.X);
    setWinner(null);
    window.localStorage.removeItem("board");
    window.localStorage.removeItem("turn");
  };

  const checkEndGame = (newBoard) => {
    // revisamos hay un empate
    //Si no hay más espacios vacíos en el tablero
    return newBoard.every((square) => square !== null);
    // si todas las posiciones del tablero
    // son distintas a null significa que hay empate
  };

  const updateBoard = (index) => {
    // Para hacer una copia profunda del array
    //* const newBoard = stucturedClone(board)

    //no actualizamos esta posicion tiene si tiene algo
    if (board[index] || winner) return;

    //Actualizar el tablero
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    // cambiar el turno
    const newTurn = turn === turns.X ? turns.O : turns.X;
    setTurn(newTurn);
    //guardar la partida
    window.localStorage.setItem("board", JSON.stringify(newBoard));
    window.localStorage.setItem("turn", newTurn);

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      confetti();
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false);
    }
  };

  return (
    <main className="board">
      <h1> TA-TE-TI</h1>
      <p>Puedes seguir más tarde si quieres...</p>
      <button onClick={resetGame}>Volver a Empezar</button>
      <section className="game">
        {board.map((square, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {square}
            </Square>
          );
        })}
      </section>

      <section className="turn">
        <Square isSelected={turn === turns.X}>{turns.X}</Square>
        <Square isSelected={turn === turns.O}>{turns.O}</Square>
      </section>

      <Winner resetGame={resetGame} winner={winner} />
    </main>
  );
}

export default App;
