import styled from "styled-components";
const Root = styled.p`
  width: 50%;
  margin: 30px auto;
  font-size: 20px;
`;

const FunctionList = styled.ol``;

const Item = styled.li`
  & + & {
    margin-top: 15px;
  }
`;

export default function AboutMe() {
  return (
    <Root>
      <p>
        這是一個 Lidemy Mentor Program 的功課。過程中會用到 React 來實作 Blog
        的基本功能，包括：
      </p>
      <FunctionList>
        <Item>登入頁面：以 JWT 來做登入驗證</Item>
        <Item>註冊頁面：成功後會驗證 JWT 並返回首頁</Item>
        <Item>文章列表頁面：每頁只顯示 5 筆文章，提供分頁功能</Item>
        <Item>單篇文章頁面：可以看到文章完整內容</Item>
        <Item>發表文章頁面：登入後，可以輸入標題跟內文發文</Item>
      </FunctionList>
    </Root>
  );
}
