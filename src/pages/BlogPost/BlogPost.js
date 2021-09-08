import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { getPost } from "../../WebAPI";

const Root = styled.div`
  width: 50%;
  margin: 0 auto;
`;

const PostContainer = styled.div``;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #0005;
`;

const PostTitle = styled.h1`
  font-size: 20px;
  width: 75%;
`;

const PostDate = styled.div`
  margin: auto 0;
`;

const PostBody = styled.div`
  padding-top: 20px;
`;

function Post({ post }) {
  return (
    <PostContainer>
      <PostHeader>
        <PostTitle>{post.title}</PostTitle>
        <PostDate>{new Date(post.createdAt).toLocaleString()}</PostDate>
      </PostHeader>
      <PostBody>{post.body}</PostBody>
    </PostContainer>
  );
}

const BackToHome = styled(Link)`
  display: block;
  color: #222;
  padding-top: 20px;
  text-decoration: none;

  &:hover {
    color: pink;
  }
`;

export default function BlogPost() {
  const [post, setPost] = useState([]);
  let { id } = useParams();

  useEffect(() => {
    getPost(id).then((post) => setPost(post));
  }, [id]);
  console.log(post);
  return (
    <Root>
      <Post post={post} />
      <BackToHome to="/">{"<- 返回首頁"}</BackToHome>
    </Root>
  );
}
