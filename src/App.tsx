import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import createHashHistory from 'history/createHashHistory';
import data from './data.json';
import './styles.css';
import Board from 'react-trello';
import LoginPanel from './containers/login/LoginPanel';
import RegisterPanel from './containers/register/CreativeRegister';
const hashHistory = createHashHistory();
class App extends React.Component {
  state = {}
  public render() {
    return (
      <div className="App">
      <Router>
        <Switch>
          <Route exact={true} path="/">
            <LoginPanel />
          </Route>
          <Route exact={true} path="/register">
            <RegisterPanel />
          </Route>
          <Route exact={true} path="/home/:id">
            <Board data={data} draggable />
          </Route>
          </Switch>
      </Router>
      </div>
    );
  }

}
export default App;
// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);
