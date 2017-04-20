import React, { Component } from 'react';
import '../styles/App.css';

import Header from './Header';
import Body from './Body';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <Header />
        </div>
        <div className="App-intro">
          <Body />
        </div>
      </div>
    );
  }
}

export default App;
