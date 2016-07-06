"use strict";

import React                   from "react";
import _                       from "lodash";


class DevTools extends React.Component {
  constructor(){
    super();
    this.state = {};
    this.state.methodList = true;
  }
  render(){
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

      }
    }
    console.log(this.props.allMethods);
    return (
      <div style={styles.devTools}>
        <div style={styles.topTools}>
          <span style={styles.openClose} onClick={()=>{this.props.toggleDevTools()}}>{this.props.devtoolsVisible ? "Close" : "Open"}</span>
          <span style={styles.openClose} onClick={()=>{this.props.clearActions();}}>Rerender</span>
          <div style={styles.openClose}  onClick={()=>{this.setState({methodList: !this.state.methodList})}}>{this.state.methodList ? "Hide method list:" : "Show method list"}</div>
        </div>
        <div style={styles.methodList}>
          {
            _.map(this.props.allMethods, (method)=>{
              return (
                <div key={method+"_list"}>
                  <input type="checkbox"
                    checked={_.contains(this.props.methodsToDisplay, method)}
                    onChange={ (e)=>{
                      console.log(e.target.checked);
                      if(e.target.checked){
                        this.props.addMethod(method)
                      } else {
                        this.props.removeMethod(method)
                      }
                    }}/>{method}
                </div>
              )
            })
          }
        </div>
        {
          _.map(this.props.debugActions, (action, index)=>{
            var calledString;
            var returnedString;
            try {
              calledString = JSON.stringify(action.arguments, null, 2);
            } catch(e){
              calledString = "Circular Reference";
            }
            try{
              returnedString = JSON.stringify(action.result, null, 2);
            } catch(e){
              returnedString = "Circular Reference";
            }

            return (
              <div key={`${action.name}_${index}`} style={styles.action}>
                <h3>{action.name}</h3>
                <div style={{padding: "5px"}}>CALLED WITH: {calledString}</div>
                <div style={{padding: "5px"}}>RETURNED: {returnedString}</div>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default function(options){
  var {ignore, focus, matchProp} = options ? options : {};
  return function(element){

    var originalMethods = _.map(Object.getOwnPropertyNames(element.prototype), function(key){
      return {name: key, val: element.prototype[key]}
    });

    _.each(originalMethods, function(method){
      if(typeof method.val == "function" && !_.contains(["render", "constructor", "getState"], method.name)){
        element.prototype[method.name] = function(){
          var origMethod = method.val.bind(this);

          // react resuses the same event so you cant keep a reference to it unless you persist.
          _.each(arguments, (arg)=>{if(arg.persist) arg.persist()});

          var result = origMethod(...arguments);
          if(ignore && ignore.length && _.contains(ignore, method.name)){
            return result;
          }
          if(focus && focus.length && !_.contains(focus, method.name)){
            return result;
          }
          if(matchProp && matchProp.length && this.props[matchProp[0]] != matchProp[1]){
            return result;
          }
          if(!_.contains(this.methodsToDisplay, method.name)){
            return result;
          }
          if(!this.debugActions) this.debugActions = [];

          this.debugActions.push({name: method.name, arguments, result});
          if(this.tools != null){
            // trigger reload if we are not in the render cycle
            this.setState({});
          }
          return result;
        }
      }
      if(typeof method.val == "function" && method.name == "render"){
        element.prototype.render = function(){
          if(!this.methodsToDisplay){
            console.log(originalMethods);
            this.methodsToDisplay = _.map(originalMethods,(originalMethod)=>(originalMethod.name));
          }
          this.tools = null;
          if(!this.state){
            this.state = {}
          }

          var origMethod = method.val.bind(this);
          return (
            <span>
              <span>{origMethod()}</span>
              <DevTools
                ref              = {(ref)=>{this.tools = ref}}
                devtoolsVisible  = {this.state.devtoolsVisible}
                toggleDevTools   = {()=>{this.setState({devtoolsVisible: !this.state.devtoolsVisible})}}
                clearActions     = {()=>{this.debugActions = []; this.setState({});}}
                debugActions     = {this.debugActions}
                addMethod        = {(methodName)=>{this.methodsToDisplay.push(methodName); this.setState({})}}
                methodsToDisplay = {this.methodsToDisplay}
                allMethods       = {_.map(originalMethods,(originalMethod)=>(originalMethod.name))}
                removeMethod     = {(methodName)=>{_.remove(this.methodsToDisplay, methodName); this.setState({})}}
              />
            </span>
          );
        }
      }
    });
  }
}
