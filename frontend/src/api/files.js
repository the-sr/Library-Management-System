import api from "./axios";

export const getFile = (fileName) =>
  api.get("/file", { params: { fileName }, responseType: "blob" });

export const addPreferredGenres = (genreIds) =>
  api.post("/add-preferred-genre", genreIds);

export const getPreferredGenres = (userId) =>
  api.get("/preferred-genre", { params: { userId } });

export const removePreferredGenre = (genreId) =>
  api.delete("/remove-preferred-genres", { params: { genreId } });

export const addPreferredAuthors = (authorIds) =>
  api.post("/add-preferred-author", authorIds);

export const getPreferredAuthors = (userId) =>
  api.get("/preferred-authors", { params: { userId } });

export const removePreferredAuthor = (authorId) =>
  api.delete("/remove-preferred-authors", { params: { authorId } });
