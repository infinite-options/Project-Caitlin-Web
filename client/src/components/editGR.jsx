import React, { Component } from 'react'
import { faEdit} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button} from 'react-bootstrap';
import DatePicker from "react-datepicker";
import ShowNotifications from "./ShowNotifications";
import ShowATList from "./ShowNotifications.jsx";
import {
    Form,
    Row,
    Col
  } from "react-bootstrap";

export default class editGR extends Component {
<<<<<<< Updated upstream
=======
  constructor(props) {
    super(props);
    this.state = {
      showEditModal: false,
      itemToEdit: this.props.ATArray[this.props.i],
      showRepeatModal: false,
      repeatOption: false,
      repeatOptionDropDown: "Does not repeat",
      repeatDropDown: "DAY",
      repeatDropDown_temp: "DAY",
      repeatMonthlyDropDown: "Monthly on day 13",
      repeatInputValue: "1",
      repeatInputValue_temp: "1",
      repeatOccurrence: "1",
      repeatOccurrence_temp: "1",
      repeatRadio: "Never",
      repeatRadio_temp: "Never",
      repeatEndDate: "",
      repeatEndDate_temp: "",
      byDay: {
        0: "",
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: "",
      },
      byDay_temp: {
        0: "",
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: "",
      },
      repeatSummary: "",
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log("this is the previous ATarry",prevProps.ATArray );
    // console.log("this is the ATarry",this.props.ATArray );
    if(prevProps.ATArray !== this.props.ATArray){
      // console.log("going in here so musttttttttttttttttttttttttttttt update");
      this.setState({itemToEdit: this.props.ATArray[this.props.i]})
      // this.forceUpdate();
    }   
  }

  newInputSubmit = () => {
    // console.log("submitting GR edited formed to firebase");
    let newArr = this.props.ATArray;
<<<<<<< Updated upstream
    
=======

>>>>>>> Stashed changes
    if (this.state.itemToEdit.photo === "") {
      if (this.props.isRoutine) {
        this.state.itemToEdit.photo =
          "https://firebasestorage.googleapis.com/v0/b/project-caitlin-c71a9.appspot.com/o/DefaultIcons%2Froutine2.svg?alt=media&token=ad257320-33ea-4d31-94b6-09653cb036e6";
      } else {
        this.state.itemToEdit.photo =
          "https://firebasestorage.googleapis.com/v0/b/project-caitlin-c71a9.appspot.com/o/DefaultIcons%2Fgoal.svg?alt=media&token=6c524155-112e-4d5f-973e-dcab66f22af2";
      }
    }
<<<<<<< Updated upstream
    
=======

>>>>>>> Stashed changes
    newArr[this.props.i] = this.state.itemToEdit;

    //Add the below attributes in case they don't already exists

    if (!newArr[this.props.i]["audio"]) {
      newArr[this.props.i]["audio"] = "";
    }
    if (!newArr[this.props.i]["datetime_completed"]) {
      newArr[this.props.i]["datetime_completed"] =
        "Sun, 23 Feb 2020 00:08:43 GMT";
    }

    if (!newArr[this.props.i]["datetime_started"]) {
      newArr[this.props.i]["datetime_started"] =
        "Sun, 23 Feb 2020 00:08:43 GMT";
    }
>>>>>>> Stashed changes

    constructor(props) {
        super(props)
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
            />
        );
    }

    convertTimeToHRMMSS =  (e) => {
        
        // console.log(e.target.value);
        let num = e.target.value;
        let hours = num/60;
        let rhours = Math.floor(hours);
        let minutes = (hours - rhours)* 60;
        let rminutes = Math.round(minutes);
        if (rhours.toString().length == 1) {
            rhours = "0" + rhours;
        }
        if (rminutes.toString().length == 1) {
            rminutes = "0" + rminutes;
        }
        // console.log(rhours+":" + rminutes +":" + "00");
        return rhours+":" + rminutes +":" + "00";
    }

    convertToMinutes = () => {
        let myStr = this.state.itemToEdit.expected_completion_time.split(':');
        let hours = myStr[0];
        let hrToMin = hours* 60;
        let minutes = (myStr[1] * 1 )+ hrToMin;
        let seconds = myStr[2];
        
        // console.log("hours: " +hours + "minutes: " + minutes + "seconds: " + seconds);
        return minutes;
    }

    handleNotificationChange = (temp) => {
        // console.log(temp);
        this.setState({ itemToEdit: temp });
    }

    editGRForm = () => {
        return (  
              // <div style={{ border: "2px", margin: '0', width: "315px", padding: '20px' }}>
            <Row style={{marginLeft:this.props.marginLeftV, border: "2px", padding: '20px', marginTop:"10px" }}>
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
                            value = {this.convertToMinutes()}
                            // value = {this.state.itemToEdit.expected_completion_time}
                            style = {{ marginTop:".25rem", paddingRight:"0px"}}
                            onChange={
                                // (e) => {e.stopPropagation(); this.convertTimeToHRMMSS(e)}
                                 (e) => { e.stopPropagation(); let temp = this.state.itemToEdit; temp.expected_completion_time = this.convertTimeToHRMMSS(e); this.setState({ itemToEdit: temp }) }
                            }
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
                            temp.is_available = !temp.is_available;
                            this.setState({ itemToEdit: temp })
                        }} />
                </div >
                    
                {this.state.itemToEdit.is_available && 
                    <ShowNotifications 
                        itemToEditPassedIn = {this.state.itemToEdit}
                        notificationChange = {this.handleNotificationChange}
                />} 
                    

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
