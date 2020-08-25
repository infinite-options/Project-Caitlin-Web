import React, { Component } from "react";
import firebase from "./firebase";
import { Button, Dropdown, DropdownButton, Modal } from "react-bootstrap";
import ShowNotifications from "./ShowNotifications";
import DatePicker from "react-datepicker";
import moment from "moment";
import { Form, Row, Col } from "react-bootstrap";
import { firestore, storage } from "firebase";

import AddIconModal from "./AddIconModal";
import UploadImage from "./UploadImage";

import {
  ListGroup
} from "react-bootstrap";

export default class showHistory extends Component {
  constructor(props) {
    super(props);
    console.log("Is this a Routine? " + this.props.isRoutine);
  }
  state = {
  };

  render() {
    console.log(this.props.historyItems);
    return (
      <Modal.Dialog
      style={{
        margin:"0",
        width:"fit-content",
        maxWidth:"1000px"
      }}>
        <Modal.Header closeButton onHide={this.props.closeModal}>
          <Modal.Title>
            <h5 className="normalfancytext">
                {this.props.displayTitle}
            </h5>{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <ListGroup id="current_history_table">
          <div style={{ width: "auto", height: "auto", overflow: "scroll" }}>
            {this.props.historyItems}
          </div>
          {/* Button to add new Goal */}
        </ListGroup>
        </Modal.Body>
        <Modal.Footer>
        <Button
        style={{}}
        onClick={(e) => {
          console.log(document.getElementById('current_history_table').innerHTML)
          var link = "mailto:me@example.com"
          + "?cc=myCCaddress@example.com"
          + "&subject=" + encodeURIComponent("This is my subject")
          + "&body=" + "<table border=1> <tr><td>blabla</td></tr> </table>";
          window.location.href = link;
        }}
        >
        Send Email
        </Button>
        <Button variant="secondary" onClick={this.props.closeModal}>
        Close
        </Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  }
}
