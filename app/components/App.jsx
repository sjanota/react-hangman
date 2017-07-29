import React from 'react';
import Game from './Game';

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
  render() {
    return (
      <div id="app-content">
        <Game
          word = "katarakta"
          allowedLetters={allowedLetters()}
          maxErrors={4}
        />
      </div>
    );
  }
}
