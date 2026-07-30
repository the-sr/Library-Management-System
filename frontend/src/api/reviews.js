import api from "./axios";

export const addReview = (data) => api.post("/add-review", data);

export const updateReview = (data) => api.put("/review", data);

export const deleteReview = (id) => api.delete(`/review/${id}`);

export const getReviewsByBook = (bookId) =>
  api.get("/review-by-book", { params: { bookId } });

export const getReviewsByUser = (userId) =>
  api.get("/reviews-by-user", { params: { userId } });
