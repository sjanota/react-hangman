import React from 'react';
import classNames from 'classnames'

export default class Hangman extends React.Component {
  render() {
    return <p>Errors: {this.props.errors} ({this.props.maxErrors} allowed)</p>
  }
}
