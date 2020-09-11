import React from "react";
import axios from "axios";
import queryString from "query-string";

import { Redirect } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Modal,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import firebase from "./firebase";
import Firebasev2 from "./Firebasev2.jsx";
import "./App.css";
import moment from "moment";
import TylersCalendarv1 from "./TCal.jsx";
import DayRoutines from "./DayRoutines.jsx";
import DayGoals from "./DayGoals.jsx";
import DayEvents from "./DayEvents.jsx";
import WeekEvents from "./WeekEvents.jsx";
import WeekRoutines from "./WeekRoutines.jsx";
import WeekGoals from "./WeekGoals.jsx";
import AboutModal from "./AboutModal.jsx";
import CreateNewAccountModal from "./CreateNewAccountModal.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      loggedIn: false,
      originalEvents: [], //holds the google events data in it's original JSON form
      dayEvents: [], //holds google events data for a single day
      weekEvents: [], //holds google events data for a week
      originalGoalsAndRoutineArr: [], //Hold goals and routines so day and week view can access it
      goals: [],
      routines: [],
      routine_ids: [],
      goal_ids: [],
      showRoutineGoalModal: false,
      showGoalModal: false,
      showRoutineModal: false,
      showAboutModal: false,
      dayEventSelected: false, //use to show modal to create new event
      // modelSelected: false, // use to display the routine/goals modal
      newAccountEmail: "asdf",
      newEventID: "", //save the event ID for possible future use
      newEventRecurringID: "",
      newEventName: "",
      newEventGuests: "",
      newEventLocation: "",
      newEventNotification: 30,
      newEventDescription: "",
      newEventStart0: new Date(), //start and end for a event... it's currently set to today
      newEventEnd0: new Date(), //start and end for a event... it's currently set to today
      isEvent: false, // use to check whether we clicked on a event and populate extra buttons in event form
      //////////New additions for new calendar
      dateContext: moment(
        new Date(
          new Date().toLocaleString("en-US", {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          })
        )
      ), //Keep track of day and month
      todayDateObject: moment(
        new Date(
          new Date().toLocaleString("en-US", {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          })
        )
      ), //Remember today's date to create the circular effect over todays day
      calendarView: "Day", // decides which type of calendar to display
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
      recurrenceRule: "",
      eventNotifications: {},
      showDeleteRecurringModal: false,
      deleteRecurringOption: "This event",
      showEditRecurringModal: false,
      editRecurringOption: "",

      currentUserPicUrl: "",
      currentUserName: "",
      currentUserTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      currentUserId: "",
      currentAdvisorCandidateName: "",
      currentAdvisorCandidateId: "",
      // profileName: "",
      userIdAndNames: {},
      userTimeZone: {},
      advisorIdAndNames: [],
      userPicsArray: [],
      enableNameDropDown: false,
      showNewAccountmodal: false,
      showAllowTAmodel: false,

      versionNumber: this.getVersionNumber(),
    };
  }

  // componentDidUpdate(prevProps, prevState) {
  //   // console.log("this is in the component update ",this.props.ATArray[this.props.i] )

  //   if (prevState.originalGoalsAndRoutineArr !== this.state.originalGoalsAndRoutineArr) {
  //     // this.grabFireBaseRoutinesGoalsData();
  //     // console.log("does it go here");

  //   }
  // }
  /**
   * grabFireBaseRoutinesGoalsData:
   * this function grabs the goals&routines array from the path located in this function
   * which will then populate the goals, routines,originalGoalsAndRoutineArr array
   * separately. The arrays will be used for display and data manipulation later.
   *
   */
  grabFireBaseRoutinesGoalsData = () => {
    const db = firebase.firestore();
    if (this.state.currentUserId !== "") {
      const docRef = db.collection("users").doc(this.state.currentUserId);
      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            // console.log(doc.data());
            var x = doc.data();
            // console.log("this is the data", x);
            // console.log(x["goals&routines"]);
            // x = x["goals&routines"];

            let routine = [];
            let routine_ids = [];
            let goal = [];
            let goal_ids = [];
            if (x["goals&routines"] !== undefined) {
              x = x["goals&routines"];
              // console.log("this is the goals and routines", x);
              x.sort((a, b) => {
                let datetimeA = new Date(a["start_day_and_time"]);
                let datetimeB = new Date(b["start_day_and_time"]);
                let timeA = new Date(datetimeA).getHours()*60 + new Date(datetimeA).getMinutes();
                let timeB = new Date(datetimeB).getHours()*60 + new Date(datetimeB).getMinutes();
                return timeA - timeB;
              });
              for (let i = 0; i < x.length; ++i) {
                if (x[i]["is_persistent"]) {
                  // console.log("routine " + x[i]["title"]);
                  // console.log("is the is the id ", x[i].id);
                  routine_ids.push(i);
                  routine.push(x[i]);
                } else if (!x[i]["is_persistent"]) {
                  // console.log("not routine " + x[i]["title"]);
                  goal_ids.push(i);
                  goal.push(x[i]);
                }
              }
              this.setState({
                originalGoalsAndRoutineArr: x,
                goals: goal,
                addNewGRModalShow: false,
                routine_ids: routine_ids,
                goal_ids: goal_ids,
                routines: routine,
              });
            } else {
              this.setState({
                originalGoalsAndRoutineArr: [],
                goals: goal,
                addNewGRModalShow: false,
                routine_ids: routine_ids,
                goal_ids: goal_ids,
                routines: routine,
              });
            }
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch(function (error) {
          console.log("Error getting document:", error);
        });
    }
  };

  handleRepeatDropDown = (eventKey, week_days) => {
    if (eventKey === "WEEK") {
      const newByDay = {
        ...this.state.byDay_temp,
        [this.state.newEventStart0.getDay()]: week_days[
          this.state.newEventStart0.getDay()
        ],
      };
      this.setState({
        repeatDropDown_temp: eventKey,
        byDay_temp: newByDay,
      });
    }
    this.setState({
      repeatDropDown_temp: eventKey,
    });
  };

  handleRepeatMonthlyDropDown = (eventKey) => {
    this.setState({
      repeatMonthlyDropDown: eventKey,
    });
  };

  handleRepeatEndDate = (date) => {
    this.setState({
      repeatEndDate_temp: date,
    });
  };

  handleRepeatInputValue = (eventKey) => {
    this.setState({
      repeatInputValue_temp: eventKey,
    });
  };

  handleRepeatOccurrence = (eventKey) => {
    this.setState({
      repeatOccurrence_temp: eventKey,
    });
  };

  // Entry of the page
  componentDidMount() {
    axios
      .get("/TALogInStatus")
      .then((response) => {
        this.setState({
          loaded: true,
          loggedIn: response.data,
        });
        if (response.data) {
          this.updateStatesByQuery();
          this.updateProfileFromFirebase();
          this.updateEventsArray();
          console.log(document.cookie);
          // this.getEventNotifications();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /*This will obtain the notifications from the database
   */

  // getEventNotifications = () => {
  //   const db = firebase.firestore();
  //   const docRef = db
  //     .collection("users")
  //     .doc("7R6hAVmDrNutRkG3sVRy")
  //     .collection("events")
  //     .doc("o0AHviYhmL7VJLXIREg2");
  //   docRef
  //     .get()
  //     .then((doc) => {
  //       if (doc.exists) {
  //         var x = doc.data();
  //         console.log("this is the event notification from fb ", x);
  //         this.setState({
  //           eventNotifications: x,
  //         });
  //       } else {
  //         console.log("No such document!");
  //       }
  //     })
  //     .catch(function (error) {
  //       console.log("Error getting document:", error);
  //     });
  // };
  /*Grabs the URL the the profile pic from the about me modal to
  display on the top left corner.
  */
  getUrlParam = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  };

  updateStatesByQuery = () => {
    let query = window.location.href;
    let createUserParam = this.getUrlParam("createUser", query) == "true";
    let email = this.getUrlParam("email", query);
    if (createUserParam) {
      this.setState({
        showNewAccountmodal: createUserParam,
        newAccountEmail: email,
      });
    }
  };

  updateProfileFromFirebase = () => {
    const db = firebase.firestore();
    const docRef = db.collection("users");
    const trustedAd = db.collection("trusted_advisor");
    docRef.get().then((usersArray) => {
      trustedAd
        .get()
        .then((advisorArray) => {
          let nameIdObject = {};
          let timeZoneObject = {};
          let profilePicURLArray = [];
          let theCurrentUserName = "";
          let theCurrentUserPic = "";
          let theCurrentUserId = "";
          let theTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          for (let user of usersArray.docs) {
            // console.log("this is x before", user.id);
            let id = user.id;
            let x = user.data();
            var advisors = [];
            for (let advisor of advisorArray.docs) {
              this.state.advisorIdAndNames[advisor.id] = advisor.data();
              if (advisor.data().users) {
                if (this.state.loggedIn == advisor.data().email_id) {
                  for (let u of advisor.data().users) {
                    if (u.User.id == id) {
                      advisors.push(u.User.id);
                      if (
                        x.about_me != undefined &&
                        x.about_me.timeSettings != undefined &&
                        x.about_me.timeSettings.timeZone != ""
                      ) {
                        theTimeZone = x.about_me.timeSettings.timeZone;
                      }
                    }
                  }
                }
              }
            }
            if (advisors.length <= 0) continue;

            // console.log("this is the user should be 3 times", x);

            // console.log(user.data());
            let firstName = x.first_name || "";
            let lastName = x.last_name || "";
            let name = firstName + " " + lastName;
            let picURL = "";
            // console.log("this is x", x);
            //  console.log(x["about_me"]);
            if (x["about_me"] !== undefined) {
              picURL = x["about_me"].pic;
              // console.log("we got in");
            }

            profilePicURLArray.push(picURL);
            //I know what went wrong need to change picURL with the id bc can have multiple picurl with same thing.
            //so have to change structure of whole thing.
            // console.log("this is the picURL", picURL);
            nameIdObject[id] = name;
            timeZoneObject[id] = theTimeZone;
            // namePicObject[picURL] = name;
            // console.log(x["about_me"]  );
            // db.collection("users").doc(user.id).get()
            //   .then()

            // if(this.state.currentUserId=== ""){
            theCurrentUserName = nameIdObject[Object.keys(nameIdObject)[0]];
            theCurrentUserPic = profilePicURLArray[0];
            theCurrentUserId = Object.keys(nameIdObject)[0];
            // }else{
            //   theCurrentUserName = this.state.userIdAndNames[this.state.currentUserId];
            //   theCurrentUserPic = this.state.currentUserPicUrl;
            //   theCurrentUserId = this.state.currentUserId;
            // }
          }
          // console.log("this is the object for name and pic after",namePicObject);
          this.setState(
            {
              userIdAndNames: nameIdObject,
              userTimeZone: timeZoneObject,
              enableNameDropDown: true,
              // currentProfilePicUrl: Object.keys(nameIdObject)[0],
              userPicsArray: profilePicURLArray,
              currentUserPicUrl: theCurrentUserPic,
              currentUserId: theCurrentUserId,
              currentUserName: theCurrentUserName,
              currentUserTimeZone: theTimeZone,
              // currentUserPicUrl: profilePicURLArray[0],
              // currentUserId: Object.keys(nameIdObject)[0],
              // currentUserName: nameIdObject[Object.keys(nameIdObject)[0]]
            },
            () => {
              this.grabFireBaseRoutinesGoalsData();
              this.updateEventsArray();
            }
          );
        })
        .catch(function (error) {
          console.log("Error getting document:", error);
        });
    });
    // console.log("this is doc", usersArray.docs);

    // const db = firebase.firestore();
    // const docRef = db.collection("users").doc("7R6hAVmDrNutRkG3sVRy");
    // docRef
    //   .get()
    //   .then((doc) => {
    //     if (doc.exists) {

    //       var x = doc.data();
    //       var firstName = x.first_name;
    //       var lastName = x.last_name;
    //       // console.log("this is x.data", x.last_name);
    //       x = x["about_me"];
    //       this.setState({
    //         profilePicUrl: x.pic,
    //         profileName: firstName + " " + lastName,
    //       });
    //     } else {
    //       console.log("No such document!");
    //     }
    //   })
    //   .catch(function (error) {
    //     console.log("Error getting document:", error);
    //   });
  };

  /*
getThisMonthEvents:
By passing in a empty interval, this method will get a response from the server with
the current month's events
*/
  getThisMonthEvents = () => {
    axios
      .get("/getEventsByInterval", {
        //get normal google calendar data for possible future use
        params: {},
      })
      .then((response) => {
        var events = response.data;
        this.setState({ originalEvents: events }, () => {
          console.log("New Events Arrived cdm", events);
        });
      })
      .catch((error) => {
        //console.log('Error Occurred ' + error);
      });
  };

  handleDayEventClick = (A) => {
    console.log("Enter handleDayEventClick");

    var guestList = "";
    console.log("handleDayEventClick , A :", A);
    if (A.recurringEventId) {
      axios
        .get("/getRecurringRules", {
          params: {
            recurringEventId: A.recurringEventId,
          },
        })
        .then((res) => {
          console.log(res.data, "getRecurringRules");
          this.setState(
            {
              recurrenceRule: res.data[0],
            },
            () => {
              this.repeatSummaryCompute();
            }
          );
        });
    }
    if (A.attendees) {
      guestList = A.attendees.reduce((guestList, nextGuest) => {
        return guestList + " " + nextGuest.email;
      }, "");
      console.log("Guest List:", A.attendees, guestList);
    }
    this.setState({
      newEvent: A,
      newEventID: A.id,
      newEventRecurringID: A.recurringEventId,
      newEventStart0: A.start.dateTime
        ? new Date(
            new Date(A.start.dateTime).toLocaleString("en-US", {
              timeZone: this.state.currentUserTimeZone,
            })
          )
        : new Date(
            new Date(A.start.date).toLocaleString("en-US", {
              timeZone: this.state.currentUserTimeZone,
            })
          ),
      newEventEnd0: A.end.dateTime
        ? new Date(
            new Date(A.end.dateTime).toLocaleString("en-US", {
              timeZone: this.state.currentUserTimeZone,
            })
          )
        : new Date(
            new Date(A.end.date).toLocaleString("en-US", {
              timeZone: this.state.currentUserTimeZone,
            })
          ),
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
      recurrenceRule: "",
      showDeleteRecurringModal: false,
      deleteRecurringOption: "This event",
      showEditRecurringModal: false,
      editRecurringOption: "",
    });
  };

  handleWeekEventClick = (A) => {
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
      recurrenceRule: "",
      showDeleteRecurringModal: false,
      deleteRecurringOption: "This event",
      showEditRecurringModal: false,
      editRecurringOption: "",
    });
  };
  repeatSummaryCompute = () => {
    const { recurrenceRule } = this.state;

    let untilSubString = "";
    let untilIndex = recurrenceRule.indexOf("UNTIL");
    if (untilIndex !== -1) {
      untilSubString = recurrenceRule.substring(untilIndex);
    }
    //console.log(untilSubString);

    if (untilSubString.includes(";")) {
      let endUntilIndex = untilSubString.indexOf(";");
      untilSubString = moment(
        untilSubString.substring(6, endUntilIndex)
      ).format("LL");
    } else if (untilSubString) {
      console.log(moment("20200406T065959Z").format("LL"));
      untilSubString = moment(untilSubString.substring(6, 14)).format("LL");
    }
    //console.log(untilSubString);

    let countSubString = "";
    let countIndex = recurrenceRule.indexOf("COUNT");
    if (countIndex !== -1) {
      countSubString = recurrenceRule.substring(countIndex);
    }
    if (countSubString.includes(";")) {
      let endCountIndex = countSubString.indexOf(";");
      countSubString = countSubString.substring(6, endCountIndex);
    } else if (countSubString) {
      countSubString = countSubString.substring(6);
    }

    //console.log(countSubString, "countSubString");

    let intervalSubString = "";
    let intervalIndex = recurrenceRule.indexOf("INTERVAL");
    if (intervalIndex !== -1) {
      intervalSubString = recurrenceRule.substring(intervalIndex);
    }
    if (intervalSubString.includes(";")) {
      let endIntervalIndex = intervalSubString.indexOf(";");
      intervalSubString = intervalSubString.substring(9, endIntervalIndex);
    } else if (intervalSubString) {
      intervalSubString = intervalSubString.substring(9);
    }

    let byDaySubString = "";
    let byDayArray = [];
    let byDayIndex = recurrenceRule.indexOf("BYDAY");
    if (byDayIndex !== -1) {
      byDaySubString = recurrenceRule.substring(byDayIndex);
    }
    // console.log(byDaySubString);

    if (byDaySubString.includes(";")) {
      let endByDayIndex = byDaySubString.indexOf(";");
      byDaySubString = byDaySubString.substring(6, endByDayIndex);
    } else if (byDaySubString) {
      byDaySubString = byDaySubString.substring(6);
    }

    byDayArray = byDaySubString.split(",");
    //console.log(byDayArray);

    // If freq is daily in rrule
    if (recurrenceRule.includes("FREQ=DAILY")) {
      if (intervalSubString === "1" || !intervalSubString) {
        if (
          !recurrenceRule.includes("COUNT") &&
          !recurrenceRule.includes("UNTIL")
        ) {
          this.setState({
            repeatOptionDropDown: "Daily",
          });
        } else if (recurrenceRule.includes("UNTIL")) {
          this.setState({
            repeatOptionDropDown: `Daily, until ${untilSubString}`,
          });
        } else if (recurrenceRule.includes("COUNT")) {
          if (countSubString === "1") {
            this.setState({
              repeatOptionDropDown: `Once`,
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Daily, ${countSubString} times`,
            });
          }
        }
      } else {
        if (
          !recurrenceRule.includes("COUNT") &&
          !recurrenceRule.includes("UNTIL")
        ) {
          this.setState({
            repeatOptionDropDown: `Every ${intervalSubString} days`,
          });
        } else if (recurrenceRule.includes("UNTIL")) {
          this.setState({
            repeatOptionDropDown: `Every ${intervalSubString} days, until ${untilSubString}`,
          });
        } else if (recurrenceRule.includes("COUNT")) {
          if (countSubString === "1") {
            this.setState({
              repeatOptionDropDown: `Once`,
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Every ${intervalSubString} days, ${countSubString} times`,
            });
          }
        }
      }
    }

    // If freq is weekly in rrule
    else if (recurrenceRule.includes("FREQ=WEEKLY")) {
      if (intervalSubString === "1" || !intervalSubString) {
        if (
          !recurrenceRule.includes("COUNT") &&
          !recurrenceRule.includes("UNTIL")
        ) {
          if (byDayArray.length === 7) {
            this.setState({
              repeatOptionDropDown: "Weekly on all days",
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Weekly on ${byDayArray.join(", ")}`,
            });
          }
        } else if (recurrenceRule.includes("UNTIL")) {
          if (byDayArray.length === 7) {
            this.setState({
              repeatOptionDropDown: `Weekly on all days, until ${untilSubString}`,
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Weekly on ${byDayArray.join(
                ", "
              )}, until ${untilSubString}`,
            });
          }
        } else if (recurrenceRule.includes("COUNT")) {
          if (countSubString === "1") {
            this.setState({
              repeatOptionDropDown: `Once`,
            });
          } else {
            if (byDayArray.length === 7) {
              this.setState({
                repeatOptionDropDown: `Weekly on all days, ${countSubString} times`,
              });
            } else {
              this.setState({
                repeatOptionDropDown: `Weekly on ${byDayArray.join(
                  ", "
                )}, ${countSubString} times`,
              });
            }
          }
        }
      } else {
        if (
          !recurrenceRule.includes("COUNT") &&
          !recurrenceRule.includes("UNTIL")
        ) {
          if (byDayArray.length === 7) {
            this.setState({
              repeatOptionDropDown: `Every ${intervalSubString} weeks on all days`,
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Every ${intervalSubString} weeks on ${byDayArray.join(
                ", "
              )}`,
            });
          }
        } else if (recurrenceRule.includes("UNTIL")) {
          if (byDayArray.length === 7) {
            this.setState({
              repeatOptionDropDown: `Every ${intervalSubString} weeks on all days, until ${untilSubString}`,
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Every ${intervalSubString} weeks on ${byDayArray.join(
                ", "
              )}, until ${untilSubString}`,
            });
          }
        } else if (recurrenceRule.includes("COUNT")) {
          if (countSubString === "1") {
            this.setState({
              repeatOptionDropDown: "Once",
            });
          } else {
            if (byDayArray.length === 7) {
              this.setState({
                repeatOptionDropDown: `Every ${intervalSubString} weeks on all days, ${countSubString} times`,
              });
            } else {
              this.setState({
                repeatOptionDropDown: `Every ${intervalSubString} weeks on ${byDayArray.join(
                  ", "
                )}, ${countSubString} times`,
              });
            }
          }
        }
      }
    }

    // If freq is monthly in rrule
    else if (recurrenceRule.includes("FREQ=MONTHLY")) {
      if (intervalSubString === "1" || !intervalSubString) {
        if (
          !recurrenceRule.includes("COUNT") &&
          !recurrenceRule.includes("UNTIL")
        ) {
          this.setState({
            repeatOptionDropDown: "Monthly",
          });
        } else if (recurrenceRule.includes("UNTIL")) {
          this.setState({
            repeatOptionDropDown: `Monthly, until ${untilSubString}`,
          });
        } else if (recurrenceRule.includes("COUNT")) {
          if (countSubString === "1") {
            this.setState({
              repeatOptionDropDown: `Once`,
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Monthly, ${countSubString} times`,
            });
          }
        }
      } else {
        if (
          !recurrenceRule.includes("COUNT") &&
          !recurrenceRule.includes("UNTIL")
        ) {
          this.setState({
            repeatOptionDropDown: `Every ${intervalSubString} months`,
          });
        } else if (recurrenceRule.includes("UNTIL")) {
          this.setState({
            repeatOptionDropDown: `Every ${intervalSubString} months, until ${untilSubString}`,
          });
        } else if (recurrenceRule.includes("COUNT")) {
          if (countSubString === "1") {
            this.setState({
              repeatOptionDropDown: `Once`,
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Every ${intervalSubString} months, ${countSubString} times`,
            });
          }
        }
      }
    }

    // If freq is yearly in rrule
    else if (recurrenceRule.includes("FREQ=YEARLY")) {
      if (intervalSubString === "1" || !intervalSubString) {
        if (
          !recurrenceRule.includes("COUNT") &&
          !recurrenceRule.includes("UNTIL")
        ) {
          this.setState({
            repeatOptionDropDown: "Annually",
          });
        } else if (recurrenceRule.includes("UNTIL")) {
          this.setState({
            repeatOptionDropDown: `Annually, until ${untilSubString}`,
          });
        } else if (recurrenceRule.includes("COUNT")) {
          if (countSubString === "1") {
            this.setState({
              repeatOptionDropDown: `Once`,
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Annually, ${countSubString} times`,
            });
          }
        }
      } else {
        if (
          !recurrenceRule.includes("COUNT") &&
          !recurrenceRule.includes("UNTIL")
        ) {
          this.setState({
            repeatOptionDropDown: `Every ${intervalSubString} years`,
          });
        } else if (recurrenceRule.includes("UNTIL")) {
          this.setState({
            repeatOptionDropDown: `Every ${intervalSubString} years, until ${untilSubString}`,
          });
        } else if (recurrenceRule.includes("COUNT")) {
          if (countSubString === "1") {
            this.setState({
              repeatOptionDropDown: `Once`,
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Every ${intervalSubString} years, ${countSubString} times`,
            });
          }
        }
      }
    }
  };

  /*
handleEventClick For Month View.
when a event on the calendar is clicked, the function below
will execute and save the clicked event varibles to this.state and
passed that into the form where the user can edit that data
*/
  handleEventClick = (i) => {
    // bind with an arrow function
    let A = this.state.originalEvents[i];
    console.log("A", A);
    if (A.recurringEventId) {
      axios
        .get("/getRecurringRules", {
          params: {
            recurringEventId: A.recurringEventId,
          },
        })
        .then((res) => {
          console.log(res.data, "getRecurringRules");
          this.setState(
            {
              recurrenceRule: res.data[0],
            },
            () => {
              this.repeatSummaryCompute();
            }
          );
        });
    }
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
        newEvent: A,
        newEventID: A.id,
        newEventRecurringID: A.recurringEventId,
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
        recurrenceRule: "",
        showDeleteRecurringModal: false,
        deleteRecurringOption: "This event",
        showEditRecurringModal: false,
        editRecurringOption: "",
      },
      () => {
        console.log("callback from handEventClick");
      }
    );
  };

  //Create event from clicking empty space from week view
  //Note arg is moment object of the time pressed
  handleDateClickOnWeekView = (arg) => {
    let newStart = arg.toDate();
    arg.add(1, "hour");
    let newEnd = arg.toDate();
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
    });
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
      recurrenceRule: "",
      showDeleteRecurringModal: false,
      deleteRecurringOption: "This event",
      showEditRecurringModal: false,
      editRecurringOption: "",
    });
  };

  /*
handleDateClick on Month View.
This will trigger when a date is clicked, it will present
the user with a new form to create a event
*/
  handleDateClick = (arg) => {
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
        recurrenceRule: "",
        showDeleteRecurringModal: false,
        deleteRecurringOption: "This event",
        showEditRecurringModal: false,
        editRecurringOption: "",
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

  handleExpandClick = (arg) => {
    let newDate = new Date(arg);
    console.log(newDate);
    this.setState(
      {
        dateContext: moment(newDate),
        calendarView: "Day",
      },
      this.updateEventsArray
    );
  };

  // handleSubmit:

  // submits the data to be passed up to be integrated into google calendar

  handleSubmit = (event) => {
    console.log("HandleSubmit: ", event);
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

  updateEventClick = (event) => {
    console.log("updateEventClick ");
    event.preventDefault();
    let eventList = this.state.originalEvents;

    if (this.state.calendarView === "Day") {
      eventList = this.state.dayEvents;
    } else if (this.state.calendarView === "Week") {
      eventList = this.state.weekEvents;
    }
    console.log("eventList: ", eventList);
    const isValid = this.validate();
    if (isValid) {
      if (this.state.newEventID === "") {
        return;
      } else {
        for (let i = 0; i < eventList.length; i++) {
          if (eventList[i].id === this.state.newEventID) {
            this.updateRequest(eventList, i);
          }
        }
      }
    }
  };

  /*
updateRequest:
updates the google calendar based  on
*/
  updateRequest = async (eventList, index) => {
    console.log("Enter updateRequest");

    const guests = this.state.newEventGuests;
    var formattedEmail = null;
    const emailList = guests.match(
      /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*(\.)?/g
    );
    if (emailList) {
      formattedEmail = emailList.map((guests) => {
        return {
          email: guests,
          responseStatus: "needsAction",
        };
      });
    }

    var minutesNotification = 30;
    if (this.state.newEventNotification) {
      minutesNotification = this.state.newEventNotification;
    }

    let updatedEvent = eventList[index];
    updatedEvent.summary = this.state.newEventName;
    updatedEvent.attendees = formattedEmail;
    updatedEvent.location = this.state.newEventLocation;
    updatedEvent.description = this.state.newEventDescription;
    console.log(" this.state.newEventStart0: ", this.state.newEventStart0);

    // format new start time
    let startDateTime = this.LocalDateToISOString(
      this.state.newEventStart0,
      this.state.currentUserTimeZone
    ).toISOString();
    console.log("startDateTime ISO:", startDateTime);

    // format new end time
    let endDateTime = this.LocalDateToISOString(
      this.state.newEventEnd0,
      this.state.currentUserTimeZone
    ).toISOString();
    //console.log(" this.state.newEventEnd0: ", this.state.newEventEnd0);

    updatedEvent.start = {
      dateTime: startDateTime,
      timeZone: this.state.currentUserTimeZone,
    };
    console.log("startDateTime: ", updatedEvent.start);
    updatedEvent.end = {
      dateTime: endDateTime,
      timeZone: this.state.currentUserTimeZone,
    };
    updatedEvent.recurrence = this.defineRecurrence();
    updatedEvent.reminders = {
      overrides: [
        {
          method: "popup",
          minutes: minutesNotification,
        },
      ],
      useDefault: false,
      sequence: 0,
    };

    console.log("updateEvent: ", updatedEvent);

    let event = {
      summary: updatedEvent.summary,
      attendees: updatedEvent.attendees,
      location: updatedEvent.location,
      description: updatedEvent.description,
      start: updatedEvent.start,
      end: updatedEvent.end,
      recurrence: this.state.repeatOption
      ? this.defineRecurrence()
      : false,
      reminders: updatedEvent.reminders,
    };
    console.log("event: ", event);
    let eventId = "";
    var firstEventCount = -1;
    var secondEventCount = -1;
    var clickedEventIndex = 0;
    var parentEvent = {};
    var isNeverEnds = false;
    eventId = this.state.newEventID;
    console.log(
      "this.state.editRecurringOption: ",
      this.state.editRecurringOption
    );

    if (this.state.editRecurringOption === "All events") {
      eventId = updatedEvent.recurringEventId;
      // event.recurrence = [event.recurrence];
      console.log("All event: ", eventId);
      await axios
        .get("/getRecurringEventInstances", {
          params: {
            recurringEventId: updatedEvent.recurringEventId,
          },
        })
        .then((res) => {
          console.log("/getRecurringEventInstances: ", res.data);
          parentEvent = res.data[0];

          // setting new start & end time in ISO time String
          let startHour = this.state.newEventStart0.getHours();
          let startMin = this.state.newEventStart0.getMinutes();
          let endHour = this.state.newEventEnd0.getHours();
          let endMin = this.state.newEventEnd0.getMinutes();
          let newStartTime = new Date(parentEvent.start["dateTime"]).setHours(
            startHour
          );
          newStartTime = new Date(newStartTime).setMinutes(startMin);
          let newEndTime = new Date(parentEvent.end["dateTime"]).setHours(
            endHour
          );
          newEndTime = new Date(newEndTime).setMinutes(endMin);
          const newISOStartTime = new Date(newStartTime).toISOString();
          const newISOEndTime = new Date(newEndTime).toISOString();
          // assign new start and end time to event
          event.start = {
            dateTime: newISOStartTime,
            timeZone: parentEvent.start["timeZone"],
          };
          event.end = {
            dateTime: newISOEndTime,
            timeZone: parentEvent.end["timeZone"],
          };
        });
    } else if (this.state.editRecurringOption === "This event") {
      eventId = this.state.newEventID;
      console.log("This event/ID: ", eventId);

      event.recurrence = null;
    } else if (this.state.editRecurringOption === "This and following events") {
      eventId = updatedEvent.recurringEventId;
      await axios
        .get("/getRecurringEventInstances", {
          params: {
            recurringEventId: updatedEvent.recurringEventId,
          },
        })
        .then((res) => {
          console.log("/getRecurringEventInstances: ", res.data);
          parentEvent = res.data[0];

          event.summary = parentEvent.summary;

          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].id === this.state.newEventID) {
              clickedEventIndex = i;
              break;
            }
          }

          let newISOStartTime = new Date(
            parentEvent.start["dateTime"]
          ).toISOString();

          let newISOEndTime = new Date(
            parentEvent.end["dateTime"]
          ).toISOString();

          event.start = {
            dateTime: newISOStartTime,
            timeZone: parentEvent.start["timeZone"],
          };
          event.end = {
            dateTime: newISOEndTime,
            timeZone: parentEvent.end["timeZone"],
          };

          firstEventCount = clickedEventIndex;
          secondEventCount = res.data.length - clickedEventIndex;
          console.log("firstEventCount: ", firstEventCount);
          console.log("secondEventCount: ", secondEventCount);
        });

      let newEvent = {
        reminders: this.state.newEvent.reminders,
        creator: this.state.newEvent.creator,
        created: this.state.newEvent.created,
        organizer: this.state.newEvent.organizer,
        sequence: this.state.newEvent.sequence,
        status: this.state.newEvent.status,
      };

      //generate new recurrence rule
      let newRecurrenceRule = this.state.recurrenceRule;
      // console.log("newRecurrenceRule", newRecurrenceRule);

      let currentDateString = `${moment(this.state.newEventStart0).format(
        "YYYYMMDD"
      )}`;
      console.log("currentDateString", currentDateString);

      //find countSubString if the recurrece rule is COUNT
      let countSubString = "";
      let countIndex = this.state.recurrenceRule.indexOf("COUNT");
      if (countIndex !== -1) {
        countSubString = this.state.recurrenceRule.substring(countIndex);
        // console.log("countSubString 1:", countSubString);
      }
      if (countSubString.includes(";")) {
        let endCountIndex = countSubString.indexOf(";");
        countSubString = countSubString.substring(6, endCountIndex);
        // console.log("countSubString 2:", countSubString);
      } else if (countSubString) {
        countSubString = countSubString.substring(6);
        // console.log("countSubString 3", countSubString);
      }

      // //find untilSubString if the recurrece rule is UNTIL
      if (newRecurrenceRule.includes("UNTIL")) {
        let untilSubString = "";
        let untilIndex = this.state.recurrenceRule.indexOf("UNTIL");
        if (untilIndex !== -1) {
          untilSubString = this.state.recurrenceRule.substring(untilIndex);
        }
        if (untilSubString.includes(";")) {
          let endUntilIndex = untilSubString.indexOf(";");
          untilSubString = untilSubString.substring(6, endUntilIndex);
        } else if (untilSubString) {
          untilSubString = untilSubString = untilSubString.substring(6);
        }
        console.log("UNTIL, newRecyrrenceRule: ", newRecurrenceRule);
        // replace by the new calculated currentDateString
        event.recurrence = newRecurrenceRule.replace(
          untilSubString,
          currentDateString
        );
        console.log("currentDateString: ", currentDateString);
        console.log("newRecurrenceRule: ", newRecurrenceRule);
      } else if (newRecurrenceRule.includes("COUNT")) {
        event.recurrence = newRecurrenceRule.replace(
          `COUNT=${countSubString}`,
          `COUNT=${firstEventCount}`
        );
        newRecurrenceRule = newRecurrenceRule.replace(
          `COUNT=${countSubString}`,
          `COUNT=${secondEventCount}`
        );

        console.log("event.recurrence changed", event.recurrence);
      } else {
        // recurrence rule === never ends
        newRecurrenceRule = newRecurrenceRule.concat(
          `;UNTIL=${currentDateString}`
        );
        console.log("entered the useless else statement");
        console.log("newRecurrenceRule: ", newRecurrenceRule);
        isNeverEnds = true;
      }

      newEvent.summary = this.state.newEventName;
      newEvent.start = updatedEvent.start;
      newEvent.end = updatedEvent.end;

      console.log("Before isNeverEnds calls: event:  ", event);
      console.log("Before isNeverEnds calls: newEvent:  ", newEvent);
      if (isNeverEnds) {
        newEvent.recurrence = [event.recurrence];
        event.recurrence = [newRecurrenceRule];
      } else {
        event.recurrence = [event.recurrence];
        newEvent.recurrence = [newRecurrenceRule];
      }

      console.log("Before axios calls: event:  ", event);
      console.log("Before axios calls: newEvent:  ", newEvent);

      if (secondEventCount !== 0) {
        console.log("Before createEvent/newEvent: ", newEvent);
        this.axiosCreateEvent(newEvent, this.state.currentUserId);
      }
    }

    if (firstEventCount === 0) {
      console.log("Before deleteEvent/eventId: ", eventId);
      this.axiosDeleteEvent(eventId, this.state.currentUserId);
    } else {
      console.log("Before updateEvent: ");
      console.log("event: ", event);
      console.log("eventId: ", eventId);
      this.axiosUpdateEvent(event, eventId, this.state.currentUserId);
    }
  };

  axiosDeleteEvent = (eventId, userId) => {
    axios
      .post("/deleteEvent", {
        //username: this.state.currentUserName,
        userId: userId,
        eventId: eventId,
      })
      .then((response) => {
        console.log("deleted event with eventId: ", eventId);
        this.setState({
          dayEventSelected: false,
          showDeleteRecurringModal: false,
        });
        this.updateEventsArray();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  axiosUpdateEvent = (event, eventId, userId) => {
    axios
      .put("/updateEvent", {
        extra: event,
        eventId: eventId,
        username: userId,
        id: this.state.currentUserId,
      })
      .then((response) => {
        console.log("/updateEvent, response: ", response);
        this.setState({
          dayEventSelected: false,
          newEventName: "",
          newEventStart0: new Date(
            new Date().toLocaleString("en-US", {
              timeZone: this.state.currentUserTimeZone,
            })
          ),
          newEventEnd0: new Date(
            new Date().toLocaleString("en-US", {
              timeZone: this.state.currentUserTimeZone,
            })
          ),
        });

        this.updateEventsArray();
      })

      .catch(function (error) {
        console.log(error);
      });
  };

  axiosCreateEvent = (event, userId) => {
    axios
      .post("/createNewEvent", {
        newEvent: event,
        //username: this.state.currentUserName,
        id: userId,
      })
      .then((res) => {
        console.log("createnewevent", res.data);
        this.setState({
          dayEventSelected: false,
        });
        this.updateEventsArray();
      })
      .catch(function (error) {
        console.log("/createNewEvent error", error);
      });
  };

  defineRecurrence = () => {
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
    return recurrence;
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
        //username: this.state.currentUserName,
        userId: this.state.currentUserId,
        eventId: this.state.newEventID,
      })
      .then((response) => {
        this.setState({
          dayEventSelected: false,
          showDeleteRecurringModal: false,
        });
        this.updateEventsArray();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  LocalDateToISOString = (date, timeZone) => {
    let a = date.getTime();
    let b = new Date(
      date.toLocaleString("en-US", { timeZone: this.state.currentUserTimeZone })
    ).getTime();
    return new Date(a - (b - a));
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
  createEvent = (newTitle) => {
    const guests = this.state.newEventGuests;
    var formattedEmail = null;
    const emailList = guests.match(
      /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*(\.)?/g
    );
    if (emailList) {
      formattedEmail = emailList.map((guests) => {
        return {
          email: guests,
          responseStatus: "needsAction",
        };
      });
    }

    var minutesNotification = 30;
    if (this.state.newEventNotification) {
      minutesNotification = this.state.newEventNotification;
    }

    let startDateTime = this.LocalDateToISOString(
      this.state.newEventStart0,
      this.state.currentUserTimeZone
    ).toISOString();
    let endDateTime = this.LocalDateToISOString(
      this.state.newEventEnd0,
      this.state.currentUserTimeZone
    ).toISOString();

    console.log(startDateTime);
    console.log(endDateTime);
    console.log(
      "Events are created in timezone: " + this.state.currentUserTimeZone
    );

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
            minutes: minutesNotification,
          },
        ],
      },
      start: {
        dateTime: startDateTime,
        timeZone: this.state.currentUserTimeZone,
      },
      end: {
        dateTime: endDateTime,
        timeZone: this.state.currentUserTimeZone,
      },
      recurrence: this.state.repeatOption && this.defineRecurrence(),
      attendees: formattedEmail,
    };
    console.log("create Event, event: ", event);
    axios
      .post("/createNewEvent", {
        newEvent: event,
        reminderTime: minutesNotification,
        title: newTitle,
        start: startDateTime,
        end: endDateTime,
        username: this.state.currentUserName,
        id: this.state.currentUserId,
      })
      .then((response) => {
        console.log("createnewevent", response);
        this.setState({
          dayEventSelected: false,
        });
        this.updateEventsArray();
      })
      .catch(function (error) {
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

  TALogOut = () => {
    axios
      .get("./TALogOut")
      .then((response) => {
        this.setState(
          {
            loggedIn: false,
          },
          console.log(response)
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  nextMonth = () => {
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).add(1, "month");
    this.setState(
      {
        dateContext: dateContext,
        originalEvents: [],
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
        originalEvents: [],
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
        dayEvents: [],
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
        dayEvents: [],
      },
      this.updateEventsArray
    );
  };

  nextWeek = () => {
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).add(1, "week");
    this.setState(
      {
        dateContext: dateContext,
        dayEvents: [],
      },
      this.updateEventsArray
    );
  };

  prevWeek = () => {
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).subtract(1, "week");
    this.setState(
      {
        dateContext: dateContext,
        dayEvents: [],
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
      this.getEventsByInterval(
        this.LocalDateToISOString(startDate, this.state.currentUserTimeZone),
        this.LocalDateToISOString(endDate, this.state.currentUserTimeZone)
      );
    } else if (this.state.calendarView === "Day") {
      let startObject = this.state.dateContext.clone();
      let endObject = this.state.dateContext.clone();
      let startDay = startObject.startOf("day");
      let endDay = endObject.endOf("day");
      let startDate = new Date(startDay.format("MM/DD/YYYY"));
      let endDate = new Date(endDay.format("MM/DD/YYYY"));
      startDate.setHours(0, 0, 0);
      endDate.setHours(23, 59, 59);
      this.getEventsByIntervalDayVersion(
        this.LocalDateToISOString(startDate, this.state.currentUserTimeZone),
        this.LocalDateToISOString(endDate, this.state.currentUserTimeZone)
      );
    } else if (this.state.calendarView === "Week") {
      let startObject = this.state.dateContext.clone();
      let endObject = this.state.dateContext.clone();
      let startDay = startObject.startOf("week");
      let endDay = endObject.endOf("week");
      let startDate = new Date(startDay.format("MM/DD/YYYY"));
      let endDate = new Date(endDay.format("MM/DD/YYYY"));
      startDate.setHours(0, 0, 0);
      endDate.setHours(23, 59, 59);
      this.getEventsByIntervalWeekVersion(
        this.LocalDateToISOString(startDate, this.state.currentUserTimeZone),
        this.LocalDateToISOString(endDate, this.state.currentUserTimeZone)
      );
    }
  };

  /*
openRepeatModal:
this will open repeat modal.
*/
  openRepeatModal = () => {
    this.setState((prevState) => {
      return { showRepeatModal: !prevState.showRepeatModal };
    });
  };

  /*
closeRepeatModal:
this will close repeat modal.
*/
  closeRepeatModal = () => {
    this.setState((prevState) => ({
      showRepeatModal: false,
      repeatInputValue_temp: prevState.repeatInputValue,
      repeatOccurrence_temp: prevState.repeatOccurrence,
      repeatDropDown_temp: prevState.repeatDropDown,
      repeatRadio_temp: prevState.repeatRadio,
      repeatEndDate_temp: prevState.repeatEndDate,
      byDay_temp: prevState.byDay,
    }));
    if (
      !this.state.repeatOption &&
      this.state.repeatOptionDropDown === "Custom..."
    ) {
      this.setState({
        repeatOptionDropDown: "Does not repeat",
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
      byDay_temp,
    } = this.state;

    this.setState((prevState) => ({
      showRepeatModal: false,
      repeatOption: true,
      repeatInputValue: prevState.repeatInputValue_temp,
      repeatOccurrence: prevState.repeatOccurrence_temp,
      repeatDropDown: prevState.repeatDropDown_temp,
      repeatRadio: prevState.repeatRadio_temp,
      repeatEndDate: prevState.repeatEndDate_temp,
      byDay: prevState.byDay_temp,
    }));

    // If repeatDropDown_temp is DAY
    if (repeatDropDown_temp === "DAY") {
      if (repeatInputValue_temp === "1") {
        if (repeatRadio_temp === "Never") {
          this.setState({
            repeatOptionDropDown: "Daily",
          });
        } else if (repeatRadio_temp === "On") {
          this.setState({
            repeatOptionDropDown: `Daily, until ${moment(
              repeatEndDate_temp
            ).format("LL")}`,
          });
        } else {
          if (repeatOccurrence_temp === "1") {
            this.setState({
              repeatOptionDropDown: `Once`,
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Daily, ${repeatOccurrence_temp} times`,
            });
          }
        }
      } else {
        if (repeatRadio_temp === "Never") {
          this.setState({
            repeatOptionDropDown: `Every ${repeatInputValue_temp} days`,
          });
        } else if (repeatRadio_temp === "On") {
          this.setState({
            repeatOptionDropDown: `Every ${repeatInputValue_temp} days, until ${moment(
              repeatEndDate_temp
            ).format("LL")}`,
          });
        } else {
          if (repeatOccurrence_temp === "1") {
            this.setState({
              repeatOptionDropDown: `Once`,
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Every ${repeatInputValue_temp} days, ${repeatOccurrence_temp} times`,
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
      console.log(selectedDays, "selectedDays week");
      if (repeatInputValue_temp === "1") {
        if (repeatRadio_temp === "Never") {
          if (selectedDays.length === 7) {
            this.setState({
              repeatOptionDropDown: "Weekly on all days",
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Weekly on ${selectedDays.join(", ")}`,
            });
          }
        } else if (repeatRadio_temp === "On") {
          if (selectedDays.length === 7) {
            this.setState({
              repeatOptionDropDown: `Weekly on all days, until ${moment(
                repeatEndDate_temp
              ).format("LL")}`,
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Weekly on ${selectedDays.join(
                ", "
              )}, until ${moment(repeatEndDate_temp).format("LL")}`,
            });
          }
        } else {
          if (repeatOccurrence_temp === "1") {
            this.setState({
              repeatOptionDropDown: `Once`,
            });
          } else {
            if (selectedDays.length === 7) {
              this.setState({
                repeatOptionDropDown: `Weekly on all days, , ${repeatOccurrence_temp} times`,
              });
            } else {
              this.setState({
                repeatOptionDropDown: `Weekly on ${selectedDays.join(
                  ", "
                )}, ${repeatOccurrence_temp} times`,
              });
            }
          }
        }
      } else {
        if (repeatRadio_temp === "Never") {
          if (selectedDays.length === 7) {
            this.setState({
              repeatOptionDropDown: `Every ${repeatInputValue_temp} weeks on all days`,
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Every ${repeatInputValue_temp} weeks on ${selectedDays.join(
                ", "
              )}`,
            });
          }
        } else if (repeatRadio_temp === "On") {
          if (selectedDays.length === 7) {
            this.setState({
              repeatOptionDropDown: `Every ${repeatInputValue_temp} weeks on all days, until ${moment(
                repeatEndDate_temp
              ).format("LL")}`,
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Every ${repeatInputValue_temp} weeks on ${selectedDays.join(
                ", "
              )}, until ${moment(repeatEndDate_temp).format("LL")}`,
            });
          }
        } else {
          if (repeatOccurrence_temp === "1") {
            this.setState({
              repeatOptionDropDown: "Once",
            });
          } else {
            if (selectedDays.length === 7) {
              this.setState({
                repeatOptionDropDown: `Every ${repeatInputValue_temp} weeks on all days, ${repeatOccurrence_temp} times`,
              });
            } else {
              this.setState({
                repeatOptionDropDown: `Every ${repeatInputValue_temp} weeks on ${selectedDays.join(
                  ", "
                )}, ${repeatOccurrence_temp} times`,
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
            repeatOptionDropDown: "Monthly",
          });
        } else if (repeatRadio_temp === "On") {
          this.setState({
            repeatOptionDropDown: `Monthly, until ${moment(
              repeatEndDate_temp
            ).format("LL")}`,
          });
        } else {
          if (repeatOccurrence_temp === "1") {
            this.setState({
              repeatOptionDropDown: `Once`,
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Monthly, ${repeatOccurrence_temp} times`,
            });
          }
        }
      } else {
        if (repeatRadio_temp === "Never") {
          this.setState({
            repeatOptionDropDown: `Every ${repeatInputValue_temp} months`,
          });
        } else if (repeatRadio_temp === "On") {
          this.setState({
            repeatOptionDropDown: `Every ${repeatInputValue_temp} months, until ${moment(
              repeatEndDate_temp
            ).format("LL")}`,
          });
        } else {
          if (repeatOccurrence_temp === "1") {
            this.setState({
              repeatOptionDropDown: `Once`,
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Every ${repeatInputValue_temp} months, ${repeatOccurrence_temp} times`,
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
            repeatOptionDropDown: "Annually",
          });
        } else if (repeatRadio_temp === "On") {
          this.setState({
            repeatOptionDropDown: `Annually, until ${moment(
              repeatEndDate_temp
            ).format("LL")}`,
          });
        } else {
          if (repeatOccurrence_temp === "1") {
            this.setState({
              repeatOptionDropDown: `Once`,
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Annually, ${repeatOccurrence_temp} times`,
            });
          }
        }
      } else {
        if (repeatRadio_temp === "Never") {
          this.setState({
            repeatOptionDropDown: `Every ${repeatInputValue_temp} years`,
          });
        } else if (repeatRadio_temp === "On") {
          this.setState({
            repeatOptionDropDown: `Every ${repeatInputValue_temp} years, until ${moment(
              repeatEndDate_temp
            ).format("LL")}`,
          });
        } else {
          if (repeatOccurrence_temp === "1") {
            this.setState({
              repeatOptionDropDown: `Once`,
            });
          } else {
            this.setState({
              repeatOptionDropDown: `Every ${repeatInputValue_temp} years, ${repeatOccurrence_temp} times`,
            });
          }
        }
      }
    }
  };

  hideNewAccountForm = () => {
    this.setState({
      showNewAccountmodal: false,
    });
  };

  theNewUserAdded = () => {
    this.setState(
      {
        showNewAccountmodal: false,
      },
      () => {
        this.updateProfileFromFirebase();
      }
    );
  };

  hideAboutForm = (e) => {
    this.setState({
      showAboutModal: false,
    });
  };

  updatePic = (name, url) => {
    // this.updateProfileFromFirebase();
    let index = null;
    Object.keys(this.state.userIdAndNames).map((keyName, keyIndex) => {
      if (keyName === this.state.currentUserId) {
        index = keyIndex;
      }
    });
    // console.log("thissi the index ",index);
    if (index !== null) {
      this.state.userPicsArray[index] = url;
    }

    this.state.userIdAndNames[this.state.currentUserId] = name;
    this.setState({
      currentUserPicUrl: url,
      currentUserName: name,
    });
  };

  updateTimeZone = (timeZone) => {
    this.setState({
      currentUserTimeZone: timeZone,
    });
  };

  changeUser = (id, index, name, timezone) => {
    this.setState(
      {
        currentUserPicUrl: this.state.userPicsArray[index],
        currentUserName: name,
        currentUserTimeZone: timezone,
        currentUserId: id,
        showAboutModal: false,
      },
      () => {
        this.grabFireBaseRoutinesGoalsData();
        this.updateEventsArray();
      }
    );
  };

  changeCurrentTACandidate = (advisorId, userId, data) => {
    this.setState({
      currentAdvisorCandidateName: data["first_name"] + data["last_name"],
      currentAdvisorCandidateId: advisorId,
    });
  };

  giveAcessToTA = () => {
    console.log(this.state.currentAdvisorCandidateId);
    console.log(this.state.currentUserId);
    const db = firebase.firestore();

    db.collection("users")
      .doc(this.state.currentUserId)
      .get()
      .then((doc) => {
        db.collection("trusted_advisor")
          .doc(this.state.currentAdvisorCandidateId)
          .get()
          .then((snapshot) => {
            let found = false;
            snapshot.data().users.forEach((user) => {
              if (user.id == this.state.currentUserId) {
                found = true;
              }
            });
            if (!found) {
              db.collection("trusted_advisor")
                .doc(this.state.currentAdvisorCandidateId)
                .update({
                  users: firebase.firestore.FieldValue.arrayUnion({
                    Relationship: "advisor",
                    User: doc.ref,
                  }),
                })
                .then(() => {
                  alert("Succeed");
                });
            } else {
              console.log("The trusted advisor already has access to the user");
            }
          });
      });
  };

  showDayViewOrAboutView = () => {
    if (this.state.dayEventSelected) {
      return this.eventFormAbstracted();
    } else if (this.state.showAboutModal) {
      return (
        //  style={(onlyCal || (this.state.currentUserId === "")) ? { marginLeft: "22%" } : { marginLeft: "35px" }}
        this.state.currentUserId === "" ? (
          <div></div>
        ) : (
          <AboutModal
            CameBackFalse={this.hideAboutForm}
            updateProfilePic={this.updatePic}
            updateProfileTimeZone={this.updateTimeZone}
            // {console.log("this is the id is it undefined at first", )}
            theCurrentUserId={this.state.currentUserId}
          />
        )
      );
    }
  };

  showCalendarView = () => {
    if (this.state.calendarView === "Month") return this.calendarAbstracted();
    else if (this.state.calendarView === "Day") return this.dayViewAbstracted();
    else if (this.state.calendarView === "Week")
      return this.weekViewAbstracted();
  };

  updateFBGR = () => {
    this.grabFireBaseRoutinesGoalsData();
  };

  render() {
    if (this.state.loaded && !this.state.loggedIn) {
      return <Redirect to="/" />;
    } else {
      //The variable below will help decide whether to center the Calendar object or not
      var onlyCal =
        !this.state.showRoutineGoalModal &&
        !this.state.showGoalModal &&
        !this.state.showRoutineModal;
      return (
        //width and height is fixed now but should be by % percentage later on
        <div
          className="normalfancytext"
          style={{
            marginLeft: "0px",
            height: "100%",
            width: "2000px",
            // width: "100%",
            // display: "flex",
            // flexDirection: "column",
            // justifyContent: "center",
            // alignItems: "center",
            // background: "lightblue",
          }}
        >
          <Button
            style={{ float: "right", marginTop: "30px", marginRight: "12%" }}
            onClick={this.TALogOut}
          >
            Log out
          </Button>
          <div
            style={{
              margin: "0",
              padding: "0",
              width: "100%",
            }}
          >
            <Row>
              <Col xs={3}>
                <Row style={{ margin: "0" }} className="d-flex flex-row">
                  <div
                    style={{
                      float: "right",
                      width: "80px",
                      height: "70px",
                      marginLeft: "50px",
                      marginTop: "5px",
                    }}
                  >
                    {this.state.currentUserPicUrl === "" ? (
                      <FontAwesomeIcon
                        icon={faImage}
                        size="5x"
                        style={{ marginLeft: "10px" }}
                      />
                    ) : (
                      <img
                        style={{
                          display: "block",

                          // marginLeft: "auto",
                          // marginRight: "auto",
                          width: "100%",
                          height: "70px",
                        }}
                        src={this.state.currentUserPicUrl}
                        alt="Profile"
                      />
                    )}
                  </div>
                  <Col>
                    {this.state.enableNameDropDown === false ? (
                      <DropdownButton
                        style={{ display: "inline-block" }}
                        title=""
                        disabled
                      ></DropdownButton>
                    ) : (
                      // {console.log("this is what suupose to be",this.state.userNamesAndPics[Object.keys(this.state.userNamesAndPics)[0]])}
                      <DropdownButton
                        // class = "dropdown-toggle.btn.btn-secondary"
                        variant="outline-primary"
                        // title={this.state.userNamesAndPics[Object.keys(this.state.userNamesAndPics)[0]] || ''}
                        title={this.state.currentUserName || ""}
                        style={{ marginTop: "20px", marginLeft: "10px" }}
                      >
                        {Object.keys(this.state.userIdAndNames).map(
                          (keyName, keyIndex) => (
                            // use keyName to get current key's name
                            // and a[keyName] to get its value
                            //keyName is the user id
                            //keyIndex will help me find the user pic
                            //this.state.userIdAndName[keyName] gives me the name of current user
                            <Dropdown.Item
                              key={keyName}
                              onClick={(e) => {
                                console.log(
                                  this.state.userTimeZone,
                                  keyName,
                                  this.state.userTimeZone[keyName]
                                );
                                this.changeUser(
                                  keyName,
                                  keyIndex,
                                  this.state.userIdAndNames[keyName],
                                  this.state.userTimeZone[keyName]
                                );
                              }}
                            >
                              {this.state.userIdAndNames[keyName] || ""}
                            </Dropdown.Item>
                          )
                        )}
                      </DropdownButton>
                    )}
                  </Col>
                </Row>
                <Row style={{ marginLeft: "50px" }} className="d-flex flex-row">
                  <Button
                    style={{ marginTop: "10px" }}
                    onClick={(e) => {
                      //   this.setState({ showNewAccountmodal: true });
                      // }
                      this.googleLogIn();
                    }}
                  >
                    Create New User
                  </Button>
                  {/* <Col>
          {this.state.showNewAccountmodal && <CreateNewAccountModal closeModal = {this.hideNewAccountForm}/>}
          </Col> */}
                </Row>
                <Row style={{ marginLeft: "50px" }} className="d-flex flex-row">
                  {this.state.showAllowTAmodel === false ? (
                    <Button
                      style={{ marginTop: "10px" }}
                      onClick={(e) => {
                        this.setState({ showAllowTAmodel: true });
                      }}
                    >
                      Give another advisor access
                    </Button>
                  ) : (
                    <Button
                      style={{ marginTop: "10px" }}
                      onClick={(e) => {
                        this.setState({ showAllowTAmodel: false });
                      }}
                    >
                      Hide
                    </Button>
                  )}
                </Row>
                {this.state.showAllowTAmodel === true ? (
                  <Row
                    style={{ marginLeft: "50px" }}
                    className="d-flex flex-row"
                  >
                    <DropdownButton
                      variant="outline-primary"
                      style={{ marginTop: "10px" }}
                      title={
                        this.state.currentAdvisorCandidateName ||
                        "Choose the advisor"
                      }
                    >
                      {Object.keys(this.state.advisorIdAndNames).map(
                        (keyName, keyIndex) => (
                          <Dropdown.Item
                            key={keyName}
                            onClick={(e) => {
                              this.changeCurrentTACandidate(
                                keyName,
                                this.state.currentUserId,
                                this.state.advisorIdAndNames[keyName]
                              );
                            }}
                          >
                            {this.state.advisorIdAndNames[keyName][
                              "first_name"
                            ] +
                              " " +
                              this.state.advisorIdAndNames[keyName][
                                "last_name"
                              ] || ""}
                          </Dropdown.Item>
                        )
                      )}
                    </DropdownButton>
                    <Button
                      style={{ marginTop: "10px", marginLeft: "10px" }}
                      onClick={(e) => {
                        this.giveAcessToTA();
                      }}
                    >
                      Confirm
                    </Button>
                  </Row>
                ) : (
                  ""
                )}
              </Col>
              {/* <Col xs={8} style={{ paddingLeft: "0px" }}>
            {this.state.showNewAccountmodal && (
            <CreateNewAccountModal closeModal={this.hideNewAccountForm} />
          )}
          </Col>
          </Row> */}
              {/* </Col> */}
              <Col xs={8} style={{ paddingLeft: "0px" }}>
                {this.state.showNewAccountmodal && (
                  <CreateNewAccountModal
                    closeModal={this.hideNewAccountForm}
                    newUserAdded={this.theNewUserAdded}
                    userNamesAndId={this.state.userIdAndNames}
                    email={this.state.newAccountEmail}
                    loggedInEmail={this.state.loggedIn}
                  />
                )}
              </Col>
            </Row>
          </div>

          <div
            style={{
              margin: "0",
              padding: "0",
              width: "100%",
            }}
          >
            {this.abstractedMainEventGRShowButtons()}
          </div>
          <Container
            fluid
            style={{
              marginTop: "15px",
              marginLeft: "0",
              // display: "flex",
              // flexDirection: "column",
              // justifyContent: "center",
              // alignItems: "center",
              // width: "100%"
            }}
          >
            <Row
              style={{
                marginTop: "0",
                // width: "100%",
                // display: "flex",
                // flexDirection: "column",
                // justifyContent: "center"
                // alignItems: "center"
              }}
            >
              {/* {this.grabFireBaseRoutinesGoalsData()} */}
              {/* the modal for routine/goal is called Firebasev2 currently */}
              {this.state.currentUserId != "" && (
                <Firebasev2
                  theCurrentUserID={this.state.currentUserId}
                  grabFireBaseRoutinesGoalsData={
                    this.grabFireBaseRoutinesGoalsData
                  }
                  originalGoalsAndRoutineArr={
                    this.state.originalGoalsAndRoutineArr
                  }
                  goals={this.state.goals}
                  routines={this.state.routines}
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
                  todayDateObject={this.state.todayDateObject}
                  calendarView={this.state.calendarView}
                  dateContext={this.state.dateContext}
                  updateFBGR={this.updateFBGR}
                />
              )}
              <Col
                sm="auto"
                md="auto"
                lg="auto"
                // style={onlyCal ? { marginLeft: "20%" } : { marginLeft: "35px" }}
                style={
                  onlyCal || this.state.currentUserId === ""
                    ? { marginLeft: "22%" }
                    : { marginLeft: "35px" }
                }
              >
                {this.showCalendarView()}
                <div>V1.47.{this.state.versionNumber}</div>
                <div
                  style={{ marginTop: "50px", textAlign: "center" }}
                  className="fancytext"
                ></div>
              </Col>
              {/* <Col style={{ marginLeft: "25px" }}> */}
              <Col>{this.showDayViewOrAboutView()}</Col>
            </Row>
          </Container>
        </div>
      );
    }
  }

  getVersionNumber = () => {
    axios.get("/buildNumber", {}).then((response) => {
      this.setState({
        versionNumber: response.data,
      });
    });
  };

  googleLogIn = () => {
    axios
      .get("/auth-url")
      .then((response) => {
        console.log(response);
        window.location.href = response.data;
      })
      .catch((error) => {
        console.log("Error Occurred " + error);
      });
  };

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
            "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        <Container>
          <Row style={{ marginTop: "0px" }}>
            <Col>
              <div>
                <FontAwesomeIcon
                  style={{ marginLeft: "100px" }}
                  icon={faChevronLeft}
                  size="2x"
                  className="X"
                  onClick={(e) => {
                    this.prevDay();
                  }}
                />
              </div>
            </Col>
            <Col
              md="auto"
              style={{ textAlign: "center" }}
              className="bigfancytext"
            >
              <p>
                {this.state.dateContext.format("dddd")} {this.getDay()}{" "}
                {this.getMonth()} {this.getYear()}{" "}
              </p>
              <p
                style={{ marginBottom: "0", height: "19.5px" }}
                className="normalfancytext"
              >
                {this.state.currentUserTimeZone}
              </p>
            </Col>
            <Col>
              <FontAwesomeIcon
                // style={{ marginLeft: "50%" }}
                style={{ float: "right", marginRight: "100px" }}
                icon={faChevronRight}
                size="2x"
                className="X"
                onClick={(e) => {
                  this.nextDay();
                }}
              />
            </Col>
          </Row>
        </Container>
        <Row>
          {/* {console.log("these are the events that are going to be passed in", this.state.dayEvents)} */}
          <DayEvents
            dateContext={this.state.dateContext}
            eventClickDayView={this.handleDayEventClick}
            handleDateClick={this.handleDateClickOnDayView}
            dayEvents={this.state.dayEvents}
            getEventsByInterval={this.getEventsByIntervalDayVersion}
            timeZone={this.state.currentUserTimeZone}
          />
          <DayRoutines
            timeZone={this.state.currentUserTimeZone}
            dateContext={this.state.dateContext}
            routine_ids={this.state.routine_ids}
            routines={this.state.routines}
            dayRoutineClick={this.toggleShowRoutine}
            theCurrentUserId={this.state.currentUserId}
            originalGoalsAndRoutineArr={this.state.originalGoalsAndRoutineArr}
          />

          <DayGoals
            TimeZone={this.state.currentUserTimeZone}
            dateContext={this.state.dateContext}
            goal_ids={this.state.goal_ids}
            goals={this.state.goals}
            dayGoalClick={this.toggleShowGoal}
            theCurrentUserId={this.state.currentUserId}
            originalGoalsAndRoutineArr={this.state.originalGoalsAndRoutineArr}
          />
        </Row>
      </div>
    );
  };

  weekViewAbstracted = () => {
    let startObject = this.state.dateContext.clone();
    let startWeek = startObject.startOf("week");
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
            "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        <Container>
          <Container>
            <Row style={{ marginTop: "0px" }}>
              <Col>
                <div>
                  <FontAwesomeIcon
                    // style={{ marginLeft: "50%" }}
                    style={{ marginLeft: "100px" }}
                    icon={faChevronLeft}
                    size="2x"
                    className="X"
                    onClick={(e) => {
                      this.prevWeek();
                    }}
                  />
                </div>
              </Col>
              <Col
                md="auto"
                style={{ textAlign: "center" }}
                className="bigfancytext"
              >
                <p> Week of {startWeek.format("D MMMM YYYY")} </p>
                <p
                  style={{ marginBottom: "0", height: "19.5px" }}
                  className="normalfancytext"
                >
                  {this.state.currentUserTimeZone}
                </p>
              </Col>
              <Col>
                <FontAwesomeIcon
                  // style={{ marginLeft: "50%" }}
                  style={{ float: "right", marginRight: "100px" }}
                  icon={faChevronRight}
                  size="2x"
                  className="X"
                  onClick={(e) => {
                    this.nextWeek();
                  }}
                />
              </Col>
            </Row>
          </Container>
          <Row>
            <WeekEvents
              weekEvents={this.state.weekEvents}
              dateContext={this.state.dateContext}
              eventClick={this.handleWeekEventClick}
              onDayClick={this.handleDateClickOnWeekView}
              timeZone={this.state.currentUserTimeZone}
            />
          </Row>
          <Row>
            <WeekGoals
              timeZone={this.state.currentUserTimeZone}
              dateContext={this.state.dateContext}
              goals={this.state.goals}
            />
          </Row>
          <Row>
            <WeekRoutines
              timeZone={this.state.currentUserTimeZone}
              routines={this.state.routines}
              dateContext={this.state.dateContext}
            />
          </Row>
        </Container>
      </div>
    );
  };

  toggleShowRoutine = () => {
    this.setState({
      showRoutineModal: !this.state.showRoutineModal,
      showGoalModal: false,
      showRoutineGoalModal: false,
    });
  };

  toggleShowGoal = () => {
    this.setState({
      showGoalModal: !this.state.showGoalModal,
      showRoutineModal: false,
      showRoutineGoalModal: false,
    });
  };

  showEventsFormbyCreateNewEventButton = () => {
    var newStart, newEnd;
    if (this.state.calendarView === "Month") {
      newStart = new Date();
      newStart.setHours(0, 0, 0, 0);
      // newStart = new Date(this.LocalDateToISOString(newStart, this.state.currentUserTimeZone));
      newEnd = new Date();
      newEnd.setHours(23, 59, 59, 59);
      // newEnd = new Date(this.LocalDateToISOString(newEnd, this.state.currentUserTimeZone));
    } else if (this.state.calendarView === "Day") {
      newStart = new Date(this.state.dateContext.toDate());
      newStart.setHours(0, 0, 0, 0);
      // newStart = new Date(this.LocalDateToISOString(newStart, this.state.currentUserTimeZone));
      newEnd = new Date(this.state.dateContext.toDate());
      newEnd.setHours(23, 59, 59, 59);
      // newEnd = new Date(this.LocalDateToISOString(newEnd, this.state.currentUserTimeZone));
    }

    this.setState({
      newEventID: "",
      newEventStart0: newStart,
      newEventEnd0: newEnd,
      newEventName: "",
      newEventGuests: "",
      newEventLocation: "",
      newEventDescription: "",
      dayEventSelected: true,
      isEvent: false,
    });
  };

  changeCalendarView = (view) => {
    this.setState(
      {
        calendarView: view,
      },
      this.updateEventsArray
    );
  };

  abstractedMainEventGRShowButtons = () => {
    // Redefine the width of those buttons; Should fix to be 100% and make
    // enclosing div to be based on % and not 2000px

    return (
      // <Row>

      <Row
        style={{
          display: "block",
          textAlign: "center",
          fontSize: "20px",
          paddingRight: "140px",
          // display: "flex",
          // justifyContent: "center",
          // alignItems: "center"
        }}
      >
        <div
          style={{
            display: "inline-block",
            margin: "10px",
            marginBottom: "0",
            marginTop: "10px",
          }}
        >
          <DropdownButton
            style={{ top: "5px" }}
            title={this.state.calendarView}
          >
            <Dropdown.Item
              onClick={(e) => {
                this.changeCalendarView("Day");
              }}
            >
              {" "}
              Day{" "}
            </Dropdown.Item>
            <Dropdown.Item
              onClick={(e) => {
                this.changeCalendarView("Week");
              }}
            >
              {" "}
              Week{" "}
            </Dropdown.Item>
            <Dropdown.Item
              onClick={(e) => {
                this.changeCalendarView("Month");
              }}
            >
              {" "}
              Month{" "}
            </Dropdown.Item>
          </DropdownButton>
        </div>
        <Button
          style={{ display: "inline-block", margin: "10px", marginBottom: "0" }}
          variant="outline-primary"
          onClick={() => {
            this.setState(
              {
                dateContext: moment(
                  new Date(
                    new Date().toLocaleString("en-US", {
                      timeZone: this.state.currentUserTimeZone,
                    })
                  )
                ),
              },
              this.updateEventsArray
            );
          }}
        >
          Today
        </Button>

        <Button //Goals button
          style={{ display: "inline-block", margin: "10px", marginBottom: "0" }}
          variant="outline-primary"
          onClick={this.toggleShowGoal}
        >
          {" "}
          Goals{" "}
        </Button>

        <Button //routines  button
          style={{ display: "inline-block", margin: "10px", marginBottom: "0" }}
          variant="outline-primary"
          onClick={this.toggleShowRoutine}
        >
          Routines
        </Button>

        <Button //Current Status
          style={{ display: "inline-block", margin: "10px", marginBottom: "0" }}
          variant="outline-primary"
          onClick={() => {
            this.grabFireBaseRoutinesGoalsData();
            this.setState({
              showRoutineGoalModal: !this.state.showRoutineGoalModal,
              showGoalModal: false,
              showRoutineModal: false,
            });
          }}
        >
          Current Status
        </Button>

        <Button //New Event button
          style={{ display: "inline-block", margin: "10px", marginBottom: "0" }}
          variant="outline-primary"
          onClick={() => {
            this.setState(
              {
                showAboutModal: false,
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

        <Button //About
          style={{
            display: "inline-block",
            margin: "10px",
            marginBottom: "0",
            // marginRight: "200px",
          }}
          variant="outline-primary"
          onClick={() => {
            this.setState({
              showAboutModal: !this.state.showAboutModal,
              dayEventSelected: false,
            });
          }}
        >
          About
        </Button>
      </Row>
    );
  };

  calendarAbstracted = () => {
    return (
      <div
        style={{
          borderRadius: "2%",
          backgroundColor: "white",
          width: "1000px",
          // marginLeft: "10px",
          padding: "45px",
          paddingBottom: "10px",
          boxShadow:
            "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
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
                  onClick={(e) => {
                    this.prevMonth();
                  }}
                />
              </div>
            </Col>
            <Col style={{ textAlign: "center" }} className="bigfancytext">
              <p>
                {this.getMonth()} {this.getYear()}
              </p>
              <p
                style={{ marginBottom: "0", height: "19.5px" }}
                className="normalfancytext"
              >
                {this.state.currentUserTimeZone}
              </p>
            </Col>
            <Col>
              <FontAwesomeIcon
                style={{ marginLeft: "50%" }}
                icon={faChevronRight}
                size="2x"
                className="X"
                onClick={(e) => {
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
          timeZone={this.state.currentUserTimeZone}
          // selectedDay={this.state.selectedDay}
        />
      </div>
    );
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
          marginLeft: "35px",
          width: "350px",
          marginTop: "0",
        }}
      >
        <Modal.Header
          closeButton
          onHide={() => {
            this.setState({
              dayEventSelected: false,
              repeatOptionDropDown: "Does not repeat",
            });
          }}
        >
          <Modal.Title>
            <h5 className="normalfancytext">Event Form</h5>{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            this.state.showRepeatModal && this.repeatModal()
            // <RepeatModal
            //   closeRepeatModal={this.closeRepeatModal}
            //   todayObject={this.state.todayDateObject}
            //   newEventStart0={this.state.newEventStart0}
            // />
          }
          {this.state.showDeleteRecurringModal && this.deleteRecurringModal()}
          {this.state.showEditRecurringModal && this.editRecurringModal()}
          {this.eventFormInputArea()}
        </Modal.Body>
        <Modal.Footer>
          <Container fluid>
            {/**
             * <Row>
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
             *  */}

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
                  onClick={(e) =>
                    this.state.newEventRecurringID
                      ? this.openEditRecurringModal()
                      : this.updateEventClick(e)
                  }
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
                  onClick={() =>
                    this.state.newEventRecurringID
                      ? this.openDeleteRecurringModal()
                      : this.deleteSubmit()
                  }
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
      "Saturday",
    ];

    // Custom styles
    const modalStyle = {
      position: "absolute",
      zIndex: "5",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: "400px",
    };

    const inputStyle = {
      padding: "8px 5px 8px 15px",
      marginLeft: "8px",
      background: "#F8F9FA",
      border: "none",
      width: "70px",
      borderRadius: "4px",
      marginRight: "8px",
    };

    const selectStyle = {
      display: "inline-block",
    };

    const weekStyle = {
      display: "flex",
      alignItems: "center",
      textAlign: "center",
      marginTop: "10px",
    };

    // const radioInputStyle = { display: "flex", alignItems: "center" };

    // onClick event handler for the circles
    const selectedDot = (e, index) => {
      let curClass = e.target.classList;
      if (curClass.contains("selected")) {
        curClass.remove("selected");
        const newByDay = { ...this.state.byDay_temp, [index]: "" };
        this.setState({
          byDay_temp: newByDay,
        });
      } else {
        curClass.add("selected");
        const newByDay = {
          ...this.state.byDay_temp,
          [index]: week_days[index],
        };
        this.setState({
          byDay_temp: newByDay,
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
                  onClick={(e) => selectedDot(e, i)}
                >
                  {day.charAt(0)}
                </span>
              );
            } else {
              return (
                <span
                  key={i}
                  className="dot"
                  onClick={(e) => selectedDot(e, i)}
                >
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
            <h5 className="normalfancytext">Repeating Options test</h5>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "5px",
              }}
            >
              Repeat every
              <input
                type="number"
                min="1"
                max="10000"
                value={this.state.repeatInputValue_temp}
                style={inputStyle}
                onChange={(e) => this.handleRepeatInputValue(e.target.value)}
              />
              <DropdownButton
                title={this.state.repeatDropDown_temp}
                style={selectStyle}
                variant="light"
              >
                <Dropdown.Item
                  eventKey="DAY"
                  onSelect={(eventKey) => this.handleRepeatDropDown(eventKey)}
                >
                  day
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="WEEK"
                  onSelect={(eventKey) =>
                    this.handleRepeatDropDown(eventKey, week_days)
                  }
                >
                  week
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="MONTH"
                  onSelect={(eventKey) => this.handleRepeatDropDown(eventKey)}
                >
                  month
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="YEAR"
                  onSelect={(eventKey) => this.handleRepeatDropDown(eventKey)}
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
                marginLeft: "5px",
              }}
              className="repeat-form"
              onChange={(e) => {
                if (e.target.type === "radio") {
                  this.setState({
                    repeatRadio_temp: e.target.value,
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
                  Until
                  <DatePicker
                    className="date-picker-btn btn btn-light"
                    selected={this.state.repeatEndDate_temp}
                    onChange={(date) => this.handleRepeatEndDate(date)}
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
                      onChange={(e) =>
                        this.handleRepeatOccurrence(e.target.value)
                      }
                      style={inputStyle}
                      className="input-exception"
                    />
                    occurrence(s)
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

  openEditRecurringModal = () => {
    //console.log("openeditrecurringmodal called");
    this.setState((prevState) => {
      return { showEditRecurringModal: !prevState.showEditRecurringModal };
    });
  };

  closeEditRecurringModal = () => {
    this.setState({
      showEditRecurringModal: false,
    });
  };

  openDeleteRecurringModal = () => {
    console.log("opendeleterecurringmodal called");
    this.setState((prevState) => {
      return { showDeleteRecurringModal: !prevState.showDeleteRecurringModal };
    });
  };

  closeDeleteRecurringModal = () => {
    this.setState({
      showDeleteRecurringModal: false,
    });
    // if (!this.state.repeatOption) {
    //   this.setState({
    //     repeatOptionDropDown: "Does not repeat",
    //   });
    // }
  };

  deleteRecurring = async () => {
    const {
      deleteRecurringOption,
      newEventRecurringID,
      newEventStart0,
      recurrenceRule,
    } = this.state;
    if (deleteRecurringOption === "This event") {
      this.deleteSubmit();
    } else if (deleteRecurringOption === "This and following events") {
      await axios
        .get("/getRecurringEventInstances", {
          params: {
            recurringEventId: newEventRecurringID,
          },
        })
        .then((res) => {
          //console.log("res.data.length: ", res.data.length);
          //console.log("res.data[0]: ", res.data[0]);
          if (res.data[0].id === this.state.newEvent.id) {
            axios
              .post("/deleteEvent", {
                userId: this.state.currentUserId,
                eventId: newEventRecurringID,
              })
              .then((response) => {
                console.log("response: ", response);
                this.setState({
                  dayEventSelected: false,
                  showDeleteRecurringModal: false,
                });
                this.updateEventsArray();
              })
              .catch(function (error) {
                console.log(error);
              });
          } else {
            let newEvent = {
              reminders: this.state.newEvent.reminders,
              creator: this.state.newEvent.creator,
              created: this.state.newEvent.created,
              organizer: this.state.newEvent.organizer,
              sequence: this.state.newEvent.sequence,
              status: this.state.newEvent.status,
            };
            let newRecurrenceRule = this.state.recurrenceRule;
            let newUntilSubString = `${moment(this.state.newEventStart0).format(
              "YYYYMMDD"
            )}`;

            let countSubString = "";
            let countIndex = this.state.recurrenceRule.indexOf("COUNT");
            if (countIndex !== -1) {
              countSubString = this.state.recurrenceRule.substring(countIndex);
            }
            if (countSubString.includes(";")) {
              let endCountIndex = countSubString.indexOf(";");
              countSubString = countSubString.substring(6, endCountIndex);
            } else if (countSubString) {
              countSubString = countSubString.substring(6);
            }

            let intervalSubString = "";
            let intervalIndex = recurrenceRule.indexOf("INTERVAL");
            if (intervalIndex !== -1) {
              intervalSubString = recurrenceRule.substring(intervalIndex);
            }
            if (intervalSubString.includes(";")) {
              let endIntervalIndex = intervalSubString.indexOf(";");
              intervalSubString = intervalSubString.substring(
                9,
                endIntervalIndex
              );
            } else if (intervalSubString) {
              intervalSubString = intervalSubString.substring(9);
            }

            if (newRecurrenceRule.includes("UNTIL")) {
              let untilSubString = "";
              let untilIndex = this.state.recurrenceRule.indexOf("UNTIL");
              if (untilIndex !== -1) {
                untilSubString = this.state.recurrenceRule.substring(
                  untilIndex
                );
              }
              if (untilSubString.includes(";")) {
                let endUntilIndex = untilSubString.indexOf(";");
                untilSubString = untilSubString.substring(6, endUntilIndex);
              } else if (untilSubString) {
                untilSubString = untilSubString = untilSubString.substring(6);
              }

              console.log(untilSubString, newUntilSubString, "untilSubString");

              newRecurrenceRule = newRecurrenceRule.replace(
                untilSubString,
                newUntilSubString
              );
            } else if (newRecurrenceRule.includes("COUNT")) {
              let start = moment(res.data[0].start.dateTime);
              let end = moment(this.state.newEventStart0);

              let arr = res.data.filter((e, i) => {
                return moment(e.start.dateTime).isBefore(end);
              });

              // let diff =
              //   moment.duration(end.diff(start)).asDays() /
              //   parseInt(intervalSubString);
              // console.log(diff, intervalSubString, "diff");
              newRecurrenceRule = newRecurrenceRule.replace(
                countSubString,
                arr.length
              );
            } else {
              newRecurrenceRule = newRecurrenceRule.concat(
                `;UNTIL=${newUntilSubString}`
              );
            }
            newEvent.start = res.data[0].start;
            newEvent.end = res.data[0].end;
            newEvent.recurrence = [newRecurrenceRule];
            newEvent.summary = res.data[0].summary;

            axios
              .put("/updateEvent", {
                extra: newEvent,
                eventId: newEventRecurringID,
                username: this.state.currentUserName,
                id: this.state.currentUserId,
                // start: updatedEvent.start,
                // end: updatedEvent.end,
              })
              .then((response) => {
                this.setState({
                  dayEventSelected: false,
                  newEventName: "",
                  newEventStart0: new Date(),
                  newEventEnd0: new Date(),
                });

                this.updateEventsArray();
              })

              .catch(function (error) {
                console.log(error);
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (deleteRecurringOption === "All events") {
      console.log("newEventRecurringID, : ", newEventRecurringID);
      console.log("this.state.newEventID : ", this.state.newEventID);
      axios
        .post("/deleteEvent", {
          //ID: newEventRecurringID,
          username: this.state.currentUserName,
          userId: this.state.currentUserId,
          eventId: this.state.newEventRecurringID,
        })
        .then((response) => {
          this.setState({
            dayEventSelected: false,
            showDeleteRecurringModal: false,
          });
          this.updateEventsArray();
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  editRecurringModal = () => {
    const modalStyle = {
      position: "absolute",
      left: "50%",
      zIndex: "5",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: "400px",
    };

    return (
      <Modal.Dialog style={modalStyle}>
        <Modal.Header closeButton onHide={this.closeEditRecurringModal}>
          <Modal.Title>
            <h5 className="normalfancytext">Edit Recurring Event</h5>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body
          style={{
            // padding: "85px 0",
            height: "250px",
            margin: "auto",
          }}
        >
          <Form
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Form.Group
              style={{
                height: "60%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
              }}
              className="delete-repeat-form"
              onChange={(e) => {
                if (e.target.type === "radio") {
                  this.setState({
                    editRecurringOption: e.target.value,
                  });
                }
              }}
            >
              {(
                  <Form.Check type="radio">
                    <Form.Check.Label style={{ marginLeft: "5px" }}>
                      <Form.Check.Input
                        type="radio"
                        value="This event"
                        name="radios"
                        defaultChecked={
                          this.state.editRecurringOption === "This event" &&
                          true
                        }
                      />
                      This event
                    </Form.Check.Label>
                  </Form.Check>
                )}
              <Form.Check type="radio">
                <Form.Check.Label style={{ marginLeft: "5px" }}>
                  <Form.Check.Input
                    type="radio"
                    value="This and following events"
                    name="radios"
                    defaultChecked={
                      this.state.editRecurringOption ===
                        "This and following events" && true
                    }
                  />
                  This and following events
                </Form.Check.Label>
              </Form.Check>
              <Form.Check type="radio">
                <Form.Check.Label style={{ marginLeft: "5px" }}>
                  <Form.Check.Input
                    type="radio"
                    value="All events"
                    name="radios"
                    defaultChecked={
                      this.state.editRecurringOption === "All events" && true
                    }
                  />
                  All events
                </Form.Check.Label>
              </Form.Check>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={this.closeEditRecurringModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={this.updateEventClick}>
            OK
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  };

  deleteRecurringModal = () => {
    const modalStyle = {
      position: "absolute",
      left: "50%",
      zIndex: "5",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: "400px",
    };

    return (
      <Modal.Dialog style={modalStyle}>
        <Modal.Header closeButton onHide={this.closeDeleteRecurringModal}>
          <Modal.Title>
            <h5 className="normalfancytext">Delete Recurring Event</h5>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body
          style={{
            // padding: "85px 0",
            height: "250px",
            margin: "auto",
          }}
        >
          <Form
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Form.Group
              style={{
                height: "60%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
              }}
              className="delete-repeat-form"
              onChange={(e) => {
                if (e.target.type === "radio") {
                  this.setState({
                    deleteRecurringOption: e.target.value,
                  });
                }
              }}
            >
              <Form.Check type="radio">
                <Form.Check.Label style={{ marginLeft: "5px" }}>
                  <Form.Check.Input
                    type="radio"
                    value="This event"
                    name="radios"
                    defaultChecked={
                      this.state.deleteRecurringOption === "This event" && true
                    }
                  />
                  This event
                </Form.Check.Label>
              </Form.Check>
              <Form.Check type="radio">
                <Form.Check.Label style={{ marginLeft: "5px" }}>
                  <Form.Check.Input
                    type="radio"
                    value="This and following events"
                    name="radios"
                    defaultChecked={
                      this.state.deleteRecurringOption ===
                        "This and following events" && true
                    }
                  />
                  This and following events
                </Form.Check.Label>
              </Form.Check>
              <Form.Check type="radio">
                <Form.Check.Label style={{ marginLeft: "5px" }}>
                  <Form.Check.Input
                    type="radio"
                    value="All events"
                    name="radios"
                    defaultChecked={
                      this.state.deleteRecurringOption === "All events" && true
                    }
                  />
                  All events
                </Form.Check.Label>
              </Form.Check>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={this.closeDeleteRecurringModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={this.deleteRecurring}>
            OK
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
                    onSelect={(eventKey) =>
                      this.setState({
                        repeatOptionDropDown: eventKey,
                        repeatOption: false,
                      })
                    }
                  >
                    Does not repeat
                  </Dropdown.Item>
                  <Dropdown.Item
                    eventKey="Custom..."
                    onSelect={(eventKey) => {
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
              <Form.Group>
                <Form.Label>Notifications:</Form.Label>
                <Row>
                  <Col style={{ paddingRight: "0px" }}>
                    <Form.Control
                      // value={this.state.newEventNotification}
                      // onChange={this.handleNotificationChange}
                      type="number"
                      placeholder="5"
                      style={{ width: "70px", marginTop: ".25rem" }}
                    />
                  </Col>
                  <Col xs={8} style={{ paddingLeft: "0px" }}>
                    <Form.Text style={{ fontSize: "65%" }}>
                      {" "}
                      Min Before Start Time
                    </Form.Text>
                  </Col>
                </Row>
                <Row style={{ marginTop: "15px" }}>
                  <Col style={{ paddingRight: "0px" }}>
                    <Form.Text style={{ fontSize: "65%" }}> User</Form.Text>
                  </Col>
                  <Col xs={8}>
                    <Form.Check type="checkbox" style={{ paddingLeft: "0px" }}>
                      <Form.Check.Input
                        type="checkbox"
                        style={{ width: "20px", height: "20px" }}
                      />

                      <Form.Control
                        as="textarea"
                        rows="1"
                        type="text"
                        placeholder="Enter Message Here"
                        style={{ marginLeft: "10px" }}
                      />
                    </Form.Check>
                  </Col>
                </Row>
                <Row style={{ marginTop: "10px" }}>
                  <Col style={{ paddingRight: "0px" }}>
                    <Form.Text style={{ fontSize: "65%" }}> TA</Form.Text>
                  </Col>
                  <Col xs={8}>
                    <Form.Check type="checkbox" style={{ paddingLeft: "0px" }}>
                      <Form.Check.Input
                        type="checkbox"
                        style={{ width: "20px", height: "20px" }}
                      />
                      <Form.Control
                        as="textarea"
                        rows="1"
                        type="text"
                        placeholder="Enter Message Here"
                        style={{ marginLeft: "10px" }}
                      />
                    </Form.Check>
                  </Col>
                </Row>
                <Row style={{ marginTop: "10px" }}>
                  <Col style={{ paddingRight: "0px" }}>
                    <Form.Control
                      // value={this.state.newEventNotification}
                      // onChange={this.handleNotificationChange}
                      type="number"
                      placeholder="30"
                      style={{ width: "70px", marginTop: ".25rem" }}
                    />
                  </Col>
                  <Col xs={8} style={{ paddingLeft: "0px" }}>
                    <Form.Text style={{ fontSize: "65%" }}>
                      {" "}
                      Min After Start Time
                    </Form.Text>
                  </Col>
                </Row>
                <Row style={{ marginTop: "15px" }}>
                  <Col style={{ paddingRight: "0px" }}>
                    <Form.Text style={{ fontSize: "65%" }}> User</Form.Text>
                  </Col>
                  <Col xs={8}>
                    <Form.Check type="checkbox" style={{ paddingLeft: "0px" }}>
                      <Form.Check.Input
                        type="checkbox"
                        style={{ width: "20px", height: "20px" }}
                      />

                      <Form.Control
                        as="textarea"
                        rows="1"
                        type="text"
                        placeholder="Enter Message Here"
                        style={{ marginLeft: "10px" }}
                      />
                    </Form.Check>
                  </Col>
                </Row>
                <Row style={{ marginTop: "10px" }}>
                  <Col style={{ paddingRight: "0px" }}>
                    <Form.Text style={{ fontSize: "65%" }}> TA</Form.Text>
                  </Col>
                  <Col xs={8}>
                    <Form.Check type="checkbox" style={{ paddingLeft: "0px" }}>
                      <Form.Check.Input
                        type="checkbox"
                        style={{ width: "20px", height: "20px" }}
                      />

                      <Form.Control
                        as="textarea"
                        rows="1"
                        type="text"
                        placeholder="Enter Message Here"
                        style={{ marginLeft: "10px" }}
                      />
                    </Form.Check>
                  </Col>
                </Row>
                <Row style={{ marginTop: "10px" }}>
                  <Col style={{ paddingRight: "0px" }}>
                    <Form.Control
                      // value={this.state.newEventNotification}
                      // onChange={this.handleNotificationChange}
                      type="number"
                      placeholder="5"
                      style={{ width: "70px", marginTop: ".25rem" }}
                    />
                  </Col>
                  <Col xs={8} style={{ paddingLeft: "0px" }}>
                    <Form.Text style={{ fontSize: "65%" }}>
                      {" "}
                      Min After End Time
                    </Form.Text>
                  </Col>
                </Row>
                <Row style={{ marginTop: "15px" }}>
                  <Col style={{ paddingRight: "0px" }}>
                    <Form.Text style={{ fontSize: "65%" }}> User</Form.Text>
                  </Col>
                  <Col xs={8}>
                    <Form.Check type="checkbox" style={{ paddingLeft: "0px" }}>
                      <Form.Check.Input
                        type="checkbox"
                        style={{ width: "20px", height: "20px" }}
                      />

                      <Form.Control
                        as="textarea"
                        rows="1"
                        type="text"
                        placeholder="Enter Message Here"
                        style={{ marginLeft: "10px" }}
                      />
                    </Form.Check>
                  </Col>
                </Row>
                <Row style={{ marginTop: "10px" }}>
                  <Col style={{ paddingRight: "0px" }}>
                    <Form.Text style={{ fontSize: "65%" }}> TA</Form.Text>
                  </Col>
                  <Col xs={8}>
                    <Form.Check type="checkbox" style={{ paddingLeft: "0px" }}>
                      <Form.Check.Input
                        type="checkbox"
                        style={{ width: "20px", height: "20px" }}
                      />

                      <Form.Control
                        as="textarea"
                        rows="1"
                        type="text"
                        placeholder="Enter Message Here"
                        style={{ marginLeft: "10px" }}
                      />
                    </Form.Check>
                  </Col>
                </Row>
              </Form.Group>
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

  startTimePicker = () => {
    // const [startDate, setStartDate] = useState(new Date());
    return (
      <DatePicker
        className="form-control"
        type="text"
        selected={this.state.newEventStart0}
        onChange={(date) => {
          this.setState(
            {
              newEventStart0: date,
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
        onChange={(date) => {
          this.setState(
            {
              newEventEnd0: date,
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
  hideEventForm = (e) => {
    //console.log("Tyler says: Hello");
    this.setState({
      dayEventSelected: false,
      repeatOptionDropDown: "Does not repeat",
    });
  };

  /*
      All functions below will change a variables
      when there is a change in the event form
      */

  handleNameChange = (event) => {
    this.setState({ newEventName: event.target.value });
  };

  handleGuestChange = (event) => {
    this.setState({ newEventGuests: event.target.value });
  };

  handleLocationChange = (event) => {
    this.setState({ newEventLocation: event.target.value });
  };

  handleNotificationChange = (event) => {
    this.setState({ newEventNotification: event.target.value });
  };

  handleDescriptionChange = (event) => {
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
    var start_call = +new Date();
    axios
      .get("/getEventsByInterval", {
        //get normal google calendar data for possible future use
        params: {
          start: start0.toString(),
          end: end0.toString(),
          timeZone: this.state.currentUserTimeZone,
          name: this.state.currentUserName,
          id: this.state.currentUserId,
        },
      })
      .then((response) => {
        var events = response.data;
        console.log(events);
        var end_call = +new Date();
        console.log("Retrieve " + response.data.length + " items in: ", end_call - start_call, "ms");
        this.setState(
          {
            newEventID: "",
            newEventName: "",
            // newEventStart: "",
            // newEventEnd: "",
            originalEvents: events,
          },
          () => {
            //console.log("New Events Arrived", events);
          }
        );
      })
      .catch((error) => {
        console.log("Error Occurred " + error);
      });
  };

  /*
   * getEventsByIntervalDayVersion:
   * gets exactly the days worth of events from the google calendar
   */
  getEventsByIntervalDayVersion = (startDate, endDate) => {
    var start_call = +new Date();
    axios
      .get("/getEventsByInterval", {
        //get normal google calendar data for possible future use
        params: {
          start: startDate.toString(),
          end: endDate.toString(),
          timeZone: this.state.currentUserTimeZone,
          name: this.state.currentUserName,
          id: this.state.currentUserId,
        },
      })
      .then((response) => {
        // console.log("what are the events", response.data);
        var events = response.data;
        var end_call = +new Date();
        console.log("Retrieve " + response.data.length + " items in: ", end_call - start_call, "ms");
        this.setState(
          {
            dayEvents: events,
          },
          () => {
          }
        );
      })
      .catch((error) => {
        console.log("Error Occurred " + error);
      });
  };

  //Get and store events by week, take first and last day of the week as parameters as date object
  getEventsByIntervalWeekVersion = (start0, end0) => {
    var start_call = +new Date();
      axios
      .get("/getEventsByInterval", {
        //get normal google calendar data for possible future use
        params: {
          start: start0,
          end: end0,
          name: this.state.currentUserName,
          id: this.state.currentUserId,
        },
      })
      .then((response) => {
        var events = response.data;
        var end_call = +new Date();
        console.log("Retrieve " + response.data.length + " items in: ", end_call - start_call, "ms");
        this.setState(
          {
            weekEvents: events,
          },
          () => {
          }
        );
      })
      .catch((error) => {
        console.log("Error Occurred " + error);
      });
  };
}
