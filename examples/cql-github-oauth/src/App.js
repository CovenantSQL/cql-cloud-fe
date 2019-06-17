import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  loginGithub = () => {
    alert('login')
  }
  render () {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <button
            className="login-button"
            onClick={this.loginGithub}
          >
            Login from Github
          </button>
        </header>
      </div>
    );
  }
}

export default App;
