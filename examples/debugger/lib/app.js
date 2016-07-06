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

var MyClass = (_dec = (0, _reactGuiDebugger2.default)({}), _dec(_class = function (_React$Component) {
  _inherits(MyClass, _React$Component);

  function MyClass() {
    _classCallCheck(this, MyClass);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(MyClass).apply(this, arguments));
  }

  _createClass(MyClass, [{
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
      var _this2 = this;

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
              return _this2.onButton(e);
            } },
          "click me"
        )
      );
    }
  }]);

  return MyClass;
}(_react2.default.Component)) || _class);


_reactDom2.default.render(_react2.default.createElement(MyClass, { props: { a: 1, b: 2, c: 3 } }), document.getElementById("main-app"));