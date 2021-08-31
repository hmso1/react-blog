import "./App.css";
import styled from "styled-components";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Header from "../Header";
import HomePage from "../../pages/HomePage";
import LoginPage from "../../pages/LoginPage";

const Root = styled.div`
  padding-top: 60px;
`;

function App() {
  return (
    <Root>
      <Router>
        <Header />
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/login">
            <LoginPage />
          </Route>
        </Switch>
      </Router>
    </Root>
  );
}

export default App;
