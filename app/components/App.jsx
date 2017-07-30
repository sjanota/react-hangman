import React from 'react';
import Game from './Game';
import WordsService from './services/WordsService'

function allowedLetters() {
  var result=[];
  const startCode = 'A'.charCodeAt(0)
  const endCode = 'Z'.charCodeAt(0)
  for (var i = startCode; i <= endCode; ++i){
    result.push(String.fromCharCode(i));
  }
  return result;
}

export default class App extends React.Component {
  constructor() {
    super();
    this.resetGame = this.resetGame.bind(this);

    WordsService.onReady(() => this.setState({wordsReady: true}))
    this.state = {
      wordsReady: false,
      difficulty: null
    }
  }

  render() {
    return (
      <div id="app-content">
        {this.renderControlBar()}
        {this.renderLoading()}
        {this.renderGame()}
      </div>
    );
  }

  renderControlBar() {
    if (this.state.difficulty == null) {
      return <ControlBar>
        {this.LevelButton('easy')}
        {this.LevelButton('medium')}
        {this.LevelButton('hard')}
      </ControlBar>
    } else {
      return <ControlBar>
        {this.ResetButton()}
      </ControlBar>
    }
  }

  renderGame() {
    if (this.state.difficulty != null) {
      return <Game
        word = {this._randomWord(this.state.difficulty)}
        allowedLetters={WordsService.letters}
        maxErrors={10}
      />
    }
  }

  _randomWord(level) {
    const i = Math.floor(Math.random() * WordsService.words[level].length)
    return WordsService.words[level][i]
  }

  renderLoading() {
    if (!this.state.wordsReady) {
      return <h5>Loading</h5>
    }
  }

  LevelButton(level) {
    return <button
      onClick={() => this.chooseDificulty(level)}
    >{level}</button>
  }

  ResetButton() {
    return <button
      onClick={this.resetGame}
    >reset</button>
  }

  chooseDificulty(level) {
    this.setState({difficulty: level});
  }

  resetGame() {
    this.setState({difficulty: null})
  }
}

const EasyButton = () => LevelButton('easy')
const MediumButton = () => LevelButton('medium')
const HardButton = () => LevelButton('hard')

const ControlBar = ({children}) => <div className="control-bar">{children}</div>
