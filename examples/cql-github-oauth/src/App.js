import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends React.Component {
  render () {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
          </header>

          <Route exact path="/" component={Home} />
          <Route path="/callback" component={Callback} />
        </div>
      </Router>
    );
  }
}

class Home extends React.Component {
  loginGithub = () => {
    const url = "http://testproject.stg-api.covenantsql.io:15153/v3/auth/authorize/github"
    const name = "CQL Github Login"
    const specs = "width=500,height=600,top=200,left=500"
    window.open(url, name, specs)
  }
  render () {
    return (
      <div>
        <h2>Home</h2>
        <button className="login-button" onClick={this.loginGithub}>
          Login from Github
        </button>
      </div>
    )
  }
}

class Callback extends React.Component {
  render () {
    return (
      <div>
        <h2>Callback...</h2>
      </div>
    )
  }
}

export default App;
