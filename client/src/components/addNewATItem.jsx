import React, { Component } from "react";
// import firebase from "./firebase";
import ShowNotifications from "./ShowNotifications"
import { Button, Modal } from "react-bootstrap";
import {
    Form,
    Row,
    Col
  } from "react-bootstrap";

export default class AddNewATItem extends Component {
  constructor(props) {
    super(props);
    console.log("AddNewATItem constructor");
    this.state = {
      newActionTitle: "", //Old delete Later
      itemToEdit: {
        id: "",
        title: "",
        photo: "",
        audio: "",
        is_complete: false,
        is_available: true,
        available_end_time: "23:59:59",
        available_start_time: "00:00:00",
        datetime_completed: "Sun, 23 Feb 2020 00:08:43 GMT",
        datetime_started: "Sun, 23 Feb 2020 00:08:43 GMT",
        is_timed: false,
        expected_completion_time: "00:11:00",
        is_sublist_available: true,
        // repeating:false,
        // repeat_number:"1",
        // repeat_frequency:"day",
        ta_notifications:{
          before:{
            is_enabled: false,
            is_set: false,
            message: "",
            time: "00:05:00"
          },
          during:{
            is_enabled: false,
            is_set: false,
            message: "",
            time: "00:30:00"
          },
          after:{
            is_enabled: false,
            is_set: false,
            message: "",
            time: "00:05:00"
          }
        },
        user_notifications:{
          before:{
            is_enabled: false,
            is_set: false,
            message: "",
            time: "00:05:00"
          },
          during:{
            is_enabled: false,
            is_set: false,
            message: "",
            time: "00:30:00"
          },
          after:{
            is_enabled: false,
            is_set: false,
            message: "",
            time: "00:05:00"
          }
        }
      }
    };
  }

  componentDidMount() {
    // console.log("AddNewATItem did mount");
    // console.log(this.props.ATItem);
    // console.log(this.props.ATItem.fbPath);
    // console.log(this.props.ATItem.arr);
    // console.log(this.props.ATArray);
  }

  newInputSubmit = () => {
    if (this.state.itemToEdit.title === "") {
      alert("Invalid Input");
      return;
    }
    // console.log("Submitting Input: " + this.state.itemToEdit.title);
    this.addNewDoc();
  };

  addNewDoc = () => {
    this.props.ATItem.fbPath
      .collection("actions&tasks")
      .add({
        title: this.state.itemToEdit.title,
        "instructions&steps": []
      })
      .then(ref => {
        if (ref.id === null) {
          alert("Fail to add new Action / Task item");
          return;
        }
        console.log("Added document with ID: ", ref.id);
        let newArr = this.props.ATArray;
        let temp = this.state.itemToEdit;
        temp.id = ref.id;
        newArr.push(temp);
        console.log(newArr);
        console.log("adding new item");
        this.updateEntireArray(newArr);
      });
  };

  //This function will below will essentially take in a array and have a key map to it
  updateEntireArray = newArr => {
    // 2. update adds to the document
    this.props.ATItem.fbPath.update({ "actions&tasks": newArr }).then(doc => {
      console.log("updateEntireArray Finished");
      console.log(doc);
      if (this.props != null) {
        this.props.hideNewATModal();
        console.log("refreshing FireBasev2 from AddNewATItem");
        this.props.refresh(newArr);
      }
    });
  };

  convertTimeToHRMMSS =  (e) => {
        
    // console.log(e.target.value);
    let num = e.target.value;
    let hours = num/60;
    let rhours = Math.floor(hours);
    let minutes = (hours - rhours)* 60;
    let rminutes = Math.round(minutes);
    if (rhours.toString().length === 1) {
        rhours = "0" + rhours;
    }
    if (rminutes.toString().length === 1) {
        rminutes = "0" + rminutes;
    }
    // console.log(rhours+":" + rminutes +":" + "00");
    return rhours+":" + rminutes +":" + "00";
  }

  convertToMinutes = () => {
      let myStr = this.state.itemToEdit.expected_completion_time.split(':');
      let hours = myStr[0];
      let hrToMin = hours* 60;
      let minutes = (myStr[1] * 1 )+ hrToMin;
      // let seconds = myStr[2];
      
      // console.log("hours: " +hours + "minutes: " + minutes + "seconds: " + seconds);
      return minutes;
  }

  handleNotificationChange = (temp) => {
    // console.log(temp);
    this.setState({ itemToEdit: temp });
  }

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

            <label>This Takes Me</label>
            <Row>
                <Col  style = {{paddingRight: "0px" }}>  
                    <Form.Control
                        type="number"
                        placeholder="30"
                        value = {this.convertToMinutes()}
                        style = {{ marginTop:".25rem", paddingRight:"0px"}}
                        onChange={
                            (e) => { e.stopPropagation(); 
                            let temp = this.state.itemToEdit; 
                            temp.expected_completion_time = this.convertTimeToHRMMSS(e);
                             this.setState({ itemToEdit: temp }) }
                        }
                    />
                </Col>
                <Col xs={8} style = {{paddingLeft:"0px"}} >
                    <p style = {{marginLeft:"10px", marginTop:"5px"}}>minutes</p>
                </Col>
            </Row>

            <div className="input-group mb-3" style ={{marginTop:"10px"}}>
              <label className="form-check-label" >Time?</label>
              <input
                style={{ marginTop: "5px", marginLeft: "5px" }}
                name="Timed"
                type="checkbox"
                checked={this.state.itemToEdit.is_timed}
                onChange={e => {
                  e.stopPropagation();
                  let temp = this.state.itemToEdit;
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
                onChange={e => {
                  e.stopPropagation();
                  let temp = this.state.itemToEdit;
                  temp.is_available = !temp.is_available;
                  this.setState({ itemToEdit: temp });
                }}
              />
            </div>

            {this.state.itemToEdit.is_available && 
              <ShowNotifications 
                itemToEditPassedIn = {this.state.itemToEdit}
                notificationChange = {this.handleNotificationChange}
              />
            }
            
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
