import api from "./axios";

export const getAllGenres = () => api.get("/genres");

export const getGenreById = (id) => api.get(`/genre/${id}`);
