import React, { Component } from "react";
import firebase from "firebase";
//import { createBrowserHistory } from "history";


import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Button from "react-bootstrap/lib/Button";


class LogoutComponent extends Component {
  constructor(props) {
    super(props);
  }

  logoutUser = this.logoutUser.bind(this);

  logoutUser() {
    firebase.auth().signOut(); // Log user out
    this.props.history.push('/login');
  }

  render() {
    return (
      <div>
        <Button bsStyle="danger" onClick={this.logoutUser}>
          Logout
        </Button>
      </div>
    );
  }
}

export default LogoutComponent;
