import React, { Component } from "react";
import { Button, Modal, Row, Col } from "react-bootstrap";
import { storage } from "./firebase";
import TimeField from "react-simple-timefield";
import TimezonePicker from 'react-bootstrap-timezone-picker';
import 'react-bootstrap-timezone-picker/dist/react-bootstrap-timezone-picker.min.css';

export default class SettingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      morning: this.props.currentTimeSetting.morning || '',
      afternoon: this.props.currentTimeSetting.afternoon || '',
      evening: this.props.currentTimeSetting.evening || '',
      night: this.props.currentTimeSetting.night || '',
      dayStart: this.props.currentTimeSetting.dayStart || '',
      dayEnd: this.props.currentTimeSetting.dayEnd || '',
      timeZone: this.props.currentTimeSetting.timeZone || '',
    };
  }

  onTimeChange = (event, value) => {
    const newTime = value.replace(/-/g, ":");
    const time = newTime.substr(0, 5);
    // console.log("this is the time",time , "this si the anem",event.target.name );
    this.setState({ [event.target.name]: time });
  };

  handleTimeZoneChange = (e) =>{
    console.log(e);
    this.setState({ timeZone : e });
  }

  newTimeSubmit = () =>{
      let time = this.state;
      this.props.newTimeSetting(time);
  }

  render() {
    return (

        <Modal.Dialog style ={{marginLeft:"-10px",marginTop:"-550px", width:"380px"}}>
          <Modal.Header closeButton onHide={this.props.closeTimeModal}>
            <Modal.Title>
                <h5 className="normalfancytext">
                    Setting Page
                </h5>{" "}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form>
              <Row style = {{marginLeft:"2px", marginBottom:"10px"}}>
                <TimezonePicker
                  value = {this.state.timeZone}
                  absolute      = {true}
                  // defaultValue  = "Europe/Moscow"
                  placeholder   = "Select timezone..."
                  onChange      = {this.handleTimeZoneChange}
                  style = {{width:"320px", fontSize: 16,border: "1px solid #666"}}
                />
              </Row>
                <Row>
              <Col style = {{paddingRight:"0px"}}>
                <label>
                    Morning Time
                </label>
                <br />
                <TimeField
                  onChange={this.onTimeChange}
                  value={this.state.morning}
                  name="morning"
                  style={{
                    border: "1px solid #666",
                    fontSize: 18,
                    width: 80,
                    padding: "3px 4px",
                    color: "#333",
                    borderRadius: 3,
                  }}
                />
              </Col>

              <Col style = {{paddingLeft:"0px"}}>
                <label> Afternoon Time</label>
                <br />
                <TimeField
                  onChange={this.onTimeChange}
                  name="afternoon"
                  value={this.state.afternoon}
                  style={{
                    border: "1px solid #666",
                    fontSize: 18,
                    width: 80,
                    padding: "3px 4px",
                    color: "#333",
                    borderRadius: 3,
                  }}
                />
              </Col>
              </Row>
              <Row style = {{marginTop:"10px"}}>
              <Col style = {{paddingRight:"0px"}}>
                <label> Evening Time</label>
                <br />
                <TimeField
                  onChange={this.onTimeChange}
                  name="evening"
                  value={this.state.evening}
                  style={{
                    border: "1px solid #666",
                    fontSize: 18,
                    width: 80,
                    padding: "3px 4px",
                    color: "#333",
                    borderRadius: 3,
                  }}
                />
              </Col>

              <Col style = {{paddingLeft:"0px"}}>
                <label> Night Time</label>
                <br />
                <TimeField
                  onChange={this.onTimeChange}
                  name="night"
                  value={this.state.night}
                  style={{
                    border: "1px solid #666",
                    fontSize: 18,
                    width: 80,
                    padding: "2px 4px",
                    color: "#333",
                    borderRadius: 3,
                  }}
                />
              </Col>
              </Row>
              <Row style = {{marginTop:"10px"}}>
              <Col style = {{paddingRight:"0px"}}>
                <label> Day Start</label>
                <br />
                <TimeField
                  onChange={this.onTimeChange}
                  name="dayStart"
                  value={this.state.dayStart}
                  style={{
                    border: "1px solid #666",
                    fontSize: 18,
                    width: 80,
                    padding: "2px 4px",
                    color: "#333",
                    borderRadius: 3,
                  }}
                />
              </Col>
              <Col style = {{paddingLeft:"0px"}}>
                <label> Day End</label>
                <br />
                <TimeField
                  onChange={this.onTimeChange}
                  name="dayEnd"
                  value={this.state.dayEnd}
                  style={{
                    border: "1px solid #666",
                    fontSize: 18,
                    width: 80,
                    padding: "2px 4px",
                    color: "#333",
                    borderRadius: 3,
                  }}
                />
              </Col>
              </Row>
            </form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.closeTimeModal}>
              Close
            </Button>
            {/* <Button variant="primary" onClick={this.props.newTimeSetting(this.state)}> */}
            <Button variant="primary" onClick={(e) => {e.stopPropagation(); this.newTimeSubmit()}}>

              Submit
            </Button>
          </Modal.Footer>
        </Modal.Dialog>

    );
  }
}
