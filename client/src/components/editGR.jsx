import React, { Component } from 'react'
import { faEdit, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Row, Col, Modal, InputGroup, FormControl } from 'react-bootstrap';
import DatePicker from "react-datepicker";

export default class editGR extends Component {

    constructor(props) {
        super(props)
        console.log('editAT constructor');
        console.log('Edit index ' + this.props.i)
        console.log(this.props.FBPath)
        console.log(this.props.ATArray)
        console.log(this.props.ATArray[this.props.i])

        this.state = {
            showEditModal: false,
            itemToEdit: this.props.ATArray[this.props.i]
        }
    }

    newInputSubmit = () => {
        console.log("submitting GR edited formed to firebase");
        let newArr = this.props.ATArray;
        newArr[this.props.i] = this.state.itemToEdit;
        
        if(!newArr[this.props.i]['datetime_completed']){
            newArr[this.props.i]['datetime_completed'] = '2020/02/03T08:32:42';
        }
        
        this.props.FBPath.update({ 'goals&routines': newArr }).then(
            (doc) => {
                console.log('updateEntireArray Finished')
                console.log(doc);
                this.setState({ showEditModal: false })
                if (this.props != null) {
                    console.log("refreshing FireBasev2 from updating GR ITEM ");
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
            <DatePicker class="form-control form-control-lg" type="text" style={{ width: '100%' }}
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
            <div style={{width: "290px", padding: "30px"}}>
                <label>Title</label>
                <div className="input-group mb-3" >
                    <input style={{ width: '200px' }} placeholder="Enter Title"  value={this.state.itemToEdit.title} onChange={
                        (e) => { e.preventDefault(); e.stopPropagation(); let temp = this.state.itemToEdit; temp.title = e.target.value; this.setState({ itemToEdit: temp }) }
                    }
                    
                    //TEMP FIX for SPACE BAR TRIGGERING KEY PRESS
                    onKeyDown={
                        (e) => {
                            if (e.keyCode == 32) {
                                 
                                let temp = this.state.itemToEdit; temp.title = e.target.value + " "; this.setState({ itemToEdit: temp })
                                e.preventDefault(); e.stopPropagation()
                            }
                        }}/>
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
                {/* <Row>
                    <FontAwesomeIcon
                    onMouseOver={event => { event.target.style.color = "#48D6D2"; }}
                    onMouseOut={event => { event.target.style.color = "#000000"; }}
                    style={{ color: "#00FF00" }}
                    onClick={(e) => { e.stopPropagation();  this.newInputSubmit(); }}
                    icon={faCheck} size="2x"
                />
                 <FontAwesomeIcon
                    onMouseOver={event => { event.target.style.color = "#48D6D2"; }}
                    onMouseOut={event => { event.target.style.color = "#000000"; }}
                    style={{ color: "#FF0000" }}
                    onClick={(e) => { e.stopPropagation(); this.setState({ showEditModal: false }) }}
                    icon={faTimes} size="2x"
                />
                    
                    </Row> */}

                <Button variant="secondary" onClick={(e) => { e.stopPropagation(); this.setState({ showEditModal: false }) }}>Close</Button>
                <Button variant="info" onClick={(e) => { e.stopPropagation(); this.newInputSubmit() }}>Save changes</Button>
            </div>
        )
    }


    showIcon = () => {
        return (
            <div style={{ marginLeft: "5px" }} >
                <FontAwesomeIcon
                    title="Edit Item"
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

            <div  onClick={(e) => { e.stopPropagation(); }}>
                {(this.state.showEditModal ? this.editGRForm() : <div> </div>)}
                {(this.state.showEditModal) ? <div> </div> : this.showIcon()}

            </div>
        )
    }
}
