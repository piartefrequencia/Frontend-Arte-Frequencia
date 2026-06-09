let logoutFunction: (() => void) | undefined;

export const setLogout = (fn: () => void) => {
  logoutFunction = fn;
};

export const triggerLogout = () => {
  if (logoutFunction) {
    logoutFunction();
  }
};
