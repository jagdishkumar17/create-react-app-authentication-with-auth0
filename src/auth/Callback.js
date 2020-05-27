import React, { Component } from 'react';
import { RingLoader } from "react-spinners";
const override = `
position: absolute;
height: 100px;
width: 100px;
top: 50%;
left: 50%;
margin-left: -50px;
margin-top: -50px;
background-size: 100%;
`;
class Callback extends Component {

  render() {
    return (
      <div >
        <header>
          <div className="container">
            <div className="row">
              <div className="col-md-12 col-sm-12 ">
                <RingLoader css={override} size={70} color={"#FF9933"} loading={true} />

                {/* <h4 className="white">This is the auth callback page, you should be redirected immediately.</h4> */}
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default Callback;