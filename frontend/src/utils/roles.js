export const ROLES = {
  ADMIN: "ADMIN",
  LIBRARIAN: "LIBRARIAN",
  MEMBER: "MEMBER",
};

export const isAdmin = (user) => user?.role === ROLES.ADMIN;
export const isLibrarian = (user) => user?.role === ROLES.LIBRARIAN;
export const isMember = (user) => user?.role === ROLES.MEMBER;

export const canManageBooks = (user) =>
  isAdmin(user) || isLibrarian(user);

export const canManageUsers = (user) =>
  isAdmin(user) || isLibrarian(user);

export const canHandleBorrowRequests = (user) =>
  isLibrarian(user);

export const canGenerateReports = (user) =>
  isAdmin(user);
