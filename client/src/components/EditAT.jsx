import React, { Component } from 'react'
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  Button } from 'react-bootstrap';


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
        
        //Add the below attributes in case they don't already exists
        if(!newArr[this.props.i]['datetime_completed']){
            newArr[this.props.i]['datetime_completed'] = 'Sun, 23 Feb 2020 00:08:43 GMT';
        }
        if(!newArr[this.props.i]['audio']){
            newArr[this.props.i]['audio'] = '';
        }

        if(!newArr[this.props.i]['datetime_started']){
            newArr[this.props.i]['datetime_started'] = 'Sun, 23 Feb 2020 00:08:43 GMT';
        }

        this.props.FBPath.update({ 'actions&tasks': newArr }).then(
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
            <div style={{ margin: '0', width: "315px", padding:'20px'}}>
                  <label>Title</label>
                        <div className="input-group mb-3" >
                            <input style={{ width: '200px' }} placeholder="Enter Title" value={this.state.itemToEdit.title} onChange={
                                (e) => { e.stopPropagation(); let temp = this.state.itemToEdit; temp.title = e.target.value; this.setState({ itemToEdit: temp }) }
                            } 
                            
                            //TEMP FIX for SPACE BAR TRIGGERING KEY PRESS
                    onKeyDown={
                        (e) => {
                            if (e.keyCode == 32) {
                                 
                                let temp = this.state.itemToEdit; temp.title = e.target.value + " "; this.setState({ itemToEdit: temp })
                                e.preventDefault(); e.stopPropagation()
                            }
                        }}
                            />
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


                        <div className="input-group mb-3" >
                            <label class="form-check-label">Available to Caitlin?</label>
                            <input
                                style={{ marginTop: '5px', marginLeft: '5px' }}
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


                        <div className="input-group mb-3" >
                            <label class="form-check-label">Time?</label>

                            <input
                                style={{ marginTop: '5px', marginLeft: '5px' }}

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

                        <div className="input-group mb-3" >
                            <label class="form-check-label">Notify TA?</label>

                            <input
                                style={{ marginTop: '5px', marginLeft: '5px' }}

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

                        <div className="input-group mb-3" >
                            <label class="form-check-label">Remind User? </label>
                            <input
                                style={{ marginTop: '5px', marginLeft: '5px' }}
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
                        </div >

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
                    icon={faEdit} size="lg"
                />
                </div>
        )
    }

    render() {
        return (
            <div style={{ marginLeft: "5px" }} onClick={(e) => { e.stopPropagation();}}>
                {(this.state.showEditModal ? this.editISForm() : <div> </div>)}
                {  (this.state.showEditModal) ? <div> </div> : this.showIcon()}

            </div>
        )
    }
}
