import React, { Component } from 'react'
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ListGroup, Button, Row, Col, Modal, InputGroup, FormControl } from 'react-bootstrap';


export default class editAT extends Component {

    constructor(props) {
        super(props)
        console.log('editAT constructor');
        console.log('Edit index ' + this.props.i)
        console.log(this.props.FBPath)
        console.log(this.props.ATArray)

        this.state = {
            showEditModal: false,
            itemToEdit: this.props.ATArray[this.props.i]
        }
    }

    newInputSubmit = () => {
        console.log("submitting edited formed to firebase");
        let newArr  = this.props.ATArray;
        newArr[this.props.i] = this.state.itemToEdit;

        this.props.FBPath.update({ 'actions&tasks': newArr }).then(
            (doc) => {
                console.log('updateEntireArray Finished')
                console.log(doc);
                if (this.props != null) {
                    console.log("refreshing FireBasev2 from updating ISItem");
                    this.props.refresh(newArr);
                }
                else{
                    console.log("update failure");
                }
            }
        )
    }

    editISForm = () => {
        return (
            <Modal.Dialog style={{ marginLeft: '0', width: this.props.modalWidth }}>
                <Modal.Header closeButton onClick={(e) => {e.stopPropagation();  this.setState({ showEditModal: false }); console.log("closed button clicked") }}>
                    <Modal.Title><h2 className="normalfancytext">Edit</h2> </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label>Title</label>
                    <div className="input-group mb-3" >
                        <input style={{ width: '200px' }} placeholder="Enter Title" value={this.state.itemToEdit.title} onChange={
                            (e) => {e.stopPropagation();  let temp = this.state.itemToEdit; temp.title = e.target.value; this.setState({itemToEdit:temp})  }
                            } />
                    </div >
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={(e) => {e.stopPropagation(); this.setState({ showEditModal: false }) }}>Close</Button>
                    <Button variant="info" onClick={(e) => { e.stopPropagation(); this.newInputSubmit() }}>Save changes</Button>
                </Modal.Footer>
            </Modal.Dialog>
        )
    }

    render() {
        return (
            <div onClick={(e) => { e.stopPropagation();}}>
                {(this.state.showEditModal ? this.editISForm() : <div> </div>)}
                <FontAwesomeIcon
                    onMouseOver={event => { event.target.style.color = "#48D6D2"; }}
                    onMouseOut={event => { event.target.style.color = "#000000"; }}
                    style={{ color: "#000000" }}
                    onClick={(e) => { e.stopPropagation(); this.setState({ showEditModal: true }) }}
                    icon={faEdit} size="1x"
                />
            </div>
        )
    }
}
