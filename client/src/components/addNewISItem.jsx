import React, { Component } from "react";
// import firebase from "./firebase";
import ShowNotifications from "./ShowNotifications"
import { Button, Modal } from "react-bootstrap";
import {
    Form,
    Row,
    Col
  } from "react-bootstrap";

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
    newInstructionTitle: "",
    itemToEdit: {
      //new item to add to array
      id: "",
      title: "",
      photo: "",
      is_complete: false,
      is_available: true,
      available_end_time: "23:59:59",
      available_start_time: "00:00:00",
      datetime_completed: "Sun, 23 Feb 2020 00:08:43 GMT",
      datetime_started: "Sun, 23 Feb 2020 00:08:43 GMT",
      audio: "",
      is_timed: false
    }
  };

  componentDidMount() {
    console.log("AddNewISItem did mount");
    console.log(this.props.ISArray);
    console.log(this.props.ISItem);
  }

  handleInputChange = e => {
    console.log(e.target.value);
    this.setState({
      newInstructionTitle: e.target.value
    });
  };

  newInputSubmit = () => {
    if (this.state.itemToEdit.title === "") {
      alert("Invalid Input");
      return;
    }
    console.log("Submitting Input: " + this.state.itemToEdit.title);

    this.props.ISArray.push(this.state.itemToEdit);
    this.updateEntireArray(this.props.ISArray);
  };

  //This function will below will essentially take in a array and have a key map to it
  updateEntireArray = newArr => {
    // 2. update adds to the document

    this.props.ISItem.fbPath
      .update({ "instructions&steps": newArr })
      .then(doc => {
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
                        // value={this.state.newEventNotification}
                        // onChange={this.handleNotificationChange}
                        type="number"
                        placeholder="30"
                        style = {{ width:"70px", marginTop:".25rem", paddingRight:"0px"}}
                    />
                </Col>
                <Col xs={8} style = {{paddingLeft:"0px"}} >
                    <p style = {{marginLeft:"0px", marginTop:"5px"}}>minutes</p>
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
                onChange={e => {
                  e.stopPropagation();
                  let temp = this.state.itemToEdit;
                  console.log(temp.is_available);
                  temp.is_available = !temp.is_available;
                  this.setState({ itemToEdit: temp });
                }}
              />
            </div>

            {this.state.itemToEdit.is_available && <ShowNotifications />}

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
