import styled from "styled-components";
import { useState, useContext } from "react";

import { register, getMe } from "../../WebAPI";
import { setAuthToken } from "../../utils";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../contexts";

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
  width: 180px;
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

export default function Register() {
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setUser } = useContext(AuthContext);
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username || !nickname || !password || !confirmedPassword)
      return setErrorMessage("請填寫所有欄位");

    if (password !== confirmedPassword) return setErrorMessage("輪入密碼不同");
    if (username === nickname)
      return setErrorMessage("Username 和 Nickname 不可以一樣");

    register(username, nickname, password).then((data) => {
      console.log(data);
      if (data.ok !== 1) {
        return setErrorMessage(data.message.toString());
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
        <InputTitle>Nickname</InputTitle>
        <InputBox
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
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
      <InputContainer>
        <InputTitle>Confirm Password:</InputTitle>
        <InputBox
          type="password"
          value={confirmedPassword}
          onChange={(e) => setConfirmedPassword(e.target.value)}
        />
      </InputContainer>
      <SubmitButton>註冊</SubmitButton>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </FormContainer>
  );
}
