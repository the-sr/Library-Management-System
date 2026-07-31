import { create } from "zustand";

const getInitialMode = () => {
  try {
    return localStorage.getItem("themeMode") || "light";
  } catch {
    return "light";
  }
};

const useUiStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  themeMode: getInitialMode(),
  toggleTheme: () =>
    set((state) => {
      const next = state.themeMode === "light" ? "dark" : "light";
      try {
        localStorage.setItem("themeMode", next);
      } catch {}
      return { themeMode: next };
    }),

  snackbar: { open: false, message: "", severity: "info" },
  showSnackbar: (message, severity = "info") =>
    set({ snackbar: { open: true, message, severity } }),
  closeSnackbar: () =>
    set((state) => ({ snackbar: { ...state.snackbar, open: false } })),
}));

export default useUiStore;
