import styled from "styled-components";

const PageButtonContainer = styled.div`
  margin-top: 50px;
  text-align: center;
`;

const Button = styled.button`
  width: 80px;
  font-size: 20px;
  padding: 5px 0;
  background-color: white;
  border: 1px solid black;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #000a;
    color: #fff;
  }

  & + & {
    margin-left: 10px;
  }
`;

const PageBreak = styled.p`
  display: inline-block;
  font-size: 20px;
  padding: 0 20px;
`;

function PageButton({ page, setCurrentPage }) {
  const handleOnClick = () => {
    setCurrentPage(page);
  };
  return <Button onClick={handleOnClick}>{`第 ${page} 頁`}</Button>;
}

export default function Pagination({
  currentPage,
  numberOfPosts,
  setCurrentPage,
}) {
  const pages = [1];

  if (currentPage === 1) {
    pages.push(currentPage + 1, "space");
  } else if (currentPage === 2) {
    pages.push(currentPage, currentPage + 1, "space");
  } else {
    pages.push("space", currentPage - 1, currentPage, currentPage + 1, "space");
  }

  pages.push(Math.ceil(numberOfPosts / 5));

  return (
    <PageButtonContainer>
      {pages.map((page, index) => {
        if (page === "space") return <PageBreak>...</PageBreak>;
        return (
          <PageButton key={index} page={page} setCurrentPage={setCurrentPage} />
        );
      })}
    </PageButtonContainer>
  );
}
