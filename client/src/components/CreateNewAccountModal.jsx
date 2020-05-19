import React, { Component } from "react";
import firebase from "./firebase";
import { Button, Modal, Row, Col, DropdownButton, Dropdown} from "react-bootstrap";

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
            google_refresh_token:"",
            email: ""
          },
          copy_from_user: "",
          copy_from_user_name: "Copy Exisiting Client",
          unique_id: "",
          UserDocsPath: firebase
            .firestore()
            .collection("users")
            // .doc("7R6hAVmDrNutRkG3sVRy")
            // .doc(this.props.theCurrentUserId)
    };

    newUserInputSubmit = ()=>{
      console.log("this is the copy fron user",this.state.copy_from_user);
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
            this.updateWithId(ref.id);

          });
    }

    updateWithId = (id ) => {
      console.log("this is the id",id);
      // console.log("this is th old id", this.state.itemToEdit.unique_id)
        console.log("this is the itemtoedit ", this.state.itemToEdit);
        this.state.UserDocsPath.doc(id).update(this.state.itemToEdit).then(
            (doc) => {
                console.log("it should be going in here");
                if(this.state.copy_from_user != ""){
                  const url = "https://us-central1-project-caitlin-c71a9.cloudfunctions.net/CopyUserData";
                  const Data = {
                      data : {
                        "copy_from_user" : this.state.copy_from_user,
                        "copy_to_user" : id
                      }
                  };
                  const param = {
                    headers:{
                        //"content-type":"application/json; charset=UTF-8"
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(Data),
                    method: "POST"
                  };

                  fetch(url, param)
                  .then((response) => response.json())
                  .then((result) => { console.log(result); } )
                  .catch((error) => { console.error(error); });

               }
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
                <label> {this.state.itemToEdit.newAccountEmail} </label>
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
                    title= {this.state.copy_from_user_name}
                    style = {{}}
                >
                     {Object.keys(this.props.userNamesAndId).map(
                        (keyName, keyIndex) => (
                          // use keyName to get current key's name
                          // and a[keyName] to get its value
                          //keyName is the user id
                          //keyIndex will help me find the user pic
                          //this.state.userIdAndName[keyName] gives me the name of current user
                          <Dropdown.Item
                            key={keyName}
                            onClick={(e) => {
                              this.setState({copy_from_user: keyName, copy_from_user_name:this.props.userNamesAndId[keyName]});
                            }}
                          >
                            {this.props.userNamesAndId[keyName] || ""}
                          </Dropdown.Item>
                        )
                      )}
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
