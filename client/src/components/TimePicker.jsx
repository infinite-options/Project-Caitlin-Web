import React, { Component } from "react";
import TimeField from "react-simple-timefield";
import { TextField } from "@material-ui/core";

export default class TimePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: this.props.time.substring(0, 5),
    };
  }

  onTimeChange = (event, value) => {
    this.props.setTime(event.target.id, event.target.value);
  };

  render() {
    return (
      <form noValidate>
        <TextField
          id={this.props.name}
          type="time"
          onChange={this.onTimeChange}
          defaultValue={this.state.time}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
        />
      </form>
    );
  }
}
