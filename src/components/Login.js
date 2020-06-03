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
    var isAuthenticated = auth.isAuthenticated();
    if(isAuthenticated)
    {
     this.props.history.push("/dashboard");
    }
    else{
     this.login();
    }
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

                <h4 className="tm-title">This is the auth page, you should be redirected to auth0 immediately.</h4>
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default LoginButton;
