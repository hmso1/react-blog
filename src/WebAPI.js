import { getAuthToken } from "./utils";

const BASE_URL = "https://student-json-api.lidemy.me";

export const getPosts = (page) => {
  return fetch(
    `${BASE_URL}/posts?_sort=createdAt&_order=desc&_page=${page}&_limit=5`
  ).then((resp) => {
    const postsAmount = resp.headers.get("x-total-count");
    const postsContent = resp.json();
    return { postsAmount, postsContent };
  });
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

export const register = (username, nickname, password) => {
  return fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username, nickname, password }),
  }).then((resp) => resp.json());
};

export const addPost = (title, body) => {
  const token = getAuthToken();
  console.log(title, body);
  return fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ title: title, body: body }),
  }).then((resp) => resp.json());
};
