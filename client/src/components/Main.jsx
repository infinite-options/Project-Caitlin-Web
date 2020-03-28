import React, { useState } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Modal,
  Dropdown,
  DropdownButton
} from "react-bootstrap";
import Firebasev2 from "./Firebasev2.jsx";
import "./App.css";
import moment from "moment";
import TylersCalendarv1 from "./TCal.jsx";
import DayRoutines from "./DayRoutines.jsx";
import DayGoals from "./DayGoals.jsx";
import DayEvents from "./DayEvents.jsx";
// import RepeatModal from "./RepeatModal.jsx";
import EventBeforeChecked from "./EventBeforeChecked.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      originalEvents: [], //holds the google events data in it's original JSON form
      dayEvents: [], //holds google events data for a single day
      showRoutineGoalModal: false,
      showGoalModal: false,
      showRoutineModal: false,
      showAboutModal: false,
      dayEventSelected: true, //use to show modal to create new event
      // modelSelected: false, // use to display the routine/goals modal
      newEventID: "", //save the event ID for possible future use
      newEventName: "",
      newEventGuests: "",
      newEventLocation: "",
      newEventNotification: 30,
      newEventDescription: "",
      // newEventStart: "", //this variable and any use of it in the code should be DELETED in future revisions
      // newEventEnd: "", //this variable and any use of it in the code should be DELETED in future revisions
      newEventStart0: new Date(), //start and end for a event... it's currently set to today
      newEventEnd0: new Date(), //start and end for a event... it's currently set to today
      isEvent: false, // use to check whether we clicked on a event and populate extra buttons in event form
      //////////New additions for new calendar
      dateContext: moment(), //Keep track of day and month
      todayDateObject: moment(), //Remember today's date to create the circular effect over todays day
      // selectedDay: null, // Any use of this variable should be deleted in future revisions
      calendarView: "Month", // decides which type of calendar to display
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
      showNoTitleError: "",
      showDateError: "",
      notificationBeforeChecked: false,
      byDay: {
        0: "",
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: ""
      },
      byDay_temp: {
        0: "",
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: ""
      },
      repeatSummary: ""
      // repeatOccurrence: newEventStart0
    };
  }

  handleRepeatDropDown = (eventKey, week_days) => {
    if (eventKey === "WEEK") {
      const newByDay = {
        ...this.state.byDay_temp,
        [this.state.newEventStart0.getDay()]: week_days[
          this.state.newEventStart0.getDay()
        ]
      };
      this.setState({
        repeatDropDown_temp: eventKey,
        byDay_temp: newByDay
      });
    }
    this.setState({
      repeatDropDown_temp: eventKey
    });
  };

  handleRepeatMonthlyDropDown = eventKey => {
    this.setState({
      repeatMonthlyDropDown: eventKey
    });
  };

  handleRepeatEndDate = date => {
    this.setState(
      {
        repeatEndDate_temp: date
      },
      console.log("handleRepeatEndDate", date, this.state.repeatEndDate)
    );
  };

  handleRepeatInputValue = eventKey => {
    this.setState({
      repeatInputValue_temp: eventKey
    });
  };

  handleRepeatOccurrence = eventKey => {
    this.setState({
      repeatOccurrence_temp: eventKey
    });
  };

  componentDidUpdate() {}

  componentDidMount() {
    this.updateEventsArray();
  }
  /*
  getThisMonthEvents:
  By passing in a empty interval, this method will get a response from the server with
  the current month's events
  */
  getThisMonthEvents = () => {
    axios
      .get("/getEventsByInterval", {
        //get normal google calendar data for possible future use
        params: {}
      })
      .then(response => {
        var events = response.data;
        this.setState({ originalEvents: events }, () => {
          console.log("New Events Arrived cdm", response.data);
        });
      })
      .catch(error => {
        //console.log('Error Occurred ' + error);
      });
  };

  handleDayEventClick = A => {
    var guestList = "";
    if (A.attendees) {
      guestList = A.attendees.reduce((guestList, nextGuest) => {
        return guestList + " " + nextGuest.email;
      }, "");
      console.log("Guest List:", A.attendees, guestList);
    }
    this.setState({
      newEventID: A.id,
      newEventStart0: A.start.dateTime
        ? new Date(A.start.dateTime)
        : new Date(A.start.date),
      newEventEnd0: A.end.dateTime
        ? new Date(A.end.dateTime)
        : new Date(A.end.date),
      newEventName: A.summary,
      newEventGuests: guestList,
      newEventLocation: A.location ? A.location : "",
      newEventNotification: A.reminders.overrides
        ? A.reminders.overrides[0].minutes
        : "",
      newEventDescription: A.description ? A.description : "",
      dayEventSelected: true,
      isEvent: true,
      showNoTitleError: "",
      showDateError: "",
      showRepeatModal: false,
      showAboutModal: false,
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
        6: ""
      },
      byDay_temp: {
        0: "",
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: ""
      }
    });
  };

  /*
  handleEventClick For Month View.
  when a event on the calendar is clicked, the function below
  will execute and save the clicked event varibles to this.state and
  passed that into the form where the user can edit that data

  TODO: set dateContext to the date clicked
  */
  handleEventClick = i => {
    // bind with an arrow function
    let A = this.state.originalEvents[i];
    console.log("A", A);
    //Guest list erroneously includes owner's email as well
    var guestList = "";
    if (A.attendees) {
      guestList = A.attendees.reduce((guestList, nextGuest) => {
        return guestList + " " + nextGuest.email;
      }, "");
      console.log("Guest List:", A.attendees, guestList);
    }
    this.setState(
      {
        newEventID: A.id,
        newEventStart0: A.start.dateTime
          ? new Date(A.start.dateTime)
          : new Date(A.start.date),
        newEventEnd0: A.end.dateTime
          ? new Date(A.end.dateTime)
          : new Date(A.end.date),
        newEventName: A.summary,
        newEventGuests: guestList,
        newEventLocation: A.location ? A.location : "",
        newEventNotification: A.reminders.overrides
          ? A.reminders.overrides[0].minutes
          : "",
        newEventDescription: A.description ? A.description : "",
        dayEventSelected: true,
        isEvent: true,
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
        showNoTitleError: "",
        showDateError: "",
        showAboutModal: false,
        byDay: {
          0: "",
          1: "",
          2: "",
          3: "",
          4: "",
          5: "",
          6: ""
        },
        byDay_temp: {
          0: "",
          1: "",
          2: "",
          3: "",
          4: "",
          5: "",
          6: ""
        }
      },
      () => {
        console.log("callback from handEventClick");
      }
    );
  };

  handleDateClickOnDayView = (arg, i) => {
    var newStart = new Date(arg);
    newStart.setHours(i, 0, 0);
    var newEnd = new Date(arg);
    newEnd.setHours(i + 1, 0, 0);
    this.setState({
      newEventID: "",
      newEventStart0: newStart,
      newEventEnd0: newEnd,
      newEventName: "",
      newEventGuests: "",
      newEventLocation: "",
      newEventNotification: 30,
      newEventDescription: "",
      dayEventSelected: true,
      isEvent: false,
      showNoTitleError: "",
      showDateError: "",
      showRepeatModal: false,
      showAboutModal: false,
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
        6: ""
      },
      byDay_temp: {
        0: "",
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: ""
      }
    });
  };

  /*
  handleDateClick on Month View.
  This will trigger when a date is clicked, it will present
  the user with a new form to create a event
  */
  //TODO: Initialize Date, set other properties to empty
  handleDateClick = arg => {
    var newStart = new Date(arg);
    newStart.setHours(0, 0, 0, 0);
    var newEnd = new Date(arg);
    newEnd.setHours(23, 59, 59, 59);
    this.setState(
      {
        newEventID: "",
        newEventStart0: newStart,
        newEventEnd0: newEnd,
        newEventName: "",
        newEventGuests: "",
        newEventLocation: "",
        newEventNotification: 30,
        newEventDescription: "",
        dayEventSelected: true,
        isEvent: false,
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
        showNoTitleError: "",
        showDateError: "",
        showAboutModal: false,
        byDay: {
          0: "",
          1: "",
          2: "",
          3: "",
          4: "",
          5: "",
          6: ""
        },
        byDay_temp: {
          0: "",
          1: "",
          2: "",
          3: "",
          4: "",
          5: "",
          6: ""
        }
      },
      console.log("handledateclick")
    );
  };

  validate = () => {
    let titleError = "";
    let dayError = "";
    var startDay = new Date(this.state.newEventStart0).getDate();
    var endDay = new Date(this.state.newEventEnd0).getDate();
    var startMonth = new Date(this.state.newEventStart0).getUTCMonth();
    var endMonth = new Date(this.state.newEventEnd0).getUTCMonth();
    var startYear = new Date(this.state.newEventStart0).getFullYear();
    var endYear = new Date(this.state.newEventEnd0).getFullYear();
    var startHour = new Date(this.state.newEventStart0).getHours();
    var endHour = new Date(this.state.newEventEnd0).getHours();
    if (
      (startDay > endDay && startMonth === endMonth) ||
      (startMonth > endMonth && startYear === endYear) ||
      startYear > endYear ||
      (startHour > endHour && startDay === endDay)
    ) {
      dayError = "Invalid: start date is before end date";
    }
    if (this.state.newEventName === "") {
      titleError = "Invalid: No Title";
    }
    //empty string evalutes to false.
    if (titleError || dayError) {
      this.setState({ showNoTitleError: titleError, showDateError: dayError });
      return false;
    }
    return true;
  };

  // handleSubmit:

  handleExpandClick = arg => {
    let newDate = new Date(arg);
    console.log(newDate);
    this.setState(
      {
        dateContext: moment(newDate),
        calendarView: "Day"
      },
      this.updateEventsArray
    );
  };

  // handleSubmit:

  // submits the data to be passed up to be integrated into google calendar

  handleSubmit = event => {
    if (this.state.start === "" || this.state.end === "") {
      console.log("invalid params");
      return;
    }
    const isValid = this.validate();
    if (isValid) {
      event.preventDefault();
      this.createEvent(this.state.newEventName);
      this.setState({ showNoTitleError: "", showDateError: "" });
    }
  };

  updateEventClick = event => {
    event.preventDefault();
    const isValid = this.validate();
    if (isValid) {
      if (this.state.newEventID === "") {
        return;
      } else {
        for (let i = 0; i < this.state.originalEvents.length; i++) {
          if (this.state.originalEvents[i].id === this.state.newEventID) {
            this.updateRequest(i);
          }
        }
      }
    }
  };

  /*
  updateRequest:
  updates the google calendar based  on
  */
  updateRequest = index => {
    const guests = this.state.newEventGuests;
    var formattedEmail = null;
    const emailList = guests.match(
      /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*(\.)?/g
    );
    if (emailList) {
      formattedEmail = emailList.map(guests => {
        return {
          email: guests,
          responseStatus: "needsAction"
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
      overrides: [
        {
          method: "popup",
          minutes: minutesNotification
        }
      ],
      useDefault: false,
      sequence: 0
    };

    axios
      .post("/updateEvent", {
        extra: updatedEvent,
        ID: this.state.newEventID
      })
      .then(response => {
        this.setState({
          dayEventSelected: false,
          newEventName: "",
          // newEventStart: '',
          // newEventEnd: '',
          newEventStart0: new Date(),
          newEventEnd0: new Date()
        });

        this.updateEventsArray();
      })

      .catch(function(error) {
        console.log(error);
      });
  };

  /*
  calls the backend API to delete a item with a particular eventID
  */

  deleteSubmit = () => {
    if (this.state.newEventID === "") {
      return;
    }
    axios
      .post("/deleteEvent", {
        ID: this.state.newEventID
      })
      .then(response => {
        // console.log(response);
        this.setState({
          dayEventSelected: false
          // newEventStart: "",
          // newEventEnd: ""
        });
        this.updateEventsArray();
      })

      .catch(function(error) {
        console.log(error);
      });
  };

  /*
  createEvent:
  Basically creates a new event based on details given
  */
  /*
   * TODO: Replace formatting email with function
   */
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
  createEvent = newTitle => {
    const guests = this.state.newEventGuests;
    var formattedEmail = null;
    const emailList = guests.match(
      /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*(\.)?/g
    );
    if (emailList) {
      formattedEmail = emailList.map(guests => {
        return {
          email: guests,
          responseStatus: "needsAction"
        };
      });
    }

    var minutesNotification = 30;
    if (this.state.newEventNotification) {
      minutesNotification = this.state.newEventNotification;
    }

    // frequency in RRULE
    let frequency =
      this.state.repeatDropDown === "DAY"
        ? "DAILY"
        : this.state.repeatDropDown.concat("LY");

    // recurrence string
    let rrule = `RRULE:FREQ=${frequency};INTERVAL=${this.state.repeatInputValue}`;
    let recurrence = [];
    let exdate = "";

    // If seleted WEEK, add BYDAY to recurrence string
    if (this.state.repeatDropDown === "WEEK") {
      let selectedDays = [];
      for (let [key, value] of Object.entries(this.state.byDay)) {
        // Excluding today if today is not selected
        if (key === this.state.newEventStart0.getDay().toString()) {
          if (value === "") {
            exdate = `EXDATE;TZID=America/Los_Angeles:${moment(
              this.state.newEventStart0
            ).format("YYYYMMDD")}T070000Z`;
            recurrence.unshift(exdate);
          }
        }
        value !== "" && selectedDays.push(value.substring(0, 2).toUpperCase());
      }
      rrule = rrule.concat(`;BYDAY=${selectedDays.toString()}`);
    }

    // If selected After, add COUNT to recurrence string
    if (this.state.repeatRadio === "After")
      rrule = rrule.concat(`;COUNT=${this.state.repeatOccurrence}`);

    // If selected On, add UNTIL to recurrence string
    if (this.state.repeatRadio === "On") {
      let repeat_end_date = moment(this.state.repeatEndDate).add(1, "days");
      rrule = rrule.concat(`;UNTIL=${repeat_end_date.format("YYYYMMDD")}`);
    }

    recurrence.push(rrule);
    console.log("recurrence", recurrence);

    let event = {
      summary: this.state.newEventName,
      location: this.state.newEventLocation,
      description: this.state.newEventDescription,
      reminders: {
        useDefault: false,
        sequence: 0,
        overrides: [
          {
            method: "popup",
            minutes: minutesNotification
          }
        ]
      },
      start: {
        dateTime: this.state.newEventStart0.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: this.state.newEventEnd0.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      recurrence: this.state.repeatOption && recurrence,
      attendees: formattedEmail
    };
    axios
      .post("/createNewEvent", {
        newEvent: event,
        reminderTime: minutesNotification,
        title: newTitle,
        start: this.state.newEventStart0.toISOString(),
        end: this.state.newEventEnd0.toISOString()
      })
      .then(response => {
        console.log("createnewevent", response);
        this.setState({
          dayEventSelected: false
        });
        this.updateEventsArray();
      })
      .catch(function(error) {
        // console.log(error);
      });
  };

  /*
  handleModalClicked:
  this will toggle show hide of the firebase modal currently
  */
  // handleModalClicked = arg => {
  //   // bind with an arrow function
  //   this.setState({
  //     modelSelected: !this.state.modelSelected
  //   });
  // };

  nextMonth = () => {
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).add(1, "month");
    this.setState(
      {
        dateContext: dateContext,
        originalEvents: []
      },
      this.updateEventsArray
    );
  };

  prevMonth = () => {
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).subtract(1, "month");
    this.setState(
      {
        dateContext: dateContext,
        originalEvents: []
      },
      this.updateEventsArray
    );
  };

  nextDay = () => {
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).add(1, "day");
    this.setState(
      {
        dateContext: dateContext,
        dayEvents: []
      },
      this.updateEventsArray
    );
  };

  prevDay = () => {
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).subtract(1, "day");
    this.setState(
      {
        dateContext: dateContext,
        dayEvents: []
      },
      this.updateEventsArray
    );
  };

  /*
  updateEventsArray:
  updates the array if the month view changes to a different month.
  */

  updateEventsArray = () => {
    if (this.state.calendarView === "Month") {
      //The month view has transferred to a different month
      let startObject = this.state.dateContext.clone();
      let endObject = this.state.dateContext.clone();
      let startDay = startObject.startOf("month");
      let endDay = endObject.endOf("month");
      let startDate = new Date(startDay.format("MM/DD/YYYY"));
      let endDate = new Date(endDay.format("MM/DD/YYYY"));
      startDate.setHours(0, 0, 0);
      endDate.setHours(23, 59, 59);
      this.getEventsByInterval(startDate.toString(), endDate.toString());
    } else if (this.state.calendarView === "Day") {
      this.getEventsByIntervalDayVersion(
        this.state.dateContext.format("MM/DD/YYYY")
      );
    }
  };

  /*
  openRepeatModal:
  this will open repeat modal.
  */
  openRepeatModal = () => {
    this.setState(prevState => {
      return { showRepeatModal: !prevState.showRepeatModal };
    });
  };

  /*
  closeRepeatModal:
  this will close repeat modal.
  */
  closeRepeatModal = () => {
    this.setState(prevState => ({
      showRepeatModal: false,
      repeatInputValue_temp: prevState.repeatInputValue,
      repeatOccurrence_temp: prevState.repeatOccurrence,
      repeatDropDown_temp: prevState.repeatDropDown,
      repeatRadio_temp: prevState.repeatRadio,
      repeatEndDate_temp: prevState.repeatEndDate,
      byDay_temp: prevState.byDay
    }));
    if (!this.state.repeatOption) {
      this.setState({
        repeatOptionDropDown: "Does not repeat"
      });
    }
  };

  /*
  saveRepeatChanges:
  this will close repeat modal.
  */
  saveRepeatChanges = () => {
    const {
      // repeatOptionDropDown,
      repeatDropDown_temp,
      repeatInputValue_temp,
      repeatOccurrence_temp,
      repeatRadio_temp,
      repeatEndDate_temp,
      byDay_temp
    } = this.state;
    this.setState(prevState => ({
      showRepeatModal: false,
      repeatOption: true,
      repeatInputValue: prevState.repeatInputValue_temp,
      repeatOccurrence: prevState.repeatOccurrence_temp,
      repeatDropDown: prevState.repeatDropDown_temp,
      repeatRadio: prevState.repeatRadio_temp,
      repeatEndDate: prevState.repeatEndDate_temp,
      byDay: prevState.byDay_temp
    }));

    // If repeatDropDown_temp is DAY
    if (repeatDropDown_temp === "DAY") {
      if (repeatInputValue_temp === "1") {
        if (repeatRadio_temp === "Never") {
          this.setState({
            repeatOptionDropDown: "Daily"
          });
        } else if (repeatRadio_temp === "On") {
          this.setState({
            repeatOptionDropDown: `Daily, until ${moment(
              repeatEndDate_temp
            ).format("LL")}`
          });
        } else {
          if (repeatOccurrence_temp === "1") {
            this.setState({
              repeatOptionDropDown: `Once`
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Daily, ${repeatOccurrence_temp} times`
            });
          }
        }
      } else {
        if (repeatRadio_temp === "Never") {
          this.setState({
            repeatOptionDropDown: `Every ${repeatInputValue_temp} days`
          });
        } else if (repeatRadio_temp === "On") {
          this.setState({
            repeatOptionDropDown: `Every ${repeatInputValue_temp} days, until ${moment(
              repeatEndDate_temp
            ).format("LL")}`
          });
        } else {
          if (repeatOccurrence_temp === "1") {
            this.setState({
              repeatOptionDropDown: `Once`
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Every ${repeatInputValue_temp} days, ${repeatOccurrence_temp} times`
            });
          }
        }
      }
    }

    // If repeatDropDown_temp is WEEK
    else if (repeatDropDown_temp === "WEEK") {
      let selectedDays = [];
      for (let [key, value] of Object.entries(byDay_temp)) {
        value !== "" && selectedDays.push(value);
      }
      if (repeatInputValue_temp === "1") {
        if (repeatRadio_temp === "Never") {
          if (selectedDays.length === "7") {
            this.setState({
              repeatOptionDropDown: "Weekly on all days"
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Weekly on ${selectedDays.join(", ")}`
            });
          }
        } else if (repeatRadio_temp === "On") {
          if (selectedDays.length === "7") {
            this.setState({
              repeatOptionDropDown: `Weekly on all days, until ${moment(
                repeatEndDate_temp
              ).format("LL")}`
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Weekly on ${selectedDays.join(
                ", "
              )}, until ${moment(repeatEndDate_temp).format("LL")}`
            });
          }
        } else {
          if (repeatOccurrence_temp === "1") {
            this.setState({
              repeatOptionDropDown: `Once`
            });
          } else {
            if (selectedDays.length === "7") {
              this.setState({
                repeatOptionDropDown: `Weekly on all days, , ${repeatOccurrence_temp} times`
              });
            } else {
              this.setState({
                repeatOptionDropDown: `Weekly on ${selectedDays.join(
                  ", "
                )}, ${repeatOccurrence_temp} times`
              });
            }
          }
        }
      } else {
        if (repeatRadio_temp === "Never") {
          if (selectedDays.length === "7") {
            this.setState({
              repeatOptionDropDown: `Every ${repeatInputValue_temp} weeks on all days`
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Every ${repeatInputValue_temp} weeks on ${selectedDays.join(
                ", "
              )}`
            });
          }
        } else if (repeatRadio_temp === "On") {
          if (selectedDays.length === "7") {
            this.setState({
              repeatOptionDropDown: `Every ${repeatInputValue_temp} weeks on all days, until ${moment(
                repeatEndDate_temp
              ).format("LL")}`
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Every ${repeatInputValue_temp} weeks on ${selectedDays.join(
                ", "
              )}, until ${moment(repeatEndDate_temp).format("LL")}`
            });
          }
        } else {
          if (repeatOccurrence_temp === "1") {
            this.setState({
              repeatOptionDropDown: "Once"
            });
          } else {
            if (selectedDays.length === "7") {
              this.setState({
                repeatOptionDropDown: `Every ${repeatInputValue_temp} weeks on all days, ${repeatOccurrence_temp} times`
              });
            } else {
              this.setState({
                repeatOptionDropDown: `Every ${repeatInputValue_temp} weeks on ${selectedDays.join(
                  ", "
                )}, ${repeatOccurrence_temp} times`
              });
            }
          }
        }
      }
    }

    // If repeatDropDown_temp is MONTH
    else if (repeatDropDown_temp === "MONTH") {
      if (repeatInputValue_temp === "1") {
        if (repeatRadio_temp === "Never") {
          this.setState({
            repeatOptionDropDown: "Monthly"
          });
        } else if (repeatRadio_temp === "On") {
          this.setState({
            repeatOptionDropDown: `Monthly, until ${moment(
              repeatEndDate_temp
            ).format("LL")}`
          });
        } else {
          if (repeatOccurrence_temp === "1") {
            this.setState({
              repeatOptionDropDown: `Once`
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Monthly, ${repeatOccurrence_temp} times`
            });
          }
        }
      } else {
        if (repeatRadio_temp === "Never") {
          this.setState({
            repeatOptionDropDown: `Every ${repeatInputValue_temp} months`
          });
        } else if (repeatRadio_temp === "On") {
          this.setState({
            repeatOptionDropDown: `Every ${repeatInputValue_temp} months, until ${moment(
              repeatEndDate_temp
            ).format("LL")}`
          });
        } else {
          if (repeatOccurrence_temp === "1") {
            this.setState({
              repeatOptionDropDown: `Once`
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Every ${repeatInputValue_temp} months, ${repeatOccurrence_temp} times`
            });
          }
        }
      }
    }

    // If repeatDropDown_temp is YEAR
    else if (repeatDropDown_temp === "YEAR") {
      if (repeatInputValue_temp === "1") {
        if (repeatRadio_temp === "Never") {
          this.setState({
            repeatOptionDropDown: "Yearly"
          });
        } else if (repeatRadio_temp === "On") {
          this.setState({
            repeatOptionDropDown: `Yearly, until ${moment(
              repeatEndDate_temp
            ).format("LL")}`
          });
        } else {
          if (repeatOccurrence_temp === "1") {
            this.setState({
              repeatOptionDropDown: `Once`
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Yearly, ${repeatOccurrence_temp} times`
            });
          }
        }
      } else {
        if (repeatRadio_temp === "Never") {
          this.setState({
            repeatOptionDropDown: `Every ${repeatInputValue_temp} years`
          });
        } else if (repeatRadio_temp === "On") {
          this.setState({
            repeatOptionDropDown: `Every ${repeatInputValue_temp} years, until ${moment(
              repeatEndDate_temp
            ).format("LL")}`
          });
        } else {
          if (repeatOccurrence_temp === "1") {
            this.setState({
              repeatOptionDropDown: `Once`
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Every ${repeatInputValue_temp} years, ${repeatOccurrence_temp} times`
            });
          }
        }
      }
    }
  };

  showDayViewOrAboutView = () => {
    if (this.state.dayEventSelected) {
      return this.eventFormAbstracted();
    } else if (this.state.showAboutModal) {
      return this.aboutFormAbstracted();
    }
  };

  render() {
    //The variable below will help decide whether to center the Calendar object or not
    var onlyCal =
      !this.state.showRoutineGoalModal &&
      !this.state.showGoalModal &&
      !this.state.showRoutineModal;

    return (
      //width and height is fixed now but should be by % percentage later on
      <div
        className="normalfancytext"
        style={{ marginLeft: "0px", height: "100%", width: "2000px" }}
      >
        <div style={{ margin: "0", padding: "0", width: "100%" }}>
          <div>{this.abstractedMainEventGRShowButtons()}</div>
        </div>
        <Container fluid style={{ marginTop: "15px", marginLeft: "0%" }}>
          {/* Within this container essentially contains all the UI of the App */}
          <Row style={{ marginTop: "0" }}>
            {/* the modal for routine/goal is called Firebasev2 currently */}
            <Firebasev2
              closeRoutineGoalModal={() => {
                this.setState({ showRoutineGoalModal: false });
              }}
              showRoutineGoalModal={this.state.showRoutineGoalModal}
              closeGoal={() => {
                this.setState({ showGoalModal: false });
              }}
              closeRoutine={() => {
                this.setState({ showRoutineModal: false });
              }}
              showRoutine={this.state.showRoutineModal}
              showGoal={this.state.showGoalModal}
            />
            <Col
              sm="auto"
              md="auto"
              lg="auto"
              style={onlyCal ? { marginLeft: "20%" } : { marginLeft: "35px" }}
            >
              {this.state.calendarView === "Month"
                ? this.calendarAbstracted()
                : this.dayViewAbstracted()}
              <div
                style={{ marginTop: "50px", textAlign: "center" }}
                className="fancytext"
              >
                Dedicated to Caitlin Little
              </div>
            </Col>
            <Col style={{ marginLeft: "25px" }}>
              {this.showDayViewOrAboutView()}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  dayViewAbstracted = () => {
    return (
      <div
        style={{
          borderRadius: "20px",
          backgroundColor: "white",
          width: "100%",
          marginLeft: "10px",
          padding: "20px",
          // border:"1px black solid",
          boxShadow:
            "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)"
        }}
      >
        <Container>
          <Row style={{ marginTop: "0px" }}>
            <Col>
              <div>
                <FontAwesomeIcon
                  style={{ marginLeft: "50%" }}
                  icon={faChevronLeft}
                  size="2x"
                  className="X"
                  onClick={e => {
                    this.prevDay();
                  }}
                />
              </div>
            </Col>
            <Col style={{ textAlign: "center" }} className="bigfancytext">
              <p>
                {" "}
                {this.getDay()} {this.getMonth()} {this.getYear()}{" "}
              </p>
            </Col>
            <Col>
              <FontAwesomeIcon
                style={{ marginLeft: "50%" }}
                icon={faChevronRight}
                size="2x"
                className="X"
                onClick={e => {
                  this.nextDay();
                }}
              />
            </Col>
          </Row>
        </Container>
        <Row>
          <DayEvents
            dateContext={this.state.dateContext}
            eventClickDayView={this.handleDayEventClick}
            handleDateClick={this.handleDateClickOnDayView}
            dayEvents={this.state.dayEvents}
            getEventsByInterval={this.state.getEventsByIntervalDayVersion}
          />
          <DayRoutines dayRoutineClick={this.toggleShowRoutine} />
          <DayGoals dayGoalClick={this.toggleShowGoal} />
        </Row>
      </div>
    );
  };

  toggleShowRoutine = () => {
    this.setState({
      showRoutineModal: !this.state.showRoutineModal,
      showGoalModal: false,
      showRoutineGoalModal: false
    });
  };

  toggleShowGoal = () => {
    this.setState({
      showGoalModal: !this.state.showGoalModal,
      showRoutineModal: false,
      showRoutineGoalModal: false
    });
  };

  showEventsFormbyCreateNewEventButton = () => {
    var newStart, newEnd;
    if (this.state.calendarView == "Month") {
      newStart = new Date();
      newStart.setHours(0, 0, 0, 0);
      newEnd = new Date();
      newEnd.setHours(23, 59, 59, 59);
    } else if (this.state.calendarView === "Day") {
      newStart = new Date(this.state.dateContext.toDate());
      newStart.setHours(0, 0, 0, 0);
      newEnd = new Date(this.state.dateContext.toDate());
      newEnd.setHours(23, 59, 59, 59);
    }

    this.setState({
      newEventID: "",
      // newEventStart: newStart.toString(),
      // newEventEnd: newEnd.toString(),
      newEventStart0: newStart,
      newEventEnd0: newEnd,
      newEventName: "",
      newEventGuests: "",
      newEventLocation: "",
      newEventDescription: "",
      dayEventSelected: true,
      isEvent: false
    });
  };

  changeCalendarView = view => {
    this.setState(
      {
        calendarView: view
      },
      this.updateEventsArray
    );
  };

  abstractedMainEventGRShowButtons = () => {
    return (
      <div style={{ marginLeft: "33%", width: "100%", fontSize: "20px" }}>
        <Button
          style={{ margin: "10px", marginBottom: "0" }}
          variant="outline-primary"
          onClick={() => {
            this.setState({
              dateContext: moment()
            });
          }}
        >
          Today
        </Button>

        <Button
          style={{ marginTop: "0", margin: "10px", marginBottom: "0" }}
          variant="outline-primary"
          onClick={() => {
            this.setState(
              {
                showAboutModal: false
                // dayEventSelected: !this.state.dayEventSelected
              },
              () => {
                this.showEventsFormbyCreateNewEventButton();
              }
            );
          }}
        >
          New Event
        </Button>

        <Button
          style={{ marginTop: "0", margin: "10px", marginBottom: "0" }}
          variant="outline-primary"
          onClick={this.toggleShowRoutine}
        >
          Routines
        </Button>

        <Button
          style={{ marginTop: "0", margin: "10px", marginBottom: "0" }}
          variant="outline-primary"
          onClick={this.toggleShowGoal}
        >
          {" "}
          Goals{" "}
        </Button>

        <Button
          style={{ margin: "10px", marginBottom: "0" }}
          variant="outline-primary"
          onClick={() => {
            this.setState({
              showRoutineGoalModal: !this.state.showRoutineGoalModal,
              showGoalModal: false,
              showRoutineModal: false
            });
          }}
        >
          Current Status
        </Button>
        <Button
          style={{ margin: "10px", marginBottom: "0" }}
          variant="outline-primary"
          onClick={() => {
            this.setState({
              showAboutModal: !this.state.showAboutModal,
              dayEventSelected: false
            });
          }}
        >
          About
        </Button>

        <DropdownButton
          style={{ margin: "10px", float: "left" }}
          title={this.state.calendarView}
        >
          <Dropdown.Item
            onClick={e => {
              this.changeCalendarView("Month");
            }}
          >
            {" "}
            Month{" "}
          </Dropdown.Item>
          <Dropdown.Item
            onClick={e => {
              this.changeCalendarView("Day");
            }}
          >
            {" "}
            Day{" "}
          </Dropdown.Item>
        </DropdownButton>
      </div>
    );
  };

  calendarAbstracted = () => {
    return (
      <div
        style={{
          borderRadius: "2%",
          backgroundColor: "white",
          width: "1000px",
          marginLeft: "10px",
          padding: "45px",
          paddingBottom: "10px",
          boxShadow:
            "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)"
        }}
      >
        <div>
          <Row style={{ marginTop: "0px" }}>
            <Col>
              <div>
                <FontAwesomeIcon
                  style={{ marginLeft: "50%" }}
                  icon={faChevronLeft}
                  size="2x"
                  className="X"
                  onClick={e => {
                    this.prevMonth();
                  }}
                />
              </div>
            </Col>
            <Col style={{ textAlign: "center" }} className="bigfancytext">
              <p>
                {this.getMonth()} {this.getYear()}
              </p>
            </Col>
            <Col>
              <FontAwesomeIcon
                style={{ marginLeft: "50%" }}
                icon={faChevronRight}
                size="2x"
                className="X"
                onClick={e => {
                  this.nextMonth();
                }}
              />
            </Col>
          </Row>
        </div>
        <TylersCalendarv1
          eventClick={this.handleEventClick}
          handleDateClick={this.handleDateClick}
          handleExpandClick={this.handleExpandClick}
          originalEvents={this.state.originalEvents}
          dateObject={this.state.todayDateObject}
          today={this.state.today}
          dateContext={this.state.dateContext}
          // selectedDay={this.state.selectedDay}
        />
      </div>
    );
  };

  /***     About Modal ***** */
  aboutFormAbstracted = () => {
    return (
      <Modal.Dialog
        style={{
          borderRadius: "15px",
          boxShadow:
            "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
          marginLeft: "0",
          width: "350px",
          marginTop: "0"
        }}
      >
        <Modal.Header
          closeButton
          onHide={() => {
            this.setState({
              showAboutModal: false
            });
          }}
        >
          <Modal.Title>
            <h5 className="normalfancytext">About Me</h5>{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="file" onChange={this.handleFileSelected} />
          <button onClick={this.imageUploadHandler}> Upload</button>
        </Modal.Body>
        <Modal.Footer>
          <Container fluid>
            <Row>
              <Col xs={4}>
                <Button variant="info" type="submit">
                  Save
                </Button>
              </Col>
              <Col xs={4}>
                <Button variant="secondary" onClick={this.hideAboutForm}>
                  Cancel
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Footer>
      </Modal.Dialog>
    );
  };

  imageUploadHandler = () => {};
  handleFileSelected = event => {
    console.log(event.target.files[0]);
  };

  hideAboutForm = e => {
    this.setState({
      showAboutModal: false
    });
  };
  /**
   * This is where the event form is made
   *
   */
  eventFormAbstracted = () => {
    return (
      <Modal.Dialog
        style={{
          borderRadius: "15px",
          boxShadow:
            "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
          marginLeft: "0",
          width: "350px",
          marginTop: "0"
        }}
      >
        <Modal.Header
          closeButton
          onHide={() => {
            this.setState({
              dayEventSelected: false,
              repeatOptionDropDown: "Does not repeat"
            });
          }}
        >
          <Modal.Title>
            <h5 className="normalfancytext">Event Form</h5>{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.showRepeatModal && this.repeatModal()
          // <RepeatModal
          //   closeRepeatModal={this.closeRepeatModal}
          //   todayObject={this.state.todayDateObject}
          //   newEventStart0={this.state.newEventStart0}
          // />
          }
          {this.eventFormInputArea()}
        </Modal.Body>
        <Modal.Footer>
          <Container fluid>
            <Row>
              <Col style={{ float: "right", marginBottom: "10px" }}>
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    this.openRepeatModal();
                    console.log("repeating", this.state.newEventStart0);
                  }}
                >
                  Repeating Options
                </Button>
              </Col>
            </Row>
            <Row>
              <Col style={this.state.isEvent ? { display: "none" } : {}} xs={4}>
                <Button
                  onClick={this.handleSubmit}
                  variant="info"
                  type="submit"
                >
                  Submit
                </Button>
              </Col>
              <Col
                style={
                  this.state.isEvent
                    ? { marginTop: "0px" }
                    : { display: "none" }
                }
                xs={4}
              >
                <Button
                  onClick={this.updateEventClick}
                  className="btn btn-info"
                >
                  Update
                </Button>
              </Col>
              <Col xs={4}>
                <Button variant="secondary" onClick={this.hideEventForm}>
                  Cancel
                </Button>
              </Col>
              <Col xs={4}>
                <Button
                  style={this.state.isEvent ? {} : { display: "none" }}
                  variant="danger"
                  onClick={this.deleteSubmit}
                >
                  {" "}
                  Delete
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Footer>
      </Modal.Dialog>
    );
  };

  repeatModal = () => {
    // const [title, setTitle] = useState("DAY");
    // const [monthly, setMonthly] = useState("Monthly on day 13");
    // const [endDate, setEndDate] = useState(this.state.newEventStart0);
    // const [inputValue, setInputValue] = useState(1);

    // this.state.repeatEndDate = this.state.newEventStart0;

    const week_days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];

    const d = new Date();

    // Custom styles
    const modalStyle = {
      position: "absolute",
      zIndex: "5",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: "400px"
    };

    const inputStyle = {
      padding: "8px 5px 8px 15px",
      marginLeft: "8px",
      background: "#F8F9FA",
      border: "none",
      width: "70px",
      borderRadius: "4px",
      marginRight: "8px"
    };

    const selectStyle = {
      display: "inline-block"
    };

    const weekStyle = {
      display: "flex",
      alignItems: "center",
      textAlign: "center",
      marginTop: "10px"
    };

    // const radioInputStyle = { display: "flex", alignItems: "center" };

    // onClick event handler for the circles
    const selectedDot = (e, index) => {
      let curClass = e.target.classList;
      if (curClass.contains("selected")) {
        curClass.remove("selected");
        const newByDay = { ...this.state.byDay_temp, [index]: "" };
        this.setState({
          byDay_temp: newByDay
        });
      } else {
        curClass.add("selected");
        const newByDay = {
          ...this.state.byDay_temp,
          [index]: week_days[index]
        };
        this.setState({
          byDay_temp: newByDay
        });
      }
    };

    let selectedDays = [];
    for (let [key, value] of Object.entries(this.state.byDay_temp)) {
      if (value !== "") selectedDays.push(key);
    }
    // If selected repeat every week, the following shows.
    const weekSelected = (
      <>
        Repeat On
        <div style={weekStyle}>
          {week_days.map((day, i) => {
            if (selectedDays.includes(i.toString())) {
              return (
                <span
                  key={i}
                  className="dot selected"
                  onClick={e => selectedDot(e, i)}
                >
                  {day.charAt(0)}
                </span>
              );
            } else {
              return (
                <span key={i} className="dot" onClick={e => selectedDot(e, i)}>
                  {day.charAt(0)}
                </span>
              );
            }
          })}
        </div>
      </>
    );

    // If selected repeat every month, the following shows.
    // const monthSelected = (
    //   <DropdownButton
    //     title={this.state.repeatMonthlyDropDown}
    //     variant="light"
    //     style={{ marginTop: "20px" }}
    //   >
    //     <Dropdown.Item
    //       eventKey="Monthly on day 13"
    //       onSelect={eventKey => this.handleRepeatMonthlyDropDown(eventKey)}
    //     >
    //       Monthly on day 13
    //     </Dropdown.Item>
    //     <Dropdown.Item
    //       eventKey="Monthly on the second Friday"
    //       onSelect={eventKey => this.handleRepeatMonthlyDropDown(eventKey)}
    //     >
    //       Monthly on the second Friday
    //     </Dropdown.Item>
    //   </DropdownButton>
    // );

    return (
      <Modal.Dialog style={modalStyle}>
        <Modal.Header closeButton onHide={this.closeRepeatModal}>
          <Modal.Title>
            <h5 className="normalfancytext">Repeating Options</h5>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "5px"
              }}
            >
              Repeat every
              <input
                type="number"
                min="1"
                max="10000"
                value={this.state.repeatInputValue_temp}
                style={inputStyle}
                onChange={e => this.handleRepeatInputValue(e.target.value)}
              />
              <DropdownButton
                title={this.state.repeatDropDown_temp}
                style={selectStyle}
                variant="light"
              >
                <Dropdown.Item
                  eventKey="DAY"
                  onSelect={eventKey => this.handleRepeatDropDown(eventKey)}
                >
                  day
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="WEEK"
                  onSelect={eventKey =>
                    this.handleRepeatDropDown(eventKey, week_days)
                  }
                >
                  week
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="MONTH"
                  onSelect={eventKey => this.handleRepeatDropDown(eventKey)}
                >
                  month
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="YEAR"
                  onSelect={eventKey => this.handleRepeatDropDown(eventKey)}
                >
                  year
                </Dropdown.Item>
              </DropdownButton>
            </Form.Group>
            <Form.Group style={{ marginLeft: "5px" }}>
              {this.state.repeatDropDown_temp === "WEEK" && weekSelected}
            </Form.Group>
            {/* {this.state.repeatDropDown === "MONTH" && monthSelected} */}
            <Form.Group
              style={{
                height: "140px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                marginTop: "20px",
                marginLeft: "5px"
              }}
              className="repeat-form"
              onChange={e => {
                if (e.target.type === "radio") {
                  this.setState({
                    repeatRadio_temp: e.target.value
                  });
                }
              }}
            >
              Ends
              <Form.Check type="radio">
                <Form.Check.Label style={{ marginLeft: "5px" }}>
                  <Form.Check.Input
                    type="radio"
                    value="Never"
                    name="radios"
                    defaultChecked={
                      this.state.repeatRadio_temp === "Never" && true
                    }
                  />
                  Never
                </Form.Check.Label>
              </Form.Check>
              <Form.Check type="radio">
                <Form.Check.Label style={{ marginLeft: "5px" }}>
                  <Form.Check.Input
                    type="radio"
                    name="radios"
                    value="On"
                    style={{ marginTop: "10px" }}
                    defaultChecked={
                      this.state.repeatRadio_temp === "On" && true
                    }
                  />
                  On
                  <DatePicker
                    className="date-picker-btn btn btn-light"
                    selected={this.state.repeatEndDate_temp}
                    onChange={date => this.handleRepeatEndDate(date)}
                  ></DatePicker>
                </Form.Check.Label>
              </Form.Check>
              <Form.Check type="radio">
                <Form.Check.Label style={{ marginLeft: "5px" }}>
                  <Form.Check.Input
                    type="radio"
                    name="radios"
                    value="After"
                    style={{ marginTop: "12px" }}
                    defaultChecked={
                      this.state.repeatRadio_temp === "After" && true
                    }
                  />
                  After
                  <span style={{ marginLeft: "60px" }}>
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={this.state.repeatOccurrence_temp}
                      onChange={e =>
                        this.handleRepeatOccurrence(e.target.value)
                      }
                      style={inputStyle}
                      className="input-exception"
                    />
                    occurrence
                  </span>
                </Form.Check.Label>
              </Form.Check>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={this.closeRepeatModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={this.saveRepeatChanges}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  };

  eventFormInputArea = () => {
    return (
      <Form>
        <Row>
          <Col>
            <div style={{ width: "300px" }}>
              <Form.Group>
                <Form.Label>Event Name</Form.Label>
                <Form.Control
                  value={this.state.newEventName}
                  onChange={this.handleNameChange}
                  type="text"
                  placeholder="Title"
                />
                <div style={{ color: "red" }}>
                  {" "}
                  {this.state.showNoTitleError}
                </div>
              </Form.Group>
              <Form.Group value={this.state.newEventStart0} controlId="Y">
                <Form.Label>Start Time</Form.Label> <br />
                {this.startTimePicker()}
              </Form.Group>
              <Form.Group value={this.state.newEventEnd0} controlId="X">
                <Form.Label>End Time</Form.Label>
                <br />
                {this.endTimePicker()}
                <div style={{ color: "red" }}> {this.state.showDateError}</div>
              </Form.Group>
              <Form.Group style={{ display: "flex", flexDirection: "column" }}>
                <Form.Label>Repeating Options</Form.Label>
                <DropdownButton
                  className="repeatOptionDropDown"
                  // onClick={this.openRepeatModal}
                  title={this.state.repeatOptionDropDown}
                  variant="light"
                >
                  <Dropdown.Item
                    eventKey="Does not repeat"
                    onSelect={eventKey =>
                      this.setState({
                        repeatOptionDropDown: eventKey,
                        repeatOption: false
                      })
                    }
                  >
                    Does not repeat
                  </Dropdown.Item>
                  <Dropdown.Item
                    eventKey="Custom..."
                    onSelect={eventKey => {
                      this.openRepeatModal();
                      // this.setState({ repeatOptionDropDown: eventKey });
                    }}
                  >
                    Custom...
                  </Dropdown.Item>
                </DropdownButton>
              </Form.Group>
              <Form.Group value={"Extra Slot"}>
                <Form.Label>Guests</Form.Label>
                <Form.Control
                  value={this.state.newEventGuests}
                  onChange={this.handleGuestChange}
                  type="email"
                  placeholder="example@gmail.com"
                />
              </Form.Group>
              <Form.Group controlId="Location">
                <Form.Label>Location:</Form.Label>
                <Form.Control
                  value={this.state.newEventLocation}
                  onChange={this.handleLocationChange}
                  type="text"
                  placeholder="Location"
                />
              </Form.Group>
              <Form.Group controlId="Notification">
                <Form.Label>Notification:</Form.Label>
                <Row>
                  <Col>
                    {" "}
                    <Form.Control
                      value={this.state.newEventNotification}
                      onChange={this.handleNotificationChange}
                      type="number"
                      placeholder="30"
                    />{" "}
                  </Col>
                  <Col>
                    {" "}
                    <Form.Text> Minutes </Form.Text>{" "}
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group controlId="formBasicCheckbox">
                <Row style={{ height: "30px" }}>
                  <Col>
                    <Form.Check type="checkbox">
                      <Form.Check.Input
                        type="checkbox"
                        onChange={e => this.notifyBefore(e)}
                        style={{ width: "20px", height: "20px" }}
                      />
                    </Form.Check>
                  </Col>
                  <Col>
                    {/* <Form.Check  type="checkbox" >
                    <Form.Check.Input type="checkbox" onChange = {(e) => this.notifyBefore(e)}  style={{ width:"20px", height:"20px"}}/>
                    </Form.Check> */}
                    <Form.Check type="checkbox">
                      <Form.Check.Input
                        type="checkbox"
                        onChange={e => this.notifyBefore(e)}
                        style={{ width: "20px", height: "20px" }}
                      />
                      <Form.Check.Label style={{ marginLeft: "10px" }}>
                        Before
                      </Form.Check.Label>
                    </Form.Check>
                  </Col>
                </Row>
                {this.state.notificationBeforeChecked && <EventBeforeChecked />}
              </Form.Group>

              <Form.Group controlId="formBasicCheckbox">
                <Row style={{ height: "30px" }}>
                  <Col>
                    <Form.Check type="checkbox">
                      <Form.Check.Input
                        type="checkbox"
                        style={{ width: "20px", height: "20px" }}
                      />
                      <Form.Check.Label style={{ marginLeft: "10px" }}>
                        During
                      </Form.Check.Label>
                    </Form.Check>
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group controlId="formBasicCheckbox">
                <Row style={{ height: "30px" }}>
                  <Col>
                    <Form.Check type="checkbox">
                      <Form.Check.Input
                        type="checkbox"
                        style={{ width: "20px", height: "20px" }}
                      />
                      <Form.Check.Label style={{ marginLeft: "10px" }}>
                        After
                      </Form.Check.Label>
                    </Form.Check>
                  </Col>
                </Row>
              </Form.Group>

              {/* End here */}
              <Form.Group controlId="Description">
                <Form.Label>Description:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  value={this.state.newEventDescription}
                  onChange={this.handleDescriptionChange}
                  type="text"
                  placeholder="Description"
                />
              </Form.Group>
            </div>
          </Col>
        </Row>
      </Form>
    );
  };

  notifyBefore = e => {
    console.log("this is result of checked:");
    console.log(e.target.checked);
    let beforeChecked = e.target.checked;
    this.setState({ notificationBeforeChecked: beforeChecked });
  };

  startTimePicker = () => {
    // const [startDate, setStartDate] = useState(new Date());
    return (
      <DatePicker
        className="form-control"
        type="text"
        selected={this.state.newEventStart0}
        onChange={date => {
          this.setState(
            {
              newEventStart0: date
            },
            () => {
              console.log("starttimepicker", this.state.newEventStart0);
            }
          );
        }}
        showTimeSelect
        timeIntervals={15}
        timeCaption="time"
        dateFormat="MMMM d, yyyy h:mm aa"
      />
    );
  };

  endTimePicker = () => {
    // const [startDate, setStartDate] = useState(new Date());
    return (
      <DatePicker
        className="form-control"
        type="text"
        style={{ width: "100%" }}
        selected={this.state.newEventEnd0}
        onChange={date => {
          this.setState(
            {
              newEventEnd0: date
            },
            () => {
              console.log(this.state.newEventEnd0);
            }
          );
        }}
        showTimeSelect
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
  };

  /*
  getMonth:
  returns the month based on the month of the dateContext
  in english word form
  */
  getMonth = () => {
    return this.state.dateContext.format("MMMM");
  };

  getDay = () => {
    return this.state.dateContext.format("D");
  };

  /*
  hideEventForm:
  Hides the create/edit events form when a date or event is clicked
  */
  hideEventForm = e => {
    //console.log("Tyler says: Hello");
    this.setState({
      dayEventSelected: false,
      repeatOptionDropDown: "Does not repeat"
    });
  };

  /*
All functions below will change a variables
when there is a change in the event form
*/

  handleNameChange = event => {
    this.setState({ newEventName: event.target.value });
  };

  handleGuestChange = event => {
    this.setState({ newEventGuests: event.target.value });
  };

  handleLocationChange = event => {
    this.setState({ newEventLocation: event.target.value });
  };

  handleNotificationChange = event => {
    this.setState({ newEventNotification: event.target.value });
  };

  handleDescriptionChange = event => {
    this.setState({ newEventDescription: event.target.value });
  };

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
    axios
      .get("/getEventsByInterval", {
        //get normal google calendar data for possible future use
        params: {
          start: start0,
          end: end0
        }
      })
      .then(response => {
        var events = response.data;
        this.setState(
          {
            newEventID: "",
            newEventName: "",
            // newEventStart: "",
            // newEventEnd: "",
            originalEvents: events
          },
          () => {
            console.log("New Events Arrived");
          }
        );
      })
      .catch(error => {
        console.log("Error Occurred " + error);
      });
  };

  /*
   * getEventsByIntervalDayVersion:
   * gets exactly the days worth of events from the google calendar
   */
  getEventsByIntervalDayVersion = day => {
    axios
      .get("/getEventsByInterval", {
        //get normal google calendar data for possible future use
        params: {
          start: day.toString(),
          end: day.toString()
        }
      })
      .then(response => {
        var events = response.data;
        this.setState(
          {
            dayEvents: events
          },
          () => {
            console.log("New Events Arrived", events);
          }
        );
      })
      .catch(error => {
        console.log("Error Occurred " + error);
      });
  };
}
