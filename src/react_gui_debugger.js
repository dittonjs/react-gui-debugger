"use strict";

import React                   from "react";
import _                       from "lodash";
import toString                from "lodash.tostring";

export default function(options){
  var {ignore, focus, matchProp} = options ? options : {};
  return function(element){
    console.log(element.prototype)

    var originalMethods = _.map(Object.getOwnPropertyNames(element.prototype), function(key){
      return {name: key, val: element.prototype[key]}
    });

    _.each(originalMethods, function(method){
      if(typeof method.val == "function" && !_.contains(["render", "constructor", "getState"], method.name)){
        element.prototype[method.name] = function(){
          console.log("CALLED: " + method.name);
          var origMethod = method.val.bind(this);
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
          if(!this.debugActions) this.debugActions = [];
          this.debugActions.push({name: method.name, arguments, result});
          console.log("made it here")
          return result;
        }
      }
      if(typeof method.val == "function" && method.name == "render"){
        element.prototype.render = function(){
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
              marginRight:"3px"
            },
            topTools: {
              position: "absolute",
              top: "0px",
              left: "0px",
              width: "100%",
              padding: "5px"
            }
          }

          var origMethod = method.val.bind(this);
          return (
            <span>
              <span>{origMethod()}</span>
              <div style={styles.devTools}>
                <div style={styles.topTools}>
                  <span style={styles.openClose} onClick={()=>{this.setState({devtoolsVisible: !this.state.devtoolsVisible})}}>{this.state.devtoolsVisible ? "Close" : "Open"}</span>
                  <span style={styles.openClose} onClick={()=>{this.debugActions=[]; this.setState({})}}>Rerender</span>
                </div>
                {
                  _.map(this.debugActions, (action)=>{
                    var calledString;
                    var returnedString;

                    try {
                      calledString = JSON.stringify(action.arguments, null, 2);
                    } catch(e){
                      calledString = "Circular Reference";
                    }
                    try{
                      returnedString = JSON.stringify(action.arguments, null, 2);
                    } catch(e){
                      returnedString = "Circular Reference";
                    }

                    return (
                      <div style={styles.action}>
                        <h3>{action.name}</h3>
                        <div style={{padding: "5px"}}>CALLED WITH: {calledString}</div>
                        <div style={{padding: "5px"}}>RETURNED: {returnedString}</div>
                      </div>
                    )
                  })
                }
              </div>
            </span>
          );
        }
      }
    });
  }
}
