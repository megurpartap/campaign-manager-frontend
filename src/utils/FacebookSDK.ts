export const getFacebookLoginStatus = () => {
  return new Promise((resolve) => {
    window.FB.getLoginStatus((response) => {
      resolve(response);
    });
  });
};

export const fbLogin = () => {
  return new Promise((resolve) => {
    window.FB.login(
      (response) => {
        resolve(response);
      },
      { config_id: "703228478688597" }
    );
  });
};

export const fbLogout = () => {
  return new Promise((resolve) => {
    window.FB.logout((response) => {
      resolve(response);
    });
  });
};
