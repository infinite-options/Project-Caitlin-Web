import React, { Component } from "react";
import firebase from "./firebase";
import { Button, Dropdown, DropdownButton, Modal } from "react-bootstrap";
import ShowNotifications from "./ShowNotifications";
import DatePicker from "react-datepicker";
import moment from "moment";
import { Form, Row, Col } from "react-bootstrap";
import { firestore, storage } from "firebase";

import DateAndTimePickers from "./DatePicker";
import AddIconModal from "./AddIconModal";
import UploadImage from "./UploadImage";

export default class AddNewGRItem extends Component {
  constructor(props) {
    super(props);
    /////

    if (this.state.itemToEdit.photo === "") {
      if (this.props.isRoutine) {
        this.state.itemToEdit.photo =
          //"https://firebasestorage.googleapis.com/v0/b/project-caitlin-c71a9.appspot.com/o/Routines-1.png?alt=media&token=5534e930-7cc1-4c5d-a6f3-fb8b6053a6a2";
          "https://firebasestorage.googleapis.com/v0/b/project-caitlin-c71a9.appspot.com/o/DefaultIconsPNG%2Froutine2.png?alt=media&token=dec839c9-5558-49b9-a41b-76fbe3e29a81";
      } else {
        this.state.itemToEdit.photo =
          //"https://firebasestorage.googleapis.com/v0/b/project-caitlin-c71a9.appspot.com/o/Goals-1.png?alt=media&token=3a5fa4f2-a136-4fdd-acf7-9007c08ccdf2";
          "https://firebasestorage.googleapis.com/v0/b/project-caitlin-c71a9.appspot.com/o/DefaultIconsPNG%2Fgoal.png?alt=media&token=a9a5c595-b245-47dc-a6d1-3ed5495f13b7";
      }
    }

    console.log("Is this a Routine? " + this.props.isRoutine);
  }
  state = {
    grArr: [], //goal, routine original array,
    itemToEdit: {
      title: "",
      id: "",
      is_persistent: this.props.isRoutine,
      photo: "",
      is_complete: false,
      is_available: true,

      is_displayed_today: false,
      is_in_progress: false,
      // todayDateObject: this.props.todayDateObject,
      // available_end_time: this.props.singleGR.available_end_time,
      // available_start_time: this.props.singleGR.available_start_time,
      available_end_time: "23:59:59",
      available_start_time: "00:00:00",
      datetime_completed: "Sun, 23 Feb 2020 00:08:43 GMT",
      datetime_started: "Sun, 23 Feb 2020 00:08:43 GMT",
      audio: "",
      is_timed: false,
      expected_completion_time: "01:00:00",
      is_sublist_available: true,

      //this is fro the reapeat routine and goals
      start_day_and_time: new Date(),
      end_day_and_time: new Date(),
      repeat: false,
      repeat_every: "1",
      repeat_frequency: "DAY",
      repeat_ends: "Never",
      repeat_ends_on: "",
      repeat_occurences: "1",
      repeat_week_days: {
        0: "",
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: "",
      },
      ta_notifications: {
        before: {
          is_enabled: false,
          is_set: false,
          message: "",
          time: "00:05:00",
        },
        during: {
          is_enabled: false,
          is_set: false,
          message: "",
          time: "00:30:00",
        },
        after: {
          is_enabled: false,
          is_set: false,
          message: "",
          time: "00:05:00",
        },
      },
      user_notifications: {
        before: {
          is_enabled: false,
          is_set: false,
          message: "",
          time: "00:05:00",
        },
        during: {
          is_enabled: false,
          is_set: false,
          message: "",
          time: "00:30:00",
        },
        after: {
          is_enabled: false,
          is_set: false,
          message: "",
          time: "00:05:00",
        },
      },
    }, //this is essentially the new item
    //below are references to firebase directories
    routineDocsPath: firebase
      .firestore()
      .collection("users")
      .doc(this.props.theCurrentUserId)
      .collection("goals&routines"),
    arrPath: firebase
      .firestore()
      .collection("users")
      .doc(this.props.theCurrentUserId),

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

  componentDidMount() {
    this.props.isRoutine
      ? console.log("Routine Input")
      : console.log("Goal Input");

    this.getGRDataFromFB();
  }

  getGRDataFromFB = () => {
    //Grab the goals/routine array from firebase and then store it in state varible grArr
    console.log(
      "this is the goals and rountins from firebase",
      this.state.arrPath
    );

    this.state.arrPath
      .get()
      .then((doc) => {
        if (doc.exists) {
          var x = doc.data();
          if (x["goals&routines"] != undefined) {
            x = x["goals&routines"];
            this.setState({
              grArr: x,
            });
          }
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document! 2");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
        alert("Error getting document");
      });
  };

  newInputSubmit = () => {
    status = this.newInputVerify();
    if (status !== "") {
      alert(status);
      return;
    }
    this.addNewDoc();
    console.log("In between ");
    this.props.closeModal();
    console.log("Leaving newInputSubmit()");
  };

  newInputVerify = () => {
    if (this.state.itemToEdit.title === "") {
      return "No Title";
    }
    let startTime = this.state.itemToEdit.start_day_and_time;
    let endTime = this.state.itemToEdit.end_day_and_time;
    let timeDiff = endTime - startTime;
    if (timeDiff <= 0) {
      return "End time is before start time";
    }
    return "";
  };

  setPhotoURLFunction = (photo_url) => {
    let temp = this.state.itemToEdit;
    temp.photo = photo_url;
    this.setState({ itemToEdit: temp });
  };

  set_day_and_time = (id, dateString) => {
    console.log("Enter set_day_and_time", dateString, id);
    let temp = this.state.itemToEdit;
    if (id === "start_day_and_time") {
      temp.start_day_and_time = dateString;
      this.setState({ itemToEdit: temp });
    } else if (id === "end_day_and_time") {
      temp.end_day_and_time = dateString;
      this.setState({ itemToEdit: temp });
    }
  };

  addNewDoc = () => {
    // this.state.routineDocsPath
    // .add({
    //   title: this.state.itemToEdit.title,
    //   "actions&tasks": [],
    // })
    // .then((ref) => {
    //   if (ref.id === null) {
    //     alert("Fail to add new routine / goal item");
    //     return;
    //   }
    //   let newArr = this.props.ATArray;
    //   let temp = this.state.itemToEdit;
    //   temp.id = ref.id;
    //   temp.available_start_time = this.state.itemToEdit.available_start_time;
    //   temp.available_end_time = this.state.itemToEdit.available_end_time;

    //   temp.start_day_and_time= String(this.state.itemToEdit.start_day_and_time);
    //   temp.end_day_and_time= String(this.state.itemToEdit.end_day_and_time);
    //   temp.repeat_ends_on = String(this.state.itemToEdit.repeat_ends_on);
    //   newArr.push(temp);
    //   this.updateEntireArray(newArr);
    // });
    this.state.arrPath
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("getGRDataFromFB DATA:");
          // console.log(doc.data());
          var x = doc.data();
          if (x["goals&routines"] != undefined) {
            x = x["goals&routines"];
            console.log("this is the goals and routines", x);
            this.setState({
              grArr: x,
            });
          }

          this.state.routineDocsPath
            .add({
              title: this.state.itemToEdit.title,
              completed: false,
              "actions&tasks": [],
            })
            .then((ref) => {
              if (ref.id === null) {
                alert("Fail to add new routine / goal item");
                return;
              }
              console.log(ref);
              //let newArr = this.props.ATArray;
              let newArr = this.state.grArr;
              let temp = this.state.itemToEdit;

              temp.id = ref.id;
              temp.available_start_time = this.state.itemToEdit.available_start_time;
              temp.available_end_time = this.state.itemToEdit.available_end_time;
              temp.is_displayed_today = this.calculateIsDisplayed(temp);

              console.log(
                "this is the start day before ",
                this.state.itemToEdit.start_day_and_time
              );
              console.log(
                "this is the repeat end on before ",
                this.state.itemToEdit.repeat_ends_on
              );
              temp.start_day_and_time = new Date(
                this.state.itemToEdit.start_day_and_time
              ).toLocaleString();
              temp.end_day_and_time = new Date(
                this.state.itemToEdit.end_day_and_time
              ).toLocaleString();

              // temp.repeat_ends_on = this.state.itemToEdit.repeat_ends_on.toUTCString();
              // temp.start_day_and_time= String(this.state.itemToEdit.start_day_and_time);
              // temp.end_day_and_time= String(this.state.itemToEdit.end_day_and_time);
              temp.repeat_ends_on = String(
                this.state.itemToEdit.repeat_ends_on
              );

              // console.log(temp.available_start_time, temp.available_end_time);
              // console.log("Added document with ID: ", ref.id);
              // this.state.grArr.push(temp);
              newArr.push(temp);

              this.updateEntireArray(newArr);
            });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document! 2");
        }
        // let newArr = this.props.ATArray;
        // let temp = this.state.itemToEdit;
        // temp.id = ref.id;
        // temp.available_start_time = this.state.itemToEdit.available_start_time;
        // temp.available_end_time = this.state.itemToEdit.available_end_time;

        // temp.start_day_and_time= String(this.state.itemToEdit.start_day_and_time);
        // temp.end_day_and_time= String(this.state.itemToEdit.end_day_and_time);
        // temp.repeat_ends_on = String(this.state.itemToEdit.repeat_ends_on);
        // // newArr.push(temp);
        // this.updateEntireArray(newArr);
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
        alert("Error getting document:");
      });
  };

  //This function below will essentially take in a array and have a key map to it
  updateEntireArray = (newArr) => {
    // 2. update adds to the document
    let db = this.state.arrPath;
    db.update({ "goals&routines": newArr }).then((doc) => {
      this.getGRDataFromFB();
      if (this.props != null) {
        this.props.refresh();
      }
    });
  };

  convertTimeToHRMMSS = (e) => {
    let num = e.target.value;
    let hours = num / 60;
    let rhours = Math.floor(hours);
    let minutes = (hours - rhours) * 60;
    let rminutes = Math.round(minutes);
    if (rhours.toString().length === 1) {
      rhours = "0" + rhours;
    }
    if (rminutes.toString().length === 1) {
      rminutes = "0" + rminutes;
    }
    return rhours + ":" + rminutes + ":" + "00";
  };

  convertToMinutes = () => {
    let myStr = this.state.itemToEdit.expected_completion_time.split(":");
    let hours = myStr[0];
    let hrToMin = hours * 60;
    let minutes = myStr[1] * 1 + hrToMin;
    return minutes;
  };

  handleNotificationChange = (temp) => {
    this.setState({ itemToEdit: temp });
  };

  startTimePicker = () => {
    return (
      <DatePicker
        className="form-control"
        type="text"
        selected={this.state.itemToEdit.start_day_and_time}
        onChange={(date) => {
          let temp = this.state.itemToEdit;
          temp.start_day_and_time = date;
          this.setState({ itemToEdit: temp }, () => {
            console.log(
              "starttimepicker",
              this.state.itemToEdit.start_day_and_time
            );
          });
        }}
        showTimeSelect
        timeIntervals={15}
        timeCaption="time"
        dateFormat="MMMM d, yyyy h:mm aa"
      />
    );
  };

  endTimePicker = () => {
    return (
      <DatePicker
        className="form-control"
        type="text"
        selected={this.state.itemToEdit.end_day_and_time}
        onChange={(date) => {
          this.setState(
            (prevState) => ({
              itemToEdit: {
                ...prevState.itemToEdit,
                end_day_and_time: date,
              },
            }),
            () => {
              console.log(
                "endtimepicker",
                this.state.itemToEdit.end_day_and_time
              );
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

  calculateIsDisplayed = (gr) => {
    console.log(gr);
    let CurrentDate = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "America/Los_Angeles",
      })
    );
    CurrentDate.setHours(0, 0, 0, 0);

    let startDate = new Date(
      new Date(gr["start_day_and_time"]).toLocaleString("en-US", {
        timeZone: "America/Los_Angeles",
      })
    );
    startDate.setHours(0, 0, 0, 0);
    let isDisplayedTodayCalculated = false;
    let repeatOccurences = parseInt(gr["repeat_occurences"]);
    let repeatEvery = parseInt(gr["repeat_every"]);
    let repeatEnds = gr["repeat_ends"];
    let repeatEndsOn = new Date(
      new Date(gr["repeat_ends_on"]).toLocaleString("en-US", {
        timeZone: "America/Los_Angeles",
      })
    );
    repeatEndsOn.setHours(0, 0, 0, 0);
    let repeatFrequency = gr["repeat_frequency"];
    let repeatWeekDays = [];
    if (gr["repeat_week_days"] != null) {
      Object.keys(gr["repeat_week_days"]).forEach((k) => {
        if (gr["repeat_week_days"][k] != "") {
          repeatWeekDays.push(parseInt(k));
        }
      });
    }
    if (!gr.repeat) {
      isDisplayedTodayCalculated =
        CurrentDate.getTime() - startDate.getTime() == 0;
    } else {
      if (CurrentDate >= startDate) {
        if (repeatEnds == "On") {
        } else if (repeatEnds == "After") {
          if (repeatFrequency == "DAY") {
            repeatEndsOn = new Date(startDate);
            repeatEndsOn.setDate(
              startDate.getDate() + (repeatOccurences - 1) * repeatEvery
            );
          } else if (repeatFrequency == "WEEK") {
            repeatEndsOn = new Date(startDate);
            repeatEndsOn.setDate(
              startDate.getDate() + (repeatOccurences - 1) * 7 * repeatEvery
            );
          } else if (repeatFrequency == "MONTH") {
            repeatEndsOn = new Date(startDate);
            repeatEndsOn.setMonth(
              startDate.getMonth() + (repeatOccurences - 1) * repeatEvery
            );
          } else if (repeatFrequency == "YEAR") {
            repeatEndsOn = new Date(startDate);
            repeatEndsOn.setFullYear(
              startDate.getFullYear() + (repeatOccurences - 1) * repeatEvery
            );
          }
        } else if (repeatEnds == "Never") {
          repeatEndsOn = CurrentDate;
        }

        if (CurrentDate <= repeatEndsOn) {
          if (repeatFrequency == "DAY") {
            isDisplayedTodayCalculated =
              Math.floor(
                (CurrentDate.getTime() - startDate.getTime()) /
                  (24 * 3600 * 1000)
              ) %
                repeatEvery ==
              0;
          } else if (repeatFrequency == "WEEK") {
            isDisplayedTodayCalculated =
              repeatWeekDays.includes(CurrentDate.getDay()) &&
              Math.floor(
                (CurrentDate.getTime() - startDate.getTime()) /
                  (7 * 24 * 3600 * 1000)
              ) %
                repeatEvery ==
                0;
          } else if (repeatFrequency == "MONTH") {
            isDisplayedTodayCalculated =
              CurrentDate.getDate() == startDate.getDate() &&
              ((CurrentDate.getFullYear() - startDate.getFullYear()) * 12 +
                CurrentDate.getMonth() -
                startDate.getMonth()) %
                repeatEvery ==
                0;
          } else if (repeatFrequency == "YEAR") {
            isDisplayedTodayCalculated =
              startDate.getDate() == CurrentDate.getDate() &&
              CurrentDate.getMonth() == startDate.getMonth() &&
              (CurrentDate.getFullYear() - startDate.getFullYear()) %
                repeatEvery ==
                0;
          }
        }
      }
    }
    return isDisplayedTodayCalculated;
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

    let temp = this.state.itemToEdit;
    temp.repeat = true;
    temp.repeat_every = repeatInputValue_temp;
    temp.repeat_frequency = repeatDropDown_temp;
    temp.repeat_ends = repeatRadio_temp;
    temp.repeat_ends_on = repeatEndDate_temp;
    temp.repeat_occurences = repeatOccurrence_temp;
    temp.repeat_week_days = byDay_temp;
    temp.is_displayed_today = this.calculateIsDisplayed(temp);

    this.setState((prevState) => ({
      itemToEdit: temp,
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

  handleRepeatEndDate = (date) => {
    let temp = this.state.itemToEdit;
    temp.repeat_ends_on = date;
    this.setState({
      itemToEdit: temp,
      repeatEndDate_temp: date,
    });
  };

  handleRepeatDropDown = (eventKey, week_days) => {
    console.log("is it going in here");
    if (eventKey === "WEEK") {
      const newByDay = {
        ...this.state.byDay_temp,
      };
      let temp = this.state.itemToEdit;
      temp.repeat_frequency = eventKey;

      this.setState({
        itemToEdit: temp,
        repeatDropDown_temp: eventKey,
        byDay_temp: newByDay,
      });
    }
    let temp = this.state.itemToEdit;
    temp.repeat_frequency = eventKey;
    this.setState({
      itemToEdit: temp,
      repeatDropDown_temp: eventKey,
    });
  };

  handleRepeatInputValue = (eventKey) => {
    let temp = this.state.itemToEdit;
    temp.repeat_every = eventKey;
    this.setState({
      itemToEdit: temp,
      repeatInputValue_temp: eventKey,
    });
  };

  handleRepeatOccurrence = (eventKey) => {
    let temp = this.state.itemToEdit;
    temp.repeat_occurences = eventKey;
    this.setState({
      itemToEdit: temp,
      repeatOccurrence_temp: eventKey,
    });
  };

  repeatModal = () => {
    const week_days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const d = new Date();

    // Custom styles
    const modalStyle = {
      position: "absolute",
      zIndex: "5",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: "340px",
    };

    const inputStyle = {
      padding: "8px 5px 8px 15px",
      marginLeft: "8px",
      background: "#F8F9FA",
      border: "none",
      width: "50px",
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
                marginLeft: "5px",
              }}
            >
              Repeat every
              <input
                type="number"
                min="1"
                max="10000"
                value={this.state.itemToEdit.repeat_every}
                style={inputStyle}
                onChange={(e) => this.handleRepeatInputValue(e.target.value)}
              />
              <DropdownButton
                title={this.state.itemToEdit.repeat_frequency}
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
            <Form.Group>
              {this.state.repeatDropDown_temp === "WEEK" && weekSelected}
            </Form.Group>
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
              <Form.Check type="radio" style={{ margin: "15px 0" }}>
                <Form.Check.Label>
                  <Form.Check.Input
                    type="radio"
                    value="Never"
                    name="radios"
                    defaultChecked={
                      this.state.itemToEdit.repeat_ends === "Never" && true
                    }
                  />
                  Never
                </Form.Check.Label>
              </Form.Check>
              <Form.Check type="radio" className="editGR-datepicker">
                <Form.Check.Label>
                  <Form.Check.Input
                    type="radio"
                    name="radios"
                    value="On"
                    style={{ marginTop: "10px" }}
                    defaultChecked={
                      this.state.itemToEdit.repeat_ends === "On" && true
                    }
                  />
                  On
                  <DatePicker
                    className="date-picker-btn btn btn-light"
                    selected={this.state.itemToEdit.repeat_ends_on}
                    onChange={(date) => this.handleRepeatEndDate(date)}
                  ></DatePicker>
                </Form.Check.Label>
              </Form.Check>
              <Form.Check type="radio" style={{ margin: "15px 0" }}>
                <Form.Check.Label>
                  {this.state.itemToEdit.repeat_frequency === "WEEK" ? (
                    <Form.Check.Input
                      type="radio"
                      name="radios"
                      value="After"
                      style={{ marginTop: "12px" }}
                      defaultChecked={
                        this.state.itemToEdit.repeat_ends === "After" && true
                      }
                      //disabled
                    />
                  ) : (
                    <Form.Check.Input
                      type="radio"
                      name="radios"
                      value="After"
                      style={{ marginTop: "12px" }}
                      defaultChecked={
                        this.state.itemToEdit.repeat_ends === "After" && true
                      }
                    />
                  )}
                  After
                  <span style={{ marginLeft: "20px" }}>
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={this.state.itemToEdit.repeat_occurences}
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

  render() {
    return (
      <Modal.Dialog style={{ marginLeft: "0", width: this.props.width }}>
        <Modal.Header closeButton onHide={this.props.closeModal}>
          <Modal.Title>
            <h5 className="normalfancytext">
              Add New {this.props.isRoutine ? "Routine" : "Goal"}
            </h5>{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.showRepeatModal && this.repeatModal()}
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={this.state.itemToEdit.title}
                onChange={(e) => {
                  e.stopPropagation();
                  let temp = this.state.itemToEdit;
                  temp.title = e.target.value;
                  this.setState({ itemToEdit: temp });
                }}
                type="text"
                placeholder="Enter Title"
              />
            </Form.Group>
            <Form.Label> Photo </Form.Label>
            <Row>
              <AddIconModal parentFunction={this.setPhotoURLFunction} />
              <UploadImage parentFunction={this.setPhotoURLFunction} />
              <br />
            </Row>
            <div style={{ marginTop: "10px", marginBottom: "10px" }}>
              <label>Icon: </label>
              <img
                alt="None"
                src={this.state.itemToEdit.photo}
                height="70"
                width="auto"
              ></img>
            </div>

            <Form.Label>
              Start Time
              <DateAndTimePickers
                day_and_time={this.state.itemToEdit.start_day_and_time}
                id="start_day_and_time"
                set_day_and_time={this.set_day_and_time}
              />
            </Form.Label>

            <Form.Label>
              End Time
              <DateAndTimePickers
                day_and_time={this.state.itemToEdit.end_day_and_time}
                id="end_day_and_time"
                set_day_and_time={this.set_day_and_time}
              />
              <br />
            </Form.Label>

            <div>
              <label>Repeating Options</label>
              <DropdownButton
                className="repeatOptionDropDown"
                // onClick={this.openRepeatModal}
                title={this.state.repeatOptionDropDown}
                variant="light"
              >
                <Dropdown.Item
                  eventKey="Does not repeat"
                  onSelect={(eventKey) =>
                    this.setState(
                      (prevState) => ({
                        itemToEdit: {
                          ...prevState.itemToEdit,
                          repeat: false,
                        },
                        repeatOptionDropDown: eventKey,
                        repeatOption: false,
                      }),
                      () => {
                        console.log("repeat ", this.state.itemToEdit.repeat);
                        console.log(
                          "repeatOptionDropDown ",
                          this.state.repeatOptionDropDown
                        );
                        console.log("repeatOption ", this.state.repeatOption);
                      }
                    )
                  }
                >
                  Does not repeat
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="Custom..."
                  onSelect={(eventKey) => {
                    this.openRepeatModal();
                  }}
                >
                  Custom...
                </Dropdown.Item>
              </DropdownButton>
            </div>

            <div style={{ marginTop: "20px" }}>
              <label>This Takes Me</label>
              <Row>
                <Col style={{ paddingRight: "0px" }}>
                  <Form.Control
                    type="number"
                    placeholder="30"
                    value={this.convertToMinutes()}
                    style={{ marginTop: ".25rem", paddingRight: "0px" }}
                    onChange={(e) => {
                      e.stopPropagation();
                      let temp = this.state.itemToEdit;
                      temp.expected_completion_time = this.convertTimeToHRMMSS(
                        e
                      );
                      this.setState({ itemToEdit: temp });
                    }}
                  />
                </Col>
                <Col xs={8} style={{ paddingLeft: "0px" }}>
                  <p style={{ marginLeft: "10px", marginTop: "5px" }}>
                    minutes
                  </p>
                </Col>
              </Row>
            </div>

            <div className="input-group mb-3" style={{ marginTop: "10px" }}>
              <label className="form-check-label">Time?</label>
              <input
                style={{ marginTop: "5px", marginLeft: "5px" }}
                name="Timed"
                type="checkbox"
                checked={this.state.itemToEdit.is_timed}
                onChange={(e) => {
                  e.stopPropagation();
                  let temp = this.state.itemToEdit;
                  temp.is_timed = !temp.is_timed;
                  this.setState({ itemToEdit: temp });
                }}
              />
            </div>

            <div className="input-group mb-3">
              <label className="form-check-label">Available to the user?</label>
              <input
                style={{ marginTop: "5px", marginLeft: "5px" }}
                name="Available"
                type="checkbox"
                checked={this.state.itemToEdit.is_available}
                onChange={(e) => {
                  e.stopPropagation();
                  let temp = this.state.itemToEdit;
                  temp.is_available = e.target.checked;
                  this.setState({ itemToEdit: temp });
                }}
              />
            </div>

            {this.state.itemToEdit.is_available && (
              <ShowNotifications
                itemToEditPassedIn={this.state.itemToEdit}
                notificationChange={this.handleNotificationChange}
              />
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.closeModal}>
            Close
          </Button>
          <Button variant="info" onClick={this.newInputSubmit}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  }
}
