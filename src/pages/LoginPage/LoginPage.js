import { useState, useContext } from "react";
import { login, getMe } from "../../WebAPI";
import styled from "styled-components";
import { setAuthToken } from "../../components/utils";
import { useHistory } from "react-router-dom";
import { AuthoContext } from "../../contexts";

const ErrorMessage = styled.div`
  color: red;
`;

const FormContainer = styled.form`
  text-align: center;
`;

const InputContainer = styled.div`
  margin-top: 20px;
`;

const InputTitle = styled.span`
  display: inline-block;
  width: 100px;
  font-size: 20px;
  margin-right: 10px;
  text-align: end;
`;

const InputBox = styled.input`
  height: 20px;
`;

const SubmitButton = styled.button`
  margin-top: 20px;
  width: 80px;
  height: 40px;
  font-size: 20px;
  background-color: white;
  border: 1px solid #0008;
  border-radius: 10px;

  &:hover {
    background-color: #0008;
    color: #fff;
  }
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

    if (!username || !password)
      return setErrorMessage("請填寫 Username 和 Password");

    login(username, password).then((data) => {
      if (data.ok === 0) {
        return setErrorMessage(data.message);
      }
      setAuthToken(data.token);
      getMe(data.token).then((response) => {
        if (response.ok !== 1) {
          setAuthToken(null);
          return setErrorMessage(response.message.toString());
        }

        setUser(response.data);
        history.push("/");
      });
    });
  };
  return (
    <FormContainer onSubmit={handleSubmit}>
      <InputContainer>
        <InputTitle>Username：</InputTitle>
        <InputBox
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </InputContainer>
      <InputContainer>
        <InputTitle>Password:</InputTitle>
        <InputBox
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </InputContainer>
      <SubmitButton>登入</SubmitButton>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </FormContainer>
  );
}
