import React, { Component } from "react";
import firebase from "./firebase";
import { Button, Modal, Row } from "react-bootstrap";

export default class AddNewGRItem extends Component {
  constructor(props) {
    super(props);
    console.log("Is this a Routine? " + this.props.isRoutine);
  }

  state = {
    grArr: [], //goal, routine original array
    itemToEdit: {
      title: "",
      id: "",
      is_persistent: this.props.isRoutine,
      photo: "",
      is_complete: false,
      is_available: true,
      available_end_time: "23:59:59",
      available_start_time: "00:00:00",
      datetime_completed: "Sun, 23 Feb 2020 00:08:43 GMT",
      datetime_started: "Sun, 23 Feb 2020 00:08:43 GMT",
      audio: "",
      is_timed: false
    }, //this is essentially the new item
    //below are references to firebase directories
    routineDocsPath: firebase
      .firestore()
      .collection("users")
      .doc("7R6hAVmDrNutRkG3sVRy")
      .collection("goals&routines"),
    arrPath: firebase
      .firestore()
      .collection("users")
      .doc("7R6hAVmDrNutRkG3sVRy")
  };

  componentDidMount() {
    this.props.isRoutine
      ? console.log("Routine Input")
      : console.log("Goal Input");

    this.getGRDataFromFB();
  }

  getGRDataFromFB = () => {
    //Grab the goals/routine array from firebase and then store it in state varible grArr
    console.log(this.state.arrPath);
    this.state.arrPath
      .get()
      .then(doc => {
        if (doc.exists) {
          console.log("getGRDataFromFB DATA:");
          // console.log(doc.data());
          var x = doc.data();
          x = x["goals&routines"];
          console.log(x);
          this.setState({
            grArr: x
          });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document! 2");
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
        alert("Error getting document:", error);
      });
  };

  newInputSubmit = () => {
    if (this.state.itemToEdit.title === "") {
      alert("Invalid Input");
      return;
    }
    this.addNewDoc();
  };

  addNewDoc = () => {
    this.state.routineDocsPath
      .add({
        title: this.state.itemToEdit.title,
        "actions&tasks": []
      })
      .then(ref => {
        if (ref.id === null) {
          alert("Fail to add new routine / goal item");
          return;
        }

        let newArr = this.props.ATArray;
        let temp = this.state.itemToEdit;
        temp.id = ref.id;
        console.log("Added document with ID: ", ref.id);
        // this.state.grArr.push(temp);
        newArr.push(temp);
        this.updateEntireArray(newArr);
      });
  };

  //This function will below will essentially take in a array and have a key map to it
  updateEntireArray = newArr => {
    // 2. update adds to the document
    let db = this.state.arrPath;
    db.update({ "goals&routines": newArr }).then(doc => {
      console.log("updateEntireArray Finished");
      console.log(doc);
      this.getGRDataFromFB();
      if (this.props != null) {
        console.log("refreshing FireBasev2 from AddNewGRItem");
        this.props.refresh();
      }
    });
  };

  render() {
    return (
      <Modal.Dialog style={{ marginLeft: "0", width: this.state.modalWidth }}>
        <Modal.Header closeButton onHide={this.props.closeModal}>
          <Modal.Title>
            <h5 className="normalfancytext">
              Add New {this.props.isRoutine ? "Routine" : "Goal"}
            </h5>{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label>Title</label>
            <div className="input-group mb-3">
              <input
                style={{ width: "200px" }}
                placeholder="Enter Title"
                value={this.state.itemToEdit.title}
                onChange={e => {
                  e.stopPropagation();
                  let temp = this.state.itemToEdit;
                  temp.title = e.target.value;
                  this.setState({ itemToEdit: temp });
                }}
              />
            </div>

            <label>Photo URL</label>
            <div className="input-group mb-3">
              <input
                style={{ width: "200px" }}
                placeholder="Enter Photo URL "
                value={this.state.itemToEdit.photo}
                onChange={e => {
                  e.stopPropagation();
                  let temp = this.state.itemToEdit;
                  temp.photo = e.target.value;
                  this.setState({ itemToEdit: temp });
                }}
              />
            </div>

            <label>Available Start Time</label>
            <div className="input-group mb-3">
              <input
                style={{ width: "200px" }}
                placeholder="HH:MM:SS (ex: 08:20:00) "
                value={this.state.itemToEdit.available_start_time}
                onChange={e => {
                  e.stopPropagation();
                  let temp = this.state.itemToEdit;
                  temp.available_start_time = e.target.value;
                  this.setState({ itemToEdit: temp });
                }}
              />
            </div>

            <label>Available End Time</label>
            <div className="input-group mb-3">
              <input
                style={{ width: "200px" }}
                placeholder="HH:MM:SS (ex: 16:20:00) "
                value={this.state.itemToEdit.available_end_time}
                onChange={e => {
                  e.stopPropagation();
                  let temp = this.state.itemToEdit;
                  temp.available_end_time = e.target.value;
                  this.setState({ itemToEdit: temp });
                }}
              />
            </div>

            <div className="input-group mb-3">
              <label className="form-check-label">Available to Caitlin?</label>
              <input
                style={{ marginTop: "5px", marginLeft: "5px" }}
                name="Available"
                type="checkbox"
                checked={this.state.itemToEdit.is_available}
                onChange={e => {
                  e.stopPropagation();
                  let temp = this.state.itemToEdit;
                  console.log(temp.is_available);
                  temp.is_available = !temp.is_available;
                  this.setState({ itemToEdit: temp });
                }}
              />
            </div>

            <div className="input-group mb-3">
              <label className="form-check-label">Time?</label>

              <input
                style={{ marginTop: "5px", marginLeft: "5px" }}
                name="Timed"
                type="checkbox"
                checked={this.state.itemToEdit.is_timed}
                onChange={e => {
                  e.stopPropagation();
                  let temp = this.state.itemToEdit;
                  console.log(temp.is_timed);
                  temp.is_timed = !temp.is_timed;
                  this.setState({ itemToEdit: temp });
                }}
              />
            </div>

            <div className="input-group mb-3">
              <label className="form-check-label">Notify TA?</label>

              <input
                style={{ marginTop: "5px", marginLeft: "5px" }}
                name="Timed"
                type="checkbox"
                checked={this.state.itemToEdit.notifies_ta}
                onChange={e => {
                  e.stopPropagation();
                  let temp = this.state.itemToEdit;
                  console.log(temp.notifies_ta);
                  temp.notifies_ta = !temp.notifies_ta;
                  this.setState({ itemToEdit: temp });
                }}
              />
            </div>

            <div className="input-group mb-3">
              <label className="form-check-label">Remind User? </label>
              <input
                style={{ marginTop: "5px", marginLeft: "5px" }}
                name="Timed"
                type="checkbox"
                checked={this.state.itemToEdit.reminds_user}
                onChange={e => {
                  e.stopPropagation();
                  let temp = this.state.itemToEdit;
                  console.log(temp.reminds_user);
                  temp.reminds_user = !temp.reminds_user;
                  this.setState({ itemToEdit: temp });
                }}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.closeModal}>
            Close
          </Button>
          <Button variant="info" onClick={this.newInputSubmit}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  }
}
