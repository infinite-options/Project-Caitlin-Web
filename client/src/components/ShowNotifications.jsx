import React from "react";
import { Form, Row, Col } from "react-bootstrap";

class ShowNotifications extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

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

  convertToMinutes = (myStr) => {
    // console.log(myStr);
    if (myStr === 0) {
      return 0;
    }
    let myStr2 = myStr.split(":");
    let hours = myStr2[0];
    let hrToMin = hours * 60;
    let minutes = myStr2[1] * 1 + hrToMin;
    // let seconds = myStr2[2];
    // console.log("hours: " +hours + "minutes: " + minutes + "seconds: " + seconds);
    return minutes;
  };
  render() {
    return (
      <div>
        <Form.Group controlId="Notification">
          <Row>
            <Col style={{ paddingRight: "0px" }}>
              <Form.Control
                type="number"
                placeholder="5"
                style={{ width: "70px", marginTop: ".25rem" }}
                value={this.convertToMinutes(
                  this.props.itemToEditPassedIn.ta_notifications.before.time
                )}
                onChange={(e) => {
                  e.stopPropagation();
                  let temp = this.props.itemToEditPassedIn;
                  temp.ta_notifications.before.time = this.convertTimeToHRMMSS(
                    e
                  );
                  temp.user_notifications.before.time = this.convertTimeToHRMMSS(
                    e
                  );
                  this.props.notificationChange(temp);
                }}
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
                  checked={
                    this.props.itemToEditPassedIn.user_notifications.before
                      .is_enabled
                  }
                  onChange={(e) => {
                    e.stopPropagation();
                    let temp = this.props.itemToEditPassedIn;
                    temp.user_notifications.before.is_enabled = !temp
                      .user_notifications.before.is_enabled;
                    this.props.notificationChange(temp);
                  }}
                />
                <Form.Control
                  as="textarea"
                  rows="1"
                  type="text"
                  placeholder="Enter Message"
                  style={{ marginLeft: "10px" }}
                  value={
                    this.props.itemToEditPassedIn.user_notifications.before
                      .message
                  }
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    let temp = this.props.itemToEditPassedIn;
                    temp.user_notifications.before.message = e.target.value;
                    this.props.notificationChange(temp);
                  }}
                  //TEMP FIX for SPACE BAR TRIGGERING KEY PRESS

                  onKeyUp={(e) => {
                    if (e.keyCode === 32) {
                      e.stopPropagation();
                      e.preventDefault();
                    }
                  }}
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
                  checked={
                    this.props.itemToEditPassedIn.ta_notifications.before
                      .is_enabled
                  }
                  onChange={(e) => {
                    e.stopPropagation();
                    let temp = this.props.itemToEditPassedIn;
                    temp.ta_notifications.before.is_enabled = !temp
                      .ta_notifications.before.is_enabled;
                    this.props.notificationChange(temp);
                  }}
                />
                <Form.Control
                  as="textarea"
                  rows="1"
                  type="text"
                  placeholder="Enter Message"
                  style={{ marginLeft: "10px" }}
                  value={
                    this.props.itemToEditPassedIn.ta_notifications.before
                      .message
                  }
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    let temp = this.props.itemToEditPassedIn;
                    temp.ta_notifications.before.message = e.target.value;
                    this.props.notificationChange(temp);
                  }}
                  //TEMP FIX for SPACE BAR TRIGGERING KEY PRESS

                  onKeyUp={(e) => {
                    if (e.keyCode === 32) {
                      e.stopPropagation();
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Check>
            </Col>
          </Row>
          <Row style={{ marginTop: "10px" }}>
            <Col style={{ paddingRight: "0px" }}>
              <Form.Control
                type="number"
                placeholder="30"
                style={{ width: "70px", marginTop: ".25rem" }}
                value={this.convertToMinutes(
                  this.props.itemToEditPassedIn.ta_notifications.during.time
                )}
                onChange={(e) => {
                  e.stopPropagation();
                  let temp = this.props.itemToEditPassedIn;
                  temp.ta_notifications.during.time = this.convertTimeToHRMMSS(
                    e
                  );
                  temp.user_notifications.during.time = this.convertTimeToHRMMSS(
                    e
                  );
                  this.props.notificationChange(temp);
                }}
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
                  checked={
                    this.props.itemToEditPassedIn.user_notifications.during
                      .is_enabled
                  }
                  onChange={(e) => {
                    e.stopPropagation();
                    let temp = this.props.itemToEditPassedIn;
                    temp.user_notifications.during.is_enabled = !temp
                      .user_notifications.during.is_enabled;
                    this.props.notificationChange(temp);
                  }}
                />
                <Form.Control
                  as="textarea"
                  rows="1"
                  type="text"
                  placeholder="Enter Message"
                  style={{ marginLeft: "10px" }}
                  value={
                    this.props.itemToEditPassedIn.user_notifications.during
                      .message
                  }
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    let temp = this.props.itemToEditPassedIn;
                    temp.user_notifications.during.message = e.target.value;
                    this.props.notificationChange(temp);
                  }}
                  //TEMP FIX for SPACE BAR TRIGGERING KEY PRESS
                  onKeyUp={(e) => {
                    if (e.keyCode === 32) {
                      e.stopPropagation();
                      e.preventDefault();
                    }
                  }}
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
                  checked={
                    this.props.itemToEditPassedIn.ta_notifications.during
                      .is_enabled
                  }
                  onChange={(e) => {
                    e.stopPropagation();
                    let temp = this.props.itemToEditPassedIn;
                    temp.ta_notifications.during.is_enabled = !temp
                      .ta_notifications.during.is_enabled;
                    this.props.notificationChange(temp);
                  }}
                />
                <Form.Control
                  as="textarea"
                  rows="1"
                  type="text"
                  placeholder="Enter Message"
                  style={{ marginLeft: "10px" }}
                  value={
                    this.props.itemToEditPassedIn.ta_notifications.during
                      .message
                  }
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    let temp = this.props.itemToEditPassedIn;
                    temp.ta_notifications.during.message = e.target.value;
                    this.props.notificationChange(temp);
                  }}
                  //TEMP FIX for SPACE BAR TRIGGERING KEY PRESS
                  onKeyUp={(e) => {
                    if (e.keyCode === 32) {
                      e.stopPropagation();
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Check>
            </Col>
          </Row>
          <Row style={{ marginTop: "10px" }}>
            <Col style={{ paddingRight: "0px" }}>
              <Form.Control
                type="number"
                placeholder="5"
                style={{ width: "70px", marginTop: ".25rem" }}
                value={this.convertToMinutes(
                  this.props.itemToEditPassedIn.ta_notifications.after.time
                )}
                onChange={(e) => {
                  e.stopPropagation();
                  let temp = this.props.itemToEditPassedIn;
                  temp.ta_notifications.after.time = this.convertTimeToHRMMSS(
                    e
                  );
                  temp.user_notifications.after.time = this.convertTimeToHRMMSS(
                    e
                  );
                  this.props.notificationChange(temp);
                }}
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
                  checked={
                    this.props.itemToEditPassedIn.user_notifications.after
                      .is_enabled
                  }
                  onChange={(e) => {
                    e.stopPropagation();
                    let temp = this.props.itemToEditPassedIn;
                    temp.user_notifications.after.is_enabled = !temp
                      .user_notifications.after.is_enabled;
                    this.props.notificationChange(temp);
                  }}
                />
                <Form.Control
                  as="textarea"
                  rows="1"
                  type="text"
                  placeholder="Enter Message"
                  style={{ marginLeft: "10px" }}
                  value={
                    this.props.itemToEditPassedIn.user_notifications.after
                      .message
                  }
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    let temp = this.props.itemToEditPassedIn;
                    temp.user_notifications.after.message = e.target.value;
                    this.props.notificationChange(temp);
                  }}
                  //TEMP FIX for SPACE BAR TRIGGERING KEY PRESS
                  onKeyUp={(e) => {
                    if (e.keyCode === 32) {
                      e.stopPropagation();
                      e.preventDefault();
                    }
                  }}
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
                  checked={
                    this.props.itemToEditPassedIn.ta_notifications.after
                      .is_enabled
                  }
                  onChange={(e) => {
                    e.stopPropagation();
                    let temp = this.props.itemToEditPassedIn;
                    temp.ta_notifications.after.is_enabled = !temp
                      .ta_notifications.after.is_enabled;
                    this.props.notificationChange(temp);
                  }}
                />
                <Form.Control
                  as="textarea"
                  rows="1"
                  type="text"
                  placeholder="Enter Message"
                  style={{ marginLeft: "10px" }}
                  value={
                    this.props.itemToEditPassedIn.ta_notifications.after.message
                  }
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    let temp = this.props.itemToEditPassedIn;
                    temp.ta_notifications.after.message = e.target.value;
                    this.props.notificationChange(temp);
                  }}
                  //TEMP FIX for SPACE BAR TRIGGERING KEY PRESS
                  onKeyUp={(e) => {
                    if (e.keyCode === 32) {
                      e.stopPropagation();
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Check>
            </Col>
          </Row>
        </Form.Group>
      </div>
    );
  }
}

export default ShowNotifications;
