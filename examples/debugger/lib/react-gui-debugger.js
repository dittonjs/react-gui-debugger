"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function (defaults) {
  if (!COMPONENT_SETUP) {
    COMPONENT_SETUP = true;
  } else {
    throw "Found more that one instance of react-gui-debugger. Only one class can use react-gui-debugger at a time.";
  }

  var _ref = defaults ? defaults : {};

  var ignore = _ref.ignore;
  var matchProp = _ref.matchProp;

  return function (element) {

    var originalMethods = _lodash2.default.map(Object.getOwnPropertyNames(element.prototype), function (key) {
      return { name: key, val: element.prototype[key] };
    });

    _lodash2.default.each(originalMethods, function (method) {
      if (typeof method.val == "function" && !_lodash2.default.contains(["render", "constructor"], method.name)) {
        element.prototype[method.name] = function () {
          var origMethod = method.val.bind(this);

          // react resuses the same event so you cant keep a reference to it unless you persist.
          _lodash2.default.each(arguments, function (arg) {
            if (arg.persist) arg.persist();
          });

          var result = origMethod.apply(undefined, arguments);

          DEBUG_ACTIONS.push({ name: method.name, arguments: arguments, result: result, props: this.props, state: this.state });
          if (this.tools != null && !_lodash2.default.contains(["componentWillUpdate", "componentDidUpdate", "componentWillRecieveProps", "shouldComponentUpdate"], method.name)) {
            // trigger reload if we are not in the render cycle
            this.setState({});
          }
          if (LOADED_COMPONENT) {
            if (LOADED_KEY != this.loaded_key) {
              NEEDS_UPDATE = true;
            }
          }
          return result;
        };
      }

      if (typeof method.val == "function" && method.name == "render") {
        element.prototype.render = function () {
          var _this3 = this;

          if (!this.methodsToDisplay) {
            this.methodsToDisplay = _lodash2.default.map(originalMethods, function (originalMethod) {
              return originalMethod.name;
            });
          }
          this.tools = null;
          if (!this.state) {
            this.state = {};
          }

          var origMethod = method.val.bind(this);
          if (!LOADED_KEY) {
            this.loaded_key = "me";
            LOADED_KEY = "me";
            LOADED_COMPONENT = this;
          }
          if (this.loaded_key != LOADED_KEY) {
            if (!this.updateKey) {
              this.updateKey = "key" + ITERATIONS;
              ITERATIONS++;
            }
            UPDATEABLES[this.updateKey] = this;
            return origMethod();
          }
          return _react2.default.createElement(
            "span",
            null,
            _react2.default.createElement(
              "span",
              null,
              origMethod()
            ),
            _react2.default.createElement(DevTools, _extends({
              ref: function ref(_ref2) {
                _this3.tools = _ref2;
              },
              clearActions: function clearActions() {
                DEBUG_ACTIONS = [];_this3.setState({});_lodash2.default.each(UPDATEABLES, function (u) {
                  return u.setState({});
                });
              },
              allMethods: _lodash2.default.map(originalMethods, function (originalMethod) {
                return originalMethod.name;
              }),
              defaultIgnore: ignore,
              defaultMatch: matchProp
            }, this.props, this.state))
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

var _reactJsonTree = require("react-json-tree");

var _reactJsonTree2 = _interopRequireDefault(_reactJsonTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//===========================================
// GLOBALS
// keeps track of number of rendered components and their
// output, maintains singleton
//===========================================

var LOADED_KEY = "";
var COMPONENT_SETUP = false;
var DEBUG_ACTIONS = [];
var UPDATEABLES = {};
var ITERATIONS = 0;
var LOADED_COMPONENT = null;
var NEEDS_UPDATE = false;

var THEME = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633'
};

//===========================================
// The main dev tool class
//===========================================

var DevTools = function (_React$Component) {
  _inherits(DevTools, _React$Component);

  function DevTools(props) {
    _classCallCheck(this, DevTools);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DevTools).call(this));

    _this.state = {};
    _this.state.methodList = true;
    _this.state.matchKey = "";
    _this.state.matchValue = "";
    _this.state.activeMethods = _lodash2.default.filter(props.allMethods, function (method) {
      return !_lodash2.default.contains(props.defaultIgnore, method);
    });
    _this.allMethods = _lodash2.default.filter(props.allMethods, function (method) {
      return !_lodash2.default.contains(["constructor", "render"], method);
    });
    return _this;
  }

  _createClass(DevTools, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (NEEDS_UPDATE) {
        NEEDS_UPDATE = false;
        this.setState({});
      }
    }
  }, {
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
          right: this.state.devtoolsVisible ? "0px" : "-360px",
          boxShadow: "1px 1px 1px 1px grey",
          backgroundColor: "rgb(43,48,59)",
          zIndex: "100",
          color: "white",
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
        methodList: {
          display: this.state.methodList ? "" : "none"
        }
      };

      var filteredDebugActions = _lodash2.default.filter(DEBUG_ACTIONS, function (action) {
        var matchedProps = true;
        if (_this2.state.matchKey) {
          matchedProps = _lodash2.default.get(action, _this2.state.matchKey) == _this2.state.matchValue;
        }
        return _lodash2.default.contains(_this2.state.activeMethods, action.name) && matchedProps;
      });
      return _react2.default.createElement(
        "div",
        { style: styles.devTools },
        _react2.default.createElement(
          "div",
          { style: styles.topTools },
          _react2.default.createElement(
            "span",
            { style: styles.openClose, onClick: function onClick() {
                _this2.setState({ devtoolsVisible: !_this2.state.devtoolsVisible });
              } },
            this.state.devtoolsVisible ? "Close" : "Open"
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
          _lodash2.default.map(this.allMethods, function (method) {
            return _react2.default.createElement(
              "div",
              { key: method + "_list" },
              _react2.default.createElement("input", { type: "checkbox",
                checked: _lodash2.default.contains(_this2.state.activeMethods, method),
                onChange: function onChange(e) {
                  if (e.target.checked && !_lodash2.default.contains(_this2.state.activeMethods, method)) {
                    var newMethodList = _lodash2.default.cloneDeep(_this2.state.activeMethods);
                    newMethodList.push(method);
                    _this2.setState({ activeMethods: newMethodList });
                  } else if (!e.target.checked && _lodash2.default.contains(_this2.state.activeMethods, method)) {
                    var newMethodList = _lodash2.default.cloneDeep(_this2.state.activeMethods);
                    _lodash2.default.remove(newMethodList, function (oldMethod) {
                      return method == oldMethod;
                    });
                    _this2.setState({ activeMethods: newMethodList });
                  }
                }
              }),
              method
            );
          })
        ),
        _react2.default.createElement(
          "div",
          null,
          _react2.default.createElement(
            "div",
            null,
            "Path",
            _react2.default.createElement("input", { type: "text", onChange: function onChange(e) {
                return _this2.setState({ matchKey: e.target.value });
              } })
          ),
          _react2.default.createElement(
            "div",
            null,
            "Value",
            _react2.default.createElement("input", { type: "text", onChange: function onChange(e) {
                return _this2.setState({ matchValue: e.target.value });
              } })
          )
        ),
        _lodash2.default.map(filteredDebugActions, function (action, index) {
          var calledString;
          var returnedString;

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
              _react2.default.createElement(_reactJsonTree2.default, { theme: THEME, isLightTheme: false, data: { arguments: action.arguments }, hideRoot: true })
            ),
            _react2.default.createElement(
              "div",
              { style: { padding: "5px" } },
              "RETURNED: ",
              _react2.default.createElement(_reactJsonTree2.default, { theme: THEME, isLightTheme: false, data: { result: action.result }, hideRoot: true })
            )
          );
        })
      );
    }
  }]);

  return DevTools;
}(_react2.default.Component);

//======================================================
// The debugger decorator
//======================================================