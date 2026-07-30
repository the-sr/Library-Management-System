import api from "./axios";

export const getAllAuthors = () => api.get("/authors");

export const getAuthorById = (id) => api.get(`/author/${id}`);
