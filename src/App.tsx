import { useState } from 'react'
import './App.css'

const BLUE = 'blue';
const BLACK = 'black';

const SIZE = 10;

function makeStartingGrid() {
  let base = new Array(SIZE).fill(null).map(() => new Array(SIZE).fill(null));

  base[0] = new Array(SIZE).fill(BLUE);
  base[SIZE - 1] = new Array(SIZE).fill(BLACK);

  return base;
}

function playable(turn: typeof BLUE | typeof BLACK, i: number, j: number, grid: (null|typeof BLUE | typeof BLACK)[][]): boolean {
  return grid[i+1][j] === turn || grid[i-1][j] === turn || grid[i][j+1] === turn || grid[i][j-1] === turn;
}

function App() {
  const [grid, setGrid] = useState<(null|typeof BLUE | typeof BLACK)[][]>(makeStartingGrid());

  const [turn, setTurn] = useState<typeof BLUE | typeof BLACK>(BLUE);

  const [win, setWin] = useState(false);

  const [canPlay, setCanPlay] = useState(true);

  const [errored, setErrored] = useState(false);

  const [squareSize, setSquareSize] = useState(window.innerWidth > window.innerHeight ? window.innerHeight / SIZE : window.innerWidth / SIZE);

  window.addEventListener("resize", () => {
    setSquareSize(window.innerWidth > window.innerHeight ? window.innerHeight / SIZE : window.innerWidth / SIZE);
  });

  return <div className={"app " + turn} style={{"--square-size": squareSize + "px"} as React.CSSProperties}>
    <div className={"win " + (win ? "active" : "")}>
      <h1>{turn === BLUE ? "Blue" : "Black"} wins!</h1>
      <div className="btns">
      <button onClick={() => {
        setGrid(makeStartingGrid());
        setTurn(BLUE);
        setWin(false);
      }}>Play again</button><button onClick={() => {setWin(false); setCanPlay(false);}}>Show grid</button>
      </div>
    </div>
    <div className="help"><h1>{(turn === BLUE ? "Blue" : "Black") + "'s turn."}</h1></div>
    <div className={"grid " + (errored ? "errored" : "")}>
      {grid.map((row, i) => (
        <div className="row" key={i}>
          {row.map((color, j) => (
            <div className={`cell cell-${color ?? "empty"}`} onClick={() => {
              if (!canPlay) {
                return;
              }
              if (color !== turn && color !== null && playable(turn, i, j, grid)) {
                setWin(true);
              } else if (color !== turn && playable(turn, i, j, grid)) {
                setGrid(prev => {
                  prev[i][j] = turn;
                  turn === BLUE ? setTurn(BLACK) : setTurn(BLUE);
                  return prev;
                })
              } else {
                setErrored(true);
                setTimeout(() => {
                  setErrored(false);
                }, 100);
              }
            }} key={j}>
              
            </div>
          ))}
        </div>
      ))}
    </div>
    <div className="help">
      <h1>How to play</h1>
      <p>This is a 2 player game. The colour of the background determines who's turn it is. You can move by clicking on a cell adjacent to any of your own colour. You can win by clicking on an adjacent cell that is your enemy's colour.</p>
    </div>
  </div>
}

export default App
