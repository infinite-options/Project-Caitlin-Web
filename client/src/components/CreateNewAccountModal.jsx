import React, { Component } from "react";
import firebase from "./firebase";
import { Button, Modal, Row, Col, DropdownButton} from "react-bootstrap";

  export default class AddNewPeople extends Component {
    constructor(props) {
      super(props);
    }
    state = {
        itemToEdit: {
            email_id: "",
            first_name: "",
            last_name: "",
            google_auth_token:"",
            google_refresh_token:""
          }, 
        //   saveChangesButtonEnabled: true,
          UserDocsPath: firebase
            .firestore()
            .collection("users")
            // .doc("7R6hAVmDrNutRkG3sVRy")
            // .doc(this.props.theCurrentUserId)
    };

    newUserInputSubmit = ()=>{
        this.state.UserDocsPath
          .add(this.state.itemToEdit)
          .then(ref => {
            if (ref.id === null) {
              alert("Fail to add new routine / goal item");
              return;
            }
   
            let temp = this.state.itemToEdit;
            temp.unique_id = ref.id;
            console.log("Added document with ID: ", ref.id);
            this.updateWithId();
   
          });
    }

    updateWithId = ( ) => {
        this.state.UserDocsPath.doc(this.state.itemToEdit.unique_id).update(this.state.itemToEdit).then(
            (doc) => {
                
                this.props.newUserAdded(); 
            }
        )
    }
  
  
    render() {
      return (
        <Modal.Dialog style={{marginLeft:"10px", width:"600px", paddingLeft:"0px", marginTop:"10px"}}>
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
                  value={this.state.itemToEdit.email_id}
                  onChange={e => {
                    e.stopPropagation();
                    let temp = this.state.itemToEdit;
                    temp.email_id = e.target.value;
                    this.setState({ itemToEdit: temp });
                  }}
                  
                />
              </div>
              </Col>
              <Col xs={4} style ={{paddingLeft:"5px"}}>

              <label> FIrst Name</label>
              <div className="input-group mb-3">
                <input
                  style={{ width: "150px" }}
                  placeholder="Enter Name"
                  value={this.state.itemToEdit.first_name}
                  onChange={e => {
                    e.stopPropagation();
                    let temp = this.state.itemToEdit;
                    temp.first_name = e.target.value;
                    this.setState({ itemToEdit: temp });
                  }}
                  
                />
              </div>
              </Col>
              <Col xs={4} style ={{paddingLeft:"0px"}}>
              
              <label>Last Name</label>
              <div className="input-group mb-3">
                <input
                  style={{ width: "150px" }}
                  placeholder="Enter Name "
                  value={this.state.itemToEdit.last_name}
                  onChange={e => {
                    e.stopPropagation();
                    let temp = this.state.itemToEdit;
                    temp.last_name = e.target.value;
                    this.setState({ itemToEdit: temp });
                  }}
                  
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
             <Button variant="info" style = {{marginRight:"30px"}} type="submit" onClick={(e) => {e.stopPropagation(); this.newUserInputSubmit()}}>
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
  