import { create } from "zustand";

const useUiStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  snackbar: { open: false, message: "", severity: "info" },
  showSnackbar: (message, severity = "info") =>
    set({ snackbar: { open: true, message, severity } }),
  closeSnackbar: () =>
    set((state) => ({ snackbar: { ...state.snackbar, open: false } })),
}));

export default useUiStore;
