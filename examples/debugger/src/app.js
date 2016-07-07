import React              from "react";
import ReactDOM           from "react-dom";
import ReactGuiDebugger   from "./react-gui-debugger";

@ReactGuiDebugger({ignore: ["onButton"]})
class AnIteratedComponent extends React.Component {
  plus100(someInt){
    return someInt + 100;
  }
  render(){
    return <div>{this.plus100(this.props.number.num)}</div>
  }
}


class MyClass extends React.Component {
  constructor(){
    super();
  }

  componentDidMount(){
    // do some mounty stuff here
  }
  componentWillUpdate(nextProps, nextState){
    // do some updaty stuff here
  }
  componentDidUpdate(){
    // do some more stuff here
  }

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
        {
          _.map([1,2,3,4,5], (num)=>{
            return <AnIteratedComponent key={num} number={{num, wayDeep: {stillDeeper: num}}}/>
          })
        }
      </div>
    );
  }
}

ReactDOM.render(<MyClass props={{a: 1, b:2, c:3}}/>, document.getElementById("main-app"));
