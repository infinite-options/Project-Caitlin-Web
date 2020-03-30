import React, { Component } from 'react'
import { faEdit} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button} from 'react-bootstrap';
import DatePicker from "react-datepicker";
import ShowNotifications from "./ShowNotifications";
import {
    Form,
    Row,
    Col
  } from "react-bootstrap";

export default class editGR extends Component {

    constructor(props) {
        super(props)
        // console.log('editAT constructor');
        // console.log('Edit index ' + this.props.i)
        // console.log(this.props.FBPath)
        // console.log(this.props.ATArray)
        // console.log(this.props.ATArray[this.props.i])

        this.state = {
            showEditModal: false,
            itemToEdit: this.props.ATArray[this.props.i]
        }
    }

    newInputSubmit = () => {
        // console.log("submitting GR edited formed to firebase");
        let newArr = this.props.ATArray;

        newArr[this.props.i] = this.state.itemToEdit;

        //Add the below attributes in case they don't already exists

        if (!newArr[this.props.i]['audio']) {
            newArr[this.props.i]['audio'] = '';
        }
        if (!newArr[this.props.i]['datetime_completed']) {
            newArr[this.props.i]['datetime_completed'] = 'Sun, 23 Feb 2020 00:08:43 GMT';
        }

        if (!newArr[this.props.i]['datetime_started']) {
            newArr[this.props.i]['datetime_started'] = 'Sun, 23 Feb 2020 00:08:43 GMT';
        }

        this.props.FBPath.update({ 'goals&routines': newArr }).then(
            (doc) => {
                // console.log('updateEntireArray Finished')
                // console.log(doc);
                this.setState({ showEditModal: false })
                if (this.props != null) {
                    // console.log("refreshing FireBasev2 from updating GR ITEM ");
                    this.props.refresh(newArr);
                }
                else {
                    console.log("update failure");
                }
            }
        )
    }


    //For possible future use because we currently just typing out the time.
    startTimePicker = () => {
        // const [startDate, setStartDate] = useState(new Date());
        return (
            <DatePicker className="form-control form-control-lg" type="text" style={{ width: '100%' }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                selected={(this.state.itemToEdit.available_start_time) ? this.state.itemToEdit.available_start_time : new Date()}
                onChange={(date) => {
                    let temp = this.state.itemToEdit;
                    temp.available_start_time = date;
                    this.setState({
                        itemToEdit: temp
                    })

                }}
            // showTimeSelect
            // timeFormat="HH:mm"
            // timeIntervals={15}
            // timeCaption="time"
            // dateFormat="MMMM d, yyyy h:mm aa"
            />
        );
    }


    editGRForm = () => {
        return (
            
            // <div style={{ border: "2px", margin: '0', width: "315px", padding: '20px' }}>
            <Row style={{marginLeft:"-170px", border: "2px", padding: '20px', marginTop:"10px" }}>
                <label >Title</label>
                 <div className="input-group mb-3" >
                    <input style={{ width: '200px' }} placeholder="Enter Title" value={this.state.itemToEdit.title} onChange={
                        (e) => { e.preventDefault(); e.stopPropagation(); let temp = this.state.itemToEdit; temp.title = e.target.value; this.setState({ itemToEdit: temp }) }
                    }

                        //TEMP FIX for SPACE BAR TRIGGERING KEY PRESS
                        onKeyDown={
                            (e) => {
                                if (e.keyCode === 32) {

                                    let temp = this.state.itemToEdit; temp.title = e.target.value + " "; this.setState({ itemToEdit: temp })
                                    e.preventDefault(); e.stopPropagation()
                                }
                            }} />
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

                <label>This Takes Me</label>
                <Row>
                    <Col  style = {{paddingRight: "0px" }}>  
                        <Form.Control
                            // value={this.state.newEventNotification}
                            // onChange={this.handleNotificationChange}
                            type="number"
                            placeholder="30"
                            style = {{ marginTop:".25rem", paddingRight:"0px"}}
                        />
                    </Col>
                    <Col xs={8} style = {{paddingLeft:"0px"}} >
                        <p style = {{marginLeft:"10px", marginTop:"5px"}}>minutes</p>
                    </Col>
                </Row>

                <div className="input-group mb-3"style ={{marginTop:"10px"}} >
                    <label className="form-check-label">Time?</label>

                    <input
                        style={{ marginTop: '5px', marginLeft: '5px' }}

                        name="Timed"
                        type="checkbox"
                        checked={this.state.itemToEdit.is_timed}
                        onChange={(e) => {
                            e.stopPropagation();
                            let temp = this.state.itemToEdit;
                            // console.log(temp.is_timed)
                            temp.is_timed = !temp.is_timed;
                            this.setState({ itemToEdit: temp })
                        }} />
                </div >

                <div className="input-group mb-3" style ={{marginTop:"10px"}}>
                    <label className="form-check-label">Available to Caitlin?</label>
                    <input
                        style={{ marginTop: '5px', marginLeft: '5px' }}
                        name="Available"
                        type="checkbox"
                        checked={this.state.itemToEdit.is_available}
                        onChange={(e) => {
                            e.stopPropagation();
                            let temp = this.state.itemToEdit;
                            // console.log(temp.is_available)
                            temp.is_available = !temp.is_available;
                            this.setState({ itemToEdit: temp })
                        }} />
                </div >
                    
                {this.state.itemToEdit.is_available && <ShowNotifications/>} 
                    

                <Button variant="secondary" onClick={(e) => { e.stopPropagation(); this.setState({ showEditModal: false }) }}>Close</Button>
                <Button variant="info" onClick={(e) => { e.stopPropagation(); this.newInputSubmit() }}>Save changes</Button>
            </Row>
        )
    }


    showIcon = () => {
        return (
            <div style={{ marginLeft: "5px" }} >
                <FontAwesomeIcon

                    title="Edit Item"
                    onMouseOver={event => { event.target.style.color = "#48D6D2"; }}
                    onMouseOut={event => { event.target.style.color = "#000000"; }}
                    style={{ color: "#000000"}}
                    onClick={(e) => { e.stopPropagation(); this.setState({ showEditModal: true }) }}
                    icon={faEdit} size="lg"
                />
            </div>
        )
    }
   

    

    render() {
        return (

            <div onClick={(e) => { e.stopPropagation(); }}>
                {(this.state.showEditModal) ? <div></div> : this.showIcon()} 
                 {(this.state.showEditModal ? this.editGRForm() : <div> </div>)}
  

            </div>
        )
    }
}
