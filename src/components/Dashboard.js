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
