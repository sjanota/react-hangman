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

    WordsService.onReady(() => this.setState({wordsReady: true}))
    this.state = {
      wordsReady: false
    }
  }

  render() {
    return (
      <div id="app-content">
        {this._isReady() ? this._renderGame() : this._renderLoading()}

      </div>
    );
  }

  _isReady() {
    return this.state.wordsReady
  }

  _renderGame() {
    return <Game
      word = {this._randomWord('easy')}
      allowedLetters={WordsService.letters}
      maxErrors={10}
    />
  }

  _randomWord(level) {
    const i = Math.floor(Math.random() * WordsService.words[level].length)
    return WordsService.words[level][i]
  }

  _renderLoading() {
    return <p>Loading</p>
  }
}
