import React, { Component } from "react";
import { Switch, Route, Link } from 'react-router-dom';

import firebase from "firebase";
import FileUploader from "react-firebase-file-uploader";
import InputGroup from "react-bootstrap/lib/InputGroup";
import Button from "react-bootstrap/lib/Button";
import ListGroup from "react-bootstrap/lib/ListGroup";
import ListGroupItem from "react-bootstrap/lib/ListGroupItem";



import './style.css';

// File upload for the icon. Name is required, I normally would use redux form.


export default class IconListComponent extends Component {
  constructor(props) {
    super(props);


    this.state = {

      isUploading: false,

      image: null,
      url: '',

      iconList: [],
    };

    this.renderIconList = this.renderIconList.bind(this);
  }

  componentDidMount() {

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

renderIconList(icon) {
   var shortenedName = icon.name.substring(0, icon.name.length-4);
    return (
      <div >
        <ListGroupItem key={icon.id} name="icon" className="icon">
          <img
           src={icon.url}
           />
           <h3>{shortenedName}</h3>
        </ListGroupItem>


        </div>
       )
}

  render() {

    {
      if (this.state.iconList.length > 0) {
        return (
        <div>

          <center>
            <ListGroup>

              {this.state.iconList.map(this.renderIconList)}
            </ListGroup>

          </center>

        </div>
      );
      }

        return (
          <div>
            No icons!
          </div>
        );

    }

  }
}
