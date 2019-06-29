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
    const authUrl = "http://w.stg-api.covenantsql.io:15153/v3/auth/authorize/github"
    window.location.href = authUrl
    // const name = "CQL Github Login"
    // const specs = "width=500,height=600,top=200,left=500"
    // window.open(authUrl, name, specs)
  }
  render () {
    return (
      <div>
        <h2>Home</h2>
        <button className="login-button" onClick={this.loginGithub}>
          Login from Github
        </button>
        <a href="http://w.stg-api.covenantsql.io:15153/v3/auth/authorize/github">
          Login from Github
        </a>
      </div>
    )
  }
}

class Callback extends React.Component {
  requestCQLToken = () => {
    const callbackUrl = "http://w.stg-api.covenantsql.io:15153/v3/auth/callback/github"
    const search = window.location.search
    // const state = search.match(new RegExp('[?&]state=([^&#]*)'))[1]
    // const code = search.match(new RegExp('[?&]code=([^&#]*)'))[1]
    // console.log('//------ from Github:', state, code)

    const requestTokenUrl = callbackUrl + search

    fetch(requestTokenUrl, {
      method: 'POST',
      credentials: 'include'
      // headers: {
      //   'Accept': 'application/json',
      //   'Content-Type': 'application/json'
      // },
      // body: JSON.stringify({ state, code })
    })
    .then(res => {
      return res.json()
    })
    .then(data => {
      console.log('//------ CQL TOKEN:', data)
    })
  }
  render () {
    return (
      <div>
        <h2>Callback...</h2>
        <button className="login-button" onClick={this.requestCQLToken}>
          Request For CQL Token
        </button>
      </div>
    )
  }
}

export default App;
