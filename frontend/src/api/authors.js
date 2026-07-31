import api from "./axios";

export const createAuthor = (data) => api.post("/author", data);

export const getAllAuthors = () => api.get("/authors");

export const getAuthorById = (id) => api.get(`/author/${id}`);
