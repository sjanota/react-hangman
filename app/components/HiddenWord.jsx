import React from 'react';
import classNames from 'classnames'
import LetterSequence from './LetterSequence'

export default class HiddenWord extends React.Component {
  constructor() {
    super();
    this.renderLetter = this.renderLetter.bind(this);
  }

  render() {
    return (
      <div className="hidden-word">
        <LetterSequence
          letters={this.props.foundLetters}
          renderLetter={this.renderLetter}
        />
      </div>
    );
  }

  renderLetter(letter, index) {
    if (this._isLetterMissing(index)) {
      if (this._isGameEnd()) {
        return <Hint letter={this.props.targetLetters[index]}/>
      } else {
        return <Unknown />
      }
    } else {
      return <Guessed letter={letter}/>
    }
  }

  _isGameEnd() {
    return this.props.phase.final
  }

  _isLetterMissing(index) {
    return this.props.foundLetters[index] == null
  }
}

const Guessed = ({letter}) => <span className='good'>{letter.toUpperCase()}</span>
const Unknown = () => <span className='wrong'>_</span>
const Hint = ({letter}) => <span className='wrong'>{letter.toUpperCase()}</span>
