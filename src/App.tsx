import React, { Suspense } from "react";
import "./App.css";
import MainNav from "./components/MainNav";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
const Trades = React.lazy(() => import("./components/Trades"));
const BusinessEvents = React.lazy(() => import("./components/BusinessEvents"));
const Rules = React.lazy(() => import("./components/Rules"));
const BusinessRules = React.lazy(() => import("./components/BusinessRules"));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
                  render={() => <BusinessEvents />}
                />
                <Route path="/ruleModel" exact render={() => <Rules />} />
                <Route
                  path="/businessRuleMapper"
                  exact
                  render={() => <BusinessRules />}
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
    </QueryClientProvider>
  );
}

export default App;
