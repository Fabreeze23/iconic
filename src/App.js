import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from "firebase";
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import SignupComponent from './Components/Signup/SignupComponent';
import LoginComponent from './Components/Login/LoginComponent';
import AccountComponent from './Components/Account/AccountComponent';
import IconUploadComponent from './Components/IconUpload/IconUploadComponent';
import SendMessageComponent from './Components/SendMessage/SendMessageComponent';


// Initialize Firebase
var config = {
  apiKey: "AIzaSyA9oKGcytDLX1yBdQMPUAC_Gb661HzTCsI",
  authDomain: "iconic-61970.firebaseapp.com",
  databaseURL: "https://iconic-61970.firebaseio.com",
  projectId: "iconic-61970",
  storageBucket: "iconic-61970.appspot.com",
  messagingSenderId: "734762880802"
};
firebase.initializeApp(config);

class App extends Component {
  render() {
    return (
      <Router>

      <div className="App">
        <header class="fa fa-eye">
        </header>

        <Route
          path='/account'
          component={AccountComponent}
        />

        <Route
          path='/login'
          component={LoginComponent}
        />

        <Route
          path='/upload'
          component={IconUploadComponent}
        />

        <Route
          exact path='/'
          component={SignupComponent}
        />

        <Route
          path='/signup'
          component={SignupComponent}
        />

        <Route
          path='/sendmessage'
          component={SendMessageComponent}
        />
          </div>
        </Router>
    );
  }
}

export default App;
