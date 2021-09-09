import "./App.css";
import styled from "styled-components";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../Header";
import HomePage from "../../pages/HomePage";
import LoginPage from "../../pages/LoginPage";
import BlogPost from "../../pages/BlogPost";
import Register from "../../pages/Register";
import AboutMe from "../../pages/AboutMe";
import AddPost from "../../pages/AddPost";

import { AuthContext } from "../../contexts";
import { getMe } from "../../WebAPI";
import { getAuthToken, setAuthToken } from "../../utils";

const Root = styled.div`
  padding-top: 60px;
`;

function App() {
  const [user, setUser] = useState(null);
  const [isGettingUser, setIsGettingUser] = useState(true);

  useEffect(() => {
    // 有 token 先 call api
    const token = getAuthToken();
    if (token === "") return setIsGettingUser(false);

    getMe(token).then((response) => {
      if (response.ok === 1) {
        setUser(response.data);
      } else {
        setAuthToken("");
        setUser(null);
      }
      setIsGettingUser(false);
    });
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser, isGettingUser }}>
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
            <Route exact path="/register">
              <Register />
            </Route>
            <Route exact path="/about">
              <AboutMe />
            </Route>
            <Route exact path="/new_post">
              <AddPost />
            </Route>
          </Switch>
        </Router>
      </Root>
    </AuthContext.Provider>
  );
}

export default App;
