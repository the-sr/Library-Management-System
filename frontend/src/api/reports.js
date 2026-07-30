import api from "./axios";

export const generateLibraryReport = (reportFormat) =>
  api.get("/report/library", { params: { reportFormat }, responseType: "blob" });

export const generateUserReport = (userId, reportFormat) =>
  api.get("/report/user", {
    params: { userId, reportFormat },
    responseType: "blob",
  });
