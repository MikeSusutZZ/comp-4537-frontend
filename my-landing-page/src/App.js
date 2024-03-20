import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="leftSide">
        <h1>Insert Title Here</h1>
      </div>
      <div className="rightSide">
        {/* Sign Up Form */}
        <div className="authForm">
          <h2>Sign Up</h2>
          <form>
            <input type="text" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button type="submit">Sign Up</button>
          </form>
        </div>
        {/* Log In Form */}
        <div className="authForm">
          <h2>Log In</h2>
          <form>
            <input type="text" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button type="submit">Log In</button>
          </form>
        </div>
        {/* Place for connecting to the backend authentication API */}
        {/* You can use fetch or Axios to connect to your API within these forms */}
      </div>
    </div>
  );
}

export default App;
