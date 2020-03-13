import React, { useState } from "react";
import { Modal, Button, Dropdown, DropdownButton } from "react-bootstrap";

const RepeatModal = props => {
  const [title, setTitle] = useState("DAY");

  const week_days = ["S", "M", "T", "W", "T", "F", "S"];

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
    borderRadius: "4px"
  };

  const selectStyle = {
    display: "inline-block",
    marginLeft: "8px"
  };

  const weekStyle = {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    marginTop: "10px"
  };

  // onClick event handler for the circles
  const selectedDot = e => {
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
            <span key={i} className="dot" onClick={e => selectedDot(e)}>
              {day}
            </span>
          );
        })}
      </div>
    </div>
  );

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
            // value="1"
            style={inputStyle}
          />
          <DropdownButton title={title} style={selectStyle} variant="light">
            <Dropdown.Item
              eventKey="DAY"
              onSelect={eventKey => setTitle(eventKey)}
            >
              day
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="WEEK"
              onSelect={eventKey => setTitle(eventKey)}
            >
              week
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="MONTH"
              onSelect={eventKey => setTitle(eventKey)}
            >
              month
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="YEAR"
              onSelect={eventKey => setTitle(eventKey)}
            >
              year
            </Dropdown.Item>
          </DropdownButton>
        </div>
        {title === "WEEK" && weekSelected}
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
