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
