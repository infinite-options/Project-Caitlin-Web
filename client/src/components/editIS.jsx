import React, { Component } from 'react'
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ListGroup, Button, Row, Col, Modal, InputGroup, FormControl } from 'react-bootstrap';


export default class editIS extends Component {

    constructor(props) {
        super(props)
        console.log('editIs constructor');
        console.log('Edit index ' + this.props.i)
        console.log(this.props.FBPath)
        console.log(this.props.ISArray)
        this.state = {
            showEditModal: false,
            itemToEdit: this.props.ISArray[this.props.i]
        }
    }

    newInputSubmit = () => {
        console.log("submitting edited formed to firebase");
        let newArr  = this.props.ISArray;
        newArr[this.props.i] = this.state.itemToEdit;
        this.props.FBPath.update({ 'instructions&steps': newArr }).then(
            (doc) => {
                console.log('updateEntireArray Finished')
                console.log(doc);
                if (this.props != null) {
                    console.log("refreshing FireBasev2 from updating ISItem");
                    this.setState({ showEditModal: false })
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
            <div>
            <label>Title</label>
            <div className="input-group mb-3" >
                <input style={{ width: '200px' }} placeholder="Enter Title" value={this.state.itemToEdit.title} onChange={
                    (e) => { e.stopPropagation(); let temp = this.state.itemToEdit; temp.title = e.target.value; this.setState({ itemToEdit: temp }) }
                } />
            </div >

            <label>Photo URL</label>
            <div className="input-group mb-3" >
                <input style={{ width: '200px' }} placeholder="Enter Photo URL " value={this.state.itemToEdit.photo} onChange={
                    (e) => { e.stopPropagation(); let temp = this.state.itemToEdit; temp.photo = e.target.value; this.setState({ itemToEdit: temp }) }
                } />
            </div >

            <label>Available Start Time</label>
            <div className="input-group mb-3" >
                <input style={{ width: '200px' }} placeholder="HH:MM:SS (ex: 08:20:00) " value={this.state.itemToEdit.available_start_time} onChange={
                    (e) => { e.stopPropagation(); let temp = this.state.itemToEdit; temp.available_start_time = e.target.value; this.setState({ itemToEdit: temp }) }
                } />
            </div >

            <label>Available End Time</label>
            <div className="input-group mb-3" >
                <input style={{ width: '200px' }} placeholder="HH:MM:SS (ex: 16:20:00) " value={this.state.itemToEdit.available_end_time} onChange={
                    (e) => { e.stopPropagation(); let temp = this.state.itemToEdit; temp.available_end_time = e.target.value; this.setState({ itemToEdit: temp }) }
                } />
            </div >

            <label>Available to Caitlin?</label>
            <div className="input-group mb-3" >
                <input
                    name="Available"
                    type="checkbox"
                    checked={this.state.itemToEdit.is_available}
                    onChange={(e) => {
                        e.stopPropagation();
                        let temp = this.state.itemToEdit;
                        console.log(temp.is_available)
                        temp.is_available = !temp.is_available;
                        this.setState({ itemToEdit: temp })
                    }} />
            </div >

            {/* <label>Time?</label>
            <div className="input-group mb-3" >
                <input
                    name="Timed"
                    type="checkbox"
                    checked={this.state.itemToEdit.is_timed}
                    onChange={(e) => {
                        e.stopPropagation();
                        let temp = this.state.itemToEdit;
                        console.log(temp.is_timed)
                        temp.is_timed = !temp.is_timed;
                        this.setState({ itemToEdit: temp })
                    }} />
            </div >

            <label>Notify TA?</label>
            <div className="input-group mb-3" >
                <input
                    name="Timed"
                    type="checkbox"
                    checked={this.state.itemToEdit.notifies_ta}
                    onChange={(e) => {
                        e.stopPropagation();
                        let temp = this.state.itemToEdit;
                        console.log(temp.notifies_ta)
                        temp.notifies_ta = !temp.notifies_ta;
                        this.setState({ itemToEdit: temp })
                    }} />
            </div >

            <label>Remind User</label>
            <div className="input-group mb-3" >
                <input
                    name="Timed"
                    type="checkbox"
                    checked={this.state.itemToEdit.reminds_user}
                    onChange={(e) => {
                        e.stopPropagation();
                        let temp = this.state.itemToEdit;
                        console.log(temp.reminds_user)
                        temp.reminds_user = !temp.reminds_user;
                        this.setState({ itemToEdit: temp })
                    }} />
            </div > */}
            <Button variant="secondary" onClick={(e) => { e.stopPropagation(); this.setState({ showEditModal: false }) }}>Close</Button>
            <Button variant="info" onClick={(e) => { e.stopPropagation(); this.newInputSubmit() }}>Save changes</Button>
        </div>
        )
    }

    showIcon = () => {
        return (
            <div>
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

    render() {
        return (
            <div>
                {(this.state.showEditModal ? this.editISForm() : <div> </div>)}
             
             {  (this.state.showEditModal) ? <div> </div> : this.showIcon()}
            </div>
        )
    }
}
