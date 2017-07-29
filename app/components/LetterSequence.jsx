import React from 'react';
import classNames from 'classnames'

export default class LetterSequence extends React.Component {
  constructor() {
    super();
    this.renderLetter = this.renderLetter.bind(this);
  }

  render() {
    return <div className='letters'>
      {this.props.letters.map(this.renderLetter)}
    </div>
  }

  renderLetter(letter, index) {
    const inner = this.props.renderLetter(letter, index)
    return <div
      className='letter'
      key={index}
    >{inner}</div>
  }
}
