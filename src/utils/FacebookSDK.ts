import conf from "@/config";

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
      { config_id: conf.FACEBOOK_CONFIG_ID }
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

export const getFbLocales = (q: string) => {
  return new Promise((resolve) => {
    window.FB.api(
      "/search",
      {
        type: "adlocale",
        q: q,
      },
      (response) => {
        resolve(response);
      }
    );
  });
};
