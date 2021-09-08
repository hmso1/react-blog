import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts";
import { setAuthToken } from "../../utils";

const HeaderContainer = styled.div`
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  padding: 0px 32px;
  box-sizing: border-box;
  background-color: white;
`;

const Brand = styled.div`
  font-size: 32px;
  font-weight: bold;
`;

const NavbarList = styled.div`
  display: flex;
  align-items: center;
`;

const Nav = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 64px;
  box-sizing: border-box;
  width: 100px;
  cursor: pointer;
  color: black;
  text-decoration: none;

  ${(props) =>
    props.$active &&
    `
    background: rgba(0, 0, 0, 0.1);
  `}
`;
const LeftContainer = styled.div`
  display: flex;
  align-items: center;

  ${NavbarList} {
    margin-left: 64px;
  }
`;

export default function Header() {
  const location = useLocation();
  const { user, setUser, isGettingUser } = useContext(AuthContext);

  const handleLogout = () => {
    setAuthToken("");
    setUser(null);
  };
  return (
    <HeaderContainer>
      <LeftContainer>
        <Brand>我的第一個部落格</Brand>
        <NavbarList>
          <Nav to="/" $active={location.pathname === "/"}>
            首頁
          </Nav>
          <Nav to="/about" $active={location.pathname === "/about"}>
            關於我們
          </Nav>
          {user && (
            <Nav to="/new_post" $active={location.pathname === "/new_post"}>
              發佈文章
            </Nav>
          )}
        </NavbarList>
      </LeftContainer>
      {!isGettingUser && (
        <NavbarList>
          {!user && (
            <Nav to="/register" $active={location.pathname === "/register"}>
              註冊
            </Nav>
          )}
          {!user && (
            <Nav to="/login" $active={location.pathname === "/login"}>
              登入
            </Nav>
          )}
          {user && (
            <Nav to="/" onClick={handleLogout}>
              登出
            </Nav>
          )}
        </NavbarList>
      )}
    </HeaderContainer>
  );
}
