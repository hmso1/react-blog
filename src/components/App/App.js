import "./App.css";
import styled from "styled-components";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../Header";
import HomePage from "../../pages/HomePage";
import LoginPage from "../../pages/LoginPage";
import BlogPost from "../../pages/BlogPost";
import { AuthoContext } from "../../contexts";
import { getMe } from "../../WebAPI";
import { getAuthToken } from "../utils";

const Root = styled.div`
  padding-top: 60px;
`;

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 有 token 先 call api
    const token = getAuthToken();
    if (token === "") return;

    getMe(token).then((response) => {
      if (response.ok) {
        setUser(response.data);
      }
    });
  }, []);
  return (
    <AuthoContext.Provider value={{ user, setUser }}>
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
            <Route exact path="/posts/:id">
              <BlogPost />
            </Route>
          </Switch>
        </Router>
      </Root>
    </AuthoContext.Provider>
  );
}

export default App;
