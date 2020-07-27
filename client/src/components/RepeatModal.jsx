import React, { useState } from "react";
import { Modal, Button, Dropdown, DropdownButton, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const RepeatModal = (props) => {
  const [title, setTitle] = useState("DAY");
  const [monthly, setMonthly] = useState("Monthly on day 13");
  const [endDate, setEndDate] = useState(props.newEventStart0);
  const [inputValue, setInputValue] = useState(1);

  const week_days = ["S", "M", "T", "W", "T", "F", "S"];

  // Custom styles
  const modalStyle = {
    position: "absolute",
    zIndex: "5",
    left: "50%",
    top: "60%",
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
  const selectedDot = (e) => {
    let curClass = e.target.classList;
    curClass.contains("selected")
      ? curClass.remove("selected")
      : curClass.add("selected");
  };

  // If selected repeat every week, the following shows.
  const weekSelected = (
    <div style={{ marginTop: "20px" }}>
      Repeat On
      <div style={weekStyle}>
        {week_days.map((day, i) => {
          return (
            <span
              key={i}
              className={
                i === props.newEventStart0.getDay() ? "dot selected" : "dot"
              }
              onClick={(e) => selectedDot(e)}
            >
              {day}
            </span>
          );
        })}
      </div>
    </div>
  );

  // If selected repeat every month, the following shows.
  const monthSelected = (
    <DropdownButton
      title={monthly}
      variant="light"
      style={{ marginTop: "20px" }}
    >
      <Dropdown.Item
        eventKey="Monthly on day 13"
        onSelect={(eventKey) => setMonthly(eventKey)}
      >
        Monthly on day 13
      </Dropdown.Item>
      <Dropdown.Item
        eventKey="Monthly on the second Friday"
        onSelect={(eventKey) => setMonthly(eventKey)}
      >
        Monthly on the second Friday
      </Dropdown.Item>
    </DropdownButton>
  );

  console.log("repeatin", props.newEventStart0.getDay());

  return (
    <Modal.Dialog style={modalStyle}>
      <Modal.Header closeButton onHide={props.closeRepeatModal}>
        <Modal.Title>
          <h5 className="normalfancytext">Repeating Options</h5>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div style={{ display: "flex", alignItems: "center" }}>
          Repeat every
          <input
            type="number"
            min="1"
            max="10000"
            value={inputValue}
            style={inputStyle}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <DropdownButton title={title} style={selectStyle} variant="light">
            <Dropdown.Item
              eventKey="DAY"
              onSelect={(eventKey) => setTitle(eventKey)}
            >
              day
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="WEEK"
              onSelect={(eventKey) => setTitle(eventKey)}
            >
              week
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="MONTH"
              onSelect={(eventKey) => setTitle(eventKey)}
            >
              month
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="YEAR"
              onSelect={(eventKey) => setTitle(eventKey)}
            >
              year
            </Dropdown.Item>
          </DropdownButton>
        </div>
        {title === "WEEK" && weekSelected}
        {title === "MONTH" && monthSelected}
        <Form
          style={{
            height: "140px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
          className="repeat-form"
        >
          Ends
          <Form.Check type="radio">
            <Form.Check.Label style={{ marginLeft: "5px" }}>
              <Form.Check.Input type="radio" name="radios" />
              Never
            </Form.Check.Label>
          </Form.Check>
          <Form.Check type="radio">
            <Form.Check.Label style={{ marginLeft: "5px" }}>
              <Form.Check.Input
                type="radio"
                name="radios"
                style={{ marginTop: "12px" }}
              />
              On
              {/* <Button style={{ marginLeft: "94px" }} variant="light"> */}
              {/* Mar 14, 2020 */}
              <DatePicker
                className="date-picker-btn btn btn-light"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
              ></DatePicker>
              {/* </Button> */}
            </Form.Check.Label>
          </Form.Check>
          <Form.Check type="radio">
            <Form.Check.Label style={{ marginLeft: "5px" }}>
              <Form.Check.Input
                type="radio"
                name="radios"
                style={{ marginTop: "12px" }}
              />
              After
              <span style={{ marginLeft: "60px" }}>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  // value="1"
                  style={inputStyle}
                  className="input-exception"
                />
                occurrence(s)
              </span>
            </Form.Check.Label>
          </Form.Check>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={props.closeRepeatModal}>
          Close
        </Button>
        <Button variant="primary">Save changes</Button>
      </Modal.Footer>
    </Modal.Dialog>
  );
};

export default RepeatModal;
