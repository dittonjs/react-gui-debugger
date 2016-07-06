"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (options) {
  var _ref = options ? options : {};

  var ignore = _ref.ignore;
  var focus = _ref.focus;
  var matchProp = _ref.matchProp;

  return function (element) {
    console.log(element.prototype);

    var originalMethods = _lodash2.default.map(Object.getOwnPropertyNames(element.prototype), function (key) {
      return { name: key, val: element.prototype[key] };
    });

    _lodash2.default.each(originalMethods, function (method) {
      if (typeof method.val == "function" && !_lodash2.default.contains(["render", "constructor", "getState"], method.name)) {
        element.prototype[method.name] = function () {

          console.log("CALLED: " + method.name);
          var origMethod = method.val.bind(this);
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
          if (!this.debugActions) this.debugActions = [];
          console.log(result);
          this.debugActions.push({ name: method.name, arguments: arguments, result: result });
          console.log("made it here");

          return result;
        };
      }
      if (typeof method.val == "function" && method.name == "render") {
        element.prototype.render = function () {
          var _this = this;

          if (!this.state) {
            this.state = {};
          }
          if (!this.enqueUpdate) {
            this.enqueUpdate = 0;
          }
          var styles = {
            devTools: {
              padding: "40px",
              width: "400px",
              position: "fixed",
              top: "0px",
              bottom: "0px",
              right: this.state.devtoolsVisible ? "0px" : "-360px",
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
            }
          };

          var origMethod = method.val.bind(this);
          return _react2.default.createElement(
            "span",
            null,
            _react2.default.createElement(
              "span",
              null,
              origMethod()
            ),
            _react2.default.createElement(
              "div",
              { style: styles.devTools },
              _react2.default.createElement(
                "div",
                { style: styles.topTools },
                _react2.default.createElement(
                  "span",
                  { style: styles.openClose, onClick: function onClick() {
                      _this.setState({ devtoolsVisible: !_this.state.devtoolsVisible });
                    } },
                  this.state.devtoolsVisible ? "Close" : "Open"
                ),
                _react2.default.createElement(
                  "span",
                  { style: styles.openClose, onClick: function onClick() {
                      _this.debugActions = [];_this.setState({});
                    } },
                  "Rerender"
                )
              ),
              _lodash2.default.map(this.debugActions, function (action, index) {
                var calledString;
                var returnedString;
                console.log(action.arguments);
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
            )
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