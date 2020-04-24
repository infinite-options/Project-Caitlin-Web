import React, { Component } from "react";
import firebase from "./firebase";
import { Button, Modal } from "react-bootstrap";
import ShowNotifications from "./ShowNotifications";
import DatePicker from "react-datepicker";
import { Form, Row, Col } from "react-bootstrap";

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
      // todayDateObject: this.props.todayDateObject,
      available_end_time: "23:59:59",
      available_start_time: "00:00:00",
      datetime_completed: "Sun, 23 Feb 2020 00:08:43 GMT",
      datetime_started: "Sun, 23 Feb 2020 00:08:43 GMT",
      audio: "",
      is_timed: false,
      expected_completion_time: "01:00:00",
      is_sublist_available: true,
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
      .doc("7R6hAVmDrNutRkG3sVRy"),
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
      .then((doc) => {
        if (doc.exists) {
          console.log("getGRDataFromFB DATA:");
          // console.log(doc.data());
          var x = doc.data();
          x = x["goals&routines"];
          console.log(x);
          this.setState({
            grArr: x,
          });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document! 2");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
        alert("Error getting document:", error);
      });
  };

  newInputSubmit = () => {
    if (this.state.itemToEdit.title === "") {
      alert("Invalid Input");
      return;
    }
    if (this.state.itemToEdit.photo === "") {
      if (this.props.isRoutine) {
        this.state.itemToEdit.photo =
          "https://firebasestorage.googleapis.com/v0/b/project-caitlin-c71a9.appspot.com/o/Routines-1.png?alt=media&token=5534e930-7cc1-4c5d-a6f3-fb8b6053a6a2";
      } else {
        this.state.itemToEdit.photo =
          "https://firebasestorage.googleapis.com/v0/b/project-caitlin-c71a9.appspot.com/o/Goals-1.png?alt=media&token=3a5fa4f2-a136-4fdd-acf7-9007c08ccdf2";
      }
    }
    this.addNewDoc();
  };

  addNewDoc = () => {
    this.state.routineDocsPath
      .add({
        title: this.state.itemToEdit.title,
        "actions&tasks": []
      })
      .then((ref) => {
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

  // startTimePicker = () => {
  //   // const [startDate, setStartDate] = useState(new Date());
  //   return (
  //     <DatePicker
  //       className="form-control"
  //       type="text"
  //       selected={this.state.todayDateObject}
  //       onChange={(date) => {
  //         this.setState(
  //           {
  //             todayDateObject: date,
  //           },
  //           () => {
  //             console.log("starttimepicker", this.state.todayDateObject);
  //           }
  //         );
  //       }}
  //       showTimeSelect
  //       timeIntervals={15}
  //       timeCaption="time"
  //       dateFormat="MMMM d, yyyy h:mm aa"
  //     />
  //   );
  // };

  render() {
    return (
      <Modal.Dialog style={{ marginLeft: "0", width: this.props.width }}>
        <Modal.Header closeButton onHide={this.props.closeModal}>
          <Modal.Title>
            <h5 className="normalfancytext">
              Add New {this.props.isRoutine ? "Routine" : "Goal"}
            </h5>{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* <Row>
          <Col>
          <div style={{ width: "300px" }}> */}
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={this.state.itemToEdit.title}
                onChange={(e) => {
                  e.stopPropagation();
                  let temp = this.state.itemToEdit;
                  temp.title = e.target.value;
                  this.setState({ itemToEdit: temp });
                }}
                type="text"
                placeholder="Enter Title"
              />
              {/* <div style={{ color: "red" }}> {this.state.showNoTitleError}</div> */}
            </Form.Group>

            <Form.Group>
              <Form.Label>Photo URL</Form.Label>
              <Form.Control
                value={this.state.itemToEdit.photo}
                onChange={(e) => {
                  e.stopPropagation();
                  let temp = this.state.itemToEdit;
                  temp.photo = e.target.value;
                  this.setState({ itemToEdit: temp });
                }}
                type="text"
                placeholder="Enter Photo URL"
              />
            </Form.Group>

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
            {/* <Form.Group value={this.state.todayDateObject} controlId="Y">
              <Form.Label>Start Time</Form.Label> <br />
              {this.startTimePicker()}
            </Form.Group> */}

            <label>Available End Time</label>
            <div className="input-group mb-3">
              <input
                style={{ width: "200px" }}
                placeholder="HH:MM:SS (ex: 16:20:00) "
                value={this.state.itemToEdit.available_end_time}
                onChange={(e) => {
                  e.stopPropagation();
                  let temp = this.state.itemToEdit;
                  temp.available_end_time = e.target.value;
                  this.setState({ itemToEdit: temp });
                }}
              />
            </div>

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
                  console.log(temp.is_timed);
                  temp.is_timed = !temp.is_timed;
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
                onChange={(e) => {
                  e.stopPropagation();
                  let temp = this.state.itemToEdit;
                  temp.is_available = e.target.checked;
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
          </Form>
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
