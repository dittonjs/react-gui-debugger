"use strict";

import React                   from "react";
import _                       from "lodash";
import JSONTree                from "react-json-tree";

//===========================================
// GLOBALS
// keeps track of number of rendered components and their
// output, maintains singleton
//===========================================

var LOADED_KEY = "";
var COMPONENT_SETUP = false;
var DEBUG_ACTIONS  = [];
var UPDATEABLES    = {};
var ITERATIONS = 0;
var LOADED_COMPONENT = null;
var NEEDS_UPDATE = false;

const THEME = {
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

class DevTools extends React.Component {

  constructor(props){
    super();
    this.state = {};
    this.state.methodList = true;
    this.state.matchKey = "";
    this.state.matchValue = "";
    this.state.activeMethods = _.filter(props.allMethods, (method)=>(!_.contains(props.defaultIgnore, method)));
    this.allMethods = _.filter(props.allMethods, (method)=>(!_.contains(["constructor", "render"], method)));
  }

  componentDidUpdate(){
    if(NEEDS_UPDATE){
      NEEDS_UPDATE = false;
      this.setState({});
    }
  }

  render(){
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
        marginRight:"3px"
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
    }

    var filteredDebugActions = _.filter(DEBUG_ACTIONS,(action)=>{
      var matchedProps = true;
      if(this.state.matchKey){
        matchedProps = _.get(action, this.state.matchKey) == this.state.matchValue;
      }
      return _.contains(this.state.activeMethods, action.name) && matchedProps;
    })
    return (
      <div style={styles.devTools}>
        <div style={styles.topTools}>
          <span style={styles.openClose} onClick={()=>{this.setState({devtoolsVisible: !this.state.devtoolsVisible})}}>{this.state.devtoolsVisible ? "Close" : "Open"}</span>
          <span style={styles.openClose} onClick={()=>{this.props.clearActions();}}>Rerender</span>
          <div style={styles.openClose}  onClick={()=>{this.setState({methodList: !this.state.methodList})}}>{this.state.methodList ? "Hide method list:" : "Show method list"}</div>
        </div>
        <div style={styles.methodList}>
          {
            _.map(this.allMethods, (method)=>{
              return (
                <div key={method+"_list"}>
                  <input type="checkbox"
                    checked={_.contains(this.state.activeMethods, method)}
                    onChange={ (e)=>{
                      if(e.target.checked && !_.contains(this.state.activeMethods, method)){
                        var newMethodList = _.cloneDeep(this.state.activeMethods);
                        newMethodList.push(method);
                        this.setState({activeMethods: newMethodList});
                      } else if(!e.target.checked && _.contains(this.state.activeMethods, method)) {
                        var newMethodList = _.cloneDeep(this.state.activeMethods);
                        _.remove(newMethodList, (oldMethod)=>(method==oldMethod));
                        this.setState({activeMethods: newMethodList});
                      }
                    }}
                  />{method}
                </div>
              )
            })
          }
        </div>
        <div>
          <div>Path<input type="text" onChange={(e)=>this.setState({matchKey: e.target.value})} /></div>
          <div>Value<input type="text" onChange={(e)=>this.setState({matchValue: e.target.value})} /></div>
        </div>
        {
          _.map(filteredDebugActions, (action, index)=>{
            var calledString;
            var returnedString;

            return (
              <div key={`${action.name}_${index}`} style={styles.action}>
                <h3>{action.name}</h3>
                <div style={{padding: "5px"}}>CALLED WITH: <JSONTree theme={THEME} isLightTheme={false} data={{arguments: action.arguments}} hideRoot/></div>
                <div style={{padding: "5px"}}>RETURNED: <JSONTree theme={THEME} isLightTheme={false} data={{result:action.result}} hideRoot/></div>
              </div>
            )
          })
        }
      </div>
    )
  }
}


//======================================================
// The debugger decorator
//======================================================
export default function(defaults){
  if(!COMPONENT_SETUP){
    COMPONENT_SETUP = true;
  } else {
    throw "Found more that one instance of react-gui-debugger. Only one class can use react-gui-debugger at a time.";
  }
  var {ignore, matchProp} = defaults ? defaults : {};
  return function(element){

    var originalMethods = _.map(Object.getOwnPropertyNames(element.prototype), function(key){
      return {name: key, val: element.prototype[key]}
    });

    _.each(originalMethods, function(method){
      if(typeof method.val == "function" && !_.contains(["render", "constructor"], method.name)){
        element.prototype[method.name] = function(){
          var origMethod = method.val.bind(this);

          // react resuses the same event so you cant keep a reference to it unless you persist.
          _.each(arguments, (arg)=>{if(arg.persist) arg.persist()});

          var result = origMethod(...arguments);


          DEBUG_ACTIONS.push({name: method.name, arguments, result, props: this.props, state: this.state});
          if(this.tools != null && !_.contains(["componentWillUpdate", "componentDidUpdate", "componentWillRecieveProps", "shouldComponentUpdate"], method.name)){
            // trigger reload if we are not in the render cycle
            this.setState({});
          }
          if(LOADED_COMPONENT){
            if(LOADED_KEY != this.loaded_key){
              NEEDS_UPDATE = true;
            }
          }
          return result;
        }
      }

      if(typeof method.val == "function" && method.name == "render"){
        element.prototype.render = function(){
          if(!this.methodsToDisplay){
            this.methodsToDisplay = _.map(originalMethods,(originalMethod)=>(originalMethod.name));
          }
          this.tools = null;
          if(!this.state){
            this.state = {}
          }

          var origMethod = method.val.bind(this);
          if(!LOADED_KEY){
            this.loaded_key = "me";
            LOADED_KEY      = "me";
            LOADED_COMPONENT = this;
          }
          if(this.loaded_key != LOADED_KEY) {
            if(!this.updateKey){
              this.updateKey = "key"+ITERATIONS;
              ITERATIONS++;
            }
            UPDATEABLES[this.updateKey] = this;
            return origMethod();
          }
          return (
            <span>
              <span>{origMethod()}</span>
              <DevTools
                ref              = {(ref)=>{this.tools = ref}}
                clearActions     = {()=>{DEBUG_ACTIONS = []; this.setState({}); _.each(UPDATEABLES, (u)=>u.setState({}))}}
                allMethods       = {_.map(originalMethods,(originalMethod)=>(originalMethod.name))}
                defaultIgnore    = {ignore}
                defaultMatch     = {matchProp}
                {...this.props}
                {...this.state}
              />
            </span>
          );
        }
      }
    });
  }
}
