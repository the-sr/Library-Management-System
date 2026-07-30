import api from "./axios";

export const borrowRequest = (bookId) =>
  api.post("/borrow-request", null, { params: { bookId } });

export const cancelBorrowRequest = (bookId) =>
  api.delete("/cancel-borrow-request", { params: { bookId } });

export const returnRequest = (userBookId) =>
  api.post("/return-request", null, { params: { userBookId } });

export const cancelReturnRequest = (userBookId) =>
  api.delete("/cancel-return-request", { params: { userBookId } });

export const getUserBookById = (userBookId) =>
  api.get(`/user-book/${userBookId}`);

export const getUserBooks = (params) => api.get("/user-books", { params });

export const handleBorrowRequest = (userBookId) =>
  api.put("/user-book/handle-borrow-request", null, { params: { userBookId } });

export const handleReturnRequest = (userBookId) =>
  api.put("/user-book/handle-return-request", null, {
    params: { userBookId },
  });
