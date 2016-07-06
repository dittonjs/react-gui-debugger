import React              from "react";
import ReactDOM           from "react-dom";
import ReactGuiDebugger   from "./react-gui-debugger";

@ReactGuiDebugger({})
class MyClass extends React.Component {
  squared(anInt){
    return anInt * anInt;
  }

  cubed(anInt){
    return anInt * anInt * anInt;
  }

  onButton(e){
    //do some stuff
    return "You cant really return from this kind of method but whatever...";
  }

  render(){
    return (
      <div>
        <h2>My Squared number: {this.squared(10)}</h2>
        <h2>My Cubed number: {this.cubed(10)}</h2>
        <button onClick={e=>this.onButton(e)}>click me</button>
      </div>
    );
  }
}

ReactDOM.render(<MyClass props={{a: 1, b:2, c:3}}/>, document.getElementById("main-app"));
