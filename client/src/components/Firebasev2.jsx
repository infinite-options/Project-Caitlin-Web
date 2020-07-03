import React from "react";
import firebase from "./firebase";
import { firestore } from "firebase";
import {
  ListGroup,
  Button,
  Row,
  Col,
  Modal,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import AddNewGRItem from "./addNewGRItem.jsx";
import AddNewATItem from "./addNewATItem.jsx";
import AddNewISItem from "./addNewISItem.jsx";
import DeleteISItem from "./DeleteISItem.jsx";
import ShowHistory from "./ShowHistory.jsx";
import DeleteAT from "./deleteAT.jsx";
import DeleteGR from "./deleteGR.jsx";
import EditGR from "./editGR.jsx";
import EditIS from "./editIS.jsx";
import EditAT from "./EditAT.jsx";
import ShowATList from "./ShowATList";
import ShowISList from "./ShowISList";
import MustDoAT from "./MustDoAT";
import EditIcon from "./EditIcon.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUserAltSlash,
  faTrophy,
  faRunning,
  faBookmark,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

/**
 * Notes from Tyler:
 * 2/17/2020
 * TODOs:
 *
 * 1.Times from GR are not passed down to AT and times from AT are not passed
 * to IS
 *
 * 2.Clicking on the Goal and Routine at the top level should closed previous
 * AT and IS Modals.
 *
 *
 *
 */

export default class FirebaseV2 extends React.Component {
  constructor(props) {
    super(props);
    console.log("this is the prop original goal ", this.props.originalGoalsAndRoutineArr)
    this.state = {
      firebaseRootPath: firebase
      .firestore()
      .collection("users")
      .doc(this.props.theCurrentUserID),
    is_sublist_available: true,
    showEditModal: false,
    indexEditing: "",
    //This single GR item is passed to AddNewATItem to help processed the new item
    singleGR: {
      //everytime a goal/routine is clicked, we open a modal and the modal info will be provided by this object
      show: false, // Show the modal
      type: "None",
      title: "GR Name",
      photo: "",
      available_end_time: new Date(), //TODO get these used
      available_start_time: new Date(), //TODO get these used
      id: null,
      arr: [],
      fbPath: null,
    },

    singleAT: {
      //for each action/task we click on, we open a new modal to show the steps/instructions affiliate
      //with the task
      show: false, // Show the model
      type: "None", // Action or Task
      title: "AT Name", //Title of action task ,
      available_end_time: new Date(), //TODO get these used
      available_start_time: new Date(), //TODO get these used
      photo: "",
      id: null, //id of Action Task
      arr: [], //array of instruction/steps formatted to display as a list
      fbPath: null, //Firebase direction to the arr
    },
    singleATitemArr: [], //temp fix for my bad memory of forgetting to add this in singleGR
    singleISitemArr: [], //temp fix for my bad memory of forgetting to add this in singleAT
    // modalWidth: "350px", //primary width size for all modals
    modalWidth: "390px",

    //Use to decided whether to show the respective modals
    addNewGRModalShow: false,
    historyViewShow: false,
    addNewATModalShow: false,
    addNewISModalShow: false,

    //used to determine thumbnail picture size
    thumbnailWidth: "150px",
    thumbnailHeight: "100px",
    thumbnailWidthV2: "200px",
    thumbnailHeightV2: "50px",

    //isRoutine is to check whether we clicked on add routine or add goal
    isRoutine: true,
    availabilityColorCode: "#D6A34C",

    //For setting default time for the AT Item
    timeSlotForAT: [],
    timeSlotForIS: [],

    routine_completed: false,
    };
  }
  // state = {
  //   firebaseRootPath: firebase
  //     .firestore()
  //     .collection("users")
  //     .doc(this.props.theCurrentUserID),
  //   // .doc("7R6hAVmDrNutRkG3sVRy"),
  //   is_sublist_available: true,
  //   showEditModal: false,
  //   indexEditing: "",
  //   //This single GR item is passed to AddNewATItem to help processed the new item
  //   singleGR: {
  //     //everytime a goal/routine is clicked, we open a modal and the modal info will be provided by this object
  //     show: false, // Show the modal
  //     type: "None",
  //     title: "GR Name",
  //     photo: "",
  //     available_end_time: new Date(), //TODO get these used
  //     available_start_time: new Date(), //TODO get these used
  //     id: null,
  //     arr: [],
  //     fbPath: null,
  //   },

  //   singleAT: {
  //     //for each action/task we click on, we open a new modal to show the steps/instructions affiliate
  //     //with the task
  //     show: false, // Show the model
  //     type: "None", // Action or Task
  //     title: "AT Name", //Title of action task ,
  //     available_end_time: new Date(), //TODO get these used
  //     available_start_time: new Date(), //TODO get these used
  //     photo: "",
  //     id: null, //id of Action Task
  //     arr: [], //array of instruction/steps formatted to display as a list
  //     fbPath: null, //Firebase direction to the arr
  //   },
  //   singleATitemArr: [], //temp fix for my bad memory of forgetting to add this in singleGR
  //   singleISitemArr: [], //temp fix for my bad memory of forgetting to add this in singleAT
  //   // modalWidth: "350px", //primary width size for all modals
  //   modalWidth: "390px",

  //   //Use to decided whether to show the respective modals
  //   addNewGRModalShow: false,
  //   historyViewShow: false,
  //   addNewATModalShow: false,
  //   addNewISModalShow: false,

  //   //used to determine thumbnail picture size
  //   thumbnailWidth: "150px",
  //   thumbnailHeight: "100px",
  //   thumbnailWidthV2: "200px",
  //   thumbnailHeightV2: "50px",

  //   //isRoutine is to check whether we clicked on add routine or add goal
  //   isRoutine: true,
  //   availabilityColorCode: "#D6A34C",

  //   //For setting default time for the AT Item
  //   timeSlotForAT: [],
  //   timeSlotForIS: [],

  //   routine_completed: false,

  //   //used for the list item icon.If at GR and this icon is turned off. then wont be able to show Action and taske list.
  //   // iconShowATModal: true
  // };

  /**
   * refreshATItem:
   * Given a array, it will replace the current array of singleGR which holds the layout
   * list of all action task under it and singleATitemArr which just holds the raw data.
   *
   */
  refreshATItem = (arr) => {
    // console.log("refreshATItem was called");

    this.setState({ singleATitemArr: arr });
    let resArr = this.createListofAT(arr);
    let singleGR = this.state.singleGR;
    singleGR.arr = resArr;
    this.setState({ singleGR: singleGR });
  };

  /**
   *
   * refreshISItem - given A array item,
   * this method will take those items,
   * put it in the list form to present
   * as a list of instructions and the
   * it will also update the array of
   * the normal list of instructions with
   * the one passed in.
   */
  refreshISItem = (arr) => {
    // console.log("refreshISItem new arr");
    // console.log(arr);
    this.setState({
      singleISitemArr: arr,
    });
    let resArr = this.createListofIS(arr);
    let singleAt = this.state.singleAT;
    singleAt.arr = resArr;
    this.setState({ singleAT: singleAt });
  };

  // constructor(props) {
  //   // serves almost no purpose currently
  //   super(props);
  //   // console.log("running Firebase 2");
  //   // this.state = {date: new Date()};
  // }

  componentDidMount() {

    //Grab the
    // this.grabFireBaseRoutinesGoalsData();
    // console.log("going into compoent did mount");
  }

  /**
   * grabFireBaseRoutinesGoalsData:
   * this function grabs the goals&routines array from the path located in this function
   * which will then populate the goals, routines,originalGoalsAndRoutineArr array
   * separately. The arrays will be used for display and data manipulation later.
   *
   */
  grabFireBaseRoutinesGoalsData = () => {
    this.props.grabFireBaseRoutinesGoalsData();
    // const db = firebase.firestore();
    // // console.log("FirebaseV2 component did mount");
    // // console.log("this is the current userid", this.state.currentUserId);
    // if (this.state.currentUserId !== "") {
    //   //  const docRef = db.collection("users").doc("7R6hAVmDrNutRkG3sVRy");
    //   const docRef = db.collection("users").doc(this.state.currentUserId);
    //   // console.log("this is suppose tto be the path", docRef);
    //   docRef
    //   .get()
    //   .then((doc) => {
    //     if (doc.exists) {
    //       // console.log(doc.data());
    //       var x = doc.data();
    //       // console.log("this is the data", x);
    //       // console.log(x["goals&routines"]);
    //       // x = x["goals&routines"];
          
    //       let routine = [];
    //       let routine_ids = [];
    //       let goal = [];
    //       let goal_ids = [];
    //       if (x["goals&routines"] !== undefined) {
    //         x = x["goals&routines"];
    //         // console.log("this is the goals and routines", x);
    //         x.sort((a,b) => {
    //           let timeA = new Date(a["start_day_and_time"]);
    //           let timeB = new Date(b["start_day_and_time"]);
    //           return timeA.getTime() - timeB.getTime();
    //         });
    //         // console.log("sorted goals and routines", x);
    //         for (let i = 0; i < x.length; ++i) {
    //           if (x[i]["is_persistent"]) {
    //             // console.log("routine " + x[i]["title"]);
    //             // console.log("is the is the id ", x[i].id);
    //             routine_ids.push(i);
    //             routine.push(x[i]);
    //           } else if (!x[i]["is_persistent"]) {
    //             // console.log("not routine " + x[i]["title"]);
    //             goal_ids.push(i);
    //             goal.push(x[i]);
    //           }
    //         }
    //         console.log("this si the original goals and routines grabed from firebase ", x);
    //         this.setState({
    //           originalGoalsAndRoutineArr: x,
    //           // goals: goal,
    //           // addNewGRModalShow: false,
    //           // routine_ids: routine_ids,
    //           // goal_ids: goal_ids,
    //           // routines: routine,
    //         });
    //       } else {
    //         console.log("this si the original goals and routines grabed from firebase  blank", x);
    //         this.setState({
    //           originalGoalsAndRoutineArr: [],
    //           // goals: goal,
    //           // addNewGRModalShow: false,
    //           // routine_ids: routine_ids,
    //           // goal_ids: goal_ids,
    //           // routines: routine,
    //         });
    //       }
    //     } else {
    //       // doc.data() will be undefined in this case
    //       console.log("No such document!");
    //     }
    //   })
    //   .catch(function (error) {
    //     console.log("Error getting document:", error);
    //   });
    // }
    // this.props.grabFireBaseRoutinesGoalsData();
  };

  // componentWillUnmount() {
  //   console.log(" FirebaseV2 will unmount web");
  // }

  formatDateTime(str) {
    //const formattedStr = str.replace(/\//g, "-");
    const formattedStr = str;
    const time = moment(formattedStr);
    return time.format("YYYY MMM DD HH:mm");
  }

  // onInputChange = (e) => {
  //   const inputField = e.target.value;
  //   // console.log("FirebaseV2.jsx :: onInputChange :: " + inputField);
  // };
  //This function essentially grabs all action/tasks
  //for the routine or goal passed in and pops open the
  //modal for the action/task
  getATList = (id, title, persist) => {
    const db = firebase.firestore();
    // console.log("getATList function with id : " + id);
    let docRef = db
      .collection("users")
      .doc(this.props.theCurrentUserID)
      // .doc("7R6hAVmDrNutRkG3sVRy")
      .collection("goals&routines")
      .doc(id);
    // console.log("this si the goals and routines", id);
    // console.log("this si the correct path", docRef);
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log(doc.data());
          var x = doc.data()["actions&tasks"];
          console.log(x);
          if (x == null) {
            // console.log("No actions&tasks array!");
            let singleGR = {
              //Variable to hold information about the parent Goal/ Routine
              show: true,
              type: persist ? "Routine" : "Goal",
              title: title,
              id: id,
              arr: [],
              fbPath: docRef,
            };
            this.setState({
              singleGR: singleGR,
              singleATitemArr: [],
            });
            return;
          }

          let singleGR = {
            //initialise without list to pass fbPath to child
            show: true,
            type: persist ? "Routine" : "Goal",
            title: title,
            id: id,
            arr: [], //array of current action/task in this singular Routine
            fbPath: docRef,
          };

          this.setState({
            singleGR: singleGR,
            singleATitemArr: x,
          });

          let resArr = this.createListofAT(x);
          //assemble singleGR template here:

          singleGR = {
            show: true,
            type: persist ? "Routine" : "Goal",
            title: title,
            id: id,
            arr: resArr, //array of current action/task in this singular Routine
            fbPath: docRef,
          };

          this.setState({
            singleGR: singleGR,
          });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  };

  //Creates a array of all actions/task for get getATList function
  //getATList stands for get all action/task
  createListofAT = (A) => {
    let res = [];
    for (let i = 0; i < A.length; i++) {
      // console.log(A[i]["title"]);
      if (!A[i]["id"] || !A[i]["title"]) {
        // console.log("missing title, or id at index : " + i);
        return [];
      }
      let tempID = A[i]["id"];
      let tempPhoto = A[i]["photo"];
      // console.log(tempPhoto);
      let tempTitle = A[i]["title"];
      let tempAvailable = A[i]["is_available"];
      res.push(
        <div key={"AT" + i}>
          <ListGroup.Item
            action
            onClick={() => {
              this.ATonClickEvent(tempTitle, tempID);
            }}
            variant="light"
            style={{ marginBottom: "3px" }}
          >
            <Row
              style={{ margin: "0", marginBottom: "10px" }}
              className="d-flex flex-row-center"
            >
              <Col>
                <div className="fancytext">{tempTitle}</div>
              </Col>
            </Row>

            {tempPhoto ? (
              <Row>
                <Col
                  xs={7}
                  // sm="auto"
                  // md="auto"
                  // lg="auto"
                  style={{ paddingRight: "0px" }}
                >
                  <img
                    src={tempPhoto}
                    alt="Action/Task"
                    // height={this.state.thumbnailHeight}
                    // width={this.state.thumbnailWidth}
                    className="center"
                    height="80px"
                    width="auto"
                  />
                </Col>
                <Col style={{ paddingLeft: "0px" }}>
                  <Row style={{ marginTop: "10px" }}>
                    {tempAvailable ? (
                      <div style={{ marginLeft: "5px" }}>
                        <FontAwesomeIcon
                          title="Available to Cailin"
                          style={{ color: this.state.availabilityColorCode }}
                          onClick={(e) => {
                            e.stopPropagation();
                            alert("Item Is Availble to the user");
                          }}
                          icon={faUser}
                          size="lg"
                        />{" "}
                      </div>
                    ) : (
                      <div>
                        <FontAwesomeIcon
                          title="Unavailable to the user"
                          style={{ color: "#000000" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            alert("Item Is NOT Availble to the user");
                          }}
                          icon={faUserAltSlash}
                          size="lg"
                        />
                      </div>
                    )}
                    {/* Index={this.findIndexByID(tempID)}
                    Array={this.state.originalGoalsAndRoutineArr}
                    Path={this.state.firebaseRootPath} */}
                    <ShowISList
                      Index={i}
                      Array={this.state.singleATitemArr}
                      Path={this.state.singleGR.fbPath}
                    />

                    <MustDoAT
                      Index={i}
                      Array={this.state.singleATitemArr}
                      SingleAT={this.state.singleATitemArr[i]}
                      Path={this.state.singleGR.fbPath}
                    />
                  </Row>

                  <Row style={{ marginTop: "15px", marginBottom: "10px" }}>
                    <DeleteAT
                      deleteIndex={i}
                      type={"actions&tasks"}
                      Array={this.state.singleATitemArr} //Holds the raw data for all the is in the single action
                      Item={this.state.singleGR} //holds complete data for action task: fbPath, title, etc
                      refresh={this.refreshATItem}
                    />
                    <EditAT
                      marginLeftV="-170px"
                      i={i} //index to edit
                      ATArray={this.state.singleATitemArr} //Holds the raw data for all the is in the single action
                      FBPath={this.state.singleGR.fbPath} //holds the path to the array data
                      refresh={this.refreshATItem} //function to refresh AT data
                    />
                  </Row>
                </Col>
              </Row>
            ) : (
              <div>
                <Row style={{ marginLeft: "100px" }} className="d-flex ">
                  {tempAvailable ? (
                    <div style={{ marginLeft: "5px" }}>
                      <FontAwesomeIcon
                        title="Available to Cailin"
                        style={{ color: this.state.availabilityColorCode }}
                        onClick={(e) => {
                          e.stopPropagation();
                          alert("Item Is Availble to the user");
                        }}
                        icon={faUser}
                        size="lg"
                      />{" "}
                    </div>
                  ) : (
                    <div>
                      <FontAwesomeIcon
                        title="Unavailable to the user"
                        style={{ color: "#000000" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          alert("Item Is NOT Availble to the user");
                        }}
                        icon={faUserAltSlash}
                        size="lg"
                      />
                    </div>
                  )}
                  <ShowISList
                    Index={i}
                    Array={this.state.singleATitemArr}
                    Path={this.state.singleGR.fbPath}
                  />
                </Row>
                <Row
                  style={{ marginTop: "15px", marginLeft: "100px" }}
                  className="d-flex "
                >
                  <DeleteAT
                    deleteIndex={i}
                    type={"actions&tasks"}
                    Array={this.state.singleATitemArr} //Holds the raw data for all the is in the single action
                    Item={this.state.singleGR} //holds complete data for action task: fbPath, title, etc
                    refresh={this.refreshATItem}
                  />
                  <EditAT
                    marginLeftV="-130px"
                    i={i} //index to edit
                    ATArray={this.state.singleATitemArr} //Holds the raw data for all the is in the single action
                    FBPath={this.state.singleGR.fbPath} //holds the path to the array data
                    refresh={this.refreshATItem} //function to refresh AT data
                  />
                </Row>
              </div>
            )}
          </ListGroup.Item>
        </div>
      );
    }
    return res;
  };

  /**
   * takes the list of steps/instructions and returns
   * it in the form of a ListGroup for presentation
   */
  createListofIS = (A) => {
    let res = [];
    for (let i = 0; i < A.length; i++) {
      // console.log(A[i]["title"]);
      // console.log(A[i]["id"]);
      /**
       * TODO: notify jeremy of this issue:
       * Some of these here don't have IDs, so we need to
       * ignore it for now
       */
      let tempPhoto = A[i]["photo"];
      // console.log("IS index " + i + " photo url :" + tempPhoto);
      let tempTitle = A[i]["title"];
      let tempAvailable = A[i]["is_available"];
      res.push(
        <div key={"IS" + i} style={{ width: "100%" }}>
          <ListGroup.Item
            action
            onClick={() => {
              this.ISonClickEvent(tempTitle);
            }}
            variant="light"
            style={{ width: "100%", marginBottom: "3px" }}
          >
            <Row
              style={{ margin: "0", marginBottom: "10px" }}
              className="d-flex flex-row-center"
            >
              <Col>
                <div className="fancytext">{tempTitle}</div>
              </Col>
            </Row>
            {tempPhoto ? (
              <Row>
                <Col xs={7} style={{ paddingRight: "0px" }}>
                  <img
                    src={tempPhoto}
                    alt="Action/Task"
                    className="center"
                    height="80px"
                    width="auto"
                  />
                </Col>
                <Col style={{ paddingLeft: "0px" }}>
                  <Row style={{ marginTop: "10px" }}>
                    {tempAvailable ? (
                      <div style={{ marginLeft: "5px" }}>
                        <FontAwesomeIcon
                          title="Available to Cailin"
                          style={{ color: this.state.availabilityColorCode }}
                          onClick={(e) => {
                            e.stopPropagation();
                            alert("Item Is Availble to the user");
                          }}
                          icon={faUser}
                          size="lg"
                        />{" "}
                      </div>
                    ) : (
                      <div>
                        <FontAwesomeIcon
                          title="Unavailable to the user"
                          style={{ color: "#000000" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            alert("Item Is NOT Availble to the user");
                          }}
                          icon={faUserAltSlash}
                          size="lg"
                        />
                      </div>
                    )}
                    {/* <ShowATList /> */}
                  </Row>
                  <Row style={{ marginTop: "15px", marginBottom: "10px" }}>
                    <DeleteISItem
                      deleteIndex={i}
                      ISArray={this.state.singleISitemArr} //Holds the raw data for all the is in the single action
                      ISItem={this.state.singleAT} //holds complete data for action task: fbPath, title, etc
                      refresh={this.refreshISItem}
                    />

                    <EditIS
                      marginLeftV="-170px"
                      i={i} //index to edit
                      ISArray={this.state.singleISitemArr} //Holds the raw data for all the is in the single action
                      FBPath={this.state.singleAT.fbPath} //holds the fbPath to arr to be updated
                      refresh={this.refreshISItem} //function to refresh IS data
                    />
                  </Row>
                </Col>
              </Row>
            ) : (
              <div>
                <Row style={{ marginLeft: "100px" }} className="d-flex ">
                  {tempAvailable ? (
                    <div style={{ marginLeft: "5px" }}>
                      <FontAwesomeIcon
                        title="Available to Cailin"
                        style={{ color: this.state.availabilityColorCode }}
                        onClick={(e) => {
                          e.stopPropagation();
                          alert("Item Is Availble to the user");
                        }}
                        icon={faUser}
                        size="lg"
                      />{" "}
                    </div>
                  ) : (
                    <div>
                      <FontAwesomeIcon
                        title="Unavailable to the user"
                        style={{ color: "#000000" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          alert("Item Is NOT Availble to the user");
                        }}
                        icon={faUserAltSlash}
                        size="lg"
                      />
                    </div>
                  )}
                  {/* <ShowATList /> */}
                </Row>
                <Row
                  style={{ marginTop: "15px", marginLeft: "100px" }}
                  className="d-flex "
                >
                  <DeleteISItem
                    deleteIndex={i}
                    ISArray={this.state.singleISitemArr} //Holds the raw data for all the is in the single action
                    ISItem={this.state.singleAT} //holds complete data for action task: fbPath, title, etc
                    refresh={this.refreshISItem}
                  />

                  <EditIS
                    marginLeftV="-130px"
                    i={i} //index to edit
                    ISArray={this.state.singleISitemArr} //Holds the raw data for all the is in the single action
                    FBPath={this.state.singleAT.fbPath} //holds the fbPath to arr to be updated
                    refresh={this.refreshISItem} //function to refresh IS data
                  />
                </Row>
              </div>
            )}
          </ListGroup.Item>
        </div>
      );
    }
    return res;
  };

  ISonClickEvent = (title) => {
    console.log("Inside IS Click " + title);
  };

  /**
   * In this function we are passed in the id title and persist property of the incoming routine/goal
   * and we need to make return a viewable list of all the actions/tasks for this routine/goal
   * which is done in getATList function
   */
  GRonClickEvent = (title, id, persist) => {
    console.log("GRonClickEvent", id, title, persist);
    this.getATList(id, title, persist);
    this.getTimeForAT();
  };

  /**
   * we are passed in the action/task id and title
   * and we will need to grab all steps/Instructions related to this action/task,
   *
   */
  ATonClickEvent = (title, id) => {
    // let stepsInstructionArrayPath = this.state.firebaseRootPath
    let stepsInstructionArrayPath = firebase
      .firestore()
      .collection("users")
      .doc(this.props.theCurrentUserID)
      .collection("goals&routines")
      .doc(this.state.singleGR.id)
      .collection("actions&tasks")
      .doc(id);
    // console.log("This is from ATonClieckEvent");
    // console.log(this.state.singleGR.id);
    // console.log("ATItem id & title: ", id, title);

    //setting timeSlot for IS according its parent AT time
    firebase
      .firestore()
      .collection("users")
      .doc(this.props.theCurrentUserID)
      .collection("goals&routines")
      .doc(this.state.singleGR.id)
      .get()
      .then((snapshot) => {
        let userData = snapshot.data()["actions&tasks"];
        userData.forEach((doc) => {
          if (doc.id === id) {
            let timeSlot = [doc.available_start_time, doc.available_end_time];
            this.setState({ timeSlotForIS: timeSlot });
            console.log("timeSLotForIS:", this.state.timeSlotForIS); //timeSlotForIS[0] == start_time, timeSlotForIS[1] == end_time
          }
        });
      });

    /*
      getTimeForAT = () => {
    console.log("Enter getTimeForAT()");
    let timeSlot = [];
    const db = firestore();
    db.collection("users")
      .doc(this.props.theCurrentUserID)
      .get()
      .then((snapshot) => {
        let userData = snapshot.data();
        let userGR = userData["goals&routines"];
        userGR.forEach((doc) => {
          console.log("This is from useGR: ", this.state.singleGR);
          if (doc.id === this.state.singleGR.id) {
            timeSlot = [doc.available_start_time, doc.available_end_time];
            this.setState({ timeSlotForAT: timeSlot });
          }
        });
      });
  };
      */

    let temp = {
      show: true,
      type: "Action/Task",
      title: title,
      id: id,
      arr: [],
      fbPath: stepsInstructionArrayPath,
    };
    console.log("this is the path", stepsInstructionArrayPath);
    stepsInstructionArrayPath
      .get()
      .then((doc) => {
        console.log("ths is the doc that doesn exist", doc);
        if (doc.exists) {
          console.log("Grabbing steps/instructions data:");
          console.log(doc.data());
          var x = doc.data();
          x = x["instructions&steps"];
          if (x == null) {
            this.setState({ singleAT: temp });
            return;
          }
          // console.log(x);
          //Below is a fix for fbPath Null when we pass it
          //createListofIS and DeleteISItem.jsx, we need a path
          //to delete the item, so we set the path then create the
          //the array and reset it.
          this.setState({ singleAT: temp, singleISitemArr: x });
          temp.arr = this.createListofIS(x);
          this.setState({ singleAT: temp, singleISitemArr: x });
        } else {
          // doc.data() will be undefined in this case
          console.log("No Instruction/Step documents!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
        alert("Error getting document:", error);
      });
  };

  /**
   * findIndexByID:
   * given a id, it will loop through the original goals and routine array to
   * return the index with the corresonding id
   */
  findIndexByID = (id) => {
    let originalGoalsAndRoutineArr = this.props.originalGoalsAndRoutineArr;
    // console.log("this is the originals Goals and routine from find index ", originalGoalsAndRoutineArr)
    for (let i = 0; i < originalGoalsAndRoutineArr.length; i++) {
      if (id === originalGoalsAndRoutineArr[i].id) {
        return i;
      }
    }
    return -1;
  };

  check_routineCompleted = (theCurrentUserID, rountineID) => {
    let result = firebase
      .firestore()
      .collection("users")
      .doc(theCurrentUserID)
      .collection("goals&routines")
      .doc(rountineID)
      .get()
      .then((docs) => {
        return docs.data()["completed"];
      })
      .catch((error) => {
        console.log("cannot access file.");
        return false;
      });
  };


 

  getRoutines = () => {
    let displayRoutines = [];
    // console.log("props", this.props.routines);
    if (this.props.routines.length !== 0) {
      //Check to make sure routines exists
      for (let i = 0; i < this.props.routines.length; i++) {
        let tempTitle = this.props.routines[i]["title"];
        let tempID = this.props.routines[i]["id"];
        let tempPersist = this.props.routines[i]["is_persistent"];

        displayRoutines.push(
          <div key={"test0" + i}>
            <ListGroup.Item
              action
              onClick={() => {
                console.log("this si the id from display ROutine", tempID);
                console.log(
                  "this si the title from display ROutine",
                  tempTitle
                );
                this.GRonClickEvent(tempTitle, tempID, tempPersist);
              }}
              variant="light"
              style={{ marginBottom: "3px" }}
            >
              <Row
                style={{ margin: "0", marginBottom: "10px" }}
                className="d-flex flex-row-center"
              >
                <Col>
                  <div className="fancytext">
                    {this.props.routines[i]["title"]}
                  </div>
                </Col>
              </Row>

              {this.props.routines[i]["photo"] ? (
                <div>
                <Row>
                  <Col xs={7} style={{ paddingRight: "0px" }}>
                    <img
                      src={this.props.routines[i]["photo"]}
                      alt="Routines"
                      className="center"
                      height="80px"
                      width="auto"
                    />
                  </Col>
                  <Col style={{ paddingLeft: "0px" }}>
                    <Row style={{ marginTop: "10px" }}>
                      {this.props.routines[i]["is_available"] ? (
                        <div style={{ marginLeft: "5px" }}>
                          <FontAwesomeIcon
                            title="Available to Cailin"
                            style={{ color: this.state.availabilityColorCode }}
                            onClick={(e) => {
                              e.stopPropagation();
                              alert("Item Is Availble to the user");
                            }}
                            icon={faUser}
                            size="lg"
                          />{" "}
                        </div>
                      ) : (
                        <div>
                          <FontAwesomeIcon
                            title="Unavailable to the user"
                            style={{ color: "#000000" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              alert("Item Is NOT Availble to the user");
                            }}
                            icon={faUserAltSlash}
                            size="lg"
                          />
                        </div>
                      )}
                      <ShowATList
                        Index={this.findIndexByID(tempID)}
                        Array={this.props.originalGoalsAndRoutineArr}
                        Path={firebase
                          .firestore()
                          .collection("users")
                          .doc(this.props.theCurrentUserID)}
                      />
                    </Row>
                    <Row style={{ marginTop: "15px", marginBottom: "10px" }}>
                      <DeleteGR
                        deleteIndex={this.findIndexByID(tempID)}
                        Array={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                        Path={firebase
                          .firestore()
                          .collection("users")
                          .doc(this.props.theCurrentUserID)}
                        refresh={this.grabFireBaseRoutinesGoalsData}
                      />
                      <EditIcon 
                         openEditModal={() => {
                          this.setState({ showEditModal: true, indexEditing: this.findIndexByID(tempID)  });
                        }}
                        showModal = {this.state.showEditModal}
                        indexEditing = {this.state.indexEditing}
                        i={this.findIndexByID(tempID)} //index to edit
                        ATArray={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                        FBPath={firebase
                          .firestore()
                          .collection("users")
                          .doc(this.props.theCurrentUserID)}
                        refresh={this.grabFireBaseRoutinesGoalsData}
                      />
                      
                    </Row>
                  </Col>
                </Row>
                <Row>
                     
                    {/* {console.log("this is the ATArray fron firbasev2 ",this.props.originalGoalsAndRoutineArr[this.findIndexByID(tempID)] )} */}
                      <EditGR
                          closeEditModal={() => {
                            this.setState({ showEditModal: false });
                            this.props.updateFBGR();
                          }}
                          showModal = {this.state.showEditModal}
                          indexEditing = {this.state.indexEditing}
                          i={this.findIndexByID(tempID)} //index to edit
                          ATArray={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                          FBPath={firebase
                            .firestore()
                            .collection("users")
                            .doc(this.props.theCurrentUserID)}
                          refresh={this.grabFireBaseRoutinesGoalsData} //function to refresh IS data
                          // chnagePhoto = {this.changePhotoIcon()}
                          
                      /> 
                    {/* )} */}
                </Row>
              </div>
              ) : (
                <div>
                  <Row style={{ marginLeft: "100px" }} className="d-flex ">
                    {this.props.routines[i]["is_available"] ? (
                      <div style={{ marginLeft: "5px" }}>
                        <FontAwesomeIcon
                          title="Available to user"
                          style={{ color: this.state.availabilityColorCode }}
                          onClick={(e) => {
                            e.stopPropagation();
                            alert("Item Is Availble to the user");
                          }}
                          icon={faUser}
                          size="lg"
                        />{" "}
                      </div>
                    ) : (
                      <div>
                        <FontAwesomeIcon
                          title="Unavailable to the user"
                          style={{ color: "#000000" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            alert("Item Is NOT Availble to the user");
                          }}
                          icon={faUserAltSlash}
                          size="lg"
                        />
                      </div>
                    )}
                    <ShowATList
                      Index={this.findIndexByID(tempID)}
                      Array={this.props.originalGoalsAndRoutineArr}
                      // Path={this.state.firebaseRootPath}
                      Path={firebase
                        .firestore()
                        .collection("users")
                        .doc(this.props.theCurrentUserID)}
                    />
                  </Row>
                  <Row
                    style={{ marginTop: "15px", marginLeft: "100px" }}
                    className="d-flex "
                  >
                    <DeleteGR
                      deleteIndex={this.findIndexByID(tempID)}
                      Array={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                      // Path={this.state.firebaseRootPath} //holds complete data for action task: fbPath, title, etc
                      Path={firebase
                        .firestore()
                        .collection("users")
                        .doc(this.props.theCurrentUserID)}
                      refresh={this.grabFireBaseRoutinesGoalsData}
                    />
                     <EditIcon 
                         openEditModal={() => {
                          this.setState({ showEditModal: true, indexEditing: this.findIndexByID(tempID)  });
                        }}
                        showModal = {this.state.showEditModal}
                        indexEditing = {this.state.indexEditing}
                        i={this.findIndexByID(tempID)} //index to edit
                        ATArray={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                        FBPath={firebase
                          .firestore()
                          .collection("users")
                          .doc(this.props.theCurrentUserID)}
                        refresh={this.grabFireBaseRoutinesGoalsData}
                      /> 
                  </Row>
                  <Row>
                  <EditGR
                          closeEditModal={() => {
                            this.setState({ showEditModal: false });
                            this.props.updateFBGR();
                          }}
                          showModal = {this.state.showEditModal}
                          indexEditing = {this.state.indexEditing}
                          i={this.findIndexByID(tempID)} //index to edit
                          ATArray={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                          FBPath={firebase
                            .firestore()
                            .collection("users")
                            .doc(this.props.theCurrentUserID)}
                          refresh={this.grabFireBaseRoutinesGoalsData} //function to refresh IS data
                    /> 
                  </Row>
                </div>
              )}
              <Row>
                <div style={{ fontSize: "12px" }}>
                  {this.props.routines[i]["start_day_and_time"] ? (
                    <div style={{ marginTop: "3px" }}>
                      {"Start Time: " +
                        this.formatDateTime(
                          this.props.routines[i]["start_day_and_time"]
                        )
                      }
                    </div>
                  ) : (
                    <div> </div>
                  )}
                  {this.props.routines[i]["end_day_and_time"] ? (
                    <div>
                      {"End Time: " +
                        this.formatDateTime(
                          this.props.routines[i]["end_day_and_time"]
                        )}
                    </div>
                  ) : (
                    <div> </div>
                  )}
                  {this.showRoutineRepeatStatus(i)}
                </div>
              </Row>
            </ListGroup.Item>
          </div>
        );
      }
    }
    return displayRoutines;
  };

  showRoutineRepeatStatus = (i) => {
  	 // console.log(i,this.props.routines[i])
  	 // console.log(this.props.routines[i]["repeat"]);
	 // console.log(this.props.routines[i]["repeat_frequency"]);
	 // console.log(this.props.routines[i]["repeat_every"]);
	 if(!this.props.routines[i]["repeat"]) {
	 	return <div> One time only </div>
	 } else {
		 switch ( this.props.routines[ i ][ "repeat_frequency" ] ) {
		 case "DAY":
		 	 if(this.props.routines[i]["repeat_every"] === "1"){
			    return <div> Repeat daily </div>
		    } else {
		 	   return <div> Repeat every {this.props.routines[i]["repeat_every"]} days </div>
		    }
		 case "WEEK":
			 if(this.props.routines[i]["repeat_every"] === "1"){
				 return <div> Repeat weekly </div>
			 } else {
				 return <div> Repeat every {this.props.routines[i]["repeat_every"]} weeks </div>
			 }
		 case "MONTH":
			 if(this.props.routines[i]["repeat_every"] === "1"){
				 return <div> Repeat monthly </div>
			 } else {
				 return <div> Repeat every {this.props.routines[i]["repeat_every"]} months </div>
			 }
		 case "YEAR":
			 if(this.props.routines[i]["repeat_every"] === "1"){
				 return <div> Repeat annually </div>
			 } else {
				 return <div> Repeat every {this.props.routines[i]["repeat_every"]} years </div>
			 }
		 default:
			 return <div> Show Routine Repeat Options Error</div>;
		 }
	 }
  }
  
  getGoals = () => {
    let displayGoals = [];
    if (this.props.goals.length != null) {
      //Check to make sure routines exists
      for (let i = 0; i < this.props.goals.length; i++) {
        let tempTitle = this.props.goals[i]["title"];
        let tempID = this.props.goals[i]["id"];
        let tempPersist = this.props.goals[i]["is_persistent"];
        displayGoals.push(
          <div key={"test1" + i}>
            <ListGroup.Item
              action
              onClick={() => {
                this.GRonClickEvent(tempTitle, tempID, tempPersist);
              }}
              variant="light"
              style={{ marginBottom: "3px" }}
            >
              <Row
                style={{ margin: "0", marginBottom: "10px" }}
                className="d-flex flex-row-center"
              >
                <Col>
                  <div className="fancytext">{tempTitle}</div>
                </Col>
              </Row>
              {this.props.goals[i]["photo"] ? (
                <div>
                <Row>
                  <Col xs={7} style={{ paddingRight: "0px" }}>
                    <img
                      src={this.props.goals[i]["photo"]}
                      alt="Instructions/Steps"
                      className="center"
                      height="80px"
                      width="auto"
                    />
                  </Col>
                  <Col style={{ paddingLeft: "0px" }}>
                    <Row style={{ marginTop: "10px" }}>
                      {this.props.goals[i]["is_available"] ? (
                        <div style={{ marginLeft: "5px" }}>
                          <FontAwesomeIcon
                            title="Available to Cailin"
                            style={{ color: this.state.availabilityColorCode }}
                            onClick={(e) => {
                              e.stopPropagation();
                              alert("Item Is Availble to the user");
                            }}
                            icon={faUser}
                            size="lg"
                          />{" "}
                        </div>
                      ) : (
                        <div>
                          <FontAwesomeIcon
                            title="Unavailable to the user"
                            style={{ color: "#000000" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              alert("Item Is NOT Availble to the user");
                            }}
                            icon={faUserAltSlash}
                            size="lg"
                          />
                        </div>
                      )}
                      <ShowATList
                        Index={this.findIndexByID(tempID)}
                        Array={this.props.originalGoalsAndRoutineArr}
                        // Path={this.state.firebaseRootPath}
                        Path={firebase
                          .firestore()
                          .collection("users")
                          .doc(this.props.theCurrentUserID)}
                      />
                    </Row>
                    <Row style={{ marginTop: "15px", marginBottom: "10px" }}>
                      <DeleteGR
                        deleteIndex={this.findIndexByID(tempID)}
                        Array={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                        // Path={this.state.firebaseRootPath} //holds complete data for action task: fbPath, title, etc
                        Path={firebase
                          .firestore()
                          .collection("users")
                          .doc(this.props.theCurrentUserID)}
                        refresh={this.grabFireBaseRoutinesGoalsData}
                      />
                       <EditIcon 
                         openEditModal={() => {
                          this.setState({ showEditModal: true, indexEditing: this.findIndexByID(tempID)  });
                        }}
                        showModal = {this.state.showEditModal}
                        indexEditing = {this.state.indexEditing}
                        i={this.findIndexByID(tempID)} //index to edit
                        ATArray={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                        FBPath={firebase
                          .firestore()
                          .collection("users")
                          .doc(this.props.theCurrentUserID)}
                        refresh={this.grabFireBaseRoutinesGoalsData}
                      /> 
                    </Row>
                  </Col>
                </Row>
                <Row>
                    <EditGR
                          closeEditModal={() => {
                            this.setState({ showEditModal: false });
                            this.props.updateFBGR();
                          }}
                          showModal = {this.state.showEditModal}
                          indexEditing = {this.state.indexEditing}
                          i={this.findIndexByID(tempID)} //index to edit
                          ATArray={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                          FBPath={firebase
                            .firestore()
                            .collection("users")
                            .doc(this.props.theCurrentUserID)}
                          refresh={this.grabFireBaseRoutinesGoalsData} //function to refresh IS data
                    /> 
                </Row>
               </div>
              ) : (
                <div>
                  <Row style={{ marginLeft: "100px" }} className="d-flex ">
                    {this.props.goals[i]["is_available"] ? (
                      <div style={{ marginLeft: "5px" }}>
                        <FontAwesomeIcon
                          title="Available to Cailin"
                          style={{ color: this.state.availabilityColorCode }}
                          onClick={(e) => {
                            e.stopPropagation();
                            alert("Item Is Availble to the user");
                          }}
                          icon={faUser}
                          size="lg"
                        />{" "}
                      </div>
                    ) : (
                      <div>
                        <FontAwesomeIcon
                          title="Unavailable to the user"
                          style={{ color: "#000000" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            alert("Item Is NOT Availble to the user");
                          }}
                          icon={faUserAltSlash}
                          size="lg"
                        />
                      </div>
                    )}
                    <ShowATList
                      Index={this.findIndexByID(tempID)}
                      Array={this.props.originalGoalsAndRoutineArr}
                      // Path={this.state.firebaseRootPath}
                      Path={firebase
                        .firestore()
                        .collection("users")
                        .doc(this.props.theCurrentUserID)}
                    />
                  </Row>
                  <Row
                    style={{ marginTop: "15px", marginLeft: "100px" }}
                    className="d-flex "
                  >
                    <DeleteGR
                      deleteIndex={this.findIndexByID(tempID)}
                      Array={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                      // Path={this.state.firebaseRootPath} //holds complete data for action task: fbPath, title, etc
                      Path={firebase
                        .firestore()
                        .collection("users")
                        .doc(this.props.theCurrentUserID)}
                      refresh={this.grabFireBaseRoutinesGoalsData}
                    />
                    <EditIcon 
                         openEditModal={() => {
                          this.setState({ showEditModal: true, indexEditing: this.findIndexByID(tempID)  });
                        }}
                        showModal = {this.state.showEditModal}
                        indexEditing = {this.state.indexEditing}
                        i={this.findIndexByID(tempID)} //index to edit
                        ATArray={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                        FBPath={firebase
                          .firestore()
                          .collection("users")
                          .doc(this.props.theCurrentUserID)}
                        refresh={this.grabFireBaseRoutinesGoalsData}
                      /> 
                  </Row>
                  <Row>
                   <EditGR
                          closeEditModal={() => {
                            this.setState({ showEditModal: false });
                            this.props.updateFBGR();
                          }}
                          showModal = {this.state.showEditModal}
                          indexEditing = {this.state.indexEditing}
                          i={this.findIndexByID(tempID)} //index to edit
                          ATArray={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                          FBPath={firebase
                            .firestore()
                            .collection("users")
                            .doc(this.props.theCurrentUserID)}
                          refresh={this.grabFireBaseRoutinesGoalsData} //function to refresh IS data
                    /> 
                  </Row>
                </div>
              )}

              <div style={{ fontSize: "12px" }}>
                {this.props.goals[i]["start_day_and_time"] ? (
                  <div style={{ marginTop: "3px" }}>
                    {"Start Time: " +
                      this.formatDateTime(
                        this.props.goals[i]["start_day_and_time"]
                      )}
                  </div>
                ) : (
                  <div> </div>
                )}

                {this.props.goals[i]["end_day_and_time"] ? (
                  <div>
                    {"End Time: " +
                      this.formatDateTime(
                        this.props.goals[i]["end_day_and_time"]
                      )}{" "}
                  </div>
                ) : (
                  <div> </div>
                )}
	              {this.showGoalRepeatStatus(i)}
              </div>
            </ListGroup.Item>
          </div>
        );
      }
    }
    //Can pass ['datetime_completed'] in datetime constructor? Eventually want Feb 3  7:30am
    return displayGoals;
  };
  
  showGoalRepeatStatus = (i) => {
  	 // console.log(i,this.props.goals[i]);
  	 // console.log(this.props.goals[i]["repeat"]);
  	 // console.log(this.props.goals[i]["repeat_frequency"]);
  	 // console.log(this.props.goals[i]["repeat_every"]);
	 if(!this.props.goals[i]["repeat"]) {
	   return <div> One time goal </div>
	 } else {
	 	switch(this.props.goals[i]["repeat_frequency"]) {
	   case "DAY":
		   if(this.props.routines[i]["repeat_every"] === "1"){
			   return <div> Repeat daily </div>
		   } else {
			   return <div> Repeat every {this.props.routines[i]["repeat_every"]} days </div>
		   }
	   case "WEEK":
		   if(this.props.routines[i]["repeat_every"] === "1"){
			   return <div> Repeat weekly </div>
		   } else {
			   return <div> Repeat every {this.props.routines[i]["repeat_every"]} weeks </div>
		   }
	   case "MONTH":
		   if(this.props.routines[i]["repeat_every"] === "1"){
			   return <div> Repeat monthly </div>
		   } else {
			   return <div> Repeat every {this.props.routines[i]["repeat_every"]} months </div>
		   }
	   case "YEAR":
		   if(this.props.routines[i]["repeat_every"] === "1"){
			   return <div> Repeat annually </div>
		   } else {
			   return <div> Repeat every {this.props.routines[i]["repeat_every"]} years </div>
		   }
	   default:
		   return <div> Show Goal Repeat Options Error</div>;
	   }
	 }
  }
  
  getGoalsStatus = () => {
    let displayGoals = [];
    if (this.props.goals.length != null) {
      //Check to make sure routines exists
      for (let i = 0; i < this.props.goals.length; i++) {
        let tempTitle = this.props.goals[i]["title"];
        // let tempID = this.state.goals[i]["id"];
        let isComplete = this.props.goals[i]["is_complete"];
        if (!this.props.goals[i]["is_available"] || !this.props.goals[i]["is_displayed_today"]) {
          continue; //skip if not available
        }
        displayGoals.push(
          <div key={"goalStatus" + i}>
            <ListGroup.Item
              action
              variant="light"
              style={{ width: "100%", marginBottom: "3px" }}
              onClick={(e) => {
                e.stopPropagation();
                this.setState({ historyViewShow: true, isRoutine: false })
              }}
            >
              <Row style={{ margin: "0" }} className="d-flex flex-row-center">
                <Col style={{ textAlign: "center", width: "100%" }}>
                  <div className="fancytext"> {tempTitle}</div>
                </Col>
              </Row>
              <Row
                style={{
                  margin: "0",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {isComplete ? (
                  <div>
                    <FontAwesomeIcon
                      title="Completed Item"
                      // onMouseOver={event => { event.target.style.color = "#48D6D2"; }}
                      // onMouseOut={event => { event.target.style.color = "#000000"; }}
                      style={{ color: this.state.availabilityColorCode }}
                      onClick={(e) => {
                        e.stopPropagation();
                        alert("Item Is Completed");
                      }}
                      icon={faTrophy}
                      size="lg"
                    />{" "}
                  </div>
                ) : (
                  <div>
                    <FontAwesomeIcon
                      title="Not Completed Item"
                      // onMouseOver={event => { event.target.style.color = "#48D6D2"; }}
                      // onMouseOut={event => { event.target.style.color = "#000000"; }}
                      style={{ color: "black" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        alert("Item Is Not Completed");
                      }}
                      icon={faRunning}
                      size="lg"
                    />
                  </div>
                )}
              </Row>
            </ListGroup.Item>
          </div>
        );
      }
    }
    //Can pass ['datetime_completed'] in datetime constructor? Eventually want Feb 3  7:30am
    return displayGoals;
  };

  getRoutinesStatus = () => {
    let displayRoutines = [];
    if (this.props.routines.length != null) {
      //Check to make sure routines exists
      for (let i = 0; i < this.props.routines.length; i++) {
        let tempTitle = this.props.routines[i]["title"];
        // let tempID = this.state.routines[i]['id'];
        let isComplete = this.props.routines[i]["is_complete"];
        let isInProgress = this.props.routines[i]["is_in_progress"];

        // let isInProgress = this.props.
        if (!this.props.routines[i]["is_available"] || !this.props.routines[i]["is_displayed_today"]) {
          continue; //skip if not available
        }
        displayRoutines.push(
          <div key={"goalStatus" + i}>
            <ListGroup.Item
              action
              variant="light"
              style={{ marginBottom: "3px" }}
              onClick={(e) => {
                e.stopPropagation();
                this.setState({ historyViewShow: true, isRoutine: true })
              }}
            >
              <Row style={{ margin: "0" }} className="d-flex flex-row-center">
                <Col style={{ textAlign: "center", width: "100%" }}>
                  <div className="fancytext"> {tempTitle}</div>
                </Col>
              </Row>
              <Row
                style={{
                  margin: "0",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {isComplete ? (
                  <div>
                    <FontAwesomeIcon
                      title="Completed Item"
                      style={{ color: this.state.availabilityColorCode }}
                      onClick={(e) => {
                        e.stopPropagation();
                        alert("Item Is Completed");
                      }}
                      icon={faTrophy}
                      size="lg"
                    />{" "}
                  </div>
                ) : (
                  <div>
                    <FontAwesomeIcon
                      title="Not Completed Item"
                      style={{ color: isInProgress ? this.state.availabilityColorCode : "black" }}
                      onClick={(e) => {
                        console.log(this);
                        e.stopPropagation();
                        alert("Item Is Not Completed???");
                      }}
                      icon={faRunning}
                      size="lg"
                    />
                  </div>
                )}
              </Row>
            </ListGroup.Item>
          </div>
        );
      }
    }
    //Can pass ['datetime_completed'] in datetime constructor? Eventually want Feb 3  7:30am
    return displayRoutines;
  };

  render() {
    // console.log("ran render firebasev2");
    var displayRoutines = this.getRoutines();
    var displayGoals = this.getGoals();
    var displayCompletedGoals = this.getGoalsStatus();
    var displayCompletedRoutines = this.getRoutinesStatus();

    return (
      <div style={{ marginTop: "0" }}>
        {/* <div style={{ marginTop: "40px" }}> */}
        {this.props.showRoutineGoalModal ? (
          <Col
            style={{
              width: this.state.modalWidth,
              marginTop: "0",
              marginRight: "15px",
            }}
            sm="auto"
            md="auto"
            lg="auto"
          >
            <div
              style={{
                borderRadius: "15px",
                boxShadow:
                  "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
              }}
            >
              {this.abstractedRoutineGoalStatusList(
                displayCompletedRoutines,
                displayCompletedGoals
              )}
            </div>
          </Col>
        ) : (
          <div> </div>
        )}

        {this.props.showRoutine ? (
          <Col
            style={{
              width: this.state.modalWidth,
              marginTop: "0",
              marginRight: "15px",
            }}
            sm="auto"
            md="auto"
            lg="auto"
          >
            <div style={{ borderRadius: "15px" }}>
              {this.abstractedRoutineList(displayRoutines)}
            </div>
          </Col>
        ) : (
          <div> </div>
        )}

        {this.props.showGoal ? (
          <Col
            style={{
              width: this.state.modalWidth,
              marginTop: "0",
              marginRight: "15px",
            }}
            sm="auto"
            md="auto"
            lg="auto"
          >
            <div style={{ borderRadius: "15px" }}>
              {this.abstractedGoalsList(displayGoals)}
            </div>
          </Col>
        ) : (
          <div> </div>
        )}
      </div>
    );
  }

  /*
abstractedGoalsList:
shows entire list of goals and routines
*/
  abstractedGoalsList = (displayGoals) => {
    return (
      <Modal.Dialog
        style={{
          borderRadius: "15px",
          marginTop: "0",
          width: this.state.modalWidth,
          marginLeft: "0",
          boxShadow:
            "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        <Modal.Header onHide={this.props.closeGoal} closeButton>
          <Modal.Title>
            <h5 className="normalfancytext">Goals</h5>{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/**
           * To allow for the Modals to pop up in front of one another
           * I have inserted the IS and AT lists inside the RT Goal Modal */}
          <div
            style={{
              borderRadius: "15px",
              boxShadow:
                "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
              position: "absolute",
              zIndex: "5"
            }}
          >
            {this.state.addNewGRModalShow ? this.AddNewGRModalAbstracted() : ""}
          </div>

          <div
            style={{
              borderRadius: "15px",
              boxShadow:
                "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
            }}
          >
            {this.state.singleGR.show ? (
              this.abstractedActionsAndTaskList()
            ) : (
              <div></div>
            )}
          </div>
          <ListGroup>
            <div style={{ height: "650px", overflow: "scroll" }}>
              {displayGoals}
            </div>
            {/* Button to add new Goal */}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-info btn-md"
            onClick={() => {
              this.setState({ addNewGRModalShow: true, isRoutine: false });
            }}
          >
            Add Goal
          </button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  };
  /*
    abstractedRoutineList:
    shows entire list of routines
    */
  abstractedRoutineList = (displayRoutines) => {
    return (
      <Modal.Dialog
        style={{
          borderRadius: "15px",
          marginTop: "0",
          width: this.state.modalWidth,
          marginLeft: "0px",
          boxShadow:
            "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        <Modal.Header onHide={this.props.closeRoutine} closeButton>
          <Modal.Title> 
            <h5 className="normalfancytext">Routines</h5>
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          {/**
           * To allow for the Modals to pop up in front of one another
           * I have inserted the IS and AT lists inside the RT Goal Modal */}

          <div
            style={{
              borderRadius: "15px",
              boxShadow:
                "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
            }}
          >
            {this.state.addNewGRModalShow ? this.AddNewGRModalAbstracted() : ""}
          </div>
          <div
            style={{
              borderRadius: "15px",
              boxShadow:
                "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
            }}
          >
            {this.state.singleGR.show ? (
              this.abstractedActionsAndTaskList()
            ) : (
              <div></div>
            )}
          </div>
          <ListGroup>
            <div style={{ height: "650px", overflow: "scroll" }}>
              {displayRoutines}
            </div>
          </ListGroup>
          {/* Button To add new Routine */}
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-info btn-md"
            onClick={() => {
              this.addRoutineOnClick();
            }}
          >
            Add Routine
          </button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  };

  addRoutineOnClick = () => {
    let newStart, newEnd;
    if (this.props.calendarView === "Month") {
      newStart = new Date();
      newStart.setHours(0, 0, 0, 0);
      newEnd = new Date();
      newEnd.setHours(23, 59, 59, 59);
    } else if (this.props.calendarView === "Day") {
      newStart = new Date(this.props.dateContext.toDate());
      newStart.setHours(0, 0, 0, 0);
      newEnd = new Date(this.props.dateContext.toDate());
      newEnd.setHours(23, 59, 59, 59);
    }

    console.log(newStart, newEnd, "newstart");

    this.setState({
      singleGR: {
        id: "",
        available_start_time: newStart,
        available_end_time: newEnd,
        type: "None",
        title: "GR Name",
        photo: "",
        arr: [],
        fbPath: null,
      },
      addNewGRModalShow: true,
      isRoutine: true,
    });
  };

  /**
   * AddNewGRModalAbstracted:
   * returns a modal showing us a slot to add a new Goal/Routine
   */
  AddNewGRModalAbstracted = () => {
    return (
      <AddNewGRItem
        closeModal={() => {
          this.setState({ addNewGRModalShow: false });
        }}
        ATArray={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
        refresh={this.grabFireBaseRoutinesGoalsData}
        isRoutine={this.state.isRoutine}
        width={this.state.modalWidth}
        todayDateObject={this.props.todayDateObject}
        theCurrentUserId={this.props.theCurrentUserID}
        singleGR={this.state.singleGR}
      />
    );
  };

  historyModel = (displayGoals) => {
    return (
      <ShowHistory
      closeModal={() => {
        this.setState({ historyViewShow: false });
      }}
      displayGoals={displayGoals}
    />
    );
  }

  /*
    abstractedInstructionsAndStepsList:
    currently only shows the single Action/Task Title with no steps
    */

  /**
   * abstractedInstructionsAndStepsList:
   * Shows a single Task / Action as Title with
   * the list of instructions/steps underneath of it
   *
   */
  abstractedInstructionsAndStepsList = () => {
    return (
      <Modal.Dialog
        style={{
          marginTop: "0",
          marginLeft: "0",
          width: this.state.modalWidth,
        }}
      >
        <Modal.Header
          closeButton
          onHide={() => {
            this.setState({ singleAT: { show: false } });
          }}
        >
          <Modal.Title>
            <h5 className="normalfancytext">{this.state.singleAT.title}</h5>{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              borderRadius: "15px",
              boxShadow:
                "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
            }}
          >
            {this.state.addNewISModalShow ? (
              <AddNewISItem
                ISArray={this.state.singleISitemArr} //Holds the raw data for all the is in the single action
                ISItem={this.state.singleAT} //holds complete data for action task: fbPath, title, etc
                refresh={this.refreshISItem}
                timeSlot={this.state.timeSlotForIS} //timeSlot[0]== start_time, timeSlot[1] == end_time
                hideNewISModal={
                  //function to hide the modal
                  () => {
                    this.setState({ addNewISModalShow: false });
                  }
                }
                width={this.state.modalWidth}
              />
            ) : (
              <div></div>
            )}
          </div>
          <ListGroup>
            <div style={{ height: "500px", overflow: "scroll" }}>
              {this.state.singleAT.arr}
            </div>
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-info btn-md"
            onClick={() => {
              this.setState({ addNewISModalShow: true });
            }}
          >
            Add Step
          </button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  };

  /**
   * Retrieve parent goal's start time and end time and use them for it's ATItem
   */
  getTimeForAT = () => {
    console.log("Enter getTimeForAT()");
    let timeSlot = [];
    const db = firestore();
    db.collection("users")
      .doc(this.props.theCurrentUserID)
      //.collection("goals&routines")
      //.where("id", "==", this.props.ATItem.id)
      .get()
      .then((snapshot) => {
        let userData = snapshot.data();
        let userGR = userData["goals&routines"];
        userGR.forEach((doc) => {
          console.log("This is from useGR: ", this.state.singleGR);
          if (doc.id === this.state.singleGR.id) {
            timeSlot = [
              doc.start_day_and_time.split(" ")[4],
              doc.end_day_and_time.split(" ")[4],
            ];
            this.setState({ timeSlotForAT: timeSlot });
          }
        });
      });
  };

  /**
   * abstractedActionsAndTaskList -
   * returns modal with with a single Routine/ Goal as title
   * and beneath it is the list of action/ task associated with the
   * goal/ routine
   */
  abstractedActionsAndTaskList = (props) => {
    return (
      <Modal.Dialog
        style={{
          marginTop: "0",
          marginLeft: "0",
          width: this.state.modalWidth,
        }}
      >
        <Modal.Header
          closeButton
          onHide={() => {
            this.setState({ singleGR: { show: false } });
          }}
        >
          <Modal.Title>
            <h5 className="normalfancytext">{this.state.singleGR.title}</h5>{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              borderRadius: "15px",
              boxShadow:
                "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
            }}
          >
            {this.state.addNewATModalShow ? (
              <AddNewATItem
                timeSlot={this.state.timeSlotForAT} //timeSlot[0]== start_time, timeSlot[1] == end_time
                refresh={this.refreshATItem} //refreshes the list of AT
                ATArray={this.state.singleATitemArr}
                ATItem={this.state.singleGR} //The parent item
                //theCurrentUserID={this.props.theCurrentUserID}
                hideNewATModal={() => {
                  this.setState({ addNewATModalShow: false });
                }}
                width={this.state.modalWidth}
              />
            ) : (
              <div></div>
            )}
          </div>
          {/**
           * Here Below, the IS list will pop up inside the AT list
           */}
          <div
            style={{
              borderRadius: "15px",
              boxShadow:
                "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
            }}
          >
            {this.state.singleAT.show ? (
              this.abstractedInstructionsAndStepsList()
            ) : (
              <div></div>
            )}
          </div>
          <ListGroup>
            <div style={{ height: "500px", overflow: "scroll" }}>
              {this.state.singleGR.arr}
            </div>
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-info btn-md"
            onClick={() => {
              this.setState({ addNewATModalShow: true });
            }}
          >
            Add Action/Task
          </button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  };

  addNewTaskInputBox = () => {
    return (
      <InputGroup size="lg" style={{ marginTop: "20px" }} className="mb-3">
        <FormControl
          onChange={() => {
            console.log("addNewGoalInputBox");
          }}
          placeholder=""
        />
        <InputGroup.Append>
          <Button variant="outline-secondary">Add</Button>
        </InputGroup.Append>
      </InputGroup>
    );
  };

  /*
    abstractedRoutineGoalStatusList:
    shows entire list of goals and routines
    */
  abstractedRoutineGoalStatusList = (displayRoutines, displayGoals) => {
    return (
      <Modal.Dialog
        style={{
          borderRadius: "15px",
          marginTop: "0",
          width: this.state.modalWidth,
          marginLeft: "0",
          boxShadow:
            "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        <Modal.Header onHide={this.props.closeRoutineGoalModal} closeButton>
          <Modal.Title>
            {" "}
            <h5 className="normalfancytext">Current Status</h5>{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h2 className="normalfancytext">Routines:</h2>

          {/**
           * To allow for the Modals to pop up in front of one another
           * I have inserted the IS and AT lists inside the RT Goal Modal */}

          {/* <div style={{ borderRadius: "15px", boxShadow: '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)' }}>
                        {(this.state.singleGR.show) ? this.abstractedActionsAndTaskList() : (<div></div>)}
                    </div> */}

          <ListGroup style={{ height: "350px", overflow: "scroll" }}>
            {displayRoutines}
            {/* <button type="button" class="btn btn-info btn-lg" onClick={() => { this.setState({ addNewGRModalShow: true, isRoutine: true }) }} >Add Routine</button> */}
          </ListGroup>
          {/* Button To add new Routine */}
          <h2 className="normalfancytext" style={{ marginTop: "50px" }}>
            Goals:
          </h2>
          <ListGroup style={{ height: "250px", overflow: "scroll" }}>
            {displayGoals}
            {/* Button to add new Goal */}
            {/* <button type="button" class="btn btn-info btn-lg" onClick={() => { this.setState({ addNewGRModalShow: true, isRoutine: false }) }}>Add Goal</button> */}
          </ListGroup>

          <div
            style={{
              borderRadius: "15px",
              boxShadow:
                "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
              position: "absolute",
              zIndex: "5",
              top: "20px",
              left: "20px",
            }}
          >
            {this.state.historyViewShow ? this.historyModel() : ""}
          </div>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal.Dialog>
    );
  };

  addNewGoalInputBox = () => {
    return (
      <InputGroup
        size="lg"
        style={{ marginTop: "20px", width: this.state.modalWidth }}
        className="mb-3"
      >
        <FormControl
          onChange={() => {
            console.log("addNewGoalInputBox");
          }}
          placeholder="place holder!!"
        />
        <InputGroup.Append>
          <Button variant="outline-secondary">Add</Button>
        </InputGroup.Append>
      </InputGroup>
    );
  };
}
