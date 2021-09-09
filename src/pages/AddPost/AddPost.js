import styled from "styled-components";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { addPost } from "../../WebAPI";

const ErrorMessage = styled.div`
  color: red;
`;

const FormContainer = styled.form`
  width: 50%;
  margin: 0 auto;
`;

const InputContainer = styled.div`
  margin-top: 20px;
`;

const InputTitle = styled.span`
  display: inline-block;
  font-size: 20px;
  margin: 0 10px 5px 0;
  text-align: end;
`;

const InputBox = styled.input`
  width: 100%;
  font-size: 20px;
  display: block;
  padding: 5px 10px;
  box-sizing: border-box;
`;

const TextArea = styled.textarea`
  display: block;
  width: 100%;
  height: 300px;
  font-size: 20px;
  padding: 10px 10px;
  box-sizing: border-box;
`;

const SubmitButton = styled.button`
  margin-top: 20px;
  width: 80px;
  height: 40px;
  font-size: 20px;
  background-color: white;
  border: 1px solid #0008;
  border-radius: 10px;
  display: block;
  margin-left: auto;

  &:hover {
    background-color: #0008;
    color: #fff;
  }
`;

export default function AddPost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();

  const handleOnSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title || !body) {
      setErrorMessage("請填寫標題和內容");
    }

    addPost(title, body).then((response) => {
      if (response.code) {
        setErrorMessage(response.message.toString());
      }
      history.push("/");
    });
  };
  return (
    <FormContainer onSubmit={handleOnSubmit}>
      <InputContainer>
        <InputTitle>標題：</InputTitle>
        <InputBox value={title} onChange={(e) => setTitle(e.target.value)} />
      </InputContainer>
      <InputContainer>
        <InputTitle>內容：</InputTitle>
        <TextArea value={body} onChange={(e) => setBody(e.target.value)} />
      </InputContainer>

      <SubmitButton>確定</SubmitButton>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </FormContainer>
  );
}
