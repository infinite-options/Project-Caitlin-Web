import React from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Modal, Dropdown, DropdownButton } from 'react-bootstrap';
import Firebasev2 from './Firebasev2.jsx';
import './App.css'
import moment from 'moment';
import TylersCalendarv1 from './TCal.jsx'
import DayRoutines from './DayRoutines.jsx'
import DayGoals from './DayGoals.jsx'
import DayEvents from './DayEvents.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default class MainPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { //Saved variables
      originalEvents: [], //holds the google events data in it's original JSON form
      showRoutineGoalModal: false,
      showGoalModal: false,
      showRoutineModal: false,
      dayEventSelected: false,  //use to show modal to create new event
      modelSelected: false, // use to display the routine/goals modal
      newEventID: '', //save the event ID for possible future use
      newEventName: '',
      newEventGuests: '',
      newEventLocation: '',
      newEventNotification: 30,
      newEventDescription: '',
      newEventStart: '', //this variable and any use of it in the code should be DELETED in future revisions
      newEventEnd: '',//this variable and any use of it in the code should be DELETED in future revisions
      newEventStart0: new Date(), //start and end for a event... it's currently set to today
      newEventEnd0: new Date(), //start and end for a event... it's currently set to today
      isEvent: false, // use to check whether we clicked on a event and populate extra buttons in event form
      //////////New additions for new calendar
      dateContext: moment(), //As we change from month to month, this variable will keep track of where we are
      todayDateObject: moment(), //Remember today's date to create the circular effect over todays day
      selectedDay: null, // Any use of this variable should be deleted in future revisions
      calendarView: "Month", // decides which type of calendar to display
    }
  }

  componentDidUpdate() {
  }

  componentDidMount() {
    this.getThisMonthEvents();
  }
  /*
  getThisMonthEvents:
  By passing in a empty interval, this method will get a response from the server with
  the current month's events
  */
  getThisMonthEvents = () => {
    axios.get('/getEventsByInterval', { //get normal google calendar data for possible future use
      params: {
      }
    })
      .then(response => {
        var events = response.data;
        this.setState({ originalEvents: events }, () => {
          console.log("New Events Arrived")
        })
      })
      .catch(error => {
        console.log('Error Occurred ' + error);
      }
      );
  }


  handleDayEventClick = (A) => {
    // console.log("this is from day view");
    var guestList = ''
    if (A.attendees) {
      guestList = A.attendees.reduce((guestList, nextGuest) => {
        return guestList + ' ' + nextGuest.email;
      }, '');
      console.log("Guest List:", A.attendees, guestList);
    }

    this.setState({
      newEventID: A.id,
      newEventStart: (A.start.dateTime) ? (new Date(A.start.dateTime)) : (new Date(A.start.date)).toISOString(),
      newEventEnd: (A.end.dateTime) ? (new Date(A.end.dateTime)) : (new Date(A.end.date)).toISOString(),
      newEventStart0: (A.start.dateTime) ? (new Date(A.start.dateTime)) : (new Date(A.start.date)),
      newEventEnd0: (A.end.dateTime) ? (new Date(A.end.dateTime)) : (new Date(A.end.date)),
      newEventName: A.summary,
      newEventGuests: guestList,
      newEventLocation: (A.location) ? A.location : '',
      newEventNotification: (A.reminders.overrides) ? (A.reminders.overrides[0].minutes) : '',
      newEventDescription: (A.description) ? A.description : '',
      dayEventSelected: true,
      isEvent: true,
    }, () => {
      console.log('callback from handEventClick')
    });
  }

  /*
  handleEventClick:
  when a event on the calendar is clicked, the function below
  will execute and save the clicked event varibles to this.state and
  passed that into the form where the user can edit that data
  */
  /*
    TODO: Set New Event Location, description, guests, ...
  */
  handleEventClick = (i) => { // bind with an arrow function
    let A = this.state.originalEvents[i];
    //Guest list erroneously includes owner's email as well
    var guestList = ''
    if (A.attendees) {
      guestList = A.attendees.reduce((guestList, nextGuest) => {
        return guestList + ' ' + nextGuest.email;
      }, '');
      console.log("Guest List:", A.attendees, guestList);
    }
    this.setState({
      newEventID: A.id,
      newEventStart: (A.start.dateTime) ? (new Date(A.start.dateTime)) : (new Date(A.start.date)).toISOString(),
      newEventEnd: (A.end.dateTime) ? (new Date(A.end.dateTime)) : (new Date(A.end.date)).toISOString(),
      newEventStart0: (A.start.dateTime) ? (new Date(A.start.dateTime)) : (new Date(A.start.date)),
      newEventEnd0: (A.end.dateTime) ? (new Date(A.end.dateTime)) : (new Date(A.end.date)),
      newEventName: A.summary,
      newEventGuests: guestList,
      newEventLocation: (A.location) ? A.location : '',
      newEventNotification: (A.reminders.overrides) ? (A.reminders.overrides[0].minutes) : '',
      newEventDescription: (A.description) ? A.description : '',
      dayEventSelected: true,
      isEvent: true,
    }, () => {
      console.log('callback from handEventClick')
    });
  }

  /*
  handleDateClick:
  This will trigger when a date is clicked, it will present
  the user with a new form to create a event
  */
  //TODO: Initialize Date, set other properties to empty
  handleDateClick = (arg) => { // bind with an arrow function
    var newStart = new Date(arg);
    newStart.setHours(0, 0, 0, 0);
    var newEnd = new Date(arg);
    newEnd.setHours(23, 59, 59, 59);
    this.setState({
      newEventID: '',
      newEventStart: newStart.toString(),
      newEventEnd: newEnd.toString(),
      newEventStart0: newStart,
      newEventEnd0: newEnd,
      newEventName: '',
      newEventGuests: '',
      newEventLocation: '',
      newEventNotification: 30,
      newEventDescription: '',
      dayEventSelected: true,
      isEvent: false
    });
  }

  /*
  *
handleSubmit:
submits the data to be passed up to be integrated into google calendar
*
*/

  handleSubmit = (event) => {
    if (this.state.start === '' || this.state.end === '') {
      console.log("invalid params")
      return;
    }
    event.preventDefault();
    var start = new Date(this.state.newEventStart).toISOString();
    var end = new Date(this.state.newEventEnd).toISOString();
    /**
     *
     * all variables within form need to be accessible up to this point
    */
    this.createEvent(this.state.newEventName, start, end);
  }

  updateEventClick = (event) => {
    event.preventDefault();
    let newStart = new Date(this.state.newEventStart).toISOString();
    let newEnd = new Date(this.state.newEventEnd).toISOString();
    if (this.state.newEventID === '') {
      return;
    }
    else {
      for (let i = 0; i < this.state.originalEvents.length; i++) {
        if (this.state.originalEvents[i].id === this.state.newEventID) {
          this.updateRequest(i, newStart, newEnd);
        }
      }
    }
  }

  /*
  updateRequest:
  updates the google calendar based  on
  */
  updateRequest = (index, newStart, newEnd) => {

    /**
     * TODO:
     * instead of individually passing original item, id
     * title, start and end,
     * pass in just extra as follows
     * let temp = this.state.originalEvents[index]
     * temp.start.dateTime = newStart
     * temp.end.dateTime = newEnd
     * and other parameters
     *
    */

    const guests = this.state.newEventGuests;
    var formattedEmail = null;
    const emailList = guests.match(/[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*(\.)?/g);
    if (emailList) {
      formattedEmail = emailList.map((guests) => {
        return {
          email: guests,
          responseStatus: 'needsAction',
        };
      });
    }

    var minutesNotification = 30;
    if (this.state.newEventNotification) {
      minutesNotification = this.state.newEventNotification;
    }

    let updatedEvent = this.state.originalEvents[index];
    updatedEvent.summary = this.state.newEventName;
    updatedEvent.attendees = formattedEmail;
    updatedEvent.location = this.state.newEventLocation;
    updatedEvent.description = this.state.newEventDescription;
    updatedEvent.start.dateTime = this.state.newEventStart0.toISOString();
    updatedEvent.end.dateTime = this.state.newEventEnd0.toISOString();
    updatedEvent.reminders = {
      overrides: [{
        method: 'popup',
        minutes: minutesNotification,
      }],
      'useDefault': false,
      'sequence': 0,
    }

    axios.post('/updateEvent', {
      extra: updatedEvent,
      ID: this.state.newEventID,
    })
      .then((response) => {
        //console.log('update return');
        //console.log(response);
        this.setState(
          {
            dayEventSelected: false,
            newEventName: '',
            newEventStart: '',
            newEventEnd: '',
            newEventStart0: new Date(),
            newEventEnd0: new Date()
          });
        this.updateEventsArray();
      })
      .catch(function (error) {
        // console.log(error);
      });
  }

  /*
  calls the backend API to delete a item with a particular eventID
  */

  deleteSubmit = () => {
    if (this.state.newEventID === '') {
      return;
    }
    axios.post('/deleteEvent', {
      ID: this.state.newEventID
    })
      .then((response) => {
        // console.log(response);
        this.setState({
          dayEventSelected: false,
          newEventStart: '',
          newEventEnd: ''
        });
        this.updateEventsArray();
      })
      .catch(function (error) {
        // console.log(error);
      });
  }

  /*
  createEvent:
  Basically creates a new event based on details given
  */
  createEvent = (newTitle, newStart, newEnd) => {
    /*
     * TODO: Replace formatting email with function
     */
    const guests = this.state.newEventGuests;
    /*
     * https://tools.ietf.org/html/rfc3696 for what is valid email addresses
     *
     * local-part@domain-part
     * local-part: alphanumeric, symbols ! # $ % & ' * + - / = ?  ^ _ ` . { | } ~ with restriction no two . in a row
     * localWord = [a-zA-Z!#$%&'*+\-/=?^_`{|}~]+
     * localPart = localWord (\.localWord)*
     * domain-part:
     * domains: alphanumeric, symbol - with restriction - not at beginning or end
     * dot separate domains, top level domain can have optional . at end
     * domain = [a-zA-Z0-9]([a-zA-Z0-9\-]*[a-zA-Z0-9])?
     * domainPart = domain(\.domain)*\.domain(\.)?
     * email: localPart@domainPart
     */
    //Note: This works, but does not email the guests that they are invited to the event
    var formattedEmail = null;
    const emailList = guests.match(/[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*(\.)?/g);
    if (emailList) {
      formattedEmail = emailList.map((guests) => {
        return {
          email: guests,
          responseStatus: 'needsAction',
        };
      });
    }

    var minutesNotification = 30;
    if (this.state.newEventNotification) {
      minutesNotification = this.state.newEventNotification;
    }
    var event = {
      'summary': this.state.newEventName,
      'location': this.state.newEventLocation,
      'description': this.state.newEventDescription,
      reminders: {
        useDefault: false,
        sequence: 0,
        overrides: [
          {
            method: 'popup',
            minutes: minutesNotification,
          }
        ]
      },
      'start': {
        'dateTime': this.state.newEventStart0.toISOString(),
      },
      'end': {
        'dateTime': this.state.newEventEnd0.toISOString(),
      },
      'attendees': formattedEmail,

    };

    // console.log("Create Event:", event);

    axios.post('/createNewEvent', {
      newEvent: event,
      reminderTime: minutesNotification,
      title: newTitle,
      start: this.state.newEventStart0.toISOString(),
      end: this.state.newEventEnd0.toISOString()
    })
      .then((response) => {
        // console.log(response);
        this.setState({
          dayEventSelected: false
        })
        this.updateEventsArray();
      })
      .catch(function (error) {
        // console.log(error);
      });
  }

  /*
  handleModalClicked:
  this will toggle show hide of the firebase modal currently
  */
  handleModalClicked = (arg) => { // bind with an arrow function
    this.setState({
      modelSelected: !this.state.modelSelected
    });
  }

  nextMonth = () => {
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).add(1, "month");
    this.setState({
      dateContext: dateContext,
      originalEvents: []
    }, this.updateEventsArray);
  }


  prevMonth = () => {
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).subtract(1, "month");
    this.setState({
      dateContext: dateContext,
      originalEvents: []
    }, this.updateEventsArray)
  }

  nextDay = () => {
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).add(1, "day");
    this.setState({
      dateContext: dateContext,
      originalEvents: []
    }, this.updateEventsArray);
  }


  prevDay = () => {
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).subtract(1, "day");
    this.setState({
      dateContext: dateContext,
      originalEvents: []
    }, this.updateEventsArray)
  }

  /*
  updateEventsArray:
  updates the array if the month view changes to a different month.
  */

  updateEventsArray = () => { //The month view has transferred to a different month
    let startObject = this.state.dateContext.clone()
    let endObject = this.state.dateContext.clone()
    let startDay = startObject.startOf('month')
    let endDay = endObject.endOf('month')
    let startDate = new Date(startDay.format("MM/DD/YYYY"))
    let endDate = new Date(endDay.format("MM/DD/YYYY"))
    startDate.setHours(0, 0, 0)
    endDate.setHours(23, 59, 59)
    // console.log("getting intervals")
    // console.log(startDate.toString(), endDate.toString())
    this.getEventsByInterval(startDate.toString(), endDate.toString());
  }

  render() {
    //The variable below will help decide whether to center the Calendar object or not
    var onlyCal = !this.state.showRoutineGoalModal && !this.state.showGoalModal && !this.state.showRoutineModal;
    return (
      //width and height is fixed now but should be by % percentage later on
      <div className="normalfancytext" style={{ marginLeft: '0px', height: "100%", width: '2000px' }}>
        <div style={{  margin: '0', padding: '0', width: '100%' }}>
          <div >
            {this.abstractedMainEventGRShowButtons()}
          </div>
        </div>
        <Container fluid style={{ marginTop: "15px", marginLeft: '0%' }}  >
          {/* Within this container essentially contains all the UI of the App */}
          <Row style={{ marginTop: "0" }}>
            {/* the modal for routine/goal is called Firebasev2 currently */}
            {/* {this.state.showRoutineGoalModal ? <Firebasev2 showRoutine = {this.state.showRoutineModal} showGoal= {this.state.showGoalModal} /> : <div></div>} */}
            <Firebasev2
              closeRoutineGoalModal={() => { this.setState({ showRoutineGoalModal: false }) }}
              showRoutineGoalModal={this.state.showRoutineGoalModal}
              closeGoal={() => { this.setState({ showGoalModal: false }) }}
              closeRoutine={() => { this.setState({ showRoutineModal: false }) }}
              showRoutine={this.state.showRoutineModal}
              showGoal={this.state.showGoalModal}
            />
            <Col sm="auto" md="auto" lg="auto" style={onlyCal ? { marginLeft: '20%' } : { marginLeft: '35px' }}  >
              {(this.state.calendarView === "Month")? this.calendarAbstracted():this.dayViewAbstracted()}
              <div style={{ marginTop: '50px', textAlign: 'center' }} className="fancytext">
                Dedicated to Caitlin Little
            </div>
            </Col>
            <Col style={{ marginLeft: '25px' }}>
              {this.state.dayEventSelected ? this.eventFormAbstracted() : <div> </div>}
            </Col>
          </Row>

        </Container>
      </div>
    )
  }

  dayViewAbstracted=()=>{
    return(
    <div style={{
      borderRadius: '20px',
      backgroundColor: 'white',
      width: '100%',
      marginLeft: '10px',
      padding: '20px',
      // border:"1px black solid",
      boxShadow: '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)'
    }}>
        <Container>
          <Row style={{ marginTop: '0px' }}>
            <Col >
              <div>
                <FontAwesomeIcon style={{ marginLeft: '50%' }} icon={faChevronLeft} size="2x" className="X"
                  onClick={(e) => { this.prevDay() }} />
              </div>
            </Col>
            <Col style={{ textAlign: 'center' }} className="bigfancytext">
              <p> {this.getDay()} {this.getMonth()} {this.getYear()} </p>
            </Col>
            <Col>
              <FontAwesomeIcon style={{ marginLeft: '50%' }} icon={faChevronRight} size="2x" className="X"
                onClick={(e) => { this.nextDay() }} />
            </Col>
          </Row>
        </Container>
      <Row>
        <DayEvents dateContext={this.state.dateContext}  eventClickDayView={this.handleDayEventClick} />
        <DayRoutines dayRoutineClick =  {this.toggleShowRoutine} />
        <DayGoals  dayGoalClick =  {this.toggleShowGoal}/>
      </Row>
    </div>)
  }



  toggleShowRoutine = () => {
    this.setState({
      showRoutineModal: !this.state.showRoutineModal,
      showGoalModal: false,
      showRoutineGoalModal: false
    })
  }

  toggleShowGoal = () => {
    this.setState({
      showGoalModal: !this.state.showGoalModal,
      showRoutineModal: false,
      showRoutineGoalModal: false
    })
  }

  showEventsFormbyCreateNewEventButton = () => {
    var newStart = new Date();
    newStart.setHours(0, 0, 0, 0);
    var newEnd = new Date();
    newEnd.setHours(23, 59, 59, 59);
    // console.log(newStart);
    // console.log(newEnd)
    this.setState({
      newEventID: '',
      newEventStart: newStart.toString(),
      newEventEnd: newEnd.toString(),
      newEventStart0: newStart,
      newEventEnd0: newEnd,
      newEventName: '',
      newEventGuests: '',
      newEventLocation: '',
      newEventDescription: '',
      dayEventSelected: true,
      isEvent: false,

      // dayEventSelected: !this.state.dayEventSelected deleted by tyler on 2/22/2020
    });
  }

  abstractedMainEventGRShowButtons = () => {
    return (<div style={{ marginLeft: '33%', width: '100%', fontSize: '20px' }}>

      <Button style={{ marginTop: '0', margin: "10px", marginBottom: '0' }} variant="outline-primary"
        onClick={() => {
          this.showEventsFormbyCreateNewEventButton()
        }}
      >New Event</Button>

      <Button style={{ marginTop: '0', margin: "10px", marginBottom: '0' }} variant="outline-primary"
        onClick={this.toggleShowRoutine}
      >Routines</Button>

      <Button style={{ marginTop: '0', margin: "10px", marginBottom: '0' }} variant="outline-primary"
        onClick={this.toggleShowGoal}> Goals </Button>


      <Button style={{ margin: "10px", marginBottom: '0' }} variant="outline-primary"
        onClick={() => {
          this.setState({
            showRoutineGoalModal: !this.state.showRoutineGoalModal,
            showGoalModal: false,
            showRoutineModal: false,
          })
        }}
      >Current Status</Button>


      <DropdownButton
      style={{ margin: '10px',   float: 'left' }}
      title={this.state.calendarView} >
        <Dropdown.Item onClick={() => {
          this.setState({
            calendarView: 'Month',
          })
        }}> Month </Dropdown.Item>
        <Dropdown.Item onClick={() => {
          this.setState({
            calendarView: 'Day',
          })
        }}> Day </Dropdown.Item>
      </DropdownButton>

    </div>)
  }

  calendarAbstracted = () => {
    return (
      <div style={{ borderRadius: '2%', backgroundColor: 'white', width: '1000px', marginLeft: '10px', padding: '45px', paddingBottom: "10px", boxShadow: '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)' }}>
        <div >
          <Row style={{ marginTop: '0px' }}>
            <Col >
              <div>
                <FontAwesomeIcon style={{ marginLeft: '50%' }} icon={faChevronLeft} size="2x" className="X"
                  onClick={(e) => { this.prevMonth() }} />
              </div>
            </Col>
            <Col style={{ textAlign: 'center' }} className="bigfancytext">
              <p>{this.getMonth()} {this.getYear()}</p>
            </Col>
            <Col>
              <FontAwesomeIcon style={{ marginLeft: '50%' }} icon={faChevronRight} size="2x" className="X"
                onClick={(e) => { this.nextMonth() }} />
            </Col>
          </Row>
        </div>
        <TylersCalendarv1 eventClick={this.handleEventClick} handleDateClick={this.handleDateClick} originalEvents={this.state.originalEvents} dateObject={this.state.todayDateObject} today={this.state.today} dateContext={this.state.dateContext} selectedDay={this.state.selectedDay} />
      </div>
    )
  }



  /**
   * This is where the event form is made
   *
  */
  eventFormAbstracted = () => {
    return (
      <Modal.Dialog style={{ borderRadius: "15px", boxShadow: '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)', marginLeft: '0', width: '350px', marginTop: "0" }}>
        <Modal.Header closeButton onClick={() => { this.setState({ dayEventSelected: false }) }} >
          <Modal.Title><h5 className="normalfancytext">Event Form</h5> </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.eventFormInputArea()}
        </Modal.Body>
        <Modal.Footer>
          <Row>
            <Col style={this.state.isEvent ? { display: 'none' } : {}} >
              <Button onClick={this.handleSubmit} variant="info" type="submit"> Submit </Button>
            </Col>
            <Col style={this.state.isEvent ? { marginTop: '0px' } : { display: 'none' }}>
              <Button onClick={this.updateEventClick} className="btn btn-info">
                Update
                </Button>
            </Col>
            <Col>
              <Button variant="secondary" onClick={this.hideEventForm}>Cancel</Button>
            </Col>
            <Col>
              <Button style={this.state.isEvent ? {} : { display: 'none' }} variant="danger" onClick={this.deleteSubmit} > Delete</Button>
            </Col>

          </Row>
        </Modal.Footer>
      </Modal.Dialog>
    )
  }

  eventFormInputArea = () => {
    return (
      <Form  >
        <Row>
          <Col>
            <div style={{ width: '300px' }}>
              <Form.Group >
                <Form.Label>Event Name</Form.Label>
                <Form.Control value={this.state.newEventName} onChange={this.handleNameChange}
                  type="text" placeholder="Title" />
              </Form.Group>
              <Form.Group value={this.state.newEventStart} controlId="Y" >
                <Form.Label>Start Time</Form.Label> <br />
                {/* <Form.Control value={this.state.newEventStart} onChange={this.handleDateStartchange}
              type="text" placeholder="Start Time" /> */}
                {this.startTimePicker()}
              </Form.Group>
              <Form.Group value={this.state.newEventEnd} controlId="X" >
                <Form.Label>End Time</Form.Label><br />
                {/* <Form.Control value={this.state.newEventEnd} onChange={this.handleDateEndchange}
              type="text" placeholder="End Time" /> */}
                {this.endTimePicker()}
              </Form.Group>
              <Form.Group value={"Extra Slot"} >
                <Form.Label>Guests</Form.Label>
                <Form.Control value={this.state.newEventGuests} onChange={this.handleGuestChange}
                  type="email" placeholder="example@gmail.com" />
              </Form.Group>
              <Form.Group controlId="Location">
                <Form.Label>Location:</Form.Label>
                <Form.Control value={this.state.newEventLocation} onChange={this.handleLocationChange}
                  type="text" placeholder="Location" />
              </Form.Group>
              <Form.Group controlId="Notification">
                <Form.Label>Notification:</Form.Label>
                <Row>
                  <Col> <Form.Control value={this.state.newEventNotification} onChange={this.handleNotificationChange}
                    type="number" placeholder="30" /> </Col>
                  <Col> <Form.Text> Minutes </Form.Text> </Col>
                </Row>
              </Form.Group>
              <Form.Group controlId="Description">
                <Form.Label>Description:</Form.Label>
                <Form.Control as="textarea" rows="3" value={this.state.newEventDescription} onChange={this.handleDescriptionChange}
                  type="text" placeholder="Description" />
              </Form.Group>
            </div>
          </Col>
        </Row>
      </Form>
    )
  }

  startTimePicker = () => {
    // const [startDate, setStartDate] = useState(new Date());
    return (
      <DatePicker class="form-control form-control-lg" type="text"
        selected={this.state.newEventStart0}
        onChange={(date) => {
          this.setState({
            newEventStart0: date
          }, () => { console.log(this.state.newEventStart0) })

        }}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        timeCaption="time"
        dateFormat="MMMM d, yyyy h:mm aa"
      />
    );
  };


  endTimePicker = () => {
    // const [startDate, setStartDate] = useState(new Date());
    return (
      <DatePicker class="form-control form-control-lg" type="text" style={{ width: '100%' }}
        selected={this.state.newEventEnd0}
        onChange={(date) => {
          this.setState({
            newEventEnd0: date
          }, () => { console.log(this.state.newEventEnd0) })

        }}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        timeCaption="time"
        dateFormat="MMMM d, yyyy h:mm aa"
      />
    );
  };
  /*
  getYear:
  returns the year based on year format
  */
  getYear = () => {
    return this.state.dateContext.format("Y");
  }

  /*
  getMonth:
  returns the month based on the month of the dateContext
  in english word form
  */
  getMonth = () => {
    return this.state.dateContext.format("MMMM");
  }

  getDay = () => {
    return this.state.dateContext.format("D");
  }

  /*
  hideEventForm:
  Hides the create/edit events form when a date or event is clicked
  */
  hideEventForm = (e) => {
    this.setState({
      dayEventSelected: false
    });
  }

  /*
All functions below will change a variables
when there is a change in the event form
*/

  handleNameChange = (event) => {
    this.setState({ newEventName: event.target.value });
  }

  handleDateStartchange = (event) => {
    this.setState({ newEventStart: event.target.value });
  }

  handleDateEndchange = (event) => {
    this.setState({ newEventEnd: event.target.value });
  }

  handleGuestChange = (event) => {
    this.setState({ newEventGuests: event.target.value });
  }

  handleLocationChange = (event) => {
    this.setState({ newEventLocation: event.target.value });
  }

  handleNotificationChange = (event) => {
    this.setState({ newEventNotification: event.target.value });
  }

  handleDescriptionChange = (event) => {
    this.setState({ newEventDescription: event.target.value });
  }

  /*
  *
  getEvents:
  this essentially gets the events data from google calendar and puts it
  into the proper state variables. Currently the parsed data for full calendar
  is used but the unfiltered data from google calendar API is not used but
  in case we do need it, it's saved in this.state.originalEvents
  *
  *
  */
  getEventsByInterval = (start0, end0) => {
    axios.get('/getEventsByInterval', { //get normal google calendar data for possible future use
      params: {
        start: start0,
        end: end0
      }
    })
      .then(response => {
        //console.log('normal gCal data');
        //console.log(response);
        var events = response.data;
        this.setState({
          newEventID: '',
          newEventName: '',
          newEventStart: '',
          newEventEnd: '',
          originalEvents: events
        }, () => {
          console.log("New Events Arrived")

          // console.log(events.data);
          // this.createOrganizeData(start0, end0);
          //Call function to prep data for Monthly View
        })
      })
      .catch(error => {
        console.log('Error Occurred ' + error);
      }
      );
  }

}
