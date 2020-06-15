import React, { Component, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Form, Row, Col } from "react-bootstrap";

export default class UploadImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  onHandleShowClick = () => {
    let toggle = this.state.show;
    this.setState({ show: !toggle });
  };

  render() {
    return (
      <>
        <Button variant="primary" onClick={this.onHandleShowClick}>
          Upload Image
        </Button>

        <Modal show={this.state.show} onHide={this.onHandleShowClick}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.onHandleShowClick}>
              Close
            </Button>
            <Button variant="primary" onClick={this.onHandleShowClick}>
              Upload
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
