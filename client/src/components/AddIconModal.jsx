import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { Form, Row, Col } from "react-bootstrap";

export default class AddIconModal extends Component {
  constructor(props) {
    super(props);
    // console.log(props.parentFunction);
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
    // console.log("this is the E: ", e);
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
          variant="outline-primary"
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

              <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/toothbrush.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/toothbrush.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/toothpaste-2.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/toothpaste-2.png"
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
              <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/bath.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/bath.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/broom-dustpan.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/broom-dustpan.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/shower-bath.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/shower-bath.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/wash-hands.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/wash-hands.png"
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
              <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/clean-laundry.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/clean-laundry.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/hooded-sweatshirt.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/hooded-sweatshirt.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/laundry.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/laundry.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/socks.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/socks.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/mittens.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/mittens.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/winter-hat.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/winter-hat.png"
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
                      "icons/push-ups.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/push-ups.png"
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
                      "icons/dessert.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/dessert.png"
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
              <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/apple.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/apple.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/bag-lunch.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/bag-lunch.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/breakfast.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/breakfast.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/fruits.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/fruits.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/rice.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/rice.png"
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
                      "icons/clean-couch.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/clean-couch.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/clean-dishes.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/clean-dishes.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/clean-dishes2.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/clean-dishes2.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/clean-ears.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/clean-ears.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/clean-kitchen.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/clean-kitchen.png"
                  ></img>
                </button>

              <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/boiling-pot.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/boiling-pot.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/boiling-pot copy.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/boiling-pot copy.png"
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
            <div>
              <div>other</div>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/alarm-clock.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/alarm-clock.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/analysis.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/analysis.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/audio.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/audio.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/backpack.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/backpack.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/bandages.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/bandages.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/bedtime-story.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/bedtime-story.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/bell.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/bell.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/bike.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/bike.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/bird.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/bird.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/bird-song.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/bird-song.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/blender.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/blender.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/blender2.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/blender2.png"
                  ></img>
                </button>
                
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/bus.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/bus.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/camera.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/camera.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/camera copy.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/camera copy.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/cat.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/cat.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/cat-food.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/cat-food.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/cat2.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/cat2.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/chess-hand.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/chess-hand.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/chess-rook.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/chess-rook.png"
                  ></img>
                </button>
                
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/clock.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/clock.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/clothes-hanger.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/clothes-hanger.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/coffee-machine.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/coffee-machine.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/computer-mouse.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/computer-mouse.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/contact-lenses.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/contact-lenses.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/coupon.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/coupon.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/credit-card.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/credit-card.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/deodorant-stick.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/deodorant-stick.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/desert-road.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/desert-road.png"
                  ></img>
                </button>
                
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/directions.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/directions.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/discussion.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/discussion.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/documents-pen.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/documents-pen.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/dog-bone.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/dog-bone.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/dog-bone-twist.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/dog-bone-twist.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/dog-bowl.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/dog-bowl.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/dog-food.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/dog-food.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/dog-food-2.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/dog-food-2.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/dog-walk.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/dog-walk.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/dollar-bill.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/dollar-bill.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/door.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/door.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/door-lock.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/door-lock.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/dry-cleaning.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/dry-cleaning.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/dryer.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/dryer.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/drying-dish.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/drying-dish.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/duffel-bag.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/duffel-bag.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/envelope.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/envelope.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/eye.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/eye.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/eye-glasses.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/eye-glasses.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/family.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/family.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/fetch-dog.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/fetch-dog.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/flower.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/flower.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/flower-pot.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/flower-pot.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/folded-towels.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/folded-towels.png"
                  ></img>
                </button>
                
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/frying-pan.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/frying-pan.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/garage.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/garage.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/garbage-can.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/garbage-can.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/gift.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/gift.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/groceries.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/groceries.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/grocery-bag.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/grocery-bag.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/guitar.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/guitar.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/hair-brush.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/hair-brush.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/hair-drier.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/hair-drier.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/happy-star.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/happy-star.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/health-call.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/health-call.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/homework.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/homework.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/hot-kettle.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/hot-kettle.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/hot-mug.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/hot-mug.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/hot-tea.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/hot-tea.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/house-keys.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/house-keys.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/idea.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/idea.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/injection.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/injection.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/iron.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/iron.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/journal.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/journal.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/juice.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/juice.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/kettle-2.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/kettle-2.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/lamp.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/lamp.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/laundry-soap.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/laundry-soap.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/leash.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/leash.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/lock.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/lock.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/mailbox.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/mailbox.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/makeup.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/makeup.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/meal.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/meal.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/meal-time.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/meal-time.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/microwave.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/microwave.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/money-stack.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/money-stack.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/moon-and-stars.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/moon-and-stars.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/music.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/music.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/old-phone.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/old-phone.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/package.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/package.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/park.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/park.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/people-talk.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/people-talk.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/person.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/person.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/picture.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/picture.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/piggybank.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/piggybank.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/pillow.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/pillow.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/pills.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/pills.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/printer1.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/printer1.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/printer2.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/printer2.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/progress-completion.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/progress-completion.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/purse.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/purse.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/puzzle.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/puzzle.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/puzzle2.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/puzzle2.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/question-mark.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/question-mark.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/radio.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/radio.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/read-book.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/read-book.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/receipt.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/receipt.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/recycle.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/recycle.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/repeat.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/repeat.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/scooter.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/scooter.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/shaving.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/shaving.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/shooting-stars.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/shooting-stars.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/sleep.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/sleep.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/smart-watch.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/smart-watch.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/smiley-face.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/smiley-face.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/sneakers.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/sneakers.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/sports.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/sports.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/store.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/store.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/stretching.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/stretching.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/sunshine.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/sunshine.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/syrringe.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/syrringe.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/telephone-call.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/telephone-call.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/television.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/television.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/text-message.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/text-message.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/three-pills.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/three-pills.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/toaster.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/toaster.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/toilet-paper.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/toilet-paper.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/tools.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/tools.png"
                  ></img>
                </button>
                
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/tracker.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/tracker.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/umbrella.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/umbrella.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/utensils.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/utensils.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/vacuum.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/vacuum.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/wake-up.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/wake-up.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/wallet.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/wallet.png"
                  ></img>
                </button>
                
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/washing-machine.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/washing-machine.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/water-bottle.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/water-bottle.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/water-glass.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/water-glass.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/weight-scale.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/weight-scale.png"
                  ></img>
                </button>
                <button
                  onClick={(e) =>
                    this.onPhotoClick(
                      "icons/wristwatch.png"
                    )
                  }
                >
                  <img
                    height="70px"
                    width="auto"
                    src="icons/wristwatch.png"
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
