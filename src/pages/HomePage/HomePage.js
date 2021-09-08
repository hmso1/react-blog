import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { getPosts } from "../../WebAPI";
import Pagination from "../../components/Pagination";

const Root = styled.div`
  width: 50%;
  margin: 0 auto;
`;

const PostsContainer = styled.div`
  height: 325px;
`;

const PostContainer = styled.div`
  border-bottom: 1px solid rgba(0, 12, 34, 0.2);
  padding: 16px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const PostTitle = styled(Link)`
  font-size: 24px;
  color: #333;
  text-decoration: none;
`;

const PostDate = styled.div`
  color: rgba(0, 0, 0, 0.8);
`;

function Post({ post }) {
  return (
    <PostContainer>
      <PostTitle to={`/posts/${post.id}`}>{post.title}</PostTitle>
      <PostDate>{new Date(post.createdAt).toLocaleString()}</PostDate>
    </PostContainer>
  );
}

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [numberOfPosts, setNumberOfPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getPosts(currentPage)
      .then(({ postsAmount, postsContent }) => {
        setNumberOfPosts(postsAmount);
        return postsContent;
      })
      .then((posts) => setPosts(posts));
  }, [currentPage]);
  console.log(currentPage);

  return (
    <Root>
      <PostsContainer>
        {posts.map((post) => {
          return <Post key={post.id} post={post} />;
        })}
      </PostsContainer>

      <Pagination
        currentPage={currentPage}
        numberOfPosts={numberOfPosts}
        setCurrentPage={setCurrentPage}
      />
    </Root>
  );
}
