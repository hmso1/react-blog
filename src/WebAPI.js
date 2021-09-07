const BASE_URL = "https://student-json-api.lidemy.me";

export const getPosts = () => {
  return fetch(`${BASE_URL}/posts?_sort=createdAt&_order=desc`).then((resp) =>
    resp.json()
  );
};

export const getPost = (id) => {
  return fetch(`${BASE_URL}/posts/${id}`).then((resp) => resp.json());
};

export const login = (username, password) => {
  return fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username, password }),
  }).then((resp) => resp.json());
};

export const getMe = (token) => {
  return fetch(`${BASE_URL}/me`, {
    headers: { authorization: `Bearer ${token}` },
  }).then((resp) => resp.json());
};
