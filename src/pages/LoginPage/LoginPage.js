import { useState, useContext } from "react";
import { login, getMe } from "../../WebAPI";
import styled from "styled-components";
import { setAuthToken } from "../../components/utils";
import { useHistory } from "react-router-dom";
import { AuthoContext } from "../../contexts";

const ErrorMessage = styled.div`
  color: red;
`;

export default function LoginPage() {
  const { setUser } = useContext(AuthoContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);
    login(username, password).then((data) => {
      if (data.ok === 0) {
        return setErrorMessage(data.message);
      }
      setAuthToken(data.token);
      getMe(data.token).then((response) => {
        if (response.ok !== 1) {
          setAuthToken(null);
          return setErrorMessage(response.toString());
        }

        setUser(response.data);
        history.push("/");
      });
    });
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        username:{" "}
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        password:{" "}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button>登入</button>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </form>
  );
}
