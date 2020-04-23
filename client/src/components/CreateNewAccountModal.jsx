import React, { Component } from "react";
import firebase from "./firebase";
import { Button, Modal} from "react-bootstrap";

  export default class AddNewPeople extends Component {
    constructor(props) {
      super(props);
    }
    state = {


    };
  
  
    render() {
      return (
        <Modal.Dialog style={{ marginLeft: "0", width: "350px" }}>
          <Modal.Header closeButton onHide={this.props.closeModal} >
            <Modal.Title>
              <h5 className="normalfancytext">
                Create Account 
              </h5>{" "}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <label>Name</label>
              <div className="input-group mb-3">
                <input
                  style={{ width: "200px" }}
                  placeholder="Enter Name"
                  
                />
              </div>
              <label>Email</label>
              <div className="input-group mb-3">
                <input
                  style={{ width: "200px" }}
                  placeholder="Enter Email "
                  
                />
              </div> 
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button style = {{marginLeft:"10px"}} variant="secondary" onClick = {this.props.closeModal}>
              Close
            </Button>
            <Button variant="info" style = {{marginLeft:"50px", marginRight:"30px"}} type="submit" >
                Save changes
              </Button>
           
          </Modal.Footer>
        </Modal.Dialog>
      );
    }
  }
  