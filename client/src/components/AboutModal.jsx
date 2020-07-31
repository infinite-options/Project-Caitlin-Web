import React from 'react';
import firebase from "./firebase";
import AddNewPeople from "./AddNewPeople";
import SettingPage from "./SettingPage";
import { Form,Row,Col ,Modal,Button,Container,Dropdown,DropdownButton,} from "react-bootstrap";
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
            .doc(this.props.theCurrentUserId),
            importantPeople1id: null,
            importantPeople2id: null,
            importantPeople3id: null,
            aboutMeObject: {have_pic: false, message_card:"", message_day:"",pic:"", timeSettings:{morning:"", afternoon:"", evening:"", night:"", dayStart:"", dayEnd:"", timeZone:""}},
            firstName: "",
            lastName: "",
            peopleNamesArray: {},
            importantPoeplArrayLength: "0",
            importantPeople1: {have_pic: false, important:false, name: "", phone_number:"",pic:"",relationship:"", unique_id:""},
            importantPeople2: {have_pic: false, important:false, name: "", phone_number:"",pic:"",relationship:"", unique_id:""},
            importantPeople3: {have_pic: false, important:false, name: "", phone_number:"",pic:"",relationship:"", unique_id:""},
            ImporPersonOneChange: false,
            ImporPersonTwoChange: false,
            ImporPersonThreeChange: false,
            importantPeople1Previous: {},
            importantPeople2Previous: {},
            importantPeople3Previous: {},
            importantPeople1DocRefChanged: null,
            importantPeople2DocRefChanged: null,
            importantPeople3DocRefChanged: null,
            showAddNewPeopleModal: false,
            showTimeModal: false,
            saveButtonEnabled: true,
            enableDropDown: false
        }
    }

    componentDidMount() {
        this.grabFireBaseAboutMeData();
        this.grabFireBaseAllPeopleNames();
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
            if(targetFile !== null && Object.keys(this.state.aboutMeObject).length !== 0 ){
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
            if(targetFile !== null && Object.keys(this.state.importantPeople1).length !== 0 ){
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
            if(targetFile !== null && Object.keys(this.state.importantPeople2).length !== 0 ){
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
            if(targetFile !== null && Object.keys(this.state.importantPeople3).length !== 0 ){
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

    grabFireBaseAllPeopleNames = () => {
        const db = firebase.firestore();
        // db.collection('users').doc("7R6hAVmDrNutRkG3sVRy").collection('people').get()
        db.collection('users').doc(this.props.theCurrentUserId).collection('people').get()
        .then((peoplesArray) => {
            let importantPeopleArray = [];
            let importantPeopleReferencid = [];
            let test = {};
            let j = 0;
        //    console.log("this is the peoples array", peoplesArray);
            // grab the ID of all of the people in the firebase.
            for(let i = 0; i<peoplesArray.docs.length; i++){
                // console.log("should not go in here");
                // db.collection('users').doc("7R6hAVmDrNutRkG3sVRy").collection('people').doc(peoplesArray.docs[i].id).get()
                db.collection('users').doc(this.props.theCurrentUserId).collection('people').doc(peoplesArray.docs[i].id).get()
                .then( (doc) => {
                    j++;
                    if(doc.data().important === true){
                        importantPeopleReferencid.push(peoplesArray.docs[i].id);
                        importantPeopleArray.push(doc.data());
                    }
                    test[doc.data().unique_id] = doc.data().name;
                    if(j === peoplesArray.docs.length){
                        if(importantPeopleArray.length >= 3){
                            this.setState({
                                peopleNamesArray:test,
                                enableDropDown: true,
                                importantPoeplArrayLength: importantPeopleArray.length,
                                importantPeople1: importantPeopleArray[0],
                                importantPeople2: importantPeopleArray[1],
                                importantPeople3: importantPeopleArray[2],
                                importantPeople1id: importantPeopleReferencid[0],
                                importantPeople2id: importantPeopleReferencid[1],
                                importantPeople3id: importantPeopleReferencid[2],
                            });
                        }
                        else if(importantPeopleArray.length === 2){
                            this.setState({
                                peopleNamesArray:test,
                                enableDropDown: true,
                                importantPoeplArrayLength: importantPeopleArray.length,
                                importantPeople1: importantPeopleArray[0],
                                importantPeople2: importantPeopleArray[1],
                                importantPeople1id: importantPeopleReferencid[0],
                                importantPeople2id: importantPeopleReferencid[1],
                            });
                        }
                        else if(importantPeopleArray.length === 1){
                            this.setState({
                                peopleNamesArray:test,
                                enableDropDown: true,
                                importantPoeplArrayLength: importantPeopleArray.length,
                                importantPeople1: importantPeopleArray[0],
                                importantPeople1id: importantPeopleReferencid[0],
                            });
                        }
                        else if(importantPeopleArray.length === 0){
                            this.setState({
                                peopleNamesArray:test,
                                enableDropDown: true,
                                importantPoeplArrayLength: importantPeopleArray.length
                            });
                        }
                    }
                })
                .catch((err) => {
                    console.log('Error getting documents', err);
                })
            }
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
    }

    grabFireBaseAboutMeData = () => {
        const db = firebase.firestore();
        // const docRef = db.collection("users").doc("7R6hAVmDrNutRkG3sVRy");
        const docRef = db.collection("users").doc(this.props.theCurrentUserId);
        docRef
          .get()
          .then(doc => {
            //   console.log("this is the doc exists", doc.exists);
            if (doc.exists) {
              var x = doc.data();
            //   console.log("this is the doc data",x)
            //   console.log("this is x in the about modal", x);
              var firstName = x.first_name;
              var lastName = x.last_name;
              if(x["about_me"] !== undefined){
                x = x["about_me"];
                this.setState({
                    aboutMeObject: x, firstName:firstName, lastName:lastName
                });
              }else{
                this.setState({
                    firstName:firstName, lastName:lastName
                });
              }


            } else {
              console.log("No such document!");
            }
          })
          .catch(function(error) {
            console.log("Error getting document:", error);
          });
    };

    hidePeopleModal = () => {
        this.setState({showAddNewPeopleModal: false});
    }

    hideTimeModal = () =>{
        this.setState({showTimeModal: false});
    }
    updatePeopleArray = () => {
        this.grabFireBaseAllPeopleNames();
    }

    updateTimeSetting = (time) =>{
        let temp = this.state.aboutMeObject;
        temp.timeSettings = time;

        this.setState({ aboutMeObject: temp, showTimeModal: false  });

    }


    changeImpPersonOne = (Reference) => {
        //Set the new person as an important person.
        this.state.firebaseRootPath.collection('people').doc(Reference).get()
        .then((doc) => {
           let temp  = {};
           let temp2 = {};
           temp = doc.data();
           temp.important = true;
           if(this.state.ImporPersonOneChange === false ){
                temp2 = this.state.importantPeople1;
                temp2.important = false;
           }
           else{
               temp2 = this.state.importantPeople1Previous;
           }
           this.setState({ImporPersonOneChange: true,importantPeople1Previous: temp2 , importantPeople1DocRefChanged: doc.ref.id, importantPeople1: temp});
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
    }

    changeImpPersonTwo = (Reference) => {
        //Set the new person as an important person.
        this.state.firebaseRootPath.collection('people').doc(Reference).get()
        .then((doc) => {
           let temp  = {};
           let temp2 = {};
           temp = doc.data();
           temp.important = true;
           if(this.state.ImporPersonTwoChange === false ){
                temp2 = this.state.importantPeople2;
                temp2.important = false;
           }
           else{
               temp2 = this.state.importantPeople2Previous;
           }
           this.setState({ImporPersonTwoChange: true,importantPeople2Previous: temp2 , importantPeople2DocRefChanged: doc.ref.id, importantPeople2: temp});
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
    }
    changeImpPersonThree = (Reference) => {
        //Set the new person as an important person.
        this.state.firebaseRootPath.collection('people').doc(Reference).get()
        .then((doc) => {
           let temp  = {};
           let temp2 = {};
           temp = doc.data();
           temp.important = true;
           if(this.state.ImporPersonThreeChange === false ){
                temp2 = this.state.importantPeople3;
                temp2.important = false;
           }
           else{
               temp2 = this.state.importantPeople3Previous;
           }
           this.setState({ImporPersonThreeChange: true,importantPeople3Previous: temp2 , importantPeople3DocRefChanged: doc.ref.id, importantPeople3: temp});
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
    }

    newInputSubmit = () => {
        if(this.state.importantPeople1.important === true){
            if(this.state.ImporPersonOneChange === true){
                if(this.state.importantPeople1id != null){
                    this.state.firebaseRootPath.collection('people').doc(this.state.importantPeople1id).update(this.state.importantPeople1Previous);
                }
                if(this.state.importantPeople1DocRefChanged != null){
                    this.state.firebaseRootPath.collection('people').doc(this.state.importantPeople1DocRefChanged).update(this.state.importantPeople1);
                }
            }
            else{
                this.state.firebaseRootPath.collection('people').doc(this.state.importantPeople1id).update(this.state.importantPeople1);
            }
        }
        if(this.state.importantPeople2.important === true){
            if(this.state.ImporPersonTwoChange === true){
                if(this.state.importantPeople2id != null){
                    this.state.firebaseRootPath.collection('people').doc(this.state.importantPeople2id).update(this.state.importantPeople2Previous);
                }
                if(this.state.importantPeople2DocRefChanged != null){
                    this.state.firebaseRootPath.collection('people').doc(this.state.importantPeople2DocRefChanged).update(this.state.importantPeople2);
                }
            }
            else{
                this.state.firebaseRootPath.collection('people').doc(this.state.importantPeople2id).update(this.state.importantPeople2);
            }
        }
        if(this.state.importantPeople3.important === true){
            if(this.state.ImporPersonThreeChange === true){
                if(this.state.importantPeople3id != null){
                    this.state.firebaseRootPath.collection('people').doc(this.state.importantPeople3id).update(this.state.importantPeople3Previous);
                }
                if(this.state.importantPeople3DocRefChanged != null){
                    this.state.firebaseRootPath.collection('people').doc(this.state.importantPeople3DocRefChanged).update(this.state.importantPeople3);
                }
            }
            else{
                this.state.firebaseRootPath.collection('people').doc(this.state.importantPeople3id).update(this.state.importantPeople3);
            }
        }
        this.state.firebaseRootPath.update({'first_name': this.state.firstName});
        this.state.firebaseRootPath.update({'last_name': this.state.lastName});
        let newArr = this.state.aboutMeObject;
        let name = this.state.firstName + " " + this.state.lastName;
        this.state.firebaseRootPath.update({ 'about_me': newArr }).then(
           (doc) => {
               this.props.updateProfilePic(name, this.state.aboutMeObject.pic);
               this.props.updateProfileTimeZone(this.state.aboutMeObject.timeSettings.timeZone);
               this.hideAboutForm();
           }
       )
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
                        <Row>
                            <Col style = {{paddingRight:"0px"}}>
                                <label style = {{marginTop:"10px", marginLeft:"10px"}}>First:</label>
                            </Col>
                            <Col xs= {9} style = {{paddingLeft:"0px"}}>
                                <Form.Control
                                type="text"
                                placeholder="First Last"
                                value={this.state.firstName || ''}
                                onChange={
                                    (e) => { e.stopPropagation(); this.setState({ firstName: e.target.value }) }
                                }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col style = {{paddingRight:"0px"}}>
                                <label style = {{marginTop:"10px", marginLeft:"10px"}}>Last:</label>
                            </Col>
                            <Col xs= {9} style = {{paddingLeft:"0px"}}>
                                <Form.Control
                                type="text"
                                placeholder="First Last"
                                value={this.state.lastName || ''}
                                onChange={
                                    (e) => { e.stopPropagation();this.setState({ lastName: e.target.value }) }
                                }
                                />
                            </Col>
                        </Row>

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

                        <Row>
                            <Col>
                                {(this.state.importantPeople1.have_pic === false ?
                                <div >
                                    <FontAwesomeIcon icon={faImage} size="6x" style = {{marginLeft:"5px"}} />
                                    {(this.state.importantPeople1.important === false ?
                                    <input
                                        style = {{color: "transparent", marginTop:"15px", width:"100px", overflow:"hidden"}}
                                        type= "file"
                                        accept="image/*"
                                        disabled/>:
                                    <input
                                        style = {{color: "transparent", marginTop:"15px", width:"100px", overflow:"hidden"}}
                                        type= "file"
                                        accept="image/*"
                                        onChange={this.handleImpPeople1}
                                    />
                                    )}
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
                                     <input
                                      style = {{color: "transparent", marginTop:"15px", width:"100px", overflow:"hidden"}}
                                      // style = {{color: "transparent", marginTop:"10px"}}
                                      type= "file" accept="image/*"
                                      onChange={this.handleImpPeople1}
                                    />
                                </div>)}
                            </Col>
                            <Col xs={7} style = {{paddingLeft:"0px", marginTop:"10px"}}>
                                <div className="d-flex flex-row">
                                    {(this.state.importantPeople1.important === false?
                                        <Form.Control
                                            style = {{width:"150px", display:"inline-block"}}
                                            type="text"
                                            placeholder="Name ..."
                                            value = ""
                                            disabled
                                        />:
                                        <Form.Control
                                            style = {{width:"150px", display:"inline-block"}}
                                            type="text"
                                            placeholder="Name ..."
                                            value = {this.state.importantPeople1.name || ''}
                                            onChange={
                                                (e) => { e.stopPropagation(); let temp = this.state.importantPeople1; temp.name = e.target.value; this.setState({ importantPeople1: temp }) }
                                            }
                                        />
                                    )}
                                    {this.state.enableDropDown === false?
                                    <DropdownButton
                                        style={{ display:"inline-block" }}
                                        title=""
                                        disabled>
                                    </DropdownButton>:
                                        <DropdownButton
                                        title=""
                                        >
                                            {
                                                Object.keys(this.state.peopleNamesArray).map((keyName, keyIndex) => (
                                                    // use keyName to get current key's name
                                                    // and a[keyName] to get its value
                                                    <Dropdown.Item  key = {keyName} onClick= {e => {this.changeImpPersonOne(keyName)}}>
                                                        {this.state.peopleNamesArray[keyName]}
                                                    </Dropdown.Item>
                                                ))
                                            }
                                        </DropdownButton>
                                    }
                                </div>
                                {this.state.importantPeople1.important === false?
                                    <div>
                                        <Form.Control
                                            type="text"
                                            placeholder="Relationship"
                                            value = ""
                                            disabled
                                        />
                                        <Form.Control
                                            type="text"
                                            placeholder="Phone Number"
                                            value = ""
                                            disabled
                                        />
                                    </div>:
                                    <div>
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
                                    </div>
                                }
                            </Col>
                            {this.state.importantPeople1.important === false && <p style = {{fontSize:"0.9em", marginLeft:"20px"}}> Choose a person or add a new one</p>}
                        </Row>
                        <Row style={{ marginTop: "20px" }}>
                            <Col>
                                {(this.state.importantPeople2.have_pic === false ?
                                <div>
                                    <FontAwesomeIcon icon={faImage} size="6x" style = {{marginLeft:"5px"}} />
                                    {(this.state.importantPeople2.important === false ?
                                    <input
                                        style = {{color: "transparent", marginTop:"15px", width:"100px", overflow:"hidden"}}
                                        type= "file"
                                        accept="image/*"
                                        disabled/>:
                                    <input
                                        style = {{color: "transparent", marginTop:"15px", width:"100px", overflow:"hidden"}}
                                        type= "file"
                                        accept="image/*"
                                        onChange={this.handleImpPeople2}
                                    />
                                    )}
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
                                    <input
                                        style = {{color: "transparent", marginTop:"15px", width:"100px", overflow:"hidden"}}
                                        type= "file"
                                        accept="image/*"
                                        onChange={this.handleImpPeople2}
                                    />
                                </div>)}

                            </Col>
                            <Col xs={7} style = {{paddingLeft:"0px", marginTop:"10px"}}>
                                <div className="d-flex flex-row">
                                    {(this.state.importantPeople2.important === false?
                                        <Form.Control
                                            style = {{width:"150px", display:"inline-block"}}
                                            type="text"
                                            placeholder="Name ..."
                                            value = ""
                                            disabled
                                        />:
                                        <Form.Control
                                            style = {{width:"150px", display:"inline-block"}}
                                            type="text"
                                            placeholder="Name ..."
                                            value = {this.state.importantPeople2.name || ''}
                                            onChange={
                                                (e) => { e.stopPropagation(); let temp = this.state.importantPeople2; temp.name = e.target.value; this.setState({ importantPeople2: temp }) }
                                            }
                                        />
                                    )}

                                    {this.state.enableDropDown === false?
                                    <DropdownButton
                                        style={{ display:"inline-block" }}
                                        title=""
                                        disabled>
                                    </DropdownButton>:
                                        <DropdownButton
                                        title=""
                                        >
                                            {
                                                Object.keys(this.state.peopleNamesArray).map((keyName, keyIndex) => (
                                                    // use keyName to get current key's name
                                                    // and a[keyName] to get its value
                                                    <Dropdown.Item  key ={keyName} onClick= {e => {this.changeImpPersonTwo(keyName)}}>
                                                        {this.state.peopleNamesArray[keyName]}
                                                    </Dropdown.Item>
                                                ))
                                            }
                                        </DropdownButton>
                                    }
                                </div>
                                {(this.state.importantPeople2.important === false?
                                    <div>
                                        <Form.Control
                                            type="text"
                                            placeholder="Relationship"
                                            value = ""
                                            disabled
                                        />
                                        <Form.Control
                                            type="text"
                                            placeholder="Phone Number"
                                            value = ""
                                            disabled
                                        />
                                    </div>:
                                    <div>
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
                                    </div>
                                )}
                            </Col>
                            {this.state.importantPeople2.important === false && <p style = {{fontSize:"0.9em", marginLeft:"20px"}}> Choose a person or add a new one</p>}
                        </Row>
                        <Row style={{ marginTop: "20px" }}>
                            <Col>
                                {(this.state.importantPeople3.have_pic === false ?
                                <div>
                                    <FontAwesomeIcon icon={faImage} size="6x" style = {{marginLeft:"5px"}} />
                                    {(this.state.importantPeople3.important === false ?
                                    <input
                                        style = {{color: "transparent", marginTop:"15px", width:"100px", overflow:"hidden"}}
                                        type= "file"
                                        accept="image/*"
                                        disabled/>:
                                    <input
                                        style = {{color: "transparent", marginTop:"15px", width:"100px", overflow:"hidden"}}
                                        type= "file"
                                        accept="image/*"
                                        onChange={this.handleImpPeople3}
                                    />
                                    )}
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
                                    <input
                                        style = {{color: "transparent", marginTop:"15px", width:"100px", overflow:"hidden"}}
                                        type= "file"
                                        accept="image/*"
                                        onChange={this.handleImpPeople3}
                                    />
                                </div>)}
                            </Col>
                            <Col xs={7} style = {{paddingLeft:"0px", marginTop:"10px"}}>
                                <div className="d-flex flex-row">
                                    {(this.state.importantPeople3.important === false?
                                      <Form.Control
                                        style = {{width:"150px", display:"inline-block"}}
                                        type="text"
                                        placeholder="Name ..."
                                        value = ""
                                        disabled
                                     />:
                                    <Form.Control
                                        style = {{width:"150px", display:"inline-block"}}
                                        type="text"
                                        placeholder="Name ..."
                                        value = {this.state.importantPeople3.name || ''}
                                        onChange={
                                            (e) => { e.stopPropagation(); let temp = this.state.importantPeople3; temp.name = e.target.value; this.setState({ importantPeople3: temp }) }
                                        }
                                    />
                                    )}

                                    {this.state.enableDropDown === false?
                                    <DropdownButton
                                        style={{ display:"inline-block" }}
                                        title=""
                                        disabled>
                                    </DropdownButton>:
                                        <DropdownButton
                                            title=""
                                        >
                                            {
                                                Object.keys(this.state.peopleNamesArray).map((keyName, keyIndex) => (
                                                    // use keyName to get current key's name
                                                    // and a[keyName] to get its value
                                                    <Dropdown.Item key ={keyName} onClick= {e => {this.changeImpPersonThree(keyName)}}>
                                                        {this.state.peopleNamesArray[keyName]}
                                                    </Dropdown.Item>
                                                ))
                                            }
                                        </DropdownButton>
                                    }
                                </div>
                                {(this.state.importantPeople3.important === false?
                                    <div>
                                        <Form.Control
                                            type="text"
                                            placeholder="Relationship"
                                            value = ""
                                            disabled
                                        />
                                        <Form.Control
                                            type="text"
                                            placeholder="Phone Number"
                                            value = ""
                                            disabled
                                        />
                                    </div>:
                                    <div>
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
                                    </div>
                                )}
                            </Col>
                            {this.state.importantPeople3.important === false && <p style = {{fontSize:"0.9em", marginLeft:"20px"}}> Choose a person or add a new one</p>}
                        </Row>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Container fluid>
                        <Row>
                        {/* style={{ display: "inline-block", margin: "10px", marginBottom: "0" }} */}

                            <Button variant="outline-primary"
                                    style={{ display: "inline-block", marginLeft: "15px", marginBottom: "10px"}}
                                    onClick={() => {
                                        this.setState(
                                          {
                                            showTimeModal: true,
                                          }
                                        );
                                    }} >
                                    Time Settings
                            </Button>
                        </Row>
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
            {this.state.showAddNewPeopleModal && <AddNewPeople closeModal= {this.hidePeopleModal} newPersonAdded = {this.updatePeopleArray} currentUserId={this.props.theCurrentUserId}/>}
             {(this.state.showTimeModal && !this.state.showAddNewPeopleModal) &&
                <SettingPage
                    closeTimeModal = {this.hideTimeModal}
                    currentTimeSetting= {this.state.aboutMeObject.timeSettings || {}}
                    newTimeSetting = {this.updateTimeSetting}
                />}
         </div>
        );
    }
}

export default AboutModal;
