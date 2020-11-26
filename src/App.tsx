import React, { Suspense } from "react";
import logo from "./logo.svg";
import "./App.css";
import MainNav from "./components/MainNav";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
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
          <Suspense fallback={<span>Loading...</span>}>
            <Switch>
              <Route path="/tradeModels" exact component={Trades} />
              {/* use react-awesome-query-builder for trigger conditions*/}
              {/* <Route path="/businessEvents" exact component={BusinessEvents} /> */}
              <Route path="**" exact>
                <Redirect to="/tradeModels" />
              </Route>
              {/* component={Home} /> */}
            </Switch>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
