import React, { Component, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Form, Row, Col } from "react-bootstrap";
import { storage } from "./firebase";

export default class UploadImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      image: null,
      url: "",
      progress: 0,
      saltedImageName: "",
    };
  }

  onHandleShowClick = () => {
    let toggle = this.state.show;
    this.setState({ show: !toggle });
  };

  onChange = (e) => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      this.setState({ image: image });
    }
  };

  onClickUpload = () => {
    if (this.state.image === null) {
      alert("Please select an image to upload");
      return;
    }

    // var storageRef = storage.ref(this.state.image.name);
    //console.log("storageRef: ", storageRef);
    const salt = Math.floor(Math.random() * 9999999999);
    let image_name = this.state.image.name;
    image_name = image_name + salt.toString();
    this.setState({ saltedImageName: image_name });
    const uploadTask = storage
      .ref(`UploadIcon/${image_name}`)
      .put(this.state.image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progrss function ....
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.setState({ progress });
      },
      (error) => {
        // error function ....
        console.log(error);
      },
      () => {
        // complete function ....
        storage
          .ref("UploadIcon")
          .child(this.state.saltedImageName)
          .getDownloadURL()
          .then((url) => {
            this.setState({ url });
          });
      }
    );
  };

  onClickConfirm = () => {
    if (this.state.progress === 100) {
      this.setState({ progress: 0 });
      this.props.parentFunction(this.state.url);
      this.onHandleShowClick();
    } else if (this.state.progress !== 100 && this.state.progress > 0) {
      alert("Image is still uploading");
      return;
    } else {
      alert("Please upload an image");
      return;
    }
  };

  render() {
    return (
      <>
        <Button variant="outline-primary" onClick={this.onHandleShowClick}>
          Upload Image
        </Button>

        <Modal show={this.state.show} onHide={this.onHandleShowClick}>
          <Modal.Header closeButton>
            <Modal.Title>Upload Image</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div>Upload Image</div>
            <input type="file" onChange={this.onChange} />
            <Button variant="dark" onClick={this.onClickUpload}>
              Upload
            </Button>
            <progress value={this.state.progress} max="100" />
            <img
              src={this.state.url || "http://via.placeholder.com/400x300"}
              alt="Uploaded images"
              height="300"
              width="400"
            />
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={this.onHandleShowClick}>
              Close
            </Button>
            <Button variant="primary" onClick={this.onClickConfirm}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
