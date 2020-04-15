import React from 'react';
import firebase from "./firebase";
import AddNewPeople from "./AddNewPeople";
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
            importantPeople1DocRef: null,
            importantPeople2DocRef: null,
            importantPeople3DocRef: null,
            aboutMeObject: {},
            importantPeople1: {},
            importantPeople2: {},
            importantPeople3: {},
            saveButtonEnabled: true,
            showAddNewPeopleModal: false
        }
    }

    componentDidMount() {
        this.grabFireBaseAboutMeData();
        this.grabFireBasePeople1Data();
        this.grabFireBasePeople2Data();
        this.grabFireBasePeople3Data();
        
    }

    hideAboutForm = e => {
        this.props.CameBackFalse();   
    };

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

  

    handleImpPeople1 = (event) =>{
        event.preventDefault(); 
        event.stopPropagation();                
        const file2 = event.target.files[0];
        this.setState({
            saveButtonEnabled: false
        }, ()=>{
            let targetFile = file2
            if(targetFile != null && Object.keys(this.state.importantPeople1).length != 0 ){
                let temp = this.state.importantPeople1;
    
                // Create a reference to the firebase storage. 
                var storageRef = storage.ref('Important_People/' + targetFile.name);
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
                        storage.ref('Important_People').child(targetFile.name).getDownloadURL().then(url => {
                            // console.log(url);
                            temp.pic = url;
                            this.setState({
                                importantPeople1: temp,
                                saveButtonEnabled: true
                            }); 
                        });
                    }
                );     
            }}); 
    }

    handleImpPeople2 = (event) =>{
        event.preventDefault(); 
        event.stopPropagation();                
        const file3 = event.target.files[0];
        this.setState({
            saveButtonEnabled: false
        }, ()=>{
            let targetFile = file3
            if(targetFile != null && Object.keys(this.state.importantPeople2).length != 0 ){
                let temp = this.state.importantPeople2;
    
                // Create a reference to the firebase storage. 
                var storageRef = storage.ref('Important_People/' + targetFile.name);
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
                        storage.ref('Important_People').child(targetFile.name).getDownloadURL().then(url => {
                            // console.log(url);
                            temp.pic = url;
                            this.setState({
                                importantPeople2: temp,
                                saveButtonEnabled: true
                            }); 
                        });
                    }
                );     
            }});
    }

    handleImpPeople3 = (event) =>{
        event.preventDefault(); 
        event.stopPropagation();                
        const file4 = event.target.files[0];
        this.setState({
            saveButtonEnabled: false
        }, ()=>{
            let targetFile = file4
            if(targetFile != null && Object.keys(this.state.importantPeople3).length != 0 ){
                let temp = this.state.importantPeople3;
    
                // Create a reference to the firebase storage. 
                var storageRef = storage.ref('Important_People/' + targetFile.name);
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
                        storage.ref('Important_People').child(targetFile.name).getDownloadURL().then(url => {
                            // console.log(url);
                            temp.pic = url;
                            this.setState({
                                importantPeople3: temp,
                                saveButtonEnabled: true
                            }); 
                        });
                    }
                );     
            }});
    }


    grabFireBasePeople1Data = () =>{
        const db = firebase.firestore();
        let collectionRef = db.collection('Users');
        let documentRefWithName = collectionRef.doc('7R6hAVmDrNutRkG3sVRy').collection("people").doc("KC3jz0SW9xyYhMgsj0v0");

        db.collection('users').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
            
            let temp = {};
            const document_ref = doc.data()["about_me"]["important_people"][0];
            console.log("this is document_ref",document_ref.path);

            document_ref.get().then((doc2) => {
                if (doc2.exists) {
                    temp = doc2.data();
                    this.setState({importantPeople1: temp, importantPeople1DocRef: document_ref}, () =>{
                        console.log("this is the important People1", this.state.importantPeople1)
                    });
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
                
            }).catch(function(error: any) {
                console.log("Error getting document:", error);
            });
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
    }

    grabFireBasePeople2Data = () =>{
        console.log("why is it not going here")
        const db = firebase.firestore();
        db.collection('users').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
            
            let temp = {};
            const document_ref = doc.data()["about_me"]["important_people"][1];
            console.log("this is the docu ref 2", document_ref);

            document_ref.get().then((doc2) => {
                if (doc2.exists) {
                    temp = doc2.data();

                    this.setState({importantPeople2: temp, importantPeople2DocRef: document_ref}, () =>{
                        console.log("this is the important People2", this.state.importantPeople2)
                    });
                } else {
                    console.log("No such document!");
                }
                
            }).catch(function(error: any) {
                console.log("Error getting document:", error);
            });
            
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
    }

    grabFireBasePeople3Data = () =>{
        console.log("why is it not going here")
        const db = firebase.firestore();
        db.collection('users').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
            
            let temp = {};
            const document_ref = doc.data()["about_me"]["important_people"][2];
            console.log("this is the docu ref 3", document_ref);
            if(document_ref === undefined){
                this.state.importantPeople3.have_pic =false;
                this.state.importantPeople3.important = false;
                this.state.importantPeople3.name = "";
                this.state.importantPeople3.phone_number="";
                this.state.importantPeople3.pic = "";
                this.state.importantPeople3.relationship = "";
                this.state.importantPeople3.unique_id = "";
            }

            document_ref.get().then((doc2) => {
                if (doc2.exists) {
                    temp = doc2.data();

                    this.setState({importantPeople3: temp, importantPeople3DocRef: document_ref}, () =>{
                        console.log("this is the important People3", this.state.importantPeople3)
                    });
                } else {
                    console.log("No such document!");
                }
                
            }).catch(function(error: any) {
                console.log("Error getting document:", error);
            });
            
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
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
              console.log("this is about page");
              console.log(x);
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
        this.state.importantPeople1DocRef.update(this.state.importantPeople1).then(
            (doc) => {
                   
            }
        )
        this.state.importantPeople2DocRef.update(this.state.importantPeople2).then(
            (doc) => {
                   
            }
        )
        this.state.importantPeople3DocRef.update(this.state.importantPeople3).then(
            (doc) => {
                   
            }
        )
        this.state.firebaseRootPath.update({ 'about_me': newArr }).then(
            (doc) => {
                this.props.updateProfilePic(this.state.aboutMeObject.pic, this.state.aboutMeObject.name);
                this.hideAboutForm();   
            }
        )
    }

    hidePeopleModal = () => {
        this.setState({showAddNewPeopleModal: false});
    }

    render(){
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
                        value={this.state.aboutMeObject.name || ''}
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
                            style = {{color: "transparent"}} 
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
                        value={this.state.aboutMeObject.message_day || ''}
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
                        value={this.state.aboutMeObject.message_card || ''}
                        onChange={
                            (e) => { e.stopPropagation(); let temp = this.state.aboutMeObject; temp.message_card = e.target.value; this.setState({ aboutMeObject: temp }) }
                       }
                        />
                    </Form.Group>
                    <Form.Group >
                        <Form.Label>Important People</Form.Label>
                        {this.state.showAddNewPeopleModal && <AddNewPeople closeModal= {this.hidePeopleModal}/>}
                        <Row>
                            <Col>
                            
                                {(this.state.importantPeople1.have_pic === false ? 
                                <div>
                                    <FontAwesomeIcon icon={faImage} size="6x" style = {{marginLeft:"10px"}} /> 
                                    <Form.Control
                                    type="text"
                                    placeholder="Name ..."
                                    value = {this.state.importantPeople1.name || ''}
                                    onChange={
                                        (e) => { e.stopPropagation(); let temp = this.state.importantPeople1; temp.name = e.target.value; this.setState({ importantPeople1: temp }) }
                                     }
                                    />
                                </div>: 
                                <div>
                                    <img style = 
                                        {{display: "block",
                                         width: "80%",
                                         height:"70px",
                                         marginTop:"10px",
                                         marginLeft:"5px"
                                        }}
                                        src={this.state.importantPeople1.pic } 
                                        alt="Important Person 1"
                                    /> 
                                    <Form.Control
                                    style = {{marginTop:"10px"}}
                                    type="text"
                                    placeholder="Name ..."
                                    value = {this.state.importantPeople1.name || ''}
                                    onChange={
                                        (e) => { e.stopPropagation(); let temp = this.state.importantPeople1; temp.name = e.target.value; this.setState({ importantPeople1: temp }) }
                                     }
                                    />
                                </div>)} 
                            </Col>
                            <Col xs={7} style = {{paddingLeft:"0px", marginTop:"10px"}}>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Relationship"
                                    value = {this.state.importantPeople1.relationship || ''}
                                    onChange={
                                        (e) => { e.stopPropagation(); let temp = this.state.importantPeople1; temp.relationship = e.target.value; this.setState({ importantPeople1: temp }) }
                                     } 
                                 />
                                <Form.Control 
                                    type="text" 
                                    placeholder="Phone Number"
                                    value = {this.state.importantPeople1.phone_number || ''}
                                    onChange={
                                        (e) => { e.stopPropagation(); let temp = this.state.importantPeople1; temp.phone_number = e.target.value; this.setState({ importantPeople1: temp }) }
                                     } 
                                />
                                <input 
                                    style = {{color: "transparent", marginTop:"10px"}}
                                    type= "file" accept="image/*" 
                                    onChange={this.handleImpPeople1}
                                />
                            </Col>
                        </Row>
                        <Row style={{ marginTop: "20px" }}>
                            <Col>
                                {(this.state.importantPeople2.have_pic === false ? 
                                <div>
                                    <FontAwesomeIcon icon={faImage} size="6x" style = {{marginLeft:"10px"}} /> 
                                    <Form.Control
                                    type="text"
                                    placeholder="Name ..."
                                    value = {this.state.importantPeople2.name || ''}
                                    onChange={
                                        (e) => { e.stopPropagation(); let temp = this.state.importantPeople2; temp.name = e.target.value; this.setState({ importantPeople2: temp }) }
                                     }
                                    />
                                </div>: 
                                <div>
                                    <img style = 
                                        {{display: "block",
                                        width: "80%",
                                        height:"70px",
                                        marginTop:"10px",
                                        marginLeft:"5px"
                                       }}
                                        src={this.state.importantPeople2.pic } 
                                        alt="Important People 2"
                                    /> 
                                    <Form.Control
                                        style = {{marginTop:"10px"}}
                                        type="text"
                                        placeholder="Name ..."
                                        value = {this.state.importantPeople2.name || ''}
                                        onChange={
                                            (e) => { e.stopPropagation(); let temp = this.state.importantPeople2; temp.name = e.target.value; this.setState({ importantPeople2: temp }) }
                                        }
                                    />
                                </div>)}
                                
                            </Col>
                            <Col xs={7} style = {{paddingLeft:"0px", marginTop:"10px"}}>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Relationship"
                                    value = {this.state.importantPeople2.relationship || ''}
                                    onChange={
                                        (e) => { e.stopPropagation(); let temp = this.state.importantPeople2; temp.relationship = e.target.value; this.setState({ importantPeople2: temp }) }
                                     }
                                 />
                                <Form.Control 
                                    type="text" 
                                    placeholder="Phone Number" 
                                    value = {this.state.importantPeople2.phone_number || ''}
                                    onChange={
                                        (e) => { e.stopPropagation(); let temp = this.state.importantPeople2; temp.phone_number = e.target.value; this.setState({ importantPeople2: temp }) }
                                     }
                                />
                                <input 
                                    style = {{color: "transparent", marginTop:"10px"}}
                                    type= "file" 
                                    accept="image/*"
                                    onChange={this.handleImpPeople2}/>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: "20px" }}>
                            <Col>
                                {(this.state.importantPeople3.have_pic === false ? 
                                <div>
                                    <FontAwesomeIcon icon={faImage} size="6x" style = {{marginLeft:"10px"}} /> 
                                    <Form.Control
                                    type="text"
                                    placeholder="Name ..."
                                    value = {this.state.importantPeople3.name || ''}
                                    onChange={
                                        (e) => { e.stopPropagation(); let temp = this.state.importantPeople3; temp.name = e.target.value; this.setState({ importantPeople3: temp }) }
                                     }
                                    />
                                </div>: 
                                <div>
                                    <img style = 
                                        {{display: "block",
                                        width: "80%",
                                        height:"70px",
                                        marginTop:"10px",
                                        marginLeft:"5px"
                                       }}
                                        src={this.state.importantPeople3.pic } 
                                        alt="Important People 3"
                                    /> 
                                    <Form.Control
                                        style = {{marginTop:"10px"}}
                                        type="text"
                                        placeholder="Name ..."
                                        value = {this.state.importantPeople3.name || ''}
                                        onChange={
                                            (e) => { e.stopPropagation(); let temp = this.state.importantPeople3; temp.name = e.target.value; this.setState({ importantPeople3: temp }) }
                                        }
                                    />
                                </div>)}
                                
                            </Col>
                            <Col xs={7} style = {{paddingLeft:"0px", marginTop:"10px"}}>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Relationship" 
                                    value = {this.state.importantPeople3.relationship || ''}
                                    onChange={
                                        (e) => { e.stopPropagation(); let temp = this.state.importantPeople3; temp.relationship = e.target.value; this.setState({ importantPeople3: temp }) }
                                     }
                                />
                                <Form.Control 
                                    type="text" 
                                    placeholder="Phone Number" 
                                    value = {this.state.importantPeople3.phone_number || ''}
                                    onChange={
                                        (e) => { e.stopPropagation(); let temp = this.state.importantPeople3; temp.phone_number = e.target.value; this.setState({ importantPeople3: temp }) }
                                     }
                                />
                                <input 
                                    style = {{color: "transparent", marginTop:"10px"}}
                                    type= "file" 
                                    accept="image/*" 
                                    onChange={this.handleImpPeople3}
                                />
                            </Col>
                        </Row>
                        
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Container fluid>
                        <Row>
                            <Col xs={3}>
                            {((this.state.saveButtonEnabled === false || this.state.showAddNewPeopleModal === true)  ? 
                            <Button variant="info" type="submit" disabled>
                            Save
                            </Button>: 
                            <Button variant="info" type="submit" onClick={(e) => {e.stopPropagation(); this.newInputSubmit()}}>
                            Save
                            </Button>)}
                            </Col>
                            <Col xs={4}>
                                <Button variant="secondary" onClick={this.hideAboutForm}>
                                Cancel
                                </Button>
                            </Col>
                            <Col xs={4}>
                                <Button variant="primary" onClick = {(e) => {e.stopPropagation(); this.setState({showAddNewPeopleModal: true})}}>
                                Add People
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