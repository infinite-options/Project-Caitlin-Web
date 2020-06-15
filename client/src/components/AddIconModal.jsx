import React, { Component, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Form, Row, Col } from "react-bootstrap";

export default class AddIconModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      photo_url: null,
    };
  }

  onHandleShowClick = () => {
    let toggle = this.state.show;
    this.setState({ show: !toggle });
  };

  onPhotoClick = (e) => {
    console.log("this is the E: ", e);
    this.setState({ photo_url: e });
  };

  render() {
    return (
      <>
        <Button
          variant="primary"
          style={{ marginRight: "15px", marginLeft: "15px" }}
          onClick={this.onHandleShowClick}
        >
          Add Icon
        </Button>

        <Modal show={this.state.show} onHide={this.onHandleShowClick}>
          <Modal.Header closeButton>
            <Modal.Title>Icon List</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div>
              <div>Clear up</div>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://img.icons8.com/ios/50/000000/cleansing.png"
                  )
                }
              >
                <img src="https://img.icons8.com/ios/50/000000/cleansing.png"></img>
              </button>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://img.icons8.com/nolan/64/shower.png"
                  )
                }
              >
                <img src="https://img.icons8.com/nolan/64/shower.png"></img>
              </button>
            </div>

            <div>
              <div>Workout</div>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://img.icons8.com/ios/100/000000/treadmill.png"
                  )
                }
              >
                <img src="https://img.icons8.com/ios/100/000000/treadmill.png"></img>
              </button>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://img.icons8.com/color/96/000000/sit-ups.png"
                  )
                }
              >
                <img src="https://img.icons8.com/color/96/000000/sit-ups.png"></img>
              </button>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={this.onHandleShowClick}>
              Close
            </Button>
            <Button variant="primary" onClick={this.onHandleShowClick}>
              Add Icon
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
