// Parent Component for Profile Component

// Need to check if user is logged in

import React, { Component } from "react";
import firebase from "firebase";
import SignupComponent from "../Signup/SignupComponent";
import LoginComponent from "../Login/LoginComponent";
import LogoutComponent from "../Logout/LogoutComponent";


import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Redirect } from "react-router";
import "./style.css";
import Button from "react-bootstrap/lib/Button";

/* This Component is for setting the profile of the user
  Parent Component of Profile
*/

class AccountComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      age: "",
      bio: "",
      username: "",

      uploadClicked: false,
    };
    this.fetchProfileData = this.fetchProfileData.bind(this);

  }

  saveProfile = this.saveProfile.bind(this);
  goToUpload = this.goToUpload.bind(this);


  componentDidMount() {
    this.fetchProfileData();
  }


  fetchProfileData() {

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var userId = user.uid;
        console.log(userId);
        firebase
          .database()
          .ref("/users/" + userId)
          .once("value")
          .then(snapshot => {
            this.setState({
              loggedIn: true,
              username: snapshot.val().username,
              firstName: snapshot.val().firstName,
              lastName: snapshot.val().lastName,
              age: snapshot.val().age,
              bio: snapshot.val().bio
            });
          });

        console.log("Profile data received");
      } else {
        console.log("No profile data received");
      }
  });
}


  saveProfile(event) {
    event.preventDefault();
    const inputs = event.target.getElementsByTagName("input");

    var username = inputs.username.value;
    var firstName = inputs.firstName.value;
    var lastName = inputs.lastName.value;
    var age = inputs.age.value;
    var bio = inputs.bio.value;

    this.setState(
      {
        username: username,
        firstName: firstName,
        lastName: lastName,
        age: age,
        bio: bio
      },
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          firebase
            .database()
            .ref("users/" + user.uid)
            .set({
              username: this.state.username,
              firstName: this.state.firstName,
              lastName: this.state.lastName,
              age: this.state.age,
              bio: this.state.bio
            });
        } else {
          console.log("Logged in");
        }
      })
    );

    // Clear fields after submission
    inputs.username.value = "";
    inputs.firstName.value = "";
    inputs.lastName.value = "";
    inputs.age.value = "";
    inputs.bio.value = "";
  }

  goToUpload() {
    this.props.history.push('/upload');
  }


  render() {
    {
      if (this.state.loggedIn == null) {
        return (
          <div>
            <Link to="/login">Login</Link> Or <Link to="/signup">Signup</Link>
          </div>
        );
      }

      else {
        return (
          <div>
            <br />
            <br />
            <div className="logout">
              <LogoutComponent history={this.props.history} />
            </div>
            <br />

            <br />
            <Button bsStyle="primary" onClick={this.goToUpload}>
              Upload Icons
            </Button>{" "}

            <form onSubmit={event => this.saveProfile(event)}>
              <div id="profile" className="bio">
                <h1 className="username">{this.state.username}</h1>
                <h1>
                  {this.state.firstName} {this.state.lastName}
                </h1>

                <h3>{this.state.bio}</h3>
                <h4>Age: {this.state.age}</h4>
              </div>
              <input type="text" placeholder="Username" name="username" />

              <input type="text" placeholder="First Name" name="firstName" />

              <input type="text" placeholder="Last Name" name="lastName" />

              <input type="number" placeholder="Age" name="age" />

              <input type="text" placeholder="Bio" name="bio" />

              <Button bsStyle="primary" type="submit">
                Update
              </Button>
            </form>

          </div>
        );
      }
    }



  }
}

export default AccountComponent;
