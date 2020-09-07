import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

export default class DatePicker extends React.Component {
  constructor(props) {
    super(props);


    const todayString = this.formatDefaultTime();
    console.log("todayString", todayString);
    //let todayString = this.formatDateAndTime(today);
    this.state = {
      dateString: todayString,
      start_day_and_time: this.props.start_day_time,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  formatDefaultTime = () => {
    const dateObject = new Date(this.props.day_and_time);
    console.log("dateObject", dateObject);
    let year = dateObject.getFullYear().toString();
    let month = (dateObject.getMonth() + 1).toString();
    let day = dateObject.getDate().toString();
    let hour = dateObject.getHours().toString();
    let min = dateObject.getMinutes().toString();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    if (hour.length < 2) hour = "0" + hour;
    if (min.length < 2) min = "0" + min;

    let todayString = year + "-" + month + "-" + day + "T" + hour + ":" + min;
    return todayString;
  };

  formatOutput = (dateString) => {
    let res = "";
    console.log("formateDateAndTime:", dateString);

    //return dateString.substring(0, 16);
  };

  handleChange(event) {
    let dateString = event.target.value;
    console.log("handle change", dateString);
    if (dateString.length !== 0) {
      let newDate = new Date();
      newDate.setFullYear(dateString.substring(0, 4));
      newDate.setMonth(parseInt(dateString.substring(6, 8)) - 1);
      newDate.setDate(dateString.substring(8, 10));
      newDate.setHours(dateString.substring(11, 13));
      newDate.setMinutes(dateString.substring(14, 17));
      console.log("formatted time: ", newDate);

      this.props.set_day_and_time(event.target.id, newDate);
    }
  }

  render() {
    return (
      <form>
        <TextField
          id={this.props.id}
          type="datetime-local"
          onChange={this.handleChange}
          //label="Start Time"
          //defaultValue="2017-05-24T10:30"
          defaultValue={this.state.dateString}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </form>
    );
  }
}
