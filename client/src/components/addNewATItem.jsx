import React, { Component } from "react";
import firebase from "./firebase";
import ShowNotifications from "./ShowNotifications";
import { Button, Modal } from "react-bootstrap";
import { Form, Row, Col } from "react-bootstrap";
import { firestore, storage } from "firebase";
import TimeField from "react-simple-timefield";

import AddIconModal from "./AddIconModal";
import UploadImage from "./UploadImage";

export default class AddNewATItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      AT_arr: [], // Actions & Tasks array
      newActionTitle: "", //Old delete Later
      itemToEdit: {
        id: "",
        title: "",
        photo:
          "https://firebasestorage.googleapis.com/v0/b/project-caitlin-c71a9.appspot.com/o/DefaultIconsPNG%2Ftask3.png?alt=media&token=a4f03983-d2ed-4382-b8bb-0b1361d1e209",
        audio: "",
        is_must_do: true,
        is_complete: false,
        is_available: true,
        available_end_time: this.props.timeSlot[1],
        available_start_time: this.props.timeSlot[0],
        datetime_completed: "Sun, 23 Feb 2020 00:08:43 GMT",
        datetime_started: "Sun, 23 Feb 2020 00:08:43 GMT",
        is_timed: false,
        expected_completion_time: "00:10:00",
        is_sublist_available: true,
        is_in_progress:false,
        ta_notifications: {
          before: {
            is_enabled: false,
            is_set: false,
            message: "",
            time: "00:05:00",
          },
          during: {
            is_enabled: false,
            is_set: false,
            message: "",
            time: "00:30:00",
          },
          after: {
            is_enabled: false,
            is_set: false,
            message: "",
            time: "00:05:00",
          },
        },
        user_notifications: {
          before: {
            is_enabled: false,
            is_set: false,
            message: "",
            time: "00:05:00",
          },
          during: {
            is_enabled: false,
            is_set: false,
            message: "",
            time: "00:30:00",
          },
          after: {
            is_enabled: false,
            is_set: false,
            message: "",
            time: "00:05:00",
          },
        },
      },
    };
  }

  componentDidMount() {}

  newInputSubmit = () => {
    if (this.state.itemToEdit.title === "") {
      alert("Invalid Input");
      return;
    }
    if (this.state.itemToEdit.photo === "") {
      this.state.itemToEdit.photo =
        "https://firebasestorage.googleapis.com/v0/b/project-caitlin-c71a9.appspot.com/o/DefaultIcons%2Ftask3.svg?alt=media&token=ce27281f-d2c7-4211-8cc5-cf1c5bcf1917";
    }

    this.addNewDoc();
  };

  addNewDoc = () => {
    this.props.ATItem.fbPath
      .get()
      .then((doc) => {
        if (doc.exists) {
          var x = doc.data();
          if (x["actions&tasks"] != undefined) {
            x = x["actions&tasks"];
            this.setState({
              AT_arr: x,
            });
            this.props.ATItem.fbPath
              .collection("actions&tasks")
              .add({
                title: this.state.itemToEdit.title,
                "instructions&steps": [],
              })
              .then((ref) => {
                if (ref.id === null) {
                  alert("Fail to add new Action / Task item");
                  return;
                }
                console.log("Added document with ID: ", ref.id);
                //let newArr = this.props.ATArray;
                let newArr = this.state.AT_arr;
                let temp = this.state.itemToEdit;
                temp.id = ref.id;
                newArr.push(temp);
                console.log(newArr);
                console.log("adding new item");
                this.updateEntireArray(newArr);
              });
          }
        } else {
          console.log("No such document!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
        alert("Error getting document:", error);
      });
  };

  //This function will below will essentially take in a array and have a key map to it
  updateEntireArray = (newArr) => {
    // 2. update adds to the document
    this.props.ATItem.fbPath.update({ "actions&tasks": newArr }).then((doc) => {
      console.log("updateEntireArray Finished");
      console.log(doc);
      if (this.props != null) {
        this.props.hideNewATModal();
        console.log("refreshing FireBasev2 from AddNewATItem");
        this.props.refresh(newArr);
      }
    });
  };

  setPhotoURLFunction = (photo_url) => {
    let temp = this.state.itemToEdit;
    temp.photo = photo_url;
    this.setState({ itemToEdit: temp });
  };

  convertTimeToHRMMSS = (e) => {
    // console.log(e.target.value);
    let num = e.target.value;
    let hours = num / 60;
    let rhours = Math.floor(hours);
    let minutes = (hours - rhours) * 60;
    let rminutes = Math.round(minutes);
    if (rhours.toString().length === 1) {
      rhours = "0" + rhours;
    }
    if (rminutes.toString().length === 1) {
      rminutes = "0" + rminutes;
    }
    // console.log(rhours+":" + rminutes +":" + "00");
    return rhours + ":" + rminutes + ":" + "00";
  };

  convertToMinutes = () => {
    let myStr = this.state.itemToEdit.expected_completion_time.split(":");
    let hours = myStr[0];
    let hrToMin = hours * 60;
    let minutes = myStr[1] * 1 + hrToMin;
    // let seconds = myStr[2];

    // console.log("hours: " +hours + "minutes: " + minutes + "seconds: " + seconds);
    return minutes;
  };

  handleNotificationChange = (temp) => {
    // console.log(temp);
    this.setState({ itemToEdit: temp });
  };

  onTimeChange = (event, value) => {
    const newTime = value.replace(/-/g, ":");
    const time = newTime.substr(0, 5) + ":00";
    let temp = this.state.itemToEdit;
    if (event.target.name === "available_start_time") {
      temp.available_start_time = time;
      this.setState({ itemToEdit: temp });
    } else {
      temp.available_end_time = time;
      this.setState({ itemToEdit: temp });
    }
  };

  render() {
    return (
      <Modal.Dialog style={{ marginLeft: "0", width: this.props.width }}>
        <Modal.Header
          closeButton
          onHide={() => {
            this.props.hideNewATModal();
          }}
        >
          <Modal.Title>
            <h2 className="normalfancytext">Add New Task/Action</h2>{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <AddNewGRItem refresh={this.grabFireBaseRoutinesGoalsData} isRoutine={this.state.isRoutine} /> */}
          <div>
            <label>Title</label>
            <div className="input-group mb-3">
              <input
                style={{ width: "200px" }}
                placeholder="Enter Title"
                value={this.state.itemToEdit.title}
                onChange={(e) => {
                  e.stopPropagation();
                  let temp = this.state.itemToEdit;
                  temp.title = e.target.value;
                  this.setState({ itemToEdit: temp });
                }}
              />
            </div>

            <Form.Label> Photo </Form.Label>
            <Row>
              <AddIconModal parentFunction={this.setPhotoURLFunction} />
              <UploadImage parentFunction={this.setPhotoURLFunction} />
              <br />
            </Row>
            <div style={{ marginTop: "10px", marginBottom: "10px" }}>
              <label>Icon: </label>
              <img
                alt="None"
                src={this.state.itemToEdit.photo}
                height="70"
                width="auto"
              ></img>
            </div>
            <section>
              Start Time
              <TimeField
                name="available_start_time"
                value={this.state.itemToEdit.available_start_time}
                onChange={this.onTimeChange}
                style={{
                  marginLeft: "6px",
                  border: "1px solid #666",
                  fontSize: 20,
                  width: 80,
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  color: "#333",
                  borderRadius: 10,
                }}
              />
            </section>
            <br />
            <section>
              End Time
              <TimeField
                name="available_end_time"
                value={this.state.itemToEdit.available_end_time}
                onChange={this.onTimeChange}
                style={{
                  marginLeft: "20px",
                  border: "1px solid #666",
                  fontSize: 20,
                  width: 80,
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  color: "#333",
                  borderRadius: 10,
                }}
              />
            </section>
            <br />
            <label>This Takes Me</label>
            <Row>
              <Col style={{ paddingRight: "0px" }}>
                <Form.Control
                  type="number"
                  placeholder="30"
                  value={this.convertToMinutes()}
                  style={{ marginTop: ".25rem", paddingRight: "0px" }}
                  onChange={(e) => {
                    e.stopPropagation();
                    let temp = this.state.itemToEdit;
                    temp.expected_completion_time = this.convertTimeToHRMMSS(e);
                    this.setState({ itemToEdit: temp });
                  }}
                />
              </Col>
              <Col xs={8} style={{ paddingLeft: "0px" }}>
                <p style={{ marginLeft: "10px", marginTop: "5px" }}>minutes</p>
              </Col>
            </Row>

            <div className="input-group mb-3" style={{ marginTop: "10px" }}>
              <label className="form-check-label">Time?</label>
              <input
                style={{ marginTop: "5px", marginLeft: "5px" }}
                name="Timed"
                type="checkbox"
                checked={this.state.itemToEdit.is_timed}
                onChange={(e) => {
                  e.stopPropagation();
                  let temp = this.state.itemToEdit;
                  temp.is_timed = !temp.is_timed;
                  this.setState({ itemToEdit: temp });
                }}
              />
            </div>

            <div className="input-group mb-3">
              <label className="form-check-label">Available to the user?</label>
              <input
                style={{ marginTop: "5px", marginLeft: "5px" }}
                name="Available"
                type="checkbox"
                checked={this.state.itemToEdit.is_available}
                onChange={(e) => {
                  e.stopPropagation();
                  let temp = this.state.itemToEdit;
                  temp.is_available = !temp.is_available;
                  this.setState({ itemToEdit: temp });
                }}
              />
            </div>

            {this.state.itemToEdit.is_available && (
              <ShowNotifications
                itemToEditPassedIn={this.state.itemToEdit}
                notificationChange={this.handleNotificationChange}
              />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              this.props.hideNewATModal();
              console.log("closed button clicked");
            }}
          >
            Close
          </Button>
          <Button
            variant="info"
            onClick={() => {
              this.newInputSubmit();
            }}
          >
            Save changes
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  }
}
