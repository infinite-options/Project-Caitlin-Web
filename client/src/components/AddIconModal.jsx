import React, { Component, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Form, Row, Col } from "react-bootstrap";

export default class AddIconModal extends Component {
  constructor(props) {
    super(props);
    console.log(props.parentFunction);
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

  onSubmitIcon = () => {
    let toggle = this.state.show;
    this.setState({ show: !toggle });
    this.props.parentFunction(this.state.photo_url);
  };

  render() {
    return (
      <>
        <Button
          variant="primary"
          style={{ marginRight: "15px", marginLeft: "15px" }}
          onClick={this.onHandleShowClick}
        >
          Change Icon
        </Button>

        <Modal show={this.state.show} onHide={this.onHandleShowClick}>
          <Modal.Header closeButton>
            <Modal.Title>Icon List</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div>
              <div>Hygiene</div>

              <button //cleansing
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://img.icons8.com/ios/50/000000/cleansing.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://img.icons8.com/ios/50/000000/cleansing.png"
                ></img>
              </button>

              <button //shower
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://img.icons8.com/nolan/64/shower.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://img.icons8.com/nolan/64/shower.png"
                ></img>
              </button>

              <button //modern-razor
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://img.icons8.com/ios/50/000000/modern-razor.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://img.icons8.com/ios/50/000000/modern-razor.png"
                ></img>
              </button>

              <button //toilet-bowl
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://img.icons8.com/dusk/64/000000/toilet-bowl.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://img.icons8.com/dusk/64/000000/toilet-bowl.png"
                ></img>
              </button>

              <button //toothpaste
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://img.icons8.com/officel/80/000000/toothpaste.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://img.icons8.com/officel/80/000000/toothpaste.png"
                ></img>
              </button>

              <button //toothbursh
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://img.icons8.com/officel/40/000000/toothbrush.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://img.icons8.com/officel/40/000000/toothbrush.png"
                ></img>
              </button>

              <button //tooth-cleaning-kit
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://img.icons8.com/ios/50/000000/tooth-cleaning-kit.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://img.icons8.com/ios/50/000000/tooth-cleaning-kit.png"
                ></img>
              </button>

              <button //smiling-mouth
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://img.icons8.com/plasticine/100/000000/smiling-mouth.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://img.icons8.com/plasticine/100/000000/smiling-mouth.png"
                ></img>
              </button>
            </div>
            <div>
              <div>Clothing</div>
              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://img.icons8.com/cotton/64/000000/t-shirt--v1.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://img.icons8.com/cotton/64/000000/t-shirt--v1.png"
                ></img>
              </button>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://img.icons8.com/ultraviolet/80/000000/trousers.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://img.icons8.com/ultraviolet/80/000000/trousers.png"
                ></img>
              </button>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://img.icons8.com/officel/80/000000/mens-pajama.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://img.icons8.com/officel/80/000000/mens-pajama.png"
                ></img>
              </button>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://img.icons8.com/officel/80/000000/womens-pajama.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://img.icons8.com/officel/80/000000/womens-pajama.png"
                ></img>
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
                <img
                  height="70px"
                  width="auto"
                  src="https://img.icons8.com/ios/100/000000/treadmill.png"
                ></img>
              </button>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://img.icons8.com/color/96/000000/sit-ups.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://img.icons8.com/color/96/000000/sit-ups.png"
                ></img>
              </button>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://img.icons8.com/color/96/000000/bench-press.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://img.icons8.com/color/96/000000/bench-press.png"
                ></img>
              </button>
            </div>

            <div>
              <div>Food</div>
              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://img.icons8.com/color/96/000000/breakfast.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://img.icons8.com/color/96/000000/breakfast.png"
                ></img>
              </button>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://img.icons8.com/cotton/64/000000/pancake.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://img.icons8.com/cotton/64/000000/pancake.png"
                ></img>
              </button>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://img.icons8.com/cotton/64/000000/sunny-side-up-eggs--v1.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://img.icons8.com/cotton/64/000000/sunny-side-up-eggs--v1.png"
                ></img>
              </button>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://img.icons8.com/cotton/64/000000/croissant--v1.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://img.icons8.com/cotton/64/000000/croissant--v1.png"
                ></img>
              </button>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://img.icons8.com/fluent/48/000000/hamburger.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://img.icons8.com/fluent/48/000000/hamburger.png"
                ></img>
              </button>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://static.thenounproject.com/png/2820604-200.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://static.thenounproject.com/png/2820604-200.png"
                ></img>
              </button>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://static.thenounproject.com/png/3256493-200.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://static.thenounproject.com/png/3256493-200.png"
                ></img>
              </button>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://static.thenounproject.com/png/2034609-200.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://static.thenounproject.com/png/2034609-200.png"
                ></img>
              </button>
            </div>

            <div>
              <div>Activities</div>
              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://img.icons8.com/color/96/000000/goal--v1.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://img.icons8.com/color/96/000000/goal--v1.png"
                ></img>
              </button>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://img.icons8.com/fluent/96/000000/todo-list.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://img.icons8.com/fluent/96/000000/todo-list.png"
                ></img>
              </button>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://img.icons8.com/officel/80/000000/tear-off-calendar.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://img.icons8.com/officel/80/000000/tear-off-calendar.png"
                ></img>
              </button>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://static.thenounproject.com/png/1241697-200.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://static.thenounproject.com/png/1241697-200.png"
                ></img>
              </button>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://static.thenounproject.com/png/1471877-200.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://static.thenounproject.com/png/1471877-200.png"
                ></img>
              </button>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://static.thenounproject.com/png/1471869-200.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://static.thenounproject.com/png/1471869-200.png"
                ></img>
              </button>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://static.thenounproject.com/png/1508065-200.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://static.thenounproject.com/png/1508065-200.png"
                ></img>
              </button>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://static.thenounproject.com/png/2998860-200.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://static.thenounproject.com/png/2998860-200.png"
                ></img>
              </button>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://static.thenounproject.com/png/1471876-200.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://static.thenounproject.com/png/1471876-200.png"
                ></img>
              </button>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://static.thenounproject.com/png/1471886-200.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://static.thenounproject.com/png/1471886-200.png"
                ></img>
              </button>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://static.thenounproject.com/png/1471882-200.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://static.thenounproject.com/png/1471882-200.png"
                ></img>
              </button>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://static.thenounproject.com/png/1471862-200.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://static.thenounproject.com/png/1471862-200.png"
                ></img>
              </button>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://static.thenounproject.com/png/2562018-200.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://static.thenounproject.com/png/2562018-200.png"
                ></img>
              </button>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://static.thenounproject.com/png/2513091-200.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://static.thenounproject.com/png/2513091-200.png"
                ></img>
              </button>

              <button
                onClick={(e) =>
                  this.onPhotoClick(
                    "https://static.thenounproject.com/png/2085421-200.png"
                  )
                }
              >
                <img
                  height="70px"
                  width="auto"
                  src="https://static.thenounproject.com/png/2085421-200.png"
                ></img>
              </button>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={this.onHandleShowClick}>
              Close
            </Button>
            <Button variant="primary" onClick={this.onSubmitIcon}>
              Add Icon
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
