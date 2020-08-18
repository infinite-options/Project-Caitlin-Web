import React, { Component } from "react";
import firebase from "./firebase";
import { Button, Modal} from "react-bootstrap";
import { storage } from './firebase';

  export default class AddNewPeople extends Component {
    constructor(props) {
      super(props);
    }
    state = {
      itemToEdit: {
        have_pic: false,
        important: false,
        name: "",
        phone_number: "",
        pic: "",
        relationship: "",
        speaker_id:"",
        unique_id: "",
        email: ""
      }, 
      saveChangesButtonEnabled: true,
      peopleDocsPath: firebase
        .firestore()
        .collection("users")
        .doc(this.props.currentUserId)
        .collection("people")
    };
  
    handleFileSelected = event => {
        event.preventDefault(); 
        event.stopPropagation();                
        const file = event.target.files[0];
        this.setState({
            saveChangesButtonEnabled: false
        }, ()=>{
            let targetFile = file
            if(targetFile != null ){
                let temp = this.state.itemToEdit;
    
                // Create a reference to the firebase storage. 
                var storageRef = storage.ref('People/' + targetFile.name);
                //upload file to firebase storage
                var task = storageRef.put(targetFile);
                //check on the the upload progress
                task.on('state_changed',
                    function progress(snapshot){
                        //get percentage uplaoded 
                        var percentage = (snapshot.bytesTransfered/ snapshot.totalBytes) * 100;
                        console.log(percentage);
    
                    },
                    function error(err){
                        console.log(err);
                    },
                    (snapshot) =>{
                        temp.have_pic = true;
                        console.log("completed");
                        storage.ref('People').child(targetFile.name).getDownloadURL().then(url => {
                            temp.pic = url;
                            this.setState({
                                itemToEdit: temp,
                                saveChangesButtonEnabled: true
                            }); 
                        });
                    }
                );     
            }}); 
    };

    newPersonInputSubmit = ( ) => {
        this.state.peopleDocsPath
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
        this.state.peopleDocsPath.doc(this.state.itemToEdit.unique_id).update(this.state.itemToEdit).then(
            (doc) => {
                
                this.props.closeModal(); 
                this.props.newPersonAdded(); 
            }
        )
    }

  
    render() {
      return (
        <Modal.Dialog style ={{marginLeft:"50px",marginTop:"-600px", width:"350px"}}>
          <Modal.Header closeButton onHide={this.props.closeModal} >
            <Modal.Title>
              <h5 className="normalfancytext">
                Add New People
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
                  value={this.state.itemToEdit.name}
                  onChange={e => {
                    e.stopPropagation();
                    let temp = this.state.itemToEdit;
                    temp.name = e.target.value;
                    this.setState({ itemToEdit: temp });
                  }}
                />
              </div>
              <label>Relationship</label>
              <div className="input-group mb-3">
                <input
                  style={{ width: "200px" }}
                  placeholder="Enter Relationship "
                  value={this.state.itemToEdit.relationship}
                  onChange={e => {
                    e.stopPropagation();
                    let temp = this.state.itemToEdit;
                    temp.relationship = e.target.value;
                    this.setState({ itemToEdit: temp });
                  }}
                />
              </div>
              <label>Phone Number</label>
              <div className="input-group mb-3">
                <input
                  style={{ width: "200px" }}
                  placeholder="Enter Phone Number"
                  value={this.state.itemToEdit.phone_number}
                  onChange={e => {
                    e.stopPropagation();
                    let temp = this.state.itemToEdit;
                    temp.phone_number = e.target.value;
                    this.setState({ itemToEdit: temp });
                  }}
                />
              </div>
              <label>Email</label>
              <div className="input-group mb-3">
                <input
                  style={{ width: "200px" }}
                  placeholder="Enter Email Address"
                  value={this.state.itemToEdit.email}
                  onChange={e => {
                    e.stopPropagation();
                    let temp = this.state.itemToEdit;
                    temp.email = e.target.value;
                    this.setState({ itemToEdit: temp });
                  }}
                />
              </div>
              
              {/* <div className="input-group mb-3" style ={{marginTop:"10px"}}>
              <label className="form-check-label" >Important Person?</label>
              <input
                style={{  marginLeft: "10px",width: "20px", height: "20px"}}
                type="checkbox"
                checked={this.state.itemToEdit.important}
                onChange={e => {
                  e.stopPropagation();
                  let temp = this.state.itemToEdit;
                //   console.log(temp.important);
                  temp.important = !temp.important;
                  this.setState({ itemToEdit: temp });
                }}
              />
            </div> */}
            <label>Upload Photo</label>
              <div className="input-group mb-3">
              <input
                style = {{color: "transparent", width: "200px"}} 
                accept="image/*"
                type="file"
                onChange={this.handleFileSelected}
                // id="ProfileImage"
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button style = {{marginLeft:"10px"}} variant="secondary" onClick = {this.props.closeModal}>
              Close
            </Button>
            {(this.state.saveChangesButtonEnabled === false?
              <Button variant="info" style = {{marginLeft:"50px", marginRight:"30px"}} type="submit" disabled>
                Save changes
              </Button>:
              <Button variant="info" style = {{marginLeft:"50px", marginRight:"30px"}} type="submit" onClick={(e) => {e.stopPropagation(); this.newPersonInputSubmit()}} >
                Save changes
              </Button>
            )}
           
          </Modal.Footer>
        </Modal.Dialog>
        
      );
    }
  }
  

  