import { WebAuth } from "auth0-js";
import history from "../utils/history";
import config from "./auth_config.json";

export default class Auth {
  auth0 = new WebAuth({
    domain: config.Auth_Domain,
    clientID: config.Auth_ClientId,
    redirectUri: config.Auth_Callback,
    responseType: "token id_token",
    scope: "openid profile email"
  });

  tokenRenewalTimeout;

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.scheduleRenewal(); // call if want renewal automatically
  }

  login() {
    this.auth0.authorize();
     this.scheduleRenewal(); // call if want renewal automatically
  }

  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("user");
    clearTimeout(this.tokenRenewalTimeout);
    this.auth0.logout();
    history.replace("/");
  }

  handleAuthentication() {
    if (typeof window !== "undefined") {
      this.auth0.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          this.setSession(authResult);
          history.replace("/");
        } else if (err) {
          history.replace("/");
          console.log(err);
        }
      });
    }
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    return new Date().getTime() < expiresAt;
  }
  scheduleRenewal() {
    if (typeof window !== "undefined") {
      const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
      const delay = expiresAt - Date.now();
      if (delay > 0) {
        this.tokenRenewalTimeout = setTimeout(() => {
          this.renewToken();
        }, delay);
      }
    }
  }

  setSession(authResult) {
    const expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime());
    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", expiresAt);
    this.auth0.client.userInfo(authResult.accessToken, (err, user) => {
      localStorage.setItem("user", JSON.stringify(user));
      history.replace("/");
    });
    this.scheduleRenewal();
  }

  renewToken() {
    this.auth0.checkSession({}, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        this.setSession(result);
      }
    });
  }

  getUser() {
    if (localStorage.getItem("user")) {
      return JSON.parse(localStorage.getItem("user"));
    }
  }

  getUserName() {
    if (this.getUser()) {
      return this.getUser().name;
    }
  }

  getAccessToken() {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      throw new Error("No access token found");
    }
    return accessToken;
  }
}
