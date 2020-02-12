import React, { Component } from 'react'
// import firebase from "./firebase";
import {  Button, Modal} from 'react-bootstrap';

export default class AddNewATItem extends Component {

    constructor(props) {
        super(props)
        console.log('AddNewATItem constructor');
    }

    state = {
        newActionTitle: '',
    }

    componentDidMount() {
        console.log('AddNewATItem did mount')
        console.log(this.props.ATItem)
        console.log(this.props.ATItem.fbPath)
        console.log(this.props.ATItem.arr)
        console.log(this.props.ATArray)
    }

    handleInputChange = (e) => {
        console.log(e.target.value);
        this.setState(
            {
                newActionTitle: e.target.value
            }
        )
    }

    newInputSubmit = () => {
        if (this.state.newActionTitle === "") {
            alert('Invalid Input');
            return;
        }
        console.log("Submitting Input: " + this.state.newActionTitle)
        this.addNewDoc();
    }



    addNewDoc = () => {
        this.props.ATItem.fbPath.collection('actions&tasks').add({
            'title': this.state.newActionTitle
        }).then(
            ref => {
                if (ref.id === null) {
                    alert('Fail to add new Action / Task item')
                    return;
                }
                console.log('Added document with ID: ', ref.id);
                let newElement = {
                    'title': this.state.newActionTitle,
                    'id': ref.id
                }
                let newArr = this.props.ATArray
                newArr.push(newElement);

                console.log(newArr);
                this.updateEntireArray(newArr);
            }
        );
    }

        //This function will below will essentially take in a array and have a key map to it 
        updateEntireArray = (newArr) => {
            // 2. update adds to the document
            this.props.ATItem.fbPath.update({ 'actions&tasks': newArr}).then(
                (doc) => {
                    console.log('updateEntireArray Finished')
                    console.log(doc);
                    if(this.props != null){
                        console.log("refreshing FireBasev2 from AddNewATItem");
                        this.props.refresh(newArr);
                    }
                }
            )
        }
    



    render() {
        return (

            <Modal.Dialog style={{ marginLeft: '0', width: this.props.modalWidth }}>
            <Modal.Header closeButton onClick={() => {this.props.hideNewATModal(); console.log("closed button clicked")}   }>
                <Modal.Title><h2 className="normalfancytext">Add New Task/Action</h2> </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* <AddNewGRItem refresh={this.grabFireBaseRoutinesGoalsData} isRoutine={this.state.isRoutine} /> */}
                <div className="input-group mb-3" >
                    <input style= {{ width:'200px'}} placeholder="Enter Title" value={this.state.newActionTitle} onChange={this.handleInputChange} />
                </div >
                </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => { this.props.hideNewATModal(); console.log("closed button clicked")}  }>Close</Button>
                <Button variant="info" onClick={() => { this.newInputSubmit() } }>Save changes</Button>
            </Modal.Footer>
        </Modal.Dialog>

        )
    }
}
