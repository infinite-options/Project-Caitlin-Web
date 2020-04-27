import React, { Component } from "react";
import firebase from "./firebase";
import { Button, Modal, Row, Col, DropdownButton} from "react-bootstrap";

  export default class AddNewPeople extends Component {
    constructor(props) {
      super(props);
    }
    state = {


    };
  
  
    render() {
      return (
        <Modal.Dialog style={{marginLeft:"10px", width:"600px", paddingLeft:"0px"}}>
          {/* <Modal.Header closeButton onHide={this.props.closeModal} >
            <Modal.Title>
              <h5 className="normalfancytext">
                Create Account 
              </h5>{" "}
            </Modal.Title>
          </Modal.Header> */}
          <Modal.Body >
            <Row>
                
                <Col xs={4}>

              <label> Email</label>
              <div className="input-group mb-3">
                <input
                  style={{ width: "150px" }}
                  placeholder="Enter Email"
                  
                />
              </div>
              </Col>
              <Col xs={4} style ={{paddingLeft:"5px"}}>

              <label> FIrst Name</label>
              <div className="input-group mb-3">
                <input
                  style={{ width: "150px" }}
                  placeholder="Enter Name"
                  
                />
              </div>
              </Col>
              <Col xs={4} style ={{paddingLeft:"0px"}}>
              
              <label>Last Name</label>
              <div className="input-group mb-3">
                <input
                  style={{ width: "150px" }}
                  placeholder="Enter Name "
                  
                />
              </div> 
              
              </Col>
              </Row>
              <Row>
              <Col xs={5}>
              <DropdownButton
                    title= "Copy Exisiting Client"
                    style = {{}}
                >
                    {/* {
                        Object.keys(this.state.userNamesAndPics).map((keyName, keyIndex) => (
                            // use keyName to get current key's name
                            // and a[keyName] to get its value
                            <Dropdown.Item key ={keyName} onClick= {e => {this.changeUser(keyName, this.state.userNamesAndPics[keyName])}}>
                                        {this.state.userNamesAndPics[keyName] || ''}
                            </Dropdown.Item>
                        ))
                    } */}
            </DropdownButton>
              </Col>
              <Col xs={3}>
              <Button style = {{marginLeft:"30px"}} variant="secondary" onClick = {this.props.closeModal}>
              Close
             </Button>
             </Col>
             <Col xs={4}>
             <Button variant="info" style = {{marginRight:"30px"}} type="submit" >
                Save changes
              </Button>
              </Col>
            </Row>
          </Modal.Body>
          {/* <Modal.Footer>
            <Button style = {{marginLeft:"10px"}} variant="secondary" onClick = {this.props.closeModal}>
              Close
            </Button>
            <Button variant="info" style = {{marginLeft:"50px", marginRight:"30px"}} type="submit" >
                Save changes
              </Button>
           
          </Modal.Footer> */}
        </Modal.Dialog>
      );
    }
  }
  