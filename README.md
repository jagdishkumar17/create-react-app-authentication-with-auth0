# Authentication using auth0 in react js

This sample demonstrates:

- Logging in to Auth0 using Redirect Mode
- Accessing profile information that has been provided in the ID token
- The `/dashboard` route is not accessible without having first logged in
![Image of Login](https://github.com/jagdishkumar17/create-react-app-authentication-with-auth0/assests/images/login.PNG)
![Image of Auth login page](https://github.com/jagdishkumar17/create-react-app-authentication-with-auth0/blob/master/src/assests/images/authlogin.PNG)
![Image of Dashboard](https://github.com/jagdishkumar17/create-react-app-authentication-with-auth0/assests/images/dashboard.PNG)
## Project setup

Use `yarn` or `npm` to install the project dependencies:

```bash
# Using npm..
npm install

# Using yarn..
yarn install
```

## npm packages required

```bash
# auth0..
npm install auth0-js --save

# react-spinners..
npm install --save react-spinners
```

### Configuration

The project needs to be configured with your Auth0 domain and client ID in order for the authentication flow to work.

To do this, in `src/auth/auth_config.json` replace the values with your own Auth0 application credentials:

```json
{
  "Auth_Callback": "{YOUR AUTH0 Callback URL}",
  "Auth_Domain": "{YOUR AUTH0 CLIENT ID}",
  "Auth_ClientId": "{YOUR AUTH0 CLIENT ID}"
}
```

# What is Auth0?

Auth0 helps you to:

- Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, among others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
- Add authentication through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
- Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
- Support for generating signed [Json Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.

## How to set up React and Auth0 for easy authentication on your next project

### Step 1: Get an Auth0 account

1. Go to [Auth0](https://auth0.com/signup) and click Sign Up.
2. Use Google, GitHub or Microsoft Account to login.

### Step 2: Create an app, get domain and client id
Now that we have our auth0 account we want to start to create a new auth application. Click Applications on the side menu and then click Create Application

Enter in any name for your application and make sure to select Single Page Web Applications. After hitting okay, you should be redirected to the application page for the app you just created. If you not you can do the following

1. Click on Applications in the side menu
2. Click on your application name
3. Click on Settings

### Step 3: Whitelist your callback URL

Now we need to add our Callback URLs in. The Callback URL is a trusted URL for your application. Auth0 redirects the client to this URL once authentication is completed. If the client is redirected to a URL that isn’t on this list the authentication will fail.

1. Scroll further down to the section Allowed Callback URLs
2. Since are using the default port and IP address for Gatsby, enter - http://localhost:3000/callback
3. Scroll to the bottom of the page and click save changes


### Step 4: Start a new react project

```bash
npx create-react-app my-app
```

### Step 5: Copy `utils` folder and its files from this sample to your project inside `src` folder

This `utils`  folder contains: 

- history.js -- this file is helpful when creating routes and navigates to another components

```bash
import { createBrowserHistory } from 'history';
export default createBrowserHistory();
```

### Step 6: Copy `auth` folder and its all files from this sample to your project inside `src` folder

This `auth`  folder contains: 

- auth_config.json -- This file stored your own Auth0 application credentials
- Auth.js --- It contain main logic for auth0
- Callback.js -- Auth0 redirects the client to this URL once authentication is completed
- SecureRoute.js -- It secure the routes which are needs to not accessible without having first logged in

### Auth.js
Our Auth file is where all the magic happens. I’ll post the entire files contents and break it down piece by piece.
```bash
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

```

### auth0
```
auth0 = new WebAuth({
    domain: config.Auth_Domain,
    clientID: config.Auth_ClientId,
    redirectUri: config.Auth_Callback,
    responseType: "token id_token",
    scope: "openid profile email"
  });

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.scheduleRenewal(); // call if want renewal automatically
  }
```
This snippet creates a new auth0 object for us to authenticate against. The constructor binds the functions within this class to its instance.

#### Login/Logout
The login function starts the authentication method and the logout function removes all Auth0 authentication data from the browser and returns the user back to the page of your choosing. We will be implementing these functions into buttons/links within our app.

#### handleAuthentication
When the login button is pressed, auth0 will redirect the client to their authentication page. After the user puts their information in they are redirected to the callback url. The callback url will then run the handleAuthentication function and attempt to authenticate the user. If the attempt is successfully the function will attempt to set up a new session for the user.

#### setSession
If authentication is successful we will store the users token and expiration time in the browser.

#### isAuthenticated
isAuthenticated is a function that will return either true or false. If the user is currently authenticated, the return value will be true, if not it will be false. We will be using this function to protect our routes.

#### getAccessToken
This function returns the users authentication token. This is useful if you were to implement protected API routes on your backend. I have a full tutorial here that describes the topic in more depth

#### getUserName
Returns the authenticated users name.

#### getUser
Returns the authenticated users detail like picture, nickname, email, name .

### Callback Component
The callback component will handle the applications authentication when a user attempts to log in.
This component is displayed in the browser while the client is waiting to be authenticated.

### Protect Components

Next we’re going to display components based on whether the user is authenticated or not. This will be a basic use showing how to protect a component. You can extend this example however you see fit using the same logic. 
This sample contain SecureRoute.js file inside auth folder which contain logic to check user is authenticated or not. use this file when creating the routes to protect the routes.
e.g. in this sample we  protect `/dasboard` route as :
```
 <Router history={history}>
        <Switch>
          <Route
            path="/callback"
            render={props => {
              handleAuthentication(props);
              return <Callback {...props} />;
            }}
          />
          {/* BASE  ROUTES  */}
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route exact path="/login" component={Login} />
          <SecureRoute exact path="/dashboard" component={Dashboard} />
          }/>
        </Switch>
      </Router>
```
```
 <SecureRoute exact path="/dashboard" component={Dashboard} />
```

### Step 6: Creating components Login, Logout, Dashboard(profile)

```
Login.js - check isAuthenticated, if Authenticated redirect to Dashboard else redirect to auth login
Logout.js - contains functionality for logout from app
Dashboard.js - contains user profile information after Authentication
```
#### Login.js
```
import React, { Component } from "react";
import { RingLoader } from "react-spinners";
import Auth from "../auth/Auth";
const auth = new Auth();

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = `
position: absolute;
height: 100px;
width: 100px;
top: 60%;
left: 50%;
margin-left: -50px;
margin-top: -50px;
background-size: 100%;
`;
class LoginButton extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    debugger;
    var isAuthenticated = auth.isAuthenticated();
    if(isAuthenticated)
    {
      this.props.history.push("/dashboard");
    }
    else{
      this.login();
    }

   // this.setState({ authenticated: isAuthenticated });
  }

  login() {
    auth.login();
  }

  render() {
    return (
      <div >
        <header>
          <div className="container">
            <div className="row">
              <div className="col-md-12 col-sm-12 ">
                <RingLoader css={override} size={70} color={"#FF9933"} loading={true} />

                {/* <h4 className="tm-title">This is the auth page, you should be redirected to auth0 immediately.</h4> */}
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default LoginButton;

```

#### Logout.js
```
import React, { Component } from "react";
import Auth from "../auth/Auth";
const auth = new Auth();
class LogoutButton extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout() {
    auth.logout();
  }

  render() {
    return (
      <button className="btn btn-primary"
        onClick={() => {
          this.logout();
        }}
      >
        Log out
      </button>
    );
  }
}

export default LogoutButton;

```

#### Dashboard.js
```
import React, { Component } from "react";
import Logout from "./Logout";
import Auth from "../auth/Auth";
import { RingLoader } from "react-spinners";
const auth = new Auth();
const override = `
position: absolute;
height: 100px;
width: 100px;
top: 60%;
left: 50%;
margin-left: -50px;
margin-top: -50px;
background-size: 100%;
`;

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      accessToken:""
    }
  }
  componentDidMount() {
    var  userDetail  = auth.getUser();
    var token  = auth.getAccessToken();

    this.setState({
      user:userDetail,
      accessToken: token
    });
  }
  render() {
    debugger;
    if (!this.state.user) {
      return  <RingLoader css={override} size={70} color={"#FF9933"} loading={true} />;
    }
    return (
      <div>
        <header>
          <div className="container">
            <div className="row">
              <div className="col-md-12 col-sm-12">
                <img
                  src={this.state.user.picture || ""}
                  className="img-responsive img-circle tm-border"
                  alt="templatemo easy profile"
                />
                <hr />
                <h1 className="tm-title bold shadow">Hi, I am {this.state.user.nickname || ""}</h1>
                <h1 className="white bold shadow">{this.state.user.email || ""}</h1>
              </div>
            </div>
          </div>
        </header>

        <section className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="contact">
                <h2>Profile</h2>
                <p>
                email: {this.state.user.email || ""}
                </p>
            
                <p>
                name: {this.state.user.name || ""}
                </p>
                <p>
                nickname: {this.state.user.nickname || ""}
                </p>
                <p>updated_at: {this.state.user.updated_at || ""}</p>
                <p>AccessToken : {this.state.accessToken || ""}</p>
                <p>   <Logout /></p>
              </div>
            </div>
           
           
          </div>
        </section>

     
      </div>
    );
  }
}

export default Dashboard;

```


### Step 6: Creating routes and handle authentication on app.js
On App.js we need to handle authtication(id authticated then setSession) using auth.handleAuthentication() and create the routes for the app .
```
const auth = new Auth();

const handleAuthentication = ({ location }) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
};

```

```
 <Router history={history}>
        <Switch>
          <Route
            path="/callback"
            render={props => {
              handleAuthentication(props);
              return <Callback {...props} />;
            }}
          />
          {/* BASE  ROUTES  */}
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route exact path="/login" component={Login} />
          <SecureRoute exact path="/dashboard" component={Dashboard} />
          }/>
        </Switch>
      </Router>
```

#### App.js
```
import React, { Component } from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Auth from "./auth/Auth";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import history from "./utils/history";
import Callback from "./auth/Callback";
import SecureRoute from "./auth/SecureRoute";

const auth = new Auth();

const handleAuthentication = ({ location }) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
};

class App extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route
            path="/callback"
            render={props => {
              handleAuthentication(props);
              return <Callback {...props} />;
            }}
          />
          {/* BASE  ROUTES  */}
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route exact path="/login" component={Login} />
          <SecureRoute exact path="/dashboard" component={Dashboard} />
          }/>
        </Switch>
      </Router>
    );
  }
}

export default App;

```

In the routes we secure dashboard route by using SecureRoute and keep login as public.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section