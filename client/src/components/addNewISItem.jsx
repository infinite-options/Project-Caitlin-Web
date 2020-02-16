import React, { Component } from 'react'
// import firebase from "./firebase";
import { Button, Modal } from 'react-bootstrap';

/**
 * 
 * This class is responsible for adding a new elemnt to the
 * firebase database. If it becomes successful then we update
 * the view on the firebasev2
*/
export default class AddNewISItem extends Component {

    constructor(props) {
        super(props)
        console.log('AddNewISItem constructor');
    }

    state = {
        atArr: [], //goal, routine original array 
        newInstructionTitle: '',
    }

    componentDidMount() {
        console.log('AddNewISItem did mount')
        console.log(this.props.ISArray);
        console.log(this.props.ISItem);

    }

    handleInputChange = (e) => {
        console.log(e.target.value);
        this.setState(
            {
                newInstructionTitle: e.target.value
            }
        )
    }

    newInputSubmit = () => {
        if (this.state.newInstructionTitle === "") {
            alert('Invalid Input');
            return;
        }
        console.log("Submitting Input: " + this.state.newInstructionTitle)
        let newElement = {
            'title': this.state.newInstructionTitle,
            'photo': "",
            'is_available': true,
            'available_end_time': "23:59:59",
            'available_start_time': "00:00:00",
            'is_complete': false
        }
        this.props.ISArray.push(newElement)
        this.updateEntireArray(this.props.ISArray);
    }

    //This function will below will essentially take in a array and have a key map to it 
    updateEntireArray = (newArr) => {
        // 2. update adds to the document
        
        this.props.ISItem.fbPath.update({ 'instructions&steps': newArr }).then(
            (doc) => {
                console.log('updateEntireArray Finished')
                console.log(doc);
                if (this.props != null) {
                    console.log("refreshing FireBasev2 from ISItem");
                    this.props.refresh(newArr);
                }
                else{
                    console.log("removing newly added item due to failure");
                    this.props.ISArray.pop()
                }
            }
        )
    }


    render() {
        return (
            <Modal.Dialog style={{ marginLeft: '0', width: this.props.modalWidth }}>
                <Modal.Header closeButton onClick={() => { this.props.hideNewISModal(); console.log("closed button clicked") }}>
                    <Modal.Title><h2 className="normalfancytext">Add New Step</h2> </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* <AddNewGRItem refresh={this.grabFireBaseRoutinesGoalsData} isRoutine={this.state.isRoutine} /> */}
                    <div className="input-group mb-3" >
                        <input style={{ width: '200px' }} placeholder="Enter Title" value={this.state.newInstructionTitle} onChange={this.handleInputChange} />
                    </div >
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { this.props.hideNewISModal(); console.log("closed button clicked") }}>Close</Button>
                    <Button variant="info" onClick={() => { this.newInputSubmit() }}>Save changes</Button>
                </Modal.Footer>
            </Modal.Dialog>

        )
    }
}
