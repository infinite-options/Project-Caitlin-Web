import React, { Component } from "react";
import firebase from "./firebase";
import ShowNotifications from "./ShowNotifications";
import { Button, Modal } from "react-bootstrap";
import { Form, Row, Col } from "react-bootstrap";
import { firestore, storage } from "firebase";
import TimeField from "react-simple-timefield";

import TimePicker from "./TimePicker";

import AddIconModal from "./AddIconModal";
import UploadImage from "./UploadImage";

export default class AddNewATItem extends Component {
  constructor(props) {
    super(props);
    console.log("In addNewATItem", this.props);
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
        is_in_progress: false,
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
      alert("Missing title");
      return;
    }
    if (this.state.itemToEdit.photo === "") {
      this.state.itemToEdit.photo =
        "https://firebasestorage.googleapis.com/v0/b/project-caitlin-c71a9.appspot.com/o/DefaultIcons%2Ftask3.svg?alt=media&token=ce27281f-d2c7-4211-8cc5-cf1c5bcf1917";
    }
    if (!this.validateTime()) {
      return;
    }
    this.addNewDoc();
  };

  validateTime = () => {
    let invalid = false;

    let initStartHour = this.props.timeSlot[0].substring(0, 2);
    let initStartMinute = this.props.timeSlot[0].substring(3, 5);

    let initEndHour = this.props.timeSlot[1].substring(0, 2);
    let initEndMinute = this.props.timeSlot[1].substring(3, 5);

    let startHour = this.state.itemToEdit.available_start_time.substring(0, 2);
    let startMinute = this.state.itemToEdit.available_start_time.substring(
      3,
      5
    );
    let endHour = this.state.itemToEdit.available_end_time.substring(0, 2);
    let endMinute = this.state.itemToEdit.available_end_time.substring(3, 5);

    let initStartTimeObject = new Date();
    initStartTimeObject.setHours(initStartHour, initStartMinute, 0);
    let initEndTimeObject = new Date();
    initEndTimeObject.setHours(initEndHour, initEndMinute, 0);

    let startTimeObject = new Date();
    startTimeObject.setHours(startHour, startMinute, 0);

    let endTimeObject = new Date(startTimeObject);
    endTimeObject.setHours(endHour, endMinute, 0);

    if (startTimeObject > endTimeObject) {
      alert("End time should not occur before start time.");
      invalid = true;
    } else if (startTimeObject < initStartTimeObject) {
      invalid = true;
      alert("Action should not start eariler than the goal/routine");
    } else if (startTimeObject > initEndTimeObject) {
      invalid = true;
      alert("Action should not start later than the goal/routine");
    } else if (endTimeObject > initEndTimeObject) {
      alert("Action should not end later than the goal/routine");
      invalid = true;
    } else {
      invalid = false;
    }
    return invalid ? false : true;
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
      console.log(this.props.ATItem.fbPath.path.split("/")[3]);
      this.props.updateNewWentThroughATListObj(
        this.props.ATItem.fbPath.path.split("/")[3]
      );
      console.log("updateEntireArray Finished");
      // console.log(doc);
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

  setTime = (name, time) => {
    let temp = this.state.itemToEdit;
    if (name === "start_time") {
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
            <Row style={{ marginLeft: "3px" }}>
              <section>
                Start Time
                <TimePicker
                  setTime={this.setTime}
                  name="start_time"
                  time={this.state.itemToEdit.available_start_time}
                />
              </section>
              <br />
              <section style={{ marginLeft: "15px" }}>
                End Time
                <TimePicker
                  setTime={this.setTime}
                  name="end_time"
                  time={this.state.itemToEdit.available_end_time}
                />
              </section>
            </Row>

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

            {/* {this.state.itemToEdit.is_available && (
              <ShowNotifications
                itemToEditPassedIn={this.state.itemToEdit}
                notificationChange={this.handleNotificationChange}
              />
            )} */}
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
