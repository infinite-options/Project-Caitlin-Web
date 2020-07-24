import React, { Component } from "react";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import ShowNotifications from "./ShowNotifications";
import { Form, Row, Col } from "react-bootstrap";
import { firestore, storage } from "firebase";
import TimeField from "react-simple-timefield";

import TimePicker from "./TimePicker";
import AddIconModal from "./AddIconModal";
import UploadImage from "./UploadImage";

export default class editIS extends Component {
  constructor(props) {
    super(props);
    console.log("from editIS: ", this.props.timeSlot);
    this.state = {
      showEditModal: false,
      itemToEdit: this.props.ISArray[this.props.i],
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.ISArray !== this.props.ISArray) {
      this.setState({ itemToEdit: this.props.ISArray[this.props.i] });
    }
  }

  setPhotoURLFunction = (photo_url) => {
    let temp = this.state.itemToEdit;
    temp.photo = photo_url;
    this.setState({ itemToEdit: temp });
  };

  newInputSubmit = () => {
    
    let newArr = this.props.ISArray;

    if (this.state.itemToEdit.title === "") {
      alert("Missing title");
      return "";
    }
    if (!this.validateTime()) {
      return;
    }

    if (this.state.itemToEdit.photo === "") {
      this.state.itemToEdit.photo =
        "https://firebasestorage.googleapis.com/v0/b/project-caitlin-c71a9.appspot.com/o/DefaultIconsPNG%2Ftask2.png?alt=media&token=03f049ce-a35c-4222-bdf7-fd8b585b1838";
    }

    newArr[this.props.i] = this.state.itemToEdit;

    //Add the below attributes in case they don't already exists
    if (!newArr[this.props.i]["datetime_completed"]) {
      newArr[this.props.i]["datetime_completed"] =
        "Sun, 23 Feb 2020 00:08:43 GMT";
    }
    if (!newArr[this.props.i]["datetime_started"]) {
      newArr[this.props.i]["datetime_started"] =
        "Sun, 23 Feb 2020 00:08:43 GMT";
    }

    if (!newArr[this.props.i]["audio"]) {
      newArr[this.props.i]["audio"] = "";
    }
    this.props.FBPath.update({ "instructions&steps": newArr }).then((doc) => {
      console.log("this is the path ", this.props.FBPath.path.split('/')[3]);
      this.props.updateWentThroughATListObjIS(this.props.FBPath.path.split('/')[3]);
      if (this.props != null) {
        // console.log("refreshing FireBasev2 from updating ISItem");
        this.setState({ showEditModal: false });
        this.props.refresh(newArr);
      } else {
        console.log("update failure");
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
      alert("Step/Instruction should not start eariler than the action/task");
    } else if (startTimeObject > initEndTimeObject) {
      invalid = true;
      alert("Step/Instruction should not start later than the action/task");
    } else if (endTimeObject > initEndTimeObject) {
      alert("Step/Instruction should not end later than the action/task");
      invalid = true;
    } else {
      invalid = false;
    }
    return invalid ? false : true;
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

  editISForm = () => {
    return (
      // <div style={{margin: '0', width: "315px", padding:'20px'}}>
      <Row
        style={{
          marginLeft: this.props.marginLeftV,
          border: "2px",
          padding: "20px",
          marginTop: "10px",
        }}
      >
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

        <Form.Group>
          <Form.Label> Photo </Form.Label>
          <Row>
            <AddIconModal parentFunction={this.setPhotoURLFunction} />
            <UploadImage parentFunction={this.setPhotoURLFunction} />
            <br />
          </Row>

          <div style={{ marginTop: "10px" }}>
            <label>Icon: </label>

            <img
              alt="None"
              src={this.state.itemToEdit.photo}
              height="70"
              width="auto"
            ></img>
          </div>
        </Form.Group>

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
        <div>
          <br />
          This Takes Me
          <br />
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
                    temp.expected_completion_time = this.convertTimeToHRMMSS(e);
                    this.setState({ itemToEdit: temp });
                  }
                }
              />
            </Col>
            <Col xs={8} style={{ paddingLeft: "0px" }}>
              <p style={{ marginLeft: "10px", marginTop: "5px" }}>minutes</p>
            </Col>
          </Row>
        </div>
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
              // console.log(temp.is_timed)
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
              // console.log(temp.is_available)
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

        <Button
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            this.setState({ showEditModal: false });
          }}
        >
          Close
        </Button>
        <Button
          variant="info"
          onClick={(e) => {
            e.stopPropagation();
            this.newInputSubmit();
          }}
        >
          Save changes
        </Button>
        {/* </div> */}
      </Row>
    );
  };

  showIcon = () => {
    return (
      <div>
        <FontAwesomeIcon
          onMouseOver={(event) => {
            event.target.style.color = "#48D6D2";
          }}
          onMouseOut={(event) => {
            event.target.style.color = "#000000";
          }}
          style={{ color: "#000000", marginLeft: "5px" }}
          onClick={(e) => {
            e.stopPropagation();
            this.setState({ showEditModal: true });
          }}
          icon={faEdit}
          size="lg"
        />
      </div>
    );
  };

  render() {
    return (
      <div>
        {/* {(this.state.showEditModal) ? <div> </div> : this.showIcon()}
                {(this.state.showEditModal ? this.editISForm() : <div> </div>)} */}
        {this.state.showEditModal ? this.editISForm() : this.showIcon()}
      </div>
    );
  }
}
