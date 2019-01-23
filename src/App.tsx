import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import createHashHistory from 'history/createHashHistory';
import StoryMap from './containers/storyMap/StoryMap';
import StoryHome from './containers/storyMap/StoryHome';
import LoginPanel from './containers/login/LoginPanel';
import RegisterPanel from './containers/register/CreativeRegister';
const hashHistory = createHashHistory();
class App extends React.Component {
  state = {}
  public render() {
    return (
      <Router>
        <Switch>
          <Route exact={true} path="/">
            <LoginPanel />
          </Route>
          <Route exact={true} path="/register">
            <RegisterPanel />
          </Route>
          <Route exact={true} path="/home">
            <StoryHome />
          </Route>
          <Route exact={true} path="/home/card/:id">
            <StoryMap />
          </Route>
          </Switch>
      </Router>
    );
  }

}
export default App;
