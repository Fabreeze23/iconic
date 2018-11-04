import React, { Component } from "react";
import { Switch, Route, Link } from 'react-router-dom';

import IconListComponent from '../IconList/IconListComponent';

import firebase from "firebase";
import FileUploader from "react-firebase-file-uploader";
import InputGroup from "react-bootstrap/lib/InputGroup";
import Button from "react-bootstrap/lib/Button";



import './style.css';

const avatarFallbackImage =
  "https://s3.amazonaws.com/onename/avatar-placeholder.png";

// File upload for the icon. Name is required, I normally would use redux form.


export default class IconUploadComponent extends Component {
  constructor(props) {
    super(props);


    this.state = {
      username: '',
      firstName: '',
      lastName: '',
      userId: '',
      isUploading: false,
      progress: 0,
      avatarURL: "",
      image: null,
      url: '',
      uploadMessage: '',
      iconName: '',
      emptyName: true,
      iconList: [],
    };

    this.checkLoggedIn = this.checkLoggedIn.bind(this);
    this.renderIconList = this.renderIconList.bind(this);
  }

  componentDidMount() {
    this.checkLoggedIn();

    var myUserId = this.state.userId

    var myIconsRef = firebase.database().ref(`/icons/${myUserId}/`);

        var iconList = [];

        myIconsRef.on('child_added', (dataSnapshot) => {

          console.log(dataSnapshot.val());
          iconList.push(dataSnapshot.val());
          console.log(iconList);
           this.setState({
             iconList: iconList

           }, console.log(iconList));
        });

  }

renderIconList(icon) {
   var shortenedName = icon.name.substring(0, icon.name.length-4);
    return (
      <div class="listbox-area">
        <li key={icon.id} name="icon">
          {shortenedName}
          <img
           src={icon.url}
           />
        </li>


        </div>
       )
}

  // The file name will be set to state
  //handleIconName = this.handleIconName.bind(this);

// Standard non redux function checking for being logged in.
  checkLoggedIn() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (user) {
          var userId = user.uid;
          console.log(userId);
          firebase
            .database()
            .ref("/users/" + userId)
            .once("value")
            .then(snapshot => {
              this.setState({
                username: snapshot.val().username,
                firstName: snapshot.val().firstName,
                lastName: snapshot.val().lastName,
                userId: userId,
              });
            });

          return (user);
        }
      } else {
        return (null);
      }
    });
  }

  handleIconName(event) {
    event.preventDefault();
    const iconName = event.target.value;

    if (iconName.length > 0) {
      this.setState({
        iconName: iconName,
        emptyName: false,
      })
    }

    // Sets emptyName back to false if user types input then clears again.
    else {
      this.setState({
        iconName: iconName,
        emptyName: true,
      })
    }

  }

  handleUploadSuccess(filename) {
    firebase
      .storage()
      .ref(`${this.state.userId}/icons/`)
      .child(filename)
      .getDownloadURL()
      .then(url => {


        var iconKey = firebase.database().ref().child('icons').push().key;
        var myIcon = {
          name: filename,
          url: url,
          id: iconKey,
        }

        var myUsername = this.state.username;
        var firstName = this.state.firstName;
        var lastName = this.state.lastName;
        var myID = this.state.userId;

        var updates = {};
        updates[`icons/${myID}/${iconKey}`] = myIcon;
        this.setState({uploadMessage: `${firstName}, the icon is now uploaded!`})
        return firebase.database().ref().update(updates);
      });
  };

  render() {

    {
      if (this.checkLoggedIn !== null) {
        return (
        <div>

          <Link to="/account">Home</Link>

          <br />
          <br />
          <center>
            <form className="form-upload">
                  <h2> Add icons for {this.state.firstName} {this.state.lastName} </h2>

                  <input type="text" placeholder="icon name" name="iconname" onChange={(event) => this.handleIconName(event)} required/>

                  {this.state.isUploading && <p>Progress: {this.state.progress}</p>}
                  <FileUploader
                    accept="image/*"
                    name="icon"
                    disabled={this.state.emptyName}
                    filename={this.state.iconName}
                    storageRef={firebase.storage().ref(`${this.state.userId}/icons/`)}
                    onUploadStart={this.handleUploadStart}
                    onUploadError={this.handleUploadError}
                    onUploadSuccess={(filename) => this.handleUploadSuccess(filename)}
                    onProgress={this.handleProgress}

                  />
                  <br />
                  <br />
                  <h4 className="uploadMessage">
                    {this.state.uploadMessage}
                  </h4>

            </form>


          <IconUploadComponent userId={this.state.userId} />


          </center>

        </div>
      );
      }

      else {
        return (
          <div>
            You are not authorized! Please log in.
          </div>
        );
      }

    }

  }
}
