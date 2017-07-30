(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var process;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("components/App.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Game = require('./Game');

var _Game2 = _interopRequireDefault(_Game);

var _WordsService = require('./services/WordsService');

var _WordsService2 = _interopRequireDefault(_WordsService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function allowedLetters() {
  var result = [];
  var startCode = 'A'.charCodeAt(0);
  var endCode = 'Z'.charCodeAt(0);
  for (var i = startCode; i <= endCode; ++i) {
    result.push(String.fromCharCode(i));
  }
  return result;
}

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App() {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

    _WordsService2.default.onReady(function () {
      return _this.setState({ wordsReady: true });
    });
    _this.state = {
      wordsReady: false
    };
    return _this;
  }

  _createClass(App, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { id: 'app-content' },
        this._isReady() ? this._renderGame() : this._renderLoading()
      );
    }
  }, {
    key: '_isReady',
    value: function _isReady() {
      return this.state.wordsReady;
    }
  }, {
    key: '_renderGame',
    value: function _renderGame() {
      return _react2.default.createElement(_Game2.default, {
        word: this._randomWord('easy'),
        allowedLetters: _WordsService2.default.letters,
        maxErrors: 10
      });
    }
  }, {
    key: '_randomWord',
    value: function _randomWord(level) {
      var i = Math.floor(Math.random() * _WordsService2.default.words[level].length);
      return _WordsService2.default.words[level][i];
    }
  }, {
    key: '_renderLoading',
    value: function _renderLoading() {
      return _react2.default.createElement(
        'p',
        null,
        'Loading'
      );
    }
  }]);

  return App;
}(_react2.default.Component);

exports.default = App;

});

require.register("components/Game.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _HiddenWord = require('./HiddenWord');

var _HiddenWord2 = _interopRequireDefault(_HiddenWord);

var _LetterPicker = require('./LetterPicker');

var _LetterPicker2 = _interopRequireDefault(_LetterPicker);

var _Hangman = require('./Hangman');

var _Hangman2 = _interopRequireDefault(_Hangman);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Phases = Object.freeze({
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

var Game = function (_React$Component) {
  _inherits(Game, _React$Component);

  function Game(props) {
    _classCallCheck(this, Game);

    var _this = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this));

    _this.onLetterGuess = _this.onLetterGuess.bind(_this);
    _this.isMatch = _this.isMatch.bind(_this);
    _this.isFinished = _this.isFinished.bind(_this);
    _this.onToManyErrors = _this.onToManyErrors.bind(_this);

    _this.state = {
      phase: Phases.INIT,
      targetLetters: props.word.split("").map(function (s) {
        return s.toUpperCase();
      }),
      foundLetters: new Array(props.word.length).fill(null),
      errors: 0
    };
    return _this;
  }

  _createClass(Game, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { id: 'game' },
        _react2.default.createElement(GameStatus, {
          phase: this.state.phase
        }),
        _react2.default.createElement(_HiddenWord2.default, {
          phase: this.state.phase,
          foundLetters: this.state.foundLetters,
          targetLetters: this.state.targetLetters
        }),
        _react2.default.createElement(_LetterPicker2.default, {
          onLetterPick: this.onLetterGuess,
          isMatch: this.isMatch,
          letters: this.props.allowedLetters,
          enabled: !this.isFinished()
        }),
        _react2.default.createElement(_Hangman2.default, {
          errors: this.state.errors,
          maxErrors: this.props.maxErrors
        })
      );
    }
  }, {
    key: 'isMatch',
    value: function isMatch(letter) {
      return this.state.targetLetters.includes(letter);
    }
  }, {
    key: 'isFinished',
    value: function isFinished() {
      return this.state.phase.final;
    }
  }, {
    key: 'onLetterGuess',
    value: function onLetterGuess(letter) {
      if (this.state.targetLetters.includes(letter)) {
        this._letterFound(letter);
      } else {
        this._miss();
      }
    }
  }, {
    key: 'onToManyErrors',
    value: function onToManyErrors() {
      this.setState({
        phase: Phases.END_FAILURE
      });
    }
  }, {
    key: '_letterFound',
    value: function _letterFound(letter) {
      var _this2 = this;

      this.setState(function (old) {
        var foundLetters = _this2.state.foundLetters.slice();
        for (var i = 0; i < _this2.state.targetLetters.length; ++i) {
          if (_this2.state.targetLetters[i] == letter) {
            foundLetters[i] = letter;
          }
        }
        var isFinish = foundLetters.join("") == _this2.state.targetLetters.join("");
        return {
          phase: isFinish ? Phases.END_SUCCESS : Phases.HIT,
          foundLetters: foundLetters
        };
      });
    }
  }, {
    key: '_miss',
    value: function _miss() {
      var _this3 = this;

      this.setState(function (old) {
        var errors = old.errors + 1;
        return {
          errors: errors,
          phase: errors == _this3.props.maxErrors ? Phases.END_FAILURE : Phases.MISS
        };
      });
    }
  }]);

  return Game;
}(_react2.default.Component);

exports.default = Game;


var GameStatus = function GameStatus(_ref) {
  var phase = _ref.phase;
  return _react2.default.createElement(
    'h5',
    { className: phase.class },
    phase.text
  );
};

});

require.register("components/Hangman.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Hangman = function (_React$Component) {
  _inherits(Hangman, _React$Component);

  function Hangman() {
    _classCallCheck(this, Hangman);

    return _possibleConstructorReturn(this, (Hangman.__proto__ || Object.getPrototypeOf(Hangman)).apply(this, arguments));
  }

  _createClass(Hangman, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'p',
        null,
        'Errors: ',
        this.props.errors,
        ' (',
        this.props.maxErrors,
        ' allowed)'
      );
    }
  }]);

  return Hangman;
}(_react2.default.Component);

exports.default = Hangman;

});

require.register("components/HiddenWord.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _LetterSequence = require('./LetterSequence');

var _LetterSequence2 = _interopRequireDefault(_LetterSequence);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HiddenWord = function (_React$Component) {
  _inherits(HiddenWord, _React$Component);

  function HiddenWord() {
    _classCallCheck(this, HiddenWord);

    var _this = _possibleConstructorReturn(this, (HiddenWord.__proto__ || Object.getPrototypeOf(HiddenWord)).call(this));

    _this.renderLetter = _this.renderLetter.bind(_this);
    return _this;
  }

  _createClass(HiddenWord, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'hidden-word' },
        _react2.default.createElement(_LetterSequence2.default, {
          letters: this.props.foundLetters,
          renderLetter: this.renderLetter
        })
      );
    }
  }, {
    key: 'renderLetter',
    value: function renderLetter(letter, index) {
      if (this._isLetterMissing(index)) {
        if (this._isGameEnd()) {
          return _react2.default.createElement(Hint, { letter: this.props.targetLetters[index] });
        } else {
          return _react2.default.createElement(Unknown, null);
        }
      } else {
        return _react2.default.createElement(Guessed, { letter: letter });
      }
    }
  }, {
    key: '_isGameEnd',
    value: function _isGameEnd() {
      return this.props.phase.final;
    }
  }, {
    key: '_isLetterMissing',
    value: function _isLetterMissing(index) {
      return this.props.foundLetters[index] == null;
    }
  }]);

  return HiddenWord;
}(_react2.default.Component);

exports.default = HiddenWord;


var Guessed = function Guessed(_ref) {
  var letter = _ref.letter;
  return _react2.default.createElement(
    'span',
    { className: 'good' },
    letter.toUpperCase()
  );
};
var Unknown = function Unknown() {
  return _react2.default.createElement(
    'span',
    { className: 'wrong' },
    '_'
  );
};
var Hint = function Hint(_ref2) {
  var letter = _ref2.letter;
  return _react2.default.createElement(
    'span',
    { className: 'wrong' },
    letter.toUpperCase()
  );
};

});

require.register("components/LetterPicker.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _LetterSequence = require('./LetterSequence');

var _LetterSequence2 = _interopRequireDefault(_LetterSequence);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LetterPicker = function (_React$Component) {
  _inherits(LetterPicker, _React$Component);

  function LetterPicker() {
    _classCallCheck(this, LetterPicker);

    var _this = _possibleConstructorReturn(this, (LetterPicker.__proto__ || Object.getPrototypeOf(LetterPicker)).call(this));

    _this._renderLetter = _this._renderLetter.bind(_this);
    _this.state = {
      picked: []
    };
    return _this;
  }

  _createClass(LetterPicker, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'letter-picker' },
        _react2.default.createElement(_LetterSequence2.default, {
          letters: this.props.letters,
          renderLetter: this._renderLetter
        })
      );
    }
  }, {
    key: '_renderLetter',
    value: function _renderLetter(letter) {
      if (this.state.picked.includes(letter)) {
        return this._renderPicked(letter);
      }if (!this.props.enabled) {
        return this._renderDisabled(letter);
      } else {
        return this._renderAvailable(letter);
      }
    }
  }, {
    key: '_renderDisabled',
    value: function _renderDisabled(letter) {
      return _react2.default.createElement(
        'span',
        null,
        letter.toUpperCase()
      );
    }
  }, {
    key: '_renderAvailable',
    value: function _renderAvailable(letter) {
      var _this2 = this;

      return _react2.default.createElement(
        'span',
        {
          className: 'available',
          onClick: function onClick() {
            return _this2._onLetterPicked(letter);
          }
        },
        letter.toUpperCase()
      );
    }
  }, {
    key: '_renderPicked',
    value: function _renderPicked(letter) {
      var hit = this.props.isMatch(letter);
      var classes = (0, _classnames2.default)('picked', {
        'good': hit,
        'wrong': !hit
      });
      return _react2.default.createElement(
        'span',
        { className: classes },
        letter.toUpperCase()
      );
    }
  }, {
    key: '_onLetterPicked',
    value: function _onLetterPicked(letter) {
      this.props.onLetterPick(letter);
      this.setState(function (old) {
        var oldPicked = old.picked.slice();
        oldPicked.push(letter);
        return {
          picked: oldPicked
        };
      });
    }
  }]);

  return LetterPicker;
}(_react2.default.Component);

exports.default = LetterPicker;

});

require.register("components/LetterSequence.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LetterSequence = function (_React$Component) {
  _inherits(LetterSequence, _React$Component);

  function LetterSequence() {
    _classCallCheck(this, LetterSequence);

    var _this = _possibleConstructorReturn(this, (LetterSequence.__proto__ || Object.getPrototypeOf(LetterSequence)).call(this));

    _this.renderLetter = _this.renderLetter.bind(_this);
    return _this;
  }

  _createClass(LetterSequence, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'letters' },
        this.props.letters.map(this.renderLetter)
      );
    }
  }, {
    key: 'renderLetter',
    value: function renderLetter(letter, index) {
      var inner = this.props.renderLetter(letter, index);
      return _react2.default.createElement(
        'div',
        {
          className: 'letter',
          key: index
        },
        inner
      );
    }
  }]);

  return LetterSequence;
}(_react2.default.Component);

exports.default = LetterSequence;

});

require.register("components/services/WordsService.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WordsService = function () {
  function WordsService() {
    _classCallCheck(this, WordsService);

    this.onReady = this.onReady.bind(this);
    this.startLoading = this.startLoading.bind(this);
    this.enterReady = this.enterReady.bind(this);

    this.isRead = false;
    this.onReadyCallbacks = [];
  }

  _createClass(WordsService, [{
    key: 'onReady',
    value: function onReady(callback) {
      if (this.isReady) {
        callback();
      } else {
        this.onReadyCallbacks.push(callback);
      }
    }
  }, {
    key: 'startLoading',
    value: function startLoading() {
      var _this = this;

      console.log("loading...");
      var loadingWords = _axios2.default.get('words.json');
      var loadingLetters = _axios2.default.get('letters.json');
      this.loading = _axios2.default.all([loadingWords, loadingLetters]).then(_axios2.default.spread(function (words, letters) {
        _this.words = words.data;
        console.log("Easy words: ", _this.words.easy.length);
        console.log("Medium words: ", _this.words.medium.length);
        console.log("Hard words: ", _this.words.hard.length);

        _this.letters = letters.data.map(function (s) {
          return s.toUpperCase();
        });
        console.log("Letters: ", _this.letters);
        _this.enterReady();
      }));
    }
  }, {
    key: 'enterReady',
    value: function enterReady() {
      if (this.loadingLetters) this._isReady = true;
      console.log("Words loaded");
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.onReadyCallbacks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var callback = _step.value;

          callback.call();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }]);

  return WordsService;
}();

var service = new WordsService();
service.startLoading();
exports.default = service;

});

require.register("initialize.js", function(exports, require, module) {
'use strict';

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _App = require('components/App');

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', function () {
  _reactDom2.default.render(_react2.default.createElement(_App2.default, null), document.querySelector('#app'));
});

});

require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map