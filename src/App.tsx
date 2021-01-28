import React, { Suspense } from "react";
import "./App.css";
import MainNav from "./components/MainNav";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
const Trades = React.lazy(() => import("./components/Trades"));
const BusinessEvent = React.lazy(() => import("./components/BusinessEvent"));
const RuleModel = React.lazy(() => import("./components/RuleModel"));
const BusinessRuleMapper = React.lazy(
  () => import("./components/BusinessRuleMapper")
);

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
                render={(props) => <BusinessEvent {...props} isNew={true} />}
              />
              <Route
                path="/ruleModel"
                exact
                render={(props) => <RuleModel {...props} isNew={true} />}
              />
              <Route
                path="/businessRuleMapper"
                exact
                render={(props) => (
                  <BusinessRuleMapper {...props} isNew={true} />
                )}
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
