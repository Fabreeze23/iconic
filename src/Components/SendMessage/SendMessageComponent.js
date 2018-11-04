import React, { Component } from "react";
import { Switch, Route, Link } from 'react-router-dom';

import IconListComponent from '../IconList/IconListComponent';

import firebase from "firebase";
import FileUploader from "react-firebase-file-uploader";
import InputGroup from "react-bootstrap/lib/InputGroup";
import Button from "react-bootstrap/lib/Button";
import ListGroup from "react-bootstrap/lib/ListGroup";
import ListGroupItem from "react-bootstrap/lib/ListGroupItem";


import './style.css';


export default class SendMessageComponent extends Component {
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
      successMessage: '',


      iconName: '',
      selectedUsername: '',
      createdMessage: '',
      selectedUrl: '',
      emptyIcon: true,
      emptyUsername: true,
      emptyMessage: true,
      iconList: [],


    };

    this.checkLoggedIn = this.checkLoggedIn.bind(this);
    this.renderIconList = this.renderIconList.bind(this);
    this.iconSelected = this.iconSelected.bind(this);
    this.onMessageSubmit = this.onMessageSubmit.bind(this);

  }

  componentDidMount() {
    this.checkLoggedIn();

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        var myUserId = user.uid;
        console.log(myUserId);
        var myIconsRef = firebase.database().ref(`/icons/${myUserId}/`);

            var iconList = [];

            myIconsRef.on('child_added', (dataSnapshot) => {

              console.log(dataSnapshot.val());
              iconList.push(dataSnapshot.val());
              console.log(iconList);
               this.setState({
                 iconList: iconList.reverse(),

               }, console.log(iconList));
            });
      } else {
        console.log("Not logged in");
      }
    });

  }

  checkLoggedIn() {
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
                username: snapshot.val().username,
                firstName: snapshot.val().firstName,
                lastName: snapshot.val().lastName,
                userId: userId,
              });
            });

          return (user);
        }
        else {
          return (null);
      }
    });
  }

  renderIconList(icon) {
     var shortenedName = icon.name.substring(0, icon.name.length-4);
      return (
        <div >
          <ListGroupItem key={icon.id} name="icon" className="icon" onClick={() => this.iconSelected(icon)}  >
            <img
             src={icon.url}
             />
             <h3>{shortenedName}</h3>
          </ListGroupItem>


          </div>
         )
  }

  handleUsername(event) {
    event.preventDefault();
    const username = event.target.value;

    if (username.length > 0) {
      this.setState({
        selectedUsername: username,
        emptyUsername: false,
      })
    }

    else {
      this.setState({
        selectedUsername: '',
        emptyUsername: true,
      })
    }

  }

  handleMessage(event) {
    event.preventDefault();
    const message = event.target.value;

    if (message.length > 0) {
      this.setState({
        createdMessage: message,
        emptyMessage: false,
      })
    }

    else {
      this.setState({
        createdMessage: '',
        emptyMessage: true,
      })
    }

  }

  iconSelected(icon) {

    this.setState({
      emptyIcon: false,
      selectedUrl: icon.url,
    })
    console.log(icon.url);
  }

//=============================

  onMessageSubmit(event) {
    event.preventDefault();
    event.target.reset();
    var selectedUser = this.state.selectedUsername;
    var sendingUser = this.state.username;

    event.preventDefault();

    var messageSent = {
    to: selectedUser,
    from: sendingUser,
    messageBody: this.state.createdMessage,
    iconUrl: this.state.selectedUrl,
}

var messageKey = firebase.database().ref().child('messages').push().key;

var updates = {};
updates[`messages/messagesSent/${sendingUser}/${selectedUser}/${messageKey}`] = messageSent;
updates[`messages/messagesReceived/${selectedUser}/${sendingUser}/${messageKey}`] = messageSent;
updates[`/user-received/${selectedUser}/${messageKey}`] = messageSent;
updates[`/user-sent/${sendingUser}/${messageKey}`] = messageSent;
updates[`/user-received/${selectedUser}/${messageKey}`] = messageSent;


console.log(messageSent);

this.setState({
  successMessage: `Your message was sent to ${this.state.selectedUsername}`,
})

return firebase.database().ref().update(updates);


  }

  render() {

    {
      if (this.checkLoggedIn !== null && this.state.iconList.length > 0) {
        return (
        <div>

          <Link to="/account">Home</Link>

          <br />
          <br />
          <center>
            <form className="message-upload" onSubmit={event => this.onMessageSubmit(event)}>
                  <h2> {this.state.firstName} you should send a message with your icons!</h2>

                  <input type="text" placeholder="username to send to" name="username" onChange={(event) => this.handleUsername(event)} required/>

                  <input type="text" placeholder="type your message here" name="message" onChange={(event) => this.handleMessage(event)} required/>

                  <Button bsStyle="primary" type="submit" disabled={this.state.emptyIcon || this.state.emptyUsername || this.state.emptyMessage}> Send</Button>

                  <h4>{this.state.successMessage}</h4>

                  <ListGroup>

                    {this.state.iconList.map(this.renderIconList)}
                  </ListGroup>

            </form>


            </center>



        </div>


      );
      }

      else {
        return (
          <div>
            If you're logged in then add some icons!
          </div>
        );
      }

    }

  }
}
