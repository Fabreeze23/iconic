import React, { Component } from "react";
import firebase from "firebase";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Redirect } from "react-router";
import style from "./style.css";
import Button from "react-bootstrap/lib/Button";


import LoginComponent from "../Login/LoginComponent";

class SignupComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signedUp: false,
    };
  }

  saveSignupInput = this.saveSignupInput.bind(this);

  saveSignupInput(event) {
    event.preventDefault();
    const inputs = event.target.getElementsByTagName("input");

    var email = inputs.email.value;
    var password = inputs.password.value;

    var usernameVal = inputs.username.value;
    var firstNameVal = inputs.firstName.value;
    var lastNameVal = inputs.lastName.value;
    var ageVal = inputs.age.value;
    var bioVal = inputs.bio.value;

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });

      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function() {

          return firebase.auth().signInWithEmailAndPassword(email, password);
        })
        .catch(function(error) {

          var errorCode = error.code;
          var errorMessage = error.message;

        });


    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase
          .database()
          .ref("users/" + user.uid)
          .set({
            id: user.uid,
            username: usernameVal,
            firstName: firstNameVal,
            lastName: lastNameVal,
            age: ageVal,
            bio: bioVal
          });

        this.setState({
          signedUp: true
        });
      } else {
        console.log("Logged in");
      }
    });

    this.props.history.push("/account");

  }

  render() {
    {
      if (this.state.signedUp === true) {
        return <Redirect to="/account" />;
      }
    }

    return (
      <div>
        <Link to="/login">Login</Link>

        <form className="form-signin" onSubmit={event => this.saveSignupInput(event)}>
          <br />
          <input type="text" placeholder="First Name" name="firstName" />
          <br />
          <br />

          <input type="text" placeholder="Last Name" name="lastName" />
          <br />
          <br />

          <input type="number" placeholder="Age" name="age" />
          <br />
          <br />

          <input type="text" placeholder="Bio" name="bio" />
          <br />
          <br />
          <input type="text" placeholder="Email" name="email" />
          <br />
          <br />

          <input type="text" placeholder="Username" name="username" />
          <br />
          <br />

          <input type="password" placeholder="Password" name="password" />
          <br />
          <br />




          <Button bsStyle="primary" type="submit"> Sign Up</Button>
        </form>
      </div>
    );
  }
}

export default SignupComponent;
