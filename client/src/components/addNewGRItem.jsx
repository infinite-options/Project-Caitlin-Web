import React, { Component } from 'react'
import firebase from "./firebase";
import { Button, Modal} from 'react-bootstrap';

export default class AddNewGRItem extends Component {

    constructor(props) {
        super(props)
        console.log('Is this a Routine? ' + this.props.isRoutine);
    }

    state = {
        grArr: [], //goal, routine original array 
        newItem: { //Object to hold new Routine/Goal
            title: "",
        },
        //below are references to firebase directories
        routineDocsPath: firebase.firestore().collection('users').doc('7R6hAVmDrNutRkG3sVRy').collection('goals&routines'),
        arrPath: firebase.firestore().collection('users').doc('7R6hAVmDrNutRkG3sVRy')
    }

    componentDidMount() {
        (this.props.isRoutine) ? console.log("Routine Input") : console.log("Goal Input")

        this.getGRDataFromFB();
    }



    getGRDataFromFB = () => {
        //Grab the goals/routine array from firebase and then store it in state varible grArr
        console.log(this.state.arrPath);
        this.state.arrPath.get().then((doc) => {
            if (doc.exists) {
                console.log('getGRDataFromFB DATA:')
                // console.log(doc.data());
                var x = doc.data();
                x = x['goals&routines'];
                console.log(x);
                this.setState({
                    grArr: x
                })
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document! 2");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
            alert("Error getting document:", error);
        });
    }

    handleInputChange = (e) => {
        console.log(e.target.value);
        this.setState(
            {
                newItem: {
                    title: e.target.value
                }
            }
        )
    }

    newInputSubmit = () => {
        if (this.state.newItem.title === "") {
            alert('Invalid Input');
            return;
        }
        this.addNewDoc();
        console.log("Submitting Input: " + this.state.newItem.title)
    }

    addNewDoc = () => {
        this.state.routineDocsPath.add({
            'title': this.state.newItem.title,
        }).then(
            ref => {
                if (ref.id === null) {
                    alert('Fail to add new routine / goal item')
                    return;
                }
                console.log('Added document with ID: ', ref.id);
                let newElement = {
                    title: this.state.newItem.title,
                    id: ref.id,
                    is_persistent: this.props.isRoutine
                }
                this.state.grArr.push(newElement);
                this.updateEntireArray();
            }
        );
    }

    //This function will below will essentially take in a array and have a key map to it 
    updateEntireArray = () => {
        // 2. update adds to the document
        let db = this.state.arrPath;
        db.update({ 'goals&routines': this.state.grArr }).then(
            (doc) => {
                console.log('updateEntireArray Finished')
                console.log(doc);
                this.getGRDataFromFB();
                if (this.props != null) {
                    console.log("refreshing FireBasev2 from AddNewGRItem");
                    this.props.refresh();
                }
            }
        )
    }


    render() {


        return (

            <Modal.Dialog style={{ marginLeft: '0', width: this.state.modalWidth, }}>
                <Modal.Header closeButton onClick={this.props.closeModal}>
                    <Modal.Title>

                        <h5 className="normalfancytext">
                            Add New {(this.state.isRoutine ? "Routine" : "Goal")}</h5> </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        < div className="input-group mb-3" >
                            <input placeholder="Enter Title" value={this.state.newItem.title} onChange={this.handleInputChange} />
                        </div >
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.closeModal}>Close</Button>
                    <Button variant="info" onClick={  this.newInputSubmit}>Save changes</Button>
                </Modal.Footer>
            </Modal.Dialog>

        )
    }
}
