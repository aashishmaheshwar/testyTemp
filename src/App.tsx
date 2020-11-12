import React from "react";
import logo from "./logo.svg";
import "./App.css";
import MainNav from "./components/MainNav";
import { BrowserRouter as Router } from "react-router-dom";
import Trades from "./components/Trades";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <MainNav />
        </header>
        <main className="App__content">
          {/* routes will come here */}
          <Trades />
        </main>
      </div>
    </Router>
  );
}

export default App;
