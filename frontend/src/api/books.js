import api from "./axios";

export const getAllBooks = () => api.get("/books");

export const getBookById = (id) => api.get(`/book/${id}`);

export const getBooksByTitle = (title) =>
  api.get("/books-by-title", { params: { title } });

export const getBooksByAuthor = (author) =>
  api.get("/books-by-author", { params: { author } });

export const getBooksByGenre = (genre) =>
  api.get("/books-by-genre", { params: { genre } });

export const getPageWiseBooks = (params) =>
  api.get("/page-wise-books", { params });

export const addBook = (data) => api.post("/add-book", data);

export const updateBook = (data) => api.put("/book", data);

export const deleteBook = (id) => api.delete(`/book/${id}`);

export const addAuthorsToBook = (bookId, authors) =>
  api.put(`/book/add-author`, authors, { params: { bookId } });

export const removeAuthorFromBook = (bookId, authorId) =>
  api.put(`/book/remove-author`, null, { params: { bookId, authorId } });

export const addGenresToBook = (bookId, genres) =>
  api.put(`/book/add-genre`, genres, { params: { bookId } });

export const removeGenreFromBook = (bookId, genreId) =>
  api.put(`/book/remove-genre`, null, { params: { bookId, genreId } });
