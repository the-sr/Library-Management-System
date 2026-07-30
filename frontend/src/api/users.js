import api from "./axios";

export const getMe = () => api.get("/user/me");

export const updateMe = (data) => api.put("/user/me", data);

export const updatePassword = (data) => api.put("/user/update-password", data);

export const getUserById = (id) => api.get(`/user/${id}`);

export const getAllUsers = (status) =>
  api.get("/users", { params: status !== undefined ? { status } : {} });

export const getPageWiseUsers = (params) =>
  api.get("/page-wise-users", { params });

export const deleteUser = (id) => api.delete(`/user/${id}`);

export const addProfilePicture = (formData) =>
  api.post("/user/add-profile-picture", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
