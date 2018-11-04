import React, { Component } from "react";
import firebase from "firebase";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Redirect } from "react-router";

import SignupComponent from "../Signup/SignupComponent";
import createHistory from "history/createBrowserHistory";
import Button from "react-bootstrap/lib/Button";
import "./style.css";


class LoginComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false //Will determine if I redirect to Profile
    };
  }

  saveLoginInput = this.saveLoginInput.bind(this);

  saveLoginInput(event) {
    event.preventDefault();
    const inputs = event.target.getElementsByTagName('input');



    var inputEmail: '';
    var inputPassword: ''
    inputEmail = inputs.email.value;
    inputPassword = inputs.password.value;

 //Persistence needs to be set to Local
 firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
   .then(function() {
     // Existing and future Auth states are now persisted in the current
     // session only. Closing the window would clear any existing state even
     // if a user forgets to sign out.
     // ...
     // New sign-in will be persisted with session persistence.
     return firebase.auth().signInWithEmailAndPassword(inputEmail, inputPassword);
   })
   .catch(function(error) {
     // Handle Errors here.
     var errorCode = error.code;
     var errorMessage = error.message;



   });

   this.props.history.push("/account");

   }

  render() {
    {
      if (this.state.loggedIn === true) {
        return <Redirect to="/account" />;
      }
    }

    return (
      <div>
        <Link to="/signup">Signup</Link>

        <br />
        <br />

        <form className="form-signin" onSubmit={this.saveLoginInput}>
          <input type="email" placeholder="email" name="email" />

          <input type="password" placeholder="password" name="password" />

          <Button bsStyle="primary" type="submit"> Login</Button>
        </form>
      </div>
    );
  }
}

export default LoginComponent;
