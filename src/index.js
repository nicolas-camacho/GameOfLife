import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import styled from 'styled-components'

const Box = styled.div`
  display: inline-block;
  border: 1px solid black;
  width: 15px;
  height: 15px;
  margin-left: -1px;
  margin-bottom: -1px;
  background-color: ${props => props.status ? 'green' : 'lightgray' };
`

const Cell = ({ status, cellId, selectCell, row, col }) => {

  return(
    <Box 
      status={status} 
      id={cellId} 
      onClick={() => selectCell(row, col)} 
    />
  )
}

const Grid = ({ cols, rows, fullGrid, selectCell }) => {

  let rowsArr = []
  let cellStatus = false;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let boxId = i + "_" + j;

      cellStatus = fullGrid[i][j];
      rowsArr.push(
        <Cell
          status={cellStatus}
          key={boxId}
          boxId={boxId}
          row={i}
          col={j}
          selectCell={selectCell}
        />
      );
    }
  }

  return(
    <div className="grid" style={{width: (cols*16) + 1}}>
      {rowsArr}
    </div>
  )
}

const Main = () => {

  const [generation, setGeneration] = useState(0)
  const [speed, setSpeed] = useState(100)
  const [cols, setCols] = useState(50)
  const [rows, setRows] = useState(30)
  const [fullGrid, setFullGrid] = useState(Array(rows).fill().map(() => Array(cols).fill(false)))
  const [intervalId, setIntervalId] = useState(null)
  
  const start = () => {
    let grid = fullGrid;
    let gridClone = [...fullGrid]

    for (let i = 0; i < rows; i++) {
		  for (let j = 0; j < cols; j++) {
		    let count = 0;
		    if (i > 0) if (grid[i - 1][j]) count++;
		    if (i > 0 && j > 0) if (grid[i - 1][j - 1]) count++;
		    if (i > 0 && j < cols - 1) if (grid[i - 1][j + 1]) count++;
		    if (j < cols - 1) if (grid[i][j + 1]) count++;
		    if (j > 0) if (grid[i][j - 1]) count++;
		    if (i < rows - 1) if (grid[i + 1][j]) count++;
		    if (i < rows - 1 && j > 0) if (grid[i + 1][j - 1]) count++;
		    if (i < rows - 1 && j < cols - 1) if (grid[i + 1][j + 1]) count++;
		    if (grid[i][j] && (count < 2 || count > 3)) gridClone[i][j] = false;
		    if (!grid[i][j] && count === 3) gridClone[i][j] = true;
		  }
    }
    setFullGrid(gridClone)
    setGeneration(generation + 1)
  }

  const startGame = () => {
    clearInterval(intervalId)
    setIntervalId(setInterval(start, speed))
  }

  const selectCell = (row, col) => {
    let gridCopy = [...fullGrid]
    gridCopy[row][col] = !gridCopy[row][col];
    setFullGrid(gridCopy)
  }

  const seed = () => {
    let gridCopy = [...fullGrid]
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if(Math.floor(Math.random() * 8) === 1) {
          gridCopy[i][j] = true;
        }
      }
    }
    setFullGrid(gridCopy)
  }

  useEffect(() => {
    seed();
    startGame();
  }, [])

  return(
    <div className="center">
      <h1>The game of life</h1>
      <Grid 
        {...{
          cols,
          rows,
          fullGrid,
          selectCell: selectCell
        }}
      />
      <h2>Generations: {generation}</h2>
    </div>
  );
}


ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
