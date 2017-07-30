import React from 'react';
import classNames from 'classnames'
import HiddenWord from './HiddenWord'
import LetterPicker from './LetterPicker'
import Hangman from './Hangman';

const Phases = Object.freeze({
    INIT: {
      class: null,
      text: 'Guess the word',
      final: false
    },
    HIT: {
      class: 'good',
      text: 'Great! Keep going!',
      final: false
    },
    MISS: {
      class: 'wrong',
      text: 'Oups... Try again',
      final: false
    },
    END_SUCCESS: {
      class: 'good',
      text: 'You found it!',
      final: true
    },
    END_FAILURE: {
      class: 'wrong',
      text: 'GAME OVER. No luck this time, huh?',
      final: true
    }
});

export default class Game extends React.Component {
  constructor(props) {
    super();
    this.onLetterGuess = this.onLetterGuess.bind(this);
    this.isMatch = this.isMatch.bind(this);
    this.isFinished = this.isFinished.bind(this);
    this.onToManyErrors = this.onToManyErrors.bind(this);

    this.state = {
      phase: Phases.INIT,
      targetLetters: props.word.split("").map((s) => s.toUpperCase()),
      foundLetters: new Array(props.word.length).fill(null),
      errors: 0
    };
  }

  render() {
    return <div id="game">
      <GameStatus
        phase={this.state.phase}
      />
      <HiddenWord
        phase={this.state.phase}
        foundLetters={this.state.foundLetters}
        targetLetters={this.state.targetLetters}
      />
      <LetterPicker
        onLetterPick={this.onLetterGuess}
        isMatch={this.isMatch}
        letters={this.props.allowedLetters}
        enabled={!this.isFinished()}
      />
      <Hangman
        errors={this.state.errors}
        maxErrors={this.props.maxErrors}
      />
    </div>
  }

  isMatch(letter) {
    return this.state.targetLetters.includes(letter)
  }

  isFinished() {
    return this.state.phase.final
  }

  onLetterGuess(letter) {
    if (this.state.targetLetters.includes(letter)) {
      this._letterFound(letter)
    } else {
      this._miss()
    }
  }

  onToManyErrors() {
    this.setState({
      phase: Phases.END_FAILURE
    });
  }
  _letterFound(letter) {
    this.setState((old) => {
      const foundLetters = this.state.foundLetters.slice()
      for (let i = 0; i < this.state.targetLetters.length; ++i) {
        if (this.state.targetLetters[i] == letter) {
          foundLetters[i] = letter
        }
      }
      const isFinish = foundLetters.join("") == this.state.targetLetters.join("")
      return {
        phase: isFinish ? Phases.END_SUCCESS : Phases.HIT,
        foundLetters: foundLetters
      }
    });
  }

  _miss() {
    this.setState((old) => {
      const errors = old.errors + 1;
      return {
        errors: errors,
        phase: errors == this.props.maxErrors ? Phases.END_FAILURE : Phases.MISS
      }
    })
  }
}

function GameStatus({phase}) {
  return <h5 className={phase.class}>{phase.text}</h5>
}
