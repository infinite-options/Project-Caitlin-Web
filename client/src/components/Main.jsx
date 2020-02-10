import React from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import './calendar.css';
import Firebasev2 from './Firebasev2.jsx';
import './App.css'
import moment from 'moment';
import TylersCalendarv1 from './TCal.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class MainPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { //Saved variables
      originalEvents: [],
      showRoutineGoalModal: false,
      showGoalModal: false,
      showRoutineModal: false,
      dayEventSelected: false,  //use to show modal to create new event
      modelSelected: false, // use to display the routine/goals modal
      newEventID: '',
      newEventName: '',
      newEventStart: '',
      newEventStart0: new Date(),
      newEventEnd0: new Date(),
      newEventEnd: '',
      isEvent: false, // use to check whether we clicked on a event and populate extra buttons in event form
      masterdateFB: null,
      //////////New additions for new calendar
      dateContext: moment(),
      todayDateObject: moment(),
      selectedDay: null,
      // organizedData: null

    }
  }

  componentDidUpdate() {
    console.log("Main.js && componentDidUpdate()");

  }

  componentDidMount() {
    this.getThisMonthEvents();
  }
  /*
  getThisMonthEvents:
  */
  getThisMonthEvents = () => {
    // var x = new Date().getFullYear();
    // var y = x - 20;
    // var z = x + 20
    axios.get('/getEventsByInterval', { //get normal google calendar data for possible future use
      params: {
      }
    })
      .then(response => {
        console.log('normal gCal data')
        console.log(response);
        var events = response.data;
        this.setState({ originalEvents: events }, () => {
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




  /*
  handleEventClick:
  when a event on the calendar is clicked, the function below
  will execute and save the clicked event to this.state and passed
  that into the form where the user can edit that data
  */
  handleEventClick = (i) => { // bind with an arrow function
    console.log('Inside handleEventClick')
    console.log(i)
    console.log('Inside handleEventClick2')
    console.log(this.state.originalEvents[i]);
    let A = this.state.originalEvents[i];
    console.log('setting new Data: ');
    console.log(A);
    this.setState({
      newEventID: A.id,
      newEventStart: (A.start.dateTime) ? (new Date(A.start.dateTime)) : (new Date(A.start.date)).toISOString(),
      newEventEnd: (A.end.dateTime) ? (new Date(A.end.dateTime)) : (new Date(A.end.date)).toISOString(),
      newEventStart0: (A.start.dateTime) ? (new Date(A.start.dateTime)) : (new Date(A.start.date)),
      newEventEnd0: (A.end.dateTime) ? (new Date(A.end.dateTime)) : (new Date(A.end.date)),
      newEventName: A.summary,
      dayEventSelected: true,
      isEvent: true
    }, () => {
      console.log('callback from handEventClick')
    });
  }

  /*
  handleDateClick:
  This will trigger when a date is clicked, it will present
  the user with a new form to create a event
  */
  handleDateClick = (arg) => { // bind with an arrow function
    console.log('Inside Main, HandleDateClick')
    console.log(arg);
    var newStart = new Date(arg);
    newStart.setHours(0, 0, 0, 0);
    var newEnd = new Date(arg);
    newEnd.setHours(23, 59, 59, 59);
    console.log(newStart);
    console.log(newEnd)
    this.setState({
      newEventID: '',
      newEventStart: newStart.toString(),
      newEventEnd: newEnd.toString(),
      newEventStart0: newStart,
      newEventEnd0: newEnd,
      newEventName: 'New Event Title',
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
    console.log("submit clicked with ", start, end);
    this.createEvent(this.state.newEventName, start, end);
  }

  updateEventClick = (event) => {
    console.log(event)
    event.preventDefault();
    let newStart = new Date(this.state.newEventStart).toISOString();
    let newEnd = new Date(this.state.newEventEnd).toISOString();
    if (this.state.newEventID === '') {
      return;
    }
    else {
      for (let i = 0; i < this.state.originalEvents.length; i++) {
        if (this.state.originalEvents[i].id === this.state.newEventID) {
          console.log(this.state.originalEvents[i]);
          console.log(newStart);
          console.log(newEnd);
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

    axios.post('/updateEvent', {
      extra: this.state.originalEvents[index],
      ID: this.state.newEventID,
      title: this.state.newEventName,
      start: this.state.newEventStart0.toISOString(),
      end: this.state.newEventEnd0.toISOString()
    })
      .then((response) => {
        console.log('update return');
        console.log(response);
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
        console.log(error);
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
        console.log(response);
        this.setState({
          dayEventSelected: false,
          newEventStart: '',
          newEventEnd: ''
        });
        this.updateEventsArray();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  /*
  createEvent:
  Basically creates a new event based on details given
  */
  createEvent = (newTitle, newStart, newEnd) => {

    /**
     * TODO: add in the other attributes 
     * here and pass it in as 1 single object
     *   
     * 
     var event = {
    'summary': newTitle
    'location': newLocation,
    'description': newDescription,
    'start': {
      'dateTime': newStart,
      'timeZone': 'America/Los_Angeles',
    },
    'end': {
      'dateTime': newEnd,
      'timeZone': 'America/Los_Angeles',
    }
  };
    */


    axios.post('/createNewEvent', {
      title: newTitle,
      start: this.state.newEventStart0.toISOString(),
      end: this.state.newEventEnd0.toISOString()
    })
      .then((response) => {
        console.log(response);
        this.setState({
          dayEventSelected: false
        })
        this.updateEventsArray();
      })
      .catch(function (error) {
        console.log(error);
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

  /*
  updateEventsArray:
  updates the array if the month view changes to a different month.
  */
  updateEventsArray = () => { //The month view has transferred to a different month
    let startObject = this.state.dateContext.clone()
    let endObject = this.state.dateContext.clone()
    let k = startObject.startOf('month')
    let kk = endObject.endOf('month')
    let startDate = new Date(k.format("MM/DD/YYYY"))
    let endDate = new Date(kk.format("MM/DD/YYYY"))
    startDate.setHours(0, 0, 0)
    endDate.setHours(23, 59, 59)
    console.log("getting intervals")
    console.log(startDate.toString(), endDate.toString())
    this.getEventsByInterval(startDate.toString(), endDate.toString());
  }

  render() {
    console.log("Main Render")

    //The variable below will help decide whether to center the Calendar object or not
    var onlyCal = !this.state.showRoutineGoalModal && !this.state.showGoalModal && !this.state.showRoutineModal &&
      !this.state.dayEventSelected;
    return (
      //width and height is fixed now but should be by % percentage later on 
      <div style={{ marginLeft: '0px', marginTop: '5px', height: "2000px", width: '2000px' }}>
        <Container fluid style={{ marginLeft: '0%' }}  >
          {/* Within this container essentially contains all the UI of the App */}
          {this.abstractedMainEventGRShowButtons()}

          <hr style={{ backgroundColor: 'white', marginLeft: "0" }} className="brace" />

          <Row>

            {/* the modal for routine/goal is called Firebasev2 currently */}
            {/* {this.state.showRoutineGoalModal ? <Firebasev2 showRoutine = {this.state.showRoutineModal} showGoal= {this.state.showGoalModal} /> : <div></div>} */}

            <Firebasev2
              closeRoutineGoalModal={() => { this.setState({ showRoutineGoalModal: false }) }}
              showRoutineGoalModal={this.state.showRoutineGoalModal}
              closeGoal={() => { this.setState({ showGoalModal: false }) }}
              closeRoutine={() => { this.setState({ showRoutineModal: false }) }}
              showRoutine={this.state.showRoutineModal}
              showGoal={this.state.showGoalModal} />
            <Col sm="auto" md="auto" lg="auto" style={onlyCal ? { marginLeft: '20%' } : { marginLeft: '25px' }}  >
              {this.calendarAbstracted()}
              {/* <Row>
                {this.eventFormAbstractedHorizontalVersion()}
              </Row> */}
            </Col>
            <Col stlye={{ marginLeft: '0' }}>
              {this.eventFormAbstracted()}
            </Col>
          </Row>
          <Row style={{ marginTop: '50px', textAlign: 'center' }} className="fancytext">
            <Col>
              Dedicated to Caitlin Little
            </Col>
          </Row>
        </Container>
      </div>
    )
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

  abstractedMainEventGRShowButtons = () => {
    return (<div>

      <Button style={{ margin: "10px", marginBottom: '0' }} variant="outline-primary"
        onClick={() => { this.setState({ dayEventSelected: !this.state.dayEventSelected }) }}
      >Create New Event</Button>

      <Button style={{ margin: "10px", marginBottom: '0' }} variant="outline-primary"
        onClick={this.toggleShowRoutine}
      >Routines</Button>

      <Button style={{ margin: "10px", marginBottom: '0' }} variant="outline-primary"
        onClick={this.toggleShowGoal}
      >Goals</Button>

      <Button style={{ margin: "10px", marginBottom: '0' }} variant="outline-primary"
        onClick={() => {
          this.setState({
            showRoutineGoalModal: !this.state.showRoutineGoalModal,
            showGoalModal: false,
            showRoutine: false
          })
        }}
      >Goals and Routines</Button>

    </div>)
  }

  calendarAbstracted = () => {
    return (
      <div style={{ borderRadius: '2%', backgroundColor: 'white', width: '1000px', marginLeft: '0px', padding: '45px', boxShadow: '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)' }}>
        <div >
          <Row style={{ marginTop: '0px' }}>
            <Col >
              <div>
                <FontAwesomeIcon style={{ marginLeft: '2.5%' }} icon={faChevronLeft} size="2x" className="X"
                  onClick={(e) => { this.prevMonth() }} />
              </div>
            </Col>
            <Col style={{ textAlign: 'center' }} className="bigfancytext">
              <p>{this.getMonth()} {this.getYear()}</p>
            </Col>
            <Col>
              <FontAwesomeIcon style={{ marginLeft: '90%' }} icon={faChevronRight} size="2x" className="X"
                onClick={(e) => { this.nextMonth() }} />
            </Col>
          </Row>
        </div>
        <TylersCalendarv1 eventClick={this.handleEventClick} handleDateClick={this.handleDateClick} originalEvents={this.state.originalEvents} dateObject={this.state.todayDateObject} today={this.state.today} dateContext={this.state.dateContext} selectedDay={this.state.selectedDay} />
      </div>
    )
  }

  eventFormAbstractedHorizontalVersion = () => {
    return (
      // style={{ marginLeft: '0', width: '1200px', height: '550px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}

      <Row style={this.state.dayEventSelected ? {
        fontSize: "small", marginTop: '15px',
        marginLeft: '15px', width: '1300px', height: '550px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
      } : { display: 'none' }}>
        <Col >
          <div style={{ marginTop: '50px' }}>
            <h3 style={{ textAlign: 'center' }} >Event Information</h3>
            {/* <p>ID: {this.state.newEventID}</p> */}
            {/* <Container> */}
            <Form onSubmit={this.handleSubmit} style={{ marginLeft: '15%', width: '850px', }} >
              <Row>
                <Col>
                  <div style={{ width: '300px' }}>

                    <Form.Group >
                      <Form.Label>Event Name</Form.Label>
                      <Form.Control value={this.state.newEventName} onChange={this.handleNameChange}
                        type="text" placeholder="Title" />
                    </Form.Group>

                    <Form.Group value={this.state.newEventStart} controlId="Y" >
                      <Form.Label>Start Time</Form.Label>
                      <Form.Control value={this.state.newEventStart} onChange={this.handleDateStartchange}
                        type="text" placeholder="Start Time" />

                    </Form.Group>
                    {this.startTimePicker()}
                    <Form.Group value={this.state.newEventEnd} controlId="X" >
                      <Form.Label>End Time</Form.Label>
                      <Form.Control value={this.state.newEventEnd} onChange={this.handleDateEndchange}
                        type="text" placeholder="End Time" />

                    </Form.Group>
                    {this.startTimePicker()}
                  </div>
                </Col>
                <Col>
                  <div style={{ width: '300px' }}>
                    <Form.Group value={"Guest"} >
                      <Form.Label>More Data</Form.Label>
                      <Form.Control value={"Invite Guests"}
                        type="text" placeholder="End" />
                    </Form.Group>
                    <Form.Group controlId="Location" onChange={this.handleDateEndchange}>
                      <Form.Label>Location:</Form.Label>
                      <Form.Control value={"Location"}
                        type="text" placeholder="Location" />
                    </Form.Group>
                    <Form.Group controlId="Description" onChange={this.handleDateEndchange}>
                      <Form.Label>Description:</Form.Label>
                      <Form.Control as="textarea" rows="3" value={"Description"}
                        type="text" placeholder="Description" />
                    </Form.Group>
                  </div>
                </Col>
              </Row>
              <Row>
                <Row>
                  <Col style={this.state.isEvent ? { display: 'none' } : {}} >
                    <Button variant="info" type="submit"> Submit </Button>
                  </Col>
                  <Col style={this.state.isEvent ? { marginTop: '0px' } : { display: 'none' }}>
                    <Button onClick={this.updateEventClick} className="btn btn-info">
                      Update
                    </Button>
                  </Col>
                  <Col>
                    <Button variant="secondary" onClick={this.hideEventForm}>Cancel</Button>
                  </Col>
                </Row>
                <Row style={{ marginLeft: '10px' }} >
                  <Col>
                    <Button style={this.state.isEvent ? {} : { display: 'none' }} variant="danger" onClick={this.deleteSubmit} > Delete</Button>
                  </Col>
                  <Col>
                    <Button style={this.state.isEvent ? {} : { display: 'none' }} onClick={this.handleModalClicked} className="btn btn-info">
                      Modal
                    </Button>
                  </Col>
                </Row>
              </Row>
            </Form>
            {/* </Container> */}
          </div>
        </Col>
      </Row>

    )
  }

  eventFormAbstracted = () => {
    return (
      <Col > {/* start of new Event Form */}
        <div style={this.state.dayEventSelected ? {} : { display: 'none' }}>
          <Row style={{ marginLeft: '0' }}>
            <Col >
              <div className="modal-content" role="document" style={{borderRadius: '2%', marginLeft: '0', width: '450px', height: '850px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
                <div style={{ marginTop: '50px' }}>
                  <h3 style={{ textAlign: 'center' }} className="bigfancytext">Event Information</h3>
                  {/* <p>ID: {this.state.newEventID}</p> */}
                  {/* <Container> */}
                  <Form onSubmit={this.handleSubmit} style={{ marginLeft: '15%', width: '850px', }} >
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
                            <Form.Control value={"Invite Guest"}
                              type="text" placeholder="End" />
                          </Form.Group>
                          <Form.Group controlId="Location" onChange={this.handleDateEndchange}>
                            <Form.Label>Location:</Form.Label>
                            <Form.Control value={"Location"}
                              type="text" placeholder="Location" />
                          </Form.Group>
                          <Form.Group controlId="Description" onChange={this.handleDateEndchange}>
                            <Form.Label>Description:</Form.Label>
                            <Form.Control as="textarea" rows="3" value={"Description"}
                              type="text" placeholder="Description" />
                          </Form.Group>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Row>
                        <Col style={this.state.isEvent ? { display: 'none' } : {}} >
                          <Button variant="info" type="submit"> Submit </Button>
                        </Col>
                        <Col style={this.state.isEvent ? { marginTop: '0px' } : { display: 'none' }}>
                          <Button onClick={this.updateEventClick} className="btn btn-info">
                            Update
                    </Button>
                        </Col>
                        <Col>
                          <Button variant="secondary" onClick={this.hideEventForm}>Cancel</Button>
                        </Col>
                      </Row>
                      <Row style={{ marginLeft: '10px' }} >
                        <Col>
                          <Button style={this.state.isEvent ? {} : { display: 'none' }} variant="danger" onClick={this.deleteSubmit} > Delete</Button>
                        </Col>
                        <Col>
                          <Button style={this.state.isEvent ? {} : { display: 'none' }} onClick={this.handleModalClicked} className="btn btn-info">
                            Modal
                    </Button>
                        </Col>
                      </Row>
                    </Row>
                  </Form>
                  {/* </Container> */}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Col>

    )
  }

  startTimePicker = () => {
    // const [startDate, setStartDate] = useState(new Date());
    return (
      <DatePicker class="form-control form-control-lg" type="text" style={{ width: '100%' }}
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

  /*
  hideEventForm:
  Hides the create/edit events form when a date or event is clicked
  */
  hideEventForm = (e) => {
    console.log(e);

    this.setState({
      dayEventSelected: false
    });


  }

  /*
All 3 functions below will change a variables
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
    console.log('Main getEventsByInterval ran ');

    axios.get('/getEventsByInterval', { //get normal google calendar data for possible future use
      params: {
        start: start0,
        end: end0
      }
    })
      .then(response => {
        console.log('normal gCal data')
        console.log(response);
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
