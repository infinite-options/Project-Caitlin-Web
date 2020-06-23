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
    console.log(this.props.displayGoals);
    return (
      <Modal.Dialog style={{ margin: "0",
      width: "340px" }}>
        <Modal.Header closeButton onHide={this.props.closeModal}>
          <Modal.Title>
            <h5 className="normalfancytext">
                History
            </h5>{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <ListGroup>
          <div style={{ height: "650px", overflow: "scroll" }}>
            {this.props.displayGoals}
          </div>
          {/* Button to add new Goal */}
        </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  }
}
