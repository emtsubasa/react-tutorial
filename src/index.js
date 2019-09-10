import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const col_size = 3;
const row_size = 3;

  function Square(props){
    return (
      <button className="square" onClick={props.onClick}> 
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return( 
        <Square 
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />);
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
        }],
        stepNumber: 0,
        xisNext: true,
      }
    }

    handleClick(i){
      const history = this.state.history.slice(0,this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if(calclateWinner(squares) || squares[i]){
        return;
      }
      squares[i] = this.state.xisNext?  'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares
        }]),
        stepNumber: history.length,
        xisNext: !this.state.xisNext,
      });
    }

    jumpTo(step){
      this.setState({
        stepNumber: step,
        xisNext: (step % 2) === 0,
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calclateWinner(current.squares);

      const moves = history.map((step,move) => {
        let newbutton = 'Go to move #' + move + "(";
        if(move){
          for(let i = 0;i < row_size * col_size;++i)
            if(history[move-1].squares[i] !== history[move].squares[i]){
              newbutton += (i % 3 + 1) + "," + (Math.floor(i / 3) + 1);
          }
          newbutton += ")"
        }
        const desc = move?
          newbutton :
          'Go to game start';
        if(move == this.state.stepNumber){
          return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>
              <b>
                {desc}
              </b>
            </button>
          </li>
          )
        }
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>
              {desc}
            </button>
          </li> 
        )
      })

      let status;
      if(winner){
        status = 'Winner ' + winner;
      }
      else {
        status = 'Next player ' + (this.state.xisNext? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
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
  
  function calclateWinner(squares){
    const lines = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6],
    ];
    for(let i = 0;i < lines.length; i++){
      const [a,b,c] = lines[i];
      if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
        return squares[a];
      }
    }
    return null;
  }