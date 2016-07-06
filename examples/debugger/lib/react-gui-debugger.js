"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function (options) {
  var _ref = options ? options : {};

  var ignore = _ref.ignore;
  var focus = _ref.focus;
  var matchProp = _ref.matchProp;

  return function (element) {

    var originalMethods = _lodash2.default.map(Object.getOwnPropertyNames(element.prototype), function (key) {
      return { name: key, val: element.prototype[key] };
    });

    _lodash2.default.each(originalMethods, function (method) {
      if (typeof method.val == "function" && !_lodash2.default.contains(["render", "constructor", "getState"], method.name)) {
        element.prototype[method.name] = function () {
          var origMethod = method.val.bind(this);

          // react resuses the same event so you cant keep a reference to it unless you persist.
          _lodash2.default.each(arguments, function (arg) {
            if (arg.persist) arg.persist();
          });

          var result = origMethod.apply(undefined, arguments);
          if (ignore && ignore.length && _lodash2.default.contains(ignore, method.name)) {
            return result;
          }
          if (focus && focus.length && !_lodash2.default.contains(focus, method.name)) {
            return result;
          }
          if (matchProp && matchProp.length && this.props[matchProp[0]] != matchProp[1]) {
            return result;
          }
          if (!_lodash2.default.contains(this.methodsToDisplay, method.name)) {
            return result;
          }
          if (!this.debugActions) this.debugActions = [];

          this.debugActions.push({ name: method.name, arguments: arguments, result: result });
          if (this.tools != null) {
            // trigger reload if we are not in the render cycle
            this.setState({});
          }
          return result;
        };
      }
      if (typeof method.val == "function" && method.name == "render") {
        element.prototype.render = function () {
          var _this3 = this;

          if (!this.methodsToDisplay) {
            console.log(originalMethods);
            this.methodsToDisplay = _lodash2.default.map(originalMethods, function (originalMethod) {
              return originalMethod.name;
            });
          }
          this.tools = null;
          if (!this.state) {
            this.state = {};
          }

          var origMethod = method.val.bind(this);
          return _react2.default.createElement(
            "span",
            null,
            _react2.default.createElement(
              "span",
              null,
              origMethod()
            ),
            _react2.default.createElement(DevTools, {
              ref: function ref(_ref2) {
                _this3.tools = _ref2;
              },
              devtoolsVisible: this.state.devtoolsVisible,
              toggleDevTools: function toggleDevTools() {
                _this3.setState({ devtoolsVisible: !_this3.state.devtoolsVisible });
              },
              clearActions: function clearActions() {
                _this3.debugActions = [];_this3.setState({});
              },
              debugActions: this.debugActions,
              addMethod: function addMethod(methodName) {
                _this3.methodsToDisplay.push(methodName);_this3.setState({});
              },
              methodsToDisplay: this.methodsToDisplay,
              allMethods: _lodash2.default.map(originalMethods, function (originalMethod) {
                return originalMethod.name;
              }),
              removeMethod: function removeMethod(methodName) {
                _lodash2.default.remove(_this3.methodsToDisplay, methodName);_this3.setState({});
              }
            })
          );
        };
      }
    });
  };
};

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DevTools = function (_React$Component) {
  _inherits(DevTools, _React$Component);

  function DevTools() {
    _classCallCheck(this, DevTools);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DevTools).call(this));

    _this.state = {};
    _this.state.methodList = true;
    return _this;
  }

  _createClass(DevTools, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var styles = {
        devTools: {
          padding: "40px",
          width: "400px",
          position: "fixed",
          top: "0px",
          bottom: "0px",
          right: this.props.devtoolsVisible ? "0px" : "-360px",
          boxShadow: "1px 1px 1px 1px grey",
          backgroundColor: "white",
          zIndex: "100",
          overflow: "auto"
        },
        action: {
          marginTop: "5px",
          border: "1px solid black",
          borderRadius: 3,
          wordWrap: "break-word",
          padding: "5px"
        },
        openClose: {
          color: "grey",
          cursor: "pointer",
          marginRight: "3px"
        },
        topTools: {
          position: "absolute",
          top: "0px",
          left: "0px",
          width: "100%",
          padding: "5px"
        },
        methodList: {}
      };
      console.log(this.props.allMethods);
      return _react2.default.createElement(
        "div",
        { style: styles.devTools },
        _react2.default.createElement(
          "div",
          { style: styles.topTools },
          _react2.default.createElement(
            "span",
            { style: styles.openClose, onClick: function onClick() {
                _this2.props.toggleDevTools();
              } },
            this.props.devtoolsVisible ? "Close" : "Open"
          ),
          _react2.default.createElement(
            "span",
            { style: styles.openClose, onClick: function onClick() {
                _this2.props.clearActions();
              } },
            "Rerender"
          ),
          _react2.default.createElement(
            "div",
            { style: styles.openClose, onClick: function onClick() {
                _this2.setState({ methodList: !_this2.state.methodList });
              } },
            this.state.methodList ? "Hide method list:" : "Show method list"
          )
        ),
        _react2.default.createElement(
          "div",
          { style: styles.methodList },
          _lodash2.default.map(this.props.allMethods, function (method) {
            return _react2.default.createElement(
              "div",
              { key: method + "_list" },
              _react2.default.createElement("input", { type: "checkbox",
                checked: _lodash2.default.contains(_this2.props.methodsToDisplay, method),
                onChange: function onChange(e) {
                  console.log(e.target.checked);
                  if (e.target.checked) {
                    _this2.props.addMethod(method);
                  } else {
                    _this2.props.removeMethod(method);
                  }
                } }),
              method
            );
          })
        ),
        _lodash2.default.map(this.props.debugActions, function (action, index) {
          var calledString;
          var returnedString;
          try {
            calledString = JSON.stringify(action.arguments, null, 2);
          } catch (e) {
            calledString = "Circular Reference";
          }
          try {
            returnedString = JSON.stringify(action.result, null, 2);
          } catch (e) {
            returnedString = "Circular Reference";
          }

          return _react2.default.createElement(
            "div",
            { key: action.name + "_" + index, style: styles.action },
            _react2.default.createElement(
              "h3",
              null,
              action.name
            ),
            _react2.default.createElement(
              "div",
              { style: { padding: "5px" } },
              "CALLED WITH: ",
              calledString
            ),
            _react2.default.createElement(
              "div",
              { style: { padding: "5px" } },
              "RETURNED: ",
              returnedString
            )
          );
        })
      );
    }
  }]);

  return DevTools;
}(_react2.default.Component);