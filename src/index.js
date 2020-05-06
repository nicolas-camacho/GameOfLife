import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import styled from 'styled-components'
const Box = styled.div`
  display: inline-block;
  width: 15px;
  height: 15px;
  background-color: ${props => props.status ? '#ffffff' : '#000000' };

  &:hover {
    background-color: blue;
  }
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
  let cellStatus = 0;

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
    <div className="grid" style={{ width: cols*15 }}>
      {rowsArr}
    </div>
  )
}

const Main = () => {

  const [cols] = useState(25)
  const [rows] = useState(25)
  const [fullGrid, setFullGrid] = useState(() => {
    const cells = [];
    for (let i = 0; i < rows; i++) {
      cells.push(Array.from(Array(cols), () => 0))
    }

    return cells;
  })
  
  const start = () => {
    let grid = fullGrid;
    let gridClone = [...fullGrid]

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let neighbors = 0;
        operations.forEach(([x, y]) => {
          const newI = i + x;
          const newJ = j + y;
          if (newI >= 0 && newI < rows && newJ >= 0 && newJ < cols) {
            neighbors += grid[newI][newJ];
          }
        });

        if (neighbors < 2 || neighbors > 3) {
          gridClone[i][j] = 0;
        } else if (grid[i][j] === 0 && neighbors === 3) {
          gridClone[i][j] = 1;
        }
      }
    }
    setFullGrid(gridClone)
  }

  const operations = [
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0]
  ];

  const selectCell = (row, col) => {
    let gridCopy = [...fullGrid]
    gridCopy[row][col] = !gridCopy[row][col];
    setFullGrid(gridCopy)
  }

  const seed = () => {
    let gridCopy = [...fullGrid]
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if(Math.floor(Math.random() * 4) === 1) {
          gridCopy[i][j] = 1;
        }
      }
    }
    setFullGrid(gridCopy)
  }

  useEffect(() => {
    seed();
    startGame();
  }, [])

  const startGame = useCallback(() => {
    start();
    setTimeout(startGame, 50)
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
