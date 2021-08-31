const BASE_URL = "https://student-json-api.lidemy.me";

export const getPosts = () => {
  return fetch(`${BASE_URL}/posts?_sort=createdAt&_order=desc`).then((resp) =>
    resp.json()
  );
};
