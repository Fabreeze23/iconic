import React, { Component } from "react";
import { Switch, Route, Link } from 'react-router-dom';

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

      userId: this.props.userId,
      isUploading: false,

      image: null,
      url: '',

      iconList: [],
    };

    this.renderIconList = this.renderIconList.bind(this);
  }

  componentDidMount() {

    var myUserId = this.state.userId;

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

  render() {

    {
      if (this.state.iconList.length > 0) {
        return (
        <div>

          <center>
            <div>
              {this.state.iconList.map(this.renderIconList)}
            </div>


          </center>

        </div>
      );
      }

      else {

        return (
          <div>
            {" "}
          </div>
        );
      }

    }

  }
}
