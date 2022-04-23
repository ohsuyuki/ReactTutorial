import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={ props.onClick }>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      key={i}
      value={ this.props.squares[i] }
      onClick={ () => this.props.onClick(i) }
    />;
  }

  render() {
    const row = 3;
    const column = 3;

    let boardRows = [];
    for(let i = 0; i < row; i++) {
      let squares = [];
      for(let j = 0; j < column; j++) {
        let index = (i * row) + j;
        let square = this.renderSquare(index);
        squares.push(square);
      }

      let boardRow = (
        <div key={i} className='board-row'>
          {squares}
        </div>
      )
      boardRows.push(boardRow);
    }

    return (
      <div>
        {boardRows}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          coord: null
        }
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if(calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const coord = i
    this.setState({
      history: history.concat([
        {
          squares: squares,
          coord: coord,
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move #${move}` :
        `Go to move start`;

      const className = (step === current) ? `current-button` : `prev-button`

      return (
        <li key={move}>
          <button className={className} onClick={() => this.jumpTo(move)}>{desc}</button>
          <div>{step.coord}</div>
        </li>
      );
    });

    const winner = calculateWinner(current);
    let status;
    if(winner) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    console.log(current);
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={ current.squares }
            onClick={ (i) => this.handleClick(i) }
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
