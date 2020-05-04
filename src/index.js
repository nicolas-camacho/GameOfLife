import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
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

  &:hover {
    background-color: #00CFF;
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

const Grid = ({ width: cols, rows, fullGrid, selectCell }) => {

  let rowsArr = []
  let cellStatus = false;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cellId = i + "_" + j;
      cellStatus = fullGrid[i][j] ? true : false;
      rowsArr.push(
        <Cell 
          {...{
            status: cellStatus,
            key: cellId,
            cellId: cellId,
            row: i,
            col: j,
            selectCell
          }}
        />
      )
    }
  }

  return(
    <div className="grid" style={{width: width}}>
      {{rowsArr}}
    </div>
  )
}

const Main = () => {

  const [generation, setGeneration] = useState(0)
  const [speed, setSpeed] = useState(100)
  const [cols, setCols] = useState(50)
  const [rows, setRows] = useState(30)
  const [fullGrid, setFullGrid] = useState(Array(rows).fill().map(() => Array(cols).fill(false)))

  return(
    <div>
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
