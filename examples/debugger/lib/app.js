"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactGuiDebugger = require("./react-gui-debugger");

var _reactGuiDebugger2 = _interopRequireDefault(_reactGuiDebugger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AnIteratedComponent = (_dec = (0, _reactGuiDebugger2.default)({ ignore: ["onButton"] }), _dec(_class = function (_React$Component) {
  _inherits(AnIteratedComponent, _React$Component);

  function AnIteratedComponent() {
    _classCallCheck(this, AnIteratedComponent);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(AnIteratedComponent).apply(this, arguments));
  }

  _createClass(AnIteratedComponent, [{
    key: "plus100",
    value: function plus100(someInt) {
      return someInt + 100;
    }
  }, {
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        "div",
        null,
        this.plus100(this.props.number.num)
      );
    }
  }]);

  return AnIteratedComponent;
}(_react2.default.Component)) || _class);

var MyClass = function (_React$Component2) {
  _inherits(MyClass, _React$Component2);

  function MyClass() {
    _classCallCheck(this, MyClass);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(MyClass).call(this));
  }

  _createClass(MyClass, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // do some mounty stuff here
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate(nextProps, nextState) {
      // do some updaty stuff here
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      // do some more stuff here
    }
  }, {
    key: "squared",
    value: function squared(anInt) {
      return anInt * anInt;
    }
  }, {
    key: "cubed",
    value: function cubed(anInt) {
      return anInt * anInt * anInt;
    }
  }, {
    key: "onButton",
    value: function onButton(e) {
      //do some stuff
      return "You cant really return from this kind of method but whatever...";
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement(
        "div",
        null,
        _react2.default.createElement(
          "h2",
          null,
          "My Squared number: ",
          this.squared(10)
        ),
        _react2.default.createElement(
          "h2",
          null,
          "My Cubed number: ",
          this.cubed(10)
        ),
        _react2.default.createElement(
          "button",
          { onClick: function onClick(e) {
              return _this3.onButton(e);
            } },
          "click me"
        ),
        _.map([1, 2, 3, 4, 5], function (num) {
          return _react2.default.createElement(AnIteratedComponent, { key: num, number: { num: num, wayDeep: { stillDeeper: num } } });
        })
      );
    }
  }]);

  return MyClass;
}(_react2.default.Component);

_reactDom2.default.render(_react2.default.createElement(MyClass, { props: { a: 1, b: 2, c: 3 } }), document.getElementById("main-app"));