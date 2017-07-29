import React from 'react';
import classNames from 'classnames'
import LetterSequence from './LetterSequence'

export default class LetterPicker extends React.Component {
  constructor() {
    super();
    this._renderLetter = this._renderLetter.bind(this);
    this.state = {
      picked: []
    };
  }
  render() {
    return <div className='letter-picker'>
      <LetterSequence
        letters={this.props.letters}
        renderLetter={this._renderLetter}
      />
    </div>
  }

  _renderLetter(letter) {
    if (this.state.picked.includes(letter)) {
      return this._renderPicked(letter)
    } if(!this.props.enabled) {
      return this._renderDisabled(letter)
    } else {
      return this._renderAvailable(letter)
    }
  }

  _renderDisabled(letter) {
    return <span>{letter.toUpperCase()}</span>
  }

  _renderAvailable(letter) {
    return <span
      className="available"
      onClick={() => this._onLetterPicked(letter)}
    >{letter.toUpperCase()}</span>
  }

  _renderPicked(letter) {
    const hit = this.props.isMatch(letter)
    const classes = classNames('picked', {
      'good': hit,
      'wrong': !hit
    })
    return <span className={classes}>{letter.toUpperCase()}</span>
  }

  _onLetterPicked(letter) {
    this.props.onLetterPick(letter)
    this.setState((old) => {
      const oldPicked = old.picked.slice();
      oldPicked.push(letter)
      return {
        picked: oldPicked
      };
    })
  }
}
