import React, { Component } from "react";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dropdown, DropdownButton, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import ShowNotifications from "./ShowNotifications";
import moment from "moment";
import { Form, Row, Col } from "react-bootstrap";
import { firestore, storage } from "firebase";

import DateAndTimePickers from "./DatePicker";

import AddIconModal from "./AddIconModal";
import UploadImage from "./UploadImage";

export default class editGR extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // showEditModal: false,
      itemToEdit: this.props.ATArray[this.props.i],
      showRepeatModal: false,
      repeatOption:
        this.props.ATArray[this.props.i].repeat === (true || "1")
          ? true
          : false,
      // repeatOptionDropDown: "Does not repeat",

      repeatOptionDropDown:
        this.props.ATArray[this.props.i].repeat === (true || "1")
          ? "Custom..."
          : "Does not repeat",
      repeatDropDown:
        this.props.ATArray[this.props.i].repeat_frequency || "DAY",
      repeatDropDown_temp:
        this.props.ATArray[this.props.i].repeat_frequency || "DAY",
      repeatMonthlyDropDown: "Monthly on day 13",
      repeatInputValue: this.props.ATArray[this.props.i].repeat_every || "1",
      repeatInputValue_temp:
        this.props.ATArray[this.props.i].repeat_every || "1",
      repeatOccurrence:
        this.props.ATArray[this.props.i].repeat_occurences || "1",
      repeatOccurrence_temp:
        this.props.ATArray[this.props.i].repeat_occurences || "1",
      repeatRadio: this.props.ATArray[this.props.i].repeat_ends || "Never",
      repeatRadio_temp: this.props.ATArray[this.props.i].repeat_ends || "Never",
      repeatEndDate: this.props.ATArray[this.props.i].repeat_ends_on || "",
      repeatEndDate_temp: this.props.ATArray[this.props.i].repeat_ends_on || "",
      byDay: this.props.ATArray[this.props.i].repeat_week_days || {
        0: "",
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: "",
      },

      byDay_temp: this.props.ATArray[this.props.i].repeat_week_days || {
        0: "",
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: "",
      },
    };
    // console.log("In editGR");
    // console.log(this.state.itemToEdit);
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log("this is in the component update ",this.props.ATArray[this.props.i] );
    // console.log(this.props.ATArray[this.props.i].title);
    // if(this.props.ATArray[this.props.i].title === "Every month"){
    //   console.log("this is the prop that holds the firbase ",this.props.ATArray[this.props.i] );
    //   console.log("this is the state of itemtoedit ", this.state.itemToEdit);
    //   console.log("when does it go here");
    // }

    // console.log("is this true ", prevState.itemToEdit !== this.state.itemToEdit);
    // console.log(prevState.itemToEdit.title);
    // if(prevState.itemToEdit.title === "Concurrent PM 2"){
    //   console.log("this is the prev Items to edit ", prevState.itemToEdit);
    // }
    // console.log("this is the prev Items to edit ", prevState.itemToEdit);
    // if(prevState.itemToEdit != this.props.ATArray[this.props.i]){
    //   console.log("this where suppose to go");
    // }

    if (prevProps.ATArray !== this.props.ATArray) {
      // console.log("does it go here");
      let repeatOptionDropDown2;
      let repeatOption2;
      if (
        this.props.ATArray[this.props.i].repeat === true ||
        this.props.ATArray[this.props.i].repeat === "1"
      ) {
        repeatOptionDropDown2 = "Custom...";
        repeatOption2 = true;
      } else {
        repeatOptionDropDown2 = "Does not repeat";
        repeatOption2 = false;
      }
      this.setState({
        itemToEdit: this.props.ATArray[this.props.i],
        repeatOptionDropDown: repeatOptionDropDown2,
        repeatOption: repeatOption2,
      });
    }
  }

  componentDidMount() {
    let temp = this.props.ATArray[this.props.i];
    this.setState({ itemToEdit: temp });
  }

  updateStateWithFB() {
    console.log("does it go in here");
    let repeatOptionDropDown2;
    let repeatOption2;
    if (
      this.props.ATArray[this.props.i].repeat === true ||
      this.props.ATArray[this.props.i].repeat === "1"
    ) {
      repeatOptionDropDown2 = "Custom...";
      repeatOption2 = true;
    } else {
      repeatOptionDropDown2 = "Does not repeat";
      repeatOption2 = false;
    }
    console.log("this is the item to edit ", this.props.ATArray[this.props.i]);
    this.setState({
      itemToEdit: this.props.ATArray[this.props.i],
      repeatOptionDropDown: repeatOptionDropDown2,
      repeatOption: repeatOption2,
    });
  }

  setPhotoURLFunction = (photo_url) => {
    let temp = this.state.itemToEdit;
    temp.photo = photo_url;
    this.setState({ itemToEdit: temp });
    // this.props.changePhoto(photo_url);
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

  newInputSubmit = () => {
    status = this.newInputVerify();

    if (status !== "") {
      alert(status);
      return;
    }
    let newArr = this.props.ATArray;
    let temp = this.state.itemToEdit;
    if (!temp.repeat_ends_on) {
      temp.repeat_ends_on = new Date();
    }
    // temp.start_day_and_time= String(this.state.itemToEdit.start_day_and_time);
    // temp.end_day_and_time= String(this.state.itemToEdit.end_day_and_time);
    temp.repeat_ends_on = String(this.state.itemToEdit.repeat_ends_on);

    // console.log("this is the start day and time before converting to string ",this.state.itemToEdit.start_day_and_time );
    temp.start_day_and_time = new Date(
      this.state.itemToEdit.start_day_and_time
    ).toLocaleString();
    temp.end_day_and_time = new Date(
      this.state.itemToEdit.end_day_and_time
    ).toLocaleString();
    // temp.repeat_ends_on = this.state.itemToEdit.repeat_ends_on.toUTCString();

    // newArr[this.props.i] = temp;

    if (temp.photo === "") {
      if (temp.is_persistent) {
        temp.photo =
          "https://firebasestorage.googleapis.com/v0/b/project-caitlin-c71a9.appspot.com/o/DefaultIconsPNG%2Froutine2.png?alt=media&token=dec839c9-5558-49b9-a41b-76fbe3e29a81";
      } else {
        temp.photo =
          "https://firebasestorage.googleapis.com/v0/b/project-caitlin-c71a9.appspot.com/o/DefaultIconsPNG%2Fgoal.png?alt=media&token=a9a5c595-b245-47dc-a6d1-3ed5495f13b7";
      }
    }

    temp.is_displayed_today = this.calculateIsDisplayed(temp);

    // console.log(temp)
    newArr[this.props.i] = temp;

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

    this.props.FBPath.update({ "goals&routines": newArr }).then((doc) => {
      this.props.closeEditModal();
      // this.setState({ showEditModal: false });
      if (this.props != null) {
        this.props.refresh(newArr);
      } else {
        console.log("update failure");
      }
    });
  };

  newInputVerify = () => {
    if (this.state.itemToEdit.title === "") {
      return "No Title";
    }

    const startDateObject = new Date(this.state.itemToEdit.start_day_and_time);
    const endDateObject = new Date(this.state.itemToEdit.end_day_and_time);
    /*
    let startTime = this.state.itemToEdit.start_day_and_time;
    let endTime = this.state.itemToEdit.end_day_and_time;
    let timeDiff = endTime - startTime;
    */
    console.log("EnterInputVerify: start time", startDateObject);
    console.log("EnterInputVerify: end time", endDateObject);
    const timeDiff = startDateObject.getTime() - endDateObject.getTime();
    //console.log("Time diff: ", timeDiff);
    if (timeDiff >= 0) {
      return "End time is before start time";
    }

    return "";
  };

  /*

  startTimePicker = () => {
    let stored_date;
    if (!this.state.itemToEdit.start_day_and_time) {
      this.state.itemToEdit.start_day_and_time = new Date();
    }
    this.state.itemToEdit.start_day_and_time
      ? (stored_date = new Date(this.state.itemToEdit.start_day_and_time))
      : (stored_date = new Date());
    return (
      <DatePicker
        className="form-control  "
        type="text"
        style={{ width: "100%" }}
        selected={stored_date}
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
    if (!this.state.itemToEdit.end_day_and_time) {
      this.state.itemToEdit.end_day_and_time = new Date();
    }
    let stored_date;
    this.state.itemToEdit.end_day_and_time
      ? (stored_date = new Date(this.state.itemToEdit.end_day_and_time))
      : (stored_date = new Date());
    return (
      <DatePicker
        className="form-control"
        type="text"
        selected={stored_date}
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

  */

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
  handleNotificationChange = (temp) => {
    this.setState({ itemToEdit: temp });
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

    let temp = this.state.itemToEdit;
    temp.repeat = true;
    temp.repeat_every = repeatInputValue_temp;
    temp.repeat_frequency = repeatDropDown_temp;
    temp.repeat_ends = repeatRadio_temp;
    temp.repeat_ends_on = repeatEndDate_temp;
    temp.repeat_occurences = repeatOccurrence_temp;
    temp.repeat_week_days = byDay_temp;

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
      // console.log(selectedDays, "selectedDays week");
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

  editGRForm = () => {
    return (
      <Row
        style={{
          marginLeft: "0px",
          border: "2px",
          padding: "15px",
          marginTop: "10px",
        }}
      >
        <label>Title</label>
        <div className="input-group mb-3">
          <input
            style={{ width: "200px" }}
            placeholder="Enter Title"
            value={this.state.itemToEdit.title}
            onChange={(e) => {
              e.preventDefault();
              e.stopPropagation();
              let temp = this.state.itemToEdit;
              temp.title = e.target.value;
              this.setState({ itemToEdit: temp });
            }}
            //TEMP FIX for SPACE BAR TRIGGERING KEY PRESS
            onKeyDown={(e) => {
              if (e.keyCode === 32) {
                let temp = this.state.itemToEdit;
                temp.title = e.target.value + " ";
                this.setState({ itemToEdit: temp });
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          />
        </div>
        <Form.Group>
          <Form.Label> Photo </Form.Label>
          <Row>
            <AddIconModal parentFunction={this.setPhotoURLFunction} />
            <UploadImage parentFunction={this.setPhotoURLFunction} />
            <br />
          </Row>

          <div style={{ marginTop: "10px" }}>
            <label>Icon: </label>

            <img
              alt="None"
              src={this.state.itemToEdit.photo}
              height="70"
              width="auto"
            ></img>
          </div>
        </Form.Group>
        <Form.Group>
          <Form.Label> Routine/Goal </Form.Label>
          <Form.Control
            as="select"
            value={this.state.itemToEdit.is_persistent}
            onChange={(e) => {
              e.stopPropagation();
              let temp = this.state.itemToEdit;
              temp.is_persistent = e.target.value === "true";
              this.setState({ itemToEdit: temp });
            }}
          >
            <option value={"true"}> Routine </option>
            <option value={"false"}> Goal </option>
          </Form.Control>
        </Form.Group>

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
                // this.setState({ repeatOptionDropDown: eventKey });
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
                  temp.expected_completion_time = this.convertTimeToHRMMSS(e);
                  this.setState({ itemToEdit: temp });
                }}
              />
            </Col>
            <Col xs={8} style={{ paddingLeft: "0px" }}>
              <p style={{ marginLeft: "10px", marginTop: "5px" }}>minutes</p>
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

        <div className="input-group mb-3" style={{ marginTop: "10px" }}>
          <label className="form-check-label">Available to the user?</label>
          <input
            style={{ marginTop: "5px", marginLeft: "5px" }}
            name="Available"
            type="checkbox"
            checked={this.state.itemToEdit.is_available}
            onChange={(e) => {
              e.stopPropagation();
              let temp = this.state.itemToEdit;
              temp.is_available = !temp.is_available;
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
        <Form.Group>
          <Button
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              // this.setState({ showEditModal: false });
              this.props.closeEditModal();
            }}
          >
            Close
          </Button>
          <Button
            variant="info"
            onClick={(e) => {
              e.stopPropagation();
              this.newInputSubmit();
            }}
          >
            Save changes
          </Button>
        </Form.Group>
      </Row>
      //{" "}
    );
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

    const modalStyle = {
      position: "absolute",
      zIndex: "5",
      // top: "45%",
      top: "35%",
      //  transform: "translate(-50%, -50%)",
      width: "300px",
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
    if (!this.state.itemToEdit.repeat_ends) {
      this.state.itemToEdit.repeat_ends = "Never";
    }
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
                value={this.state.itemToEdit.repeat_every || "1"}
                style={inputStyle}
                onChange={(e) => this.handleRepeatInputValue(e.target.value)}
              />
              <DropdownButton
                title={this.state.itemToEdit.repeat_frequency || "DAY"}
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
                      this.state.itemToEdit.repeat_ends === ("Never" || null) &&
                      true
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
                    selected={
                      this.state.itemToEdit.repeat_ends_on
                        ? new Date(this.state.itemToEdit.repeat_ends_on)
                        : new Date()
                    }
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
                  <span style={{ marginLeft: "30px" }}>
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={this.state.itemToEdit.repeat_occurences || ""}
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
  showIcon = () => {
    return (
      <div style={{ marginLeft: "5px" }}>
        <FontAwesomeIcon
          title="Edit Item"
          onMouseOver={(event) => {
            event.target.style.color = "#48D6D2";
          }}
          onMouseOut={(event) => {
            event.target.style.color = "#000000";
          }}
          style={{ color: "#000000" }}
          onClick={(e) => {
            e.stopPropagation();
            this.setState({ showEditModal: true });
          }}
          icon={faEdit}
          size="lg"
        />
      </div>
    );
  };
  render() {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {this.props.showModal && this.props.i === this.props.indexEditing ? (
          this.editGRForm()
        ) : (
          <div> </div>
        )}
        {this.state.showRepeatModal && this.repeatModal()}
      </div>
    );
  }
}
