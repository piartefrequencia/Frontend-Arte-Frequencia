

let logoutFunction;

export const setLogout = (fn) => {
  logoutFunction = fn;
};

export const triggerLogout = () => {
  if (logoutFunction) {
    logoutFunction();
  }
};