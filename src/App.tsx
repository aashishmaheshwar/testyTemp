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
import BusinessEvents from "./components/BusinessEvents";
import Rules from "./components/Rules";

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
              <Route path="/tradeModel" exact component={Trades} />
              <Route
                path="/businessEvent"
                exact
                render={(props) => <BusinessEvents {...props} isNew={true} />}
              />
              <Route
                path="/ruleModel"
                exact
                render={(props) => <Rules {...props} isNew={true} />}
              />
              <Route path="**" exact>
                <Redirect to="/tradeModel" />
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
