import api from "./axios";

export const signIn = (data) => api.post("/public/sign-in", data);

export const signUp = (data) => api.post("/public/sign-up", data);

export const activateAccount = (data) =>
  api.post("/public/activate-account", data);

export const sendOtp = (identifier) =>
  api.post("/public/otp", { identifier });

export const validateOtp = (data) => api.post("/public/validate-otp", data);

export const forgotPassword = (identifier) =>
  api.post("/public/forgot-password", { identifier });

export const resetPassword = (data) => api.put("/public/reset-password", data);
