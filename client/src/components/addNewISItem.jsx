import React, { Component } from "react";
// import firebase from "./firebase";
import ShowNotifications from "./ShowNotifications";
import { Button, Modal } from "react-bootstrap";
import { Form, Row, Col } from "react-bootstrap";
import { firestore, storage } from "firebase";
import TimeField from "react-simple-timefield";

import AddIconModal from "./AddIconModal";
import UploadImage from "./UploadImage";

/**
 *
 * This class is responsible for adding a new elemnt to the
 * firebase database. If it becomes successful then we update
 * the view on the firebasev2
 */

export default class AddNewISItem extends Component {
  constructor(props) {
    super(props);
    console.log("AddNewISItem constructor");
  }

  state = {
    atArr: [], //goal, routine original array
    ISArr: [], //Instructions and steps array
    newInstructionTitle: "",
    itemToEdit: {
      //new item to add to array
      id: "",
      title: "",
      photo:
        "https://firebasestorage.googleapis.com/v0/b/project-caitlin-c71a9.appspot.com/o/DefaultIconsPNG%2Ftask2.png?alt=media&token=03f049ce-a35c-4222-bdf7-fd8b585b1838",
      is_complete: false,
      is_available: true,
      available_end_time: this.props.timeSlot[1],
      available_start_time: this.props.timeSlot[0],
      datetime_completed: "Sun, 23 Feb 2020 00:08:43 GMT",
      datetime_started: "Sun, 23 Feb 2020 00:08:43 GMT",
      audio: "",
      is_timed: false,
      expected_completion_time: "00:05:00",
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

  setPhotoURLFunction = (photo_url) => {
    let temp = this.state.itemToEdit;
    temp.photo = photo_url;
    this.setState({ itemToEdit: temp });
  };

  componentDidMount() {
    // console.log("AddNewISItem did mount");
    // console.log(this.props.ISArray);
    // console.log(this.props.ISItem);
  }

  handleInputChange = (e) => {
    console.log(e.target.value);
    this.setState({
      newInstructionTitle: e.target.value,
    });
  };

  newInputSubmit = () => {
    if (this.state.itemToEdit.title === "") {
      alert("Invalid Input");
      return;
    }
    console.log("Submitting Input: " + this.state.itemToEdit.title);

    this.props.ISItem.fbPath
      .get()
      .then((doc) => {
        if (doc.exists) {
          var x = doc.data();
          if (x["instructions&steps"] != undefined) {
            x = x["instructions&steps"];
            this.setState({
              ISArr: x,
            });

            this.state.ISArr.push(this.state.itemToEdit);
            this.updateEntireArray(this.state.ISArr);
          }
        } else {
          console.log("No such document!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
        alert("Error getting document:", error);
      });
    //this.state.ISArr.push(this.state.itemToEdit);
    //this.updateEntireArray(this.state.ISArr);
  };

  //This function will below will essentially take in a array and have a key map to it
  updateEntireArray = (newArr) => {
    // 2. update adds to the document

    this.props.ISItem.fbPath
      .update({ "instructions&steps": newArr })
      .then((doc) => {
        console.log("updateEntireArray Finished");
        console.log(doc);
        if (this.props != null) {
          this.props.hideNewISModal();
          console.log("refreshing FireBasev2 from ISItem");
          this.props.refresh(newArr);
        } else {
          console.log("removing newly added item due to failure");
          this.props.ISArray.pop();
        }
      });
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
            this.props.hideNewISModal();
            console.log("closed button clicked");
          }}
        >
          <Modal.Title>
            <h2 className="normalfancytext">Add New Step</h2>{" "}
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
                  // value={this.state.newEventNotification}
                  // onChange={this.handleNotificationChange}
                  type="number"
                  placeholder="30"
                  value={this.convertToMinutes()}
                  // value = {this.state.itemToEdit.expected_completion_time}
                  style={{ marginTop: ".25rem", paddingRight: "0px" }}
                  onChange={
                    // (e) => {e.stopPropagation(); this.convertTimeToHRMMSS(e)}
                    (e) => {
                      e.stopPropagation();
                      let temp = this.state.itemToEdit;
                      temp.expected_completion_time = this.convertTimeToHRMMSS(
                        e
                      );
                      this.setState({ itemToEdit: temp });
                    }
                  }
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
              <label className="form-check-label">
                Available to thee user?
              </label>
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
              this.props.hideNewISModal();
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
