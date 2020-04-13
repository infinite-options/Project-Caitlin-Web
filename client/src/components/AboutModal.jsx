import React from 'react';
import firebase from "./firebase";
import { Form,Row,Col ,Modal,Button,Container} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage
} from "@fortawesome/free-solid-svg-icons";
import { storage } from './firebase';

class AboutModal extends React.Component{

    constructor(props) {
        super(props);
        this.state={
            firebaseRootPath: firebase
            .firestore()
            .collection("users")
            .doc("7R6hAVmDrNutRkG3sVRy"),
            file: null,
            file2: null,
            file3: null,
            file4: null,
            aboutMeObject: {},
            peopleObject: {},
            saveButtonEnabled: true
        }
    }

    componentDidMount() {
        this.grabFireBaseAboutMeData();
        this.grabFireBasePeopleData();
        // console.log('INSIDE', this.state.aboutMeObject);
    }t

    handleFileSelected = event => {
        event.preventDefault(); 
        event.stopPropagation();                
        const file = event.target.files[0];
        this.setState({
            saveButtonEnabled: false
        }, ()=>{
            let targetFile = file
            if(targetFile != null && Object.keys(this.state.aboutMeObject).length != 0 ){
                let temp = this.state.aboutMeObject;
    
                // Create a reference to the firebase storage. 
                var storageRef = storage.ref('Profile_Pics/' + targetFile.name);
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
                        storage.ref('Profile_Pics').child(targetFile.name).getDownloadURL().then(url => {
                            // console.log(url);
                            temp.pic = url;
                            this.setState({
                                aboutMeObject: temp,
                                saveButtonEnabled: true
                            }); 
                        });
                    }
                );     
            }}); 
    };
  
    hideAboutForm = e => {
      this.props.CameBackFalse();   
    };

    handleImpPeople1 = (event) =>{
        if(event.target.files[0] != null){
        this.setState({
            file2: URL.createObjectURL(event.target.files[0])
          });
        }
    }

    handleImpPeople2 = (event) =>{
        if(event.target.files[0] != null){
        this.setState({
            file3: URL.createObjectURL(event.target.files[0])
          });
        }
    }

    handleImpPeople3 = (event) =>{
        if(event.target.files[0] != null){
        this.setState({
            file4: URL.createObjectURL(event.target.files[0])
          });
        }
    }

    grabFireBasePeopleData = () =>{
        // const db = firebase.firestore();
        // const docRef = db.collection("users").doc("7R6hAVmDrNutRkG3sVRy").collection("people").doc("dRyk732Hqs6qqUxgUDe");
        // docRef
        //   .get()
        //   .then(doc => {
        //     if (doc.exists) {
        //       var x = doc.data()['people'];
              
        //       console.log("this is people object", x);
        //       this.setState({
        //         peopleObject: x
        //       });
              
        //     } else {
        //       console.log("No such document!");
        //     }
        //   })
        //   .catch(function(error) {
        //     console.log("Error getting document:", error);
        //   });
    }

    grabFireBaseAboutMeData = () => {
        const db = firebase.firestore();
        const docRef = db.collection("users").doc("7R6hAVmDrNutRkG3sVRy");
        docRef
          .get()
          .then(doc => {
            if (doc.exists) {
              var x = doc.data();
              x = x["about_me"];
              this.setState({
                aboutMeObject: x
              });
              
            } else {
              console.log("No such document!");
            }
          })
          .catch(function(error) {
            console.log("Error getting document:", error);
          });
      };

    newInputSubmit = () => {
        let newArr = this.state.aboutMeObject;
        this.state.firebaseRootPath.update({ 'about_me': newArr }).then(
            (doc) => {
                this.hideAboutForm();   
            }
        )
    }

    render(){
        // console.log("looook heere");
        // console.log('IN', this.state.aboutMeObject.pic);
        return (
            <div>
                <Modal.Dialog
                    style={{
                    borderRadius: "15px",
                    boxShadow:
                        "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
                    marginLeft: "35px",
                    width: "350px",
                    marginTop: "0"
                    }}
                >
                <Modal.Header
                closeButton
                onHide={() => {
                    this.hideAboutForm();
                }}
                >
                    <Modal.Title>
                        <h5 className="normalfancytext">About Me</h5>{" "}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Name:</Form.Label>
                        <Form.Control
                        type="text"
                        placeholder="First Last"
                        value={this.state.aboutMeObject.name}
                        onChange={
                            (e) => { e.stopPropagation(); let temp = this.state.aboutMeObject; temp.name = e.target.value; this.setState({ aboutMeObject: temp }) }
                        }
                        />
                    </Form.Group>
                    <Row>
                        <Col>  
                            {(this.state.aboutMeObject.have_pic === false  ? 
                            <FontAwesomeIcon icon={faImage} size="6x"/> : 
                            <img style = 
                                {{display: "block",
                                marginLeft: "auto",
                                marginRight:"auto" ,
                                width: "100%",
                                height:"70px",
                                }}
                                src={this.state.aboutMeObject.pic}
                                alt="Profile"
                            /> )
                            }
                        </Col>
                        <Col xs={8}>
                        <label >Upload A New Image</label>
                        <input
                             accept="image/*"
                            type="file"
                            onChange={this.handleFileSelected}
                            id="ProfileImage"
                        />
                        </Col>
                    </Row>

                    <Form.Group controlId="AboutMessage" style={{ marginTop: "10px" }}>
                        <Form.Label>Message (My Day):</Form.Label>
                        <Form.Control
                        as="textarea"
                        rows="4"
                        type="text"
                        placeholder="You are a strong ..."
                        value={this.state.aboutMeObject.message_day}
                        onChange={
                             (e) => { e.stopPropagation(); let temp = this.state.aboutMeObject; temp.message_day = e.target.value; this.setState({ aboutMeObject: temp }) }
                        }
                        />
                    </Form.Group>
                    <Form.Group controlId="AboutMessageCard">
                        <Form.Label>Message (My Card):</Form.Label>
                        <Form.Control
                        as="textarea"
                        rows="4"
                        type="text"
                        placeholder="You are a safe ..."
                        value={this.state.aboutMeObject.message_card}
                        onChange={
                            (e) => { e.stopPropagation(); let temp = this.state.aboutMeObject; temp.message_card = e.target.value; this.setState({ aboutMeObject: temp }) }
                       }
                        />
                    </Form.Group>
                    <Form.Group >
                        <Form.Label>Important People</Form.Label>
                        <Row>
                            <Col>
                                {/* <FontAwesomeIcon icon={faImage} size="6x"  /> */}
                                {(this.state.file2 === null ? 
                                <FontAwesomeIcon icon={faImage} size="6x"  /> : 
                                <img style = 
                                    {{display: "block",
                                    marginLeft: "auto",
                                    marginRight:"auto" ,
                                    width: "100%",
                                    height:"90px",
                                    }}
                                    src={this.state.file2 } alt="Important People 1"
                                /> )}
                                
                            </Col>
                            <Col xs={8}>
                                <Form.Control type="text" placeholder="Relationship" />
                                <Form.Control type="text" placeholder="Phone Number" />
                                <input type= "file" onChange={this.handleImpPeople1}/>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: "20px" }}>
                            <Col>
                                {/* <FontAwesomeIcon icon={faImage} size="5x" /> */}
                                {(this.state.file3 === null ? 
                                <FontAwesomeIcon icon={faImage} size="6x"  /> : 
                                <img style = 
                                    {{display: "block",
                                    marginLeft: "auto",
                                    marginRight:"auto" ,
                                    width: "100%",
                                    height:"90px",
                                    }}
                                    src={this.state.file3 } alt="Important People 2"
                                /> )}
                            </Col>
                            <Col xs={8}>
                                <Form.Control type="text" placeholder="Relationship" />
                                <Form.Control type="text" placeholder="Phone Number" />
                                <input type= "file" onChange={this.handleImpPeople2}/>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: "20px" }}>
                            <Col>
                                {(this.state.file4 === null ? 
                                <FontAwesomeIcon icon={faImage} size="6x"  /> : 
                                <img style = 
                                    {{display: "block",
                                    marginLeft: "auto",
                                    marginRight:"auto" ,
                                    width: "100%",
                                    height:"90px",
                                    }}
                                    src={this.state.file4 } alt="Important People 3"
                                /> )}
                            </Col>
                            <Col xs={8}>
                                <Form.Control type="text" placeholder="Relationship" />
                                <Form.Control type="text" placeholder="Phone Number" />
                                <input type= "file" onChange={this.handleImpPeople3}/>
                            </Col>
                        </Row>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Container fluid>
                        <Row>
                            <Col xs={4}>
                            {(this.state.saveButtonEnabled === false  ? 
                            <Button variant="info" type="submit" disabled>
                            Save
                            </Button>: 
                            <Button variant="info" type="submit" onClick={(e) => {e.stopPropagation(); this.newInputSubmit()}}>
                            Save
                            </Button>)}
                                {/* // <Button variant="info" type="submit" onClick={(e) => {e.stopPropagation(); this.newInputSubmit()}} disabled>
                                // Save
                                // </Button> */}
                            </Col>
                            <Col xs={4}>
                                <Button variant="secondary" onClick={this.hideAboutForm}>
                                Cancel
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Footer>
            </Modal.Dialog>
         </div>
        );
    }
}

export default AboutModal;