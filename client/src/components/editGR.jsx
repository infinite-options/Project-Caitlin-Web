import React, { Component } from "react";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dropdown, DropdownButton, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import ShowNotifications from "./ShowNotifications";
// import ShowATList from "./ShowNotifications.jsx";
import moment from "moment";
import { Form, Row, Col } from "react-bootstrap";

export default class editGR extends Component {
  constructor(props) {
    super(props);
    // console.log("this is the itemToEdit ",this.props.ATArray[this.props.i])
    this.state = {
      showEditModal: false,
      itemToEdit: this.props.ATArray[this.props.i],
      showRepeatModal: false,
      // repeatOption: false,
      repeatOption: this.props.ATArray[this.props.i].repeat === true?true: false,
      // repeatOptionDropDown: "Does not repeat",
      
      repeatOptionDropDown: this.props.ATArray[this.props.i].repeat === true? "Custom..." : "Does not repeat",
      repeatDropDown: this.props.ATArray[this.props.i].repeat_frequency || "DAY",
      repeatDropDown_temp: this.props.ATArray[this.props.i].repeat_frequency || "DAY", 
      repeatMonthlyDropDown: "Monthly on day 13",
      repeatInputValue: this.props.ATArray[this.props.i].repeat_every || "1",
      repeatInputValue_temp: this.props.ATArray[this.props.i].repeat_every || "1",
      repeatOccurrence: this.props.ATArray[this.props.i].repeat_occurences || "1",
      repeatOccurrence_temp: this.props.ATArray[this.props.i].repeat_occurences || "1",
      repeatRadio: this.props.ATArray[this.props.i].repeat_ends || "Never",
      repeatRadio_temp:this.props.ATArray[this.props.i].repeat_ends || "Never",
      repeatEndDate: this.props.ATArray[this.props.i].repeat_ends_on || "" ,
      repeatEndDate_temp: this.props.ATArray[this.props.i].repeat_ends_on || "",
      // repeatDropDown: "DAY",
      // repeatDropDown_temp: "DAY",
      // repeatMonthlyDropDown: "Monthly on day 13",
      // repeatInputValue: "1",
      // repeatInputValue_temp: "1",
      // repeatOccurrence: "1",
      // repeatOccurrence_temp: "1",
      // repeatRadio: "Never",
      // repeatRadio_temp: "Never",
      // repeatEndDate: "",
      // repeatEndDate_temp: "",
      // byDay: {
      //   0: "",
      //   1: "",
      //   2: "",
      //   3: "",
      //   4: "",
      //   5: "",
      //   6: "",
      // },
      byDay:this.props.ATArray[this.props.i].repeat_week_days || 
        {
          0: "",
          1: "",
          2: "",
          3: "",
          4: "",
          5: "",
          6: "",
        } ,
      
      byDay_temp:this.props.ATArray[this.props.i].repeat_week_days || 
          {
          0: "",
          1: "",
          2: "",
          3: "",
          4: "",
          5: "",
          6: "",
        }
      // byDay_temp: {
      //   0: "",
      //   1: "",
      //   2: "",
      //   3: "",
      //   4: "",
      //   5: "",
      //   6: "",
      // },
      // repeatSummary: "",
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log("this is component did update");
    // console.log("this is the previous ATarry",prevProps.ATArray );
    // console.log("this is the ATarry",this.props.ATArray );
    if(prevProps.ATArray !== this.props.ATArray ){
      let repeatOptionDropDown2;
      let repeatOption2 ;
      if(this.props.ATArray[this.props.i].repeat === true){
          repeatOptionDropDown2 = "Custom...";
          repeatOption2 =true
      }else{
        repeatOptionDropDown2 = "Does not repeat";
        repeatOption2 =false
      }
    //  console.log("this is the props ATArray",this.props.ATArray[this.props.i]);
      this.setState({itemToEdit: this.props.ATArray[this.props.i], repeatOptionDropDown:repeatOptionDropDown2, repeatOption:repeatOption2})
    }   
  }

  componentDidMount(){
    this.setState({itemToEdit: this.props.ATArray[this.props.i]});
  }

  newInputSubmit = () => {
    // console.log("submitting GR edited formed to firebase");
    let newArr = this.props.ATArray;
    let temp = this.state.itemToEdit;
    // console.log("this is the  temp updateing the firebase", temp);
    if(!temp.repeat_ends_on){
      temp.repeat_ends_on = new Date();
    }
    temp.start_day_and_time= String(this.state.itemToEdit.start_day_and_time);
    temp.end_day_and_time= String(this.state.itemToEdit.end_day_and_time);
    temp.repeat_ends_on = String(this.state.itemToEdit.repeat_ends_on);
    
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

    // console.log("this is the newArr array updateing the firebase", newArr);

    this.props.FBPath.update({ "goals&routines": newArr }).then((doc) => {
      this.setState({ showEditModal: false });
      if (this.props != null) {
        // console.log("refreshing FireBasev2 from updating GR ITEM ");
        this.props.refresh(newArr);
      } else {
        console.log("update failure");
      }
    });
  }; 

  

  startTimePicker = () => {
    let stored_date ;
    if(!this.state.itemToEdit.start_day_and_time){
      // console.log("should be going in here");
      this.state.itemToEdit.start_day_and_time = new Date();
    }
    // console.log("thi sis wherreee tooo looooooook", this.state.itemToEdit.start_day_and_time )
    this.state.itemToEdit.start_day_and_time 
      ? stored_date = new Date(this.state.itemToEdit.start_day_and_time)
      : stored_date = new Date();
  
    
      // console.log("this is the start day and time",this.state.itemToEdit.start_day_and_time );
      // console.log("this is the stored date",stored_date);
    return (
      <DatePicker
        className="form-control  "
        type="text"
        style={{ width: "100%" }}
        selected={stored_date }
        onChange={(date) => {
          let temp = this.state.itemToEdit;
          temp.start_day_and_time= date;
          this.setState({ itemToEdit: temp }, 
            ()=> {console.log("starttimepicker", this.state.itemToEdit.start_day_and_time)});
          
        }}
        showTimeSelect
        timeIntervals={15}
        timeCaption="time"
        dateFormat="MMMM d, yyyy h:mm aa"
      />
    );
  };

  endTimePicker = () => {
    if(!this.state.itemToEdit.end_day_and_time){
      // console.log("should be going in here");
      this.state.itemToEdit.end_day_and_time = new Date();
    }
    let stored_date ;
    this.state.itemToEdit.end_day_and_time 
      ? stored_date = new Date(this.state.itemToEdit.end_day_and_time)
      : stored_date = new Date();
    // if(this.state.itemToEdit.end_day_and_time === undefined){
    //   this.state.itemToEdit.end_day_and_time = new Date();
    // }
    return (
      <DatePicker
        className="form-control"
        type="text"
        selected={stored_date }
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

  convertTimeToHRMMSS = (e) => {
    // console.log(e.target.value);
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
    // console.log(rhours+":" + rminutes +":" + "00");
    return rhours + ":" + rminutes + ":" + "00";
  };

  convertToMinutes = () => {
    let myStr = this.state.itemToEdit.expected_completion_time.split(":");
    let hours = myStr[0];
    let hrToMin = hours * 60;
    let minutes = myStr[1] * 1 + hrToMin;
    // let seconds = myStr[2];

    // console.log("hours: " +hours + "minutes: " + minutes + "seconds: " + seconds);
    return minutes;
  };

  handleNotificationChange = (temp) => {
    // console.log(temp);
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
    // console.log("this is the full props", this.props.ATArray);
    // console.log("this is the props",this.props.ATArray[this.props.i] );
    // console.log("this is the temp from state", temp);
    // console.log("this is the repeat_every option", repeatInputValue_temp);
    temp.repeat = true;
    temp.repeat_every = repeatInputValue_temp;
    temp.repeat_frequency = repeatDropDown_temp;
    temp.repeat_ends = repeatRadio_temp;
    temp.repeat_ends_on = repeatEndDate_temp;
    temp.repeat_occurences  = repeatOccurrence_temp;
    temp.repeat_week_days = byDay_temp;
    // console.log("this is what will be saved to FB from the save repeat changes", temp);
    // console.log("this is the dsy ", byDay_temp);

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
    this.setState(
      {
        itemToEdit:temp,
        repeatEndDate_temp: date,
      },
      // console.log()
      // console.log("handleRepeatEndDate", date, this.state.repeatEndDate)
    );
  };

  handleRepeatDropDown = (eventKey, week_days) => {
    // console.log("is it going in here");
    if (eventKey === "WEEK") {
      const newByDay = {
        ...this.state.byDay_temp,
        // [this.state.newEventStart0.getDay()]: week_days[
        //   this.state.newEventStart0.getDay()
        // ],
      };
      let temp = this.state.itemToEdit;
      temp.repeat_frequency = eventKey;
      
      this.setState({
        itemToEdit:temp,
        repeatDropDown_temp: eventKey,
        byDay_temp: newByDay,
      });
    }
    let temp = this.state.itemToEdit;
    temp.repeat_frequency = eventKey;
    // console.log("this is the repeat frequency ",temp.repeat_frequency );
    this.setState({
      itemToEdit:temp,
      repeatDropDown_temp: eventKey,
    });
  };

  handleRepeatInputValue = (eventKey) => {
    let temp = this.state.itemToEdit;
    // console.log("this si the eventKey shouldn't come in here unless chaneg it",eventKey );
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
      itemToEdit:temp,
      repeatOccurrence_temp: eventKey,
    });
  };

  editGRForm = () => {
    
    // console.log(this.state.itemToEdit.available_end_time, "itemToEdit");
    // {console.log("this is what it is seeing ", this.state.itemToEdit)}
    // console.log()
    // let start_time = moment(this.state.itemToEdit.start_day_and_time).format(
    //   "LLL"
    // );
    // console.log(start_time);
    // let end_time = moment(this.state.itemToEdit.available_end_time).format(
    //   "LLL"
    // );
    // console.log(start_time);
    return (
      
      // <div style={{ border: "2px", margin: '0', width: "315px", padding: '20px' }}>
      <Row
        style={{
          marginLeft: this.props.marginLeftV,
          border: "2px",
          padding: "20px",
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

        <label>Photo URL</label>
        <div className="input-group mb-3">
          <input
            style={{ width: "200px" }}
            placeholder="Enter Photo URL "
            value={this.state.itemToEdit.photo}
            onChange={(e) => {
              e.stopPropagation();
              let temp = this.state.itemToEdit;
              temp.photo = e.target.value;
              this.setState({ itemToEdit: temp });
            }}
          />
        </div>

        <Form.Group
            value = {this.state.itemToEdit.start_day_and_time || ''}
            controlId="Y"
          >
            <Form.Label>Start Time</Form.Label> <br />
            
            {this.startTimePicker()}
        </Form.Group>

        <Form.Group
              value={this.state.itemToEdit.end_day_and_time || ''}
              controlId="X"
            >
              <Form.Label>End Time</Form.Label>
              <br />
              {this.endTimePicker()}
              <div style={{ color: "red" }}> {this.state.showDateError}</div>
            </Form.Group>

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
                
                // this.setState({
                //   repeatOptionDropDown: eventKey,
                //   repeatOption: false,
                // })
                this.setState(
                  (prevState) => ({
                    itemToEdit: {
                      ...prevState.itemToEdit,
                      repeat: false,
                    },
                    repeatOptionDropDown: eventKey,
                    repeatOption: false
                  }),
                  () => {
                    console.log("repeat ",this.state.itemToEdit.repeat);
                    console.log("repeatOptionDropDown ",this.state.repeatOptionDropDown);
                    console.log("repeatOption ",this.state.repeatOption);
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
                // value={this.state.newEventNotification}
                // onChange={this.handleNotificationChange}
                type="number"
                placeholder="30"
                value={this.convertToMinutes()}
                // value = {this.state.itemToEdit.expected_completion_time}
                style={{ marginTop: ".25rem", paddingRight: "0px" }}
                onChange={
                  // (e) => {e.stopPropagation(); this.convertTimeToHRMMSS(e)}
                  (e) => {
                    e.stopPropagation();
                    let temp = this.state.itemToEdit;
                    temp.expected_completion_time = this.convertTimeToHRMMSS(e);
                    this.setState({ itemToEdit: temp });
                  }
                }
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
              // console.log(temp.is_timed)
              temp.is_timed = !temp.is_timed;
              this.setState({ itemToEdit: temp });
            }}
          />
        </div>

        <div className="input-group mb-3" style={{ marginTop: "10px" }}>
          <label className="form-check-label">Available to Caitlin?</label>
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

        <Button
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            this.setState({ showEditModal: false });
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
      </Row>
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

    // const d = new Date();

    // Custom styles
    const modalStyle = {
      position: "absolute",
      zIndex: "5",
      left: "-20%",
      top: "45%",
      transform: "translate(-50%, -50%)",
      width: "300px",
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
    if(!this.state.itemToEdit.repeat_ends){
      this.state.itemToEdit.repeat_ends = "Never" ;
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
              <Form.Check type="radio" style={{ margin: "15px 0" }}>
                <Form.Check.Label>
                  <Form.Check.Input
                    type="radio"
                    value="Never"
                    name="radios"
                    defaultChecked={
                      this.state.itemToEdit.repeat_ends === ("Never" || null) && true
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
                    // selected={this.state.itemToEdit.repeat_ends_on || new Date()}
                    selected = {this.state.itemToEdit.repeat_ends_on
                      ? new Date(this.state.itemToEdit.repeat_ends_on)
                      : new Date()}
                    onChange={(date) => this.handleRepeatEndDate(date)}
                  ></DatePicker>
                </Form.Check.Label>
              </Form.Check>
              <Form.Check type="radio" style={{ margin: "15px 0" }}>
                <Form.Check.Label>
                  {/* <Form.Check.Input
                    type="radio"
                    name="radios"
                    value="After"
                    style={{ marginTop: "12px" }}
                    defaultChecked={
                      this.state.itemToEdit.repeat_ends === "After" && true
                    }
                  /> */}
                   {(this.state.itemToEdit.repeat_frequency === "WEEK"?
                    <Form.Check.Input
                    type="radio"
                    name="radios"
                    value="After" 
                    style={{ marginTop: "12px" }}
                    defaultChecked={
                      // this.state.repeatRadio_temp === "After" && true
                      this.state.itemToEdit.repeat_ends === "After" && true
                    }
                    disabled/>:
                    <Form.Check.Input
                    type="radio"
                    name="radios"
                    value="After" 
                    style={{ marginTop: "12px" }}
                    defaultChecked={
                      // this.state.repeatRadio_temp === "After" && true
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
                      value={this.state.itemToEdit.repeat_occurences || '1'}
                      onChange={(e) =>
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
        {this.state.showEditModal ? <div></div> : this.showIcon()}
        {this.state.showEditModal ? this.editGRForm() : <div> </div>}
        {this.state.showRepeatModal && this.repeatModal()}
      </div>
    );
  }
}
