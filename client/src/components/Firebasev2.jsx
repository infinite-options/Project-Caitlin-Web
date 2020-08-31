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
  Table,
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
// import moment from "moment";

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
      modalWidth: "390px",

      //Use to decided whether to show the respective modals
      addNewGRModalShow: false,
      historyViewShow: false,
      historyViewShowObject: null,
      historyItems: [],
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

      AT_expected_completion_time: {},
      WentThroughATList: {},
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
    console.log("AT items after delete", arr);
    this.setState({ singleATitemArr: arr });
    let resArr = this.createListofAT(arr);
    let singleGR = this.state.singleGR;
    console.log("singleGR", singleGR.title, singleGR.arr);
    singleGR.arr = resArr;
    console.log("After delete singleGR", singleGR.arr);
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
    console.log("IS items after delete", arr);
    this.setState({
      singleISitemArr: arr,
    });
    let resArr = this.createListofIS(arr);
    let singleAt = this.state.singleAT;
    console.log("Before delete singleAt", singleAt.title, singleAt.arr);
    singleAt.arr = resArr;
    console.log("After delete singleAt", singleAt.arr);
    this.setState({ singleAT: singleAt });
  };

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
  };

  formatDateTime(str) {
    let newTime = new Date(str).toLocaleTimeString();
    newTime = newTime.substring(0, 5) + " " + newTime.slice(-2);
    return newTime;
    /*
    const formattedStr = str;
    const time = moment(formattedStr);
    return time.format("YYYY MMM DD HH:mm");
    */
  }

  //This function essentially grabs all action/tasks
  //for the routine or goal passed in and pops open the
  //modal for the action/task
  getATList = async (id, title, persist) => {
    const db = firebase.firestore();
    let docRef = db
      .collection("users")
      .doc(this.props.theCurrentUserID)
      .collection("goals&routines")
      .doc(id);
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          // console.log(doc.data());
          var x = doc.data()["actions&tasks"];
          // console.log(x);
          if (x == null) {
            let singleGR = {
              //Variable to hold information about the parent Goal/ Routine
              show: true,
              type: persist ? "Routine" : "Goal",
              title: title,
              id: id,
              is_complete: doc.data().is_complete,
              is_in_progress: doc.data().is_in_progress,
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
          console.log(this.state.singleATitemArr);
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
      if (!A[i]["id"] || !A[i]["title"]) {
        return [];
      }
      let tempID = A[i]["id"];
      let tempPhoto = A[i]["photo"];
      let tempTitle = A[i]["title"];
      let tempAvailable = A[i]["is_available"];

      res.push(
        <div key={"AT" + i}>
          <ListGroup.Item
            action
            onClick={() => {
              // Disable IS layer
              // this.ATonClickEvent(tempTitle, tempID);
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
                          title="Available to User"
                          style={{ color: this.state.availabilityColorCode }}
                          onClick={(e) => {
                            e.stopPropagation();
                            alert("Item Is Availble to User");
                          }}
                          icon={faUser}
                          size="lg"
                        />{" "}
                      </div>
                    ) : (
                      <div>
                        <FontAwesomeIcon
                          title="Unavailable to User"
                          style={{ color: "#000000" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            alert("Item Is NOT Availble to User");
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
                      updateNewWentThroughATDelete={
                        this.handleWentThroughATListObj
                      }
                    />
                    <EditAT
                      marginLeftV="-170px"
                      i={i} //index to edit
                      timeSlot={this.state.timeSlotForAT}
                      ATArray={this.state.singleATitemArr} //Holds the raw data for all the is in the single action
                      FBPath={this.state.singleGR.fbPath} //holds the path to the array data
                      refresh={this.refreshATItem} //function to refresh AT data
                      updateWentThroughATListObj={
                        this.handleWentThroughATListObj
                      }
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
                        title="Available to the user"
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
                    updateNewWentThroughATDelete={
                      this.handleWentThroughATListObj
                    }
                  />
                  <EditAT
                    marginLeftV="-130px"
                    i={i} //index to edit
                    ATArray={this.state.singleATitemArr} //Holds the raw data for all the is in the single action
                    FBPath={this.state.singleGR.fbPath} //holds the path to the array data
                    refresh={this.refreshATItem} //function to refresh AT data
                    updateWentThroughATListObj={this.handleWentThroughATListObj}
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

  handleWentThroughATListObj = (id) => {
    let WentThroughOjt = this.state.WentThroughATList;
    WentThroughOjt[id] = false;
    this.setState({ WentThroughATList: WentThroughOjt });
  };
  /**
   * takes the list of steps/instructions and returns
   * it in the form of a ListGroup for presentation
   */
  createListofIS = (A) => {
    let res = [];
    for (let i = 0; i < A.length; i++) {
      let tempPhoto = A[i]["photo"];
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
                          title="Available to the user"
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
                  </Row>
                  <Row style={{ marginTop: "15px", marginBottom: "10px" }}>
                    <DeleteISItem
                      deleteIndex={i}
                      ISArray={this.state.singleISitemArr} //Holds the raw data for all the is in the single action
                      ISItem={this.state.singleAT} //holds complete data for action task: fbPath, title, etc
                      refresh={this.refreshISItem}
                      updateNewWentThroughISDelete={
                        this.handleWentThroughATListObj
                      }
                    />

                    <EditIS
                      marginLeftV="-170px"
                      timeSlot={this.state.timeSlotForAT}
                      i={i} //index to edit
                      ISArray={this.state.singleISitemArr} //Holds the raw data for all the is in the single action
                      FBPath={this.state.singleAT.fbPath} //holds the fbPath to arr to be updated
                      refresh={this.refreshISItem} //function to refresh IS data
                      updateWentThroughATListObjIS={
                        this.handleWentThroughATListObj
                      }
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
                        title="Available to the user"
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
                    updateNewWentThroughISDelete={
                      this.handleWentThroughATListObj
                    }
                  />

                  <EditIS
                    marginLeftV="-130px"
                    i={i} //index to edit
                    ISArray={this.state.singleISitemArr} //Holds the raw data for all the is in the single action
                    FBPath={this.state.singleAT.fbPath} //holds the fbPath to arr to be updated
                    refresh={this.refreshISItem} //function to refresh IS data
                    updateWentThroughATListObjIS={
                      this.handleWentThroughATListObj
                    }
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
   * Retrieve parent goal's start time and end time and use them for it's ATItem
   */
  setTimeSlot = async (id) => {
    let timeSlot = [];
    const db = firestore();
    const userData = await db
      .collection("users")
      .doc(this.props.theCurrentUserID)
      .get();

    let userGR = userData.data()["goals&routines"];

    userGR.forEach((doc) => {
      // console.log("This is from useGR: ", this.state.singleGR);
      if (doc.id === id) {
        //console.log("Time String From firebase: ", doc.start_day_and_time);
        let start_day_and_time = new Date(doc.start_day_and_time).toString();
        let end_day_and_time = new Date(doc.end_day_and_time).toString();
        //console.log("Time String after firebase: ", start_day_and_time);

        timeSlot = [
          start_day_and_time.split(" ")[4],
          end_day_and_time.split(" ")[4],
        ];
      }
    });
    this.setState({ timeSlotForAT: timeSlot });
  };
  /**
   * In this function we are passed in the id title and persist property of the incoming routine/goal
   * and we need to make return a viewable list of all the actions/tasks for this routine/goal
   * which is done in getATList function
   */
  GRonClickEvent = async (title, id, persist) => {
    await this.setTimeSlot(id);
    this.getATList(id, title, persist);
    // console.log("GRonClickEvent", id, title, persist);
  };

  /**
   * we are passed in the action/task id and title
   * and we will need to grab all steps/Instructions related to this action/task,
   *
   */
  ATonClickEvent = (title, id) => {
    let stepsInstructionArrayPath = firebase
      .firestore()
      .collection("users")
      .doc(this.props.theCurrentUserID)
      .collection("goals&routines")
      .doc(this.state.singleGR.id)
      .collection("actions&tasks")
      .doc(id);

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

    let temp = {
      show: true,
      type: "Action/Task",
      title: title,
      id: id,
      arr: [],
      fbPath: stepsInstructionArrayPath,
    };
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
                              title="Available to the user"
                              style={{
                                color: this.state.availabilityColorCode,
                              }}
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
                            this.setState({
                              showEditModal: true,
                              indexEditing: this.findIndexByID(tempID),
                            });
                          }}
                          showModal={this.state.showEditModal}
                          indexEditing={this.state.indexEditing}
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
                      showModal={this.state.showEditModal}
                      indexEditing={this.state.indexEditing}
                      i={this.findIndexByID(tempID)} //index to edit
                      ATArray={this.props.originalGoalsAndRoutineArr} //Holds the raw data for all the is in the single action
                      FBPath={firebase
                        .firestore()
                        .collection("users")
                        .doc(this.props.theCurrentUserID)}
                      refresh={this.grabFireBaseRoutinesGoalsData} //function to refresh IS data
                      // chnagePhoto = {this.changePhotoIcon()}
                    />
                  </Row>
                </div>
              ) : (
                <div>
                  <Row style={{ marginLeft: "100px" }} className="d-flex ">
                    {this.props.routines[i]["is_available"] ? (
                      <div style={{ marginLeft: "5px" }}>
                        <FontAwesomeIcon
                          title="Available to the user"
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
                        this.setState({
                          showEditModal: true,
                          indexEditing: this.findIndexByID(tempID),
                        });
                      }}
                      showModal={this.state.showEditModal}
                      indexEditing={this.state.indexEditing}
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
                      showModal={this.state.showEditModal}
                      indexEditing={this.state.indexEditing}
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
                {this.props.routines[i]["start_day_and_time"] ? (
                  <Col
                    style={{
                      marginTop: "3px",
                      fontSize: "12px",
                      paddingRight: "0px",
                      paddingLeft: "0px",
                      marginLeft: "10px",
                    }}
                  >
                    {"Start Time: " +
                      this.formatDateTime(
                        this.props.routines[i]["start_day_and_time"]
                      )}
                  </Col>
                ) : (
                  <Col> </Col>
                )}
                {this.props.routines[i]["end_day_and_time"] ? (
                  <Col
                    xs={6}
                    style={{
                      fontSize: "12px",
                      paddingLeft: "0px",
                      paddingRight: "0px",
                    }}
                  >
                    {"End Time: " +
                      this.formatDateTime(
                        this.props.routines[i]["end_day_and_time"]
                      )}
                  </Col>
                ) : (
                  <Col> </Col>
                )}
              </Row>

              <Row>
                {this.props.showRoutine &&
                  (this.state.WentThroughATList[tempID] === false ||
                    this.state.WentThroughATList[tempID] === undefined) &&
                  this.getATexpectedTime(tempID)}

                <Col
                  style={{
                    paddingRight: "0px",
                    paddingLeft: "0px",
                    marginLeft: "10px",
                  }}
                >
                  {this.showRoutineRepeatStatus(i)}
                </Col>

                <Col xs={6} style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                  {this.thisTakesMeGivenVsSelected(i, tempID)}
                </Col>
              </Row>
            </ListGroup.Item>
          </div>
        );
      }
    }
    return displayRoutines;
  };

  getATexpectedTime(id) {
    let ActionTaskArrayPath = firebase
      .firestore()
      .collection("users")
      .doc(this.props.theCurrentUserID)
      .collection("goals&routines")
      .doc(id);

    let ATGrabFromFB = this.state.WentThroughATList;
    ATGrabFromFB[id] = true;
    this.setState({
      WentThroughATList: ATGrabFromFB,
    });

    ActionTaskArrayPath.get()
      .then((doc) => {
        if (doc.exists) {
          let ATExpTimeObj = this.state.AT_expected_completion_time;
          // let ATGrabFromFB = this.state.WentThroughATList;
          let ATtimeCombines = 0;
          var x = doc.data()["actions&tasks"];
          if (x.length === 0) {
            ATExpTimeObj[id] = "0";
            ATGrabFromFB[id] = true;
            this.setState({
              AT_expected_completion_time: ATExpTimeObj,
              WentThroughATList: ATGrabFromFB,
            });
            return;
          }

          for (let k = 0; k < x.length; k++) {
            // console.log("this is k ", k);
            ActionTaskArrayPath.collection("actions&tasks")
              .doc(x[k]["id"])
              .get()
              .then((doc) => {
                if (doc.exists) {
                  let InsStep = doc.data()["instructions&steps"];
                  if (InsStep.length === 0) {
                    ATtimeCombines += this.convertToMinutes(
                      x[k]["expected_completion_time"]
                    );
                  } else {
                    for (let y = 0; y < InsStep.length; y++) {
                      ATtimeCombines += this.convertToMinutes(
                        InsStep[y]["expected_completion_time"]
                      );
                    }
                  }
                } else {
                  // doc.data() will be undefined in this case
                  console.log("No Instruction/Step documents!");
                }
                // if (k === x.length - 1) {
                ATExpTimeObj[id] = ATtimeCombines;
                ATGrabFromFB[id] = true;

                this.setState({
                  AT_expected_completion_time: ATExpTimeObj,
                  WentThroughATList: ATGrabFromFB,
                });
                // }
              });
          }
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  }

  thisTakesMeGivenVsSelected = (i, id) => {
    if (this.state.AT_expected_completion_time[id] === "0") {
      return (
        <div style={{ fontSize: "12px" }}>
          {" "}
          Takes{" "}
          {this.convertToMinutes(
            this.props.routines[i]["expected_completion_time"]
          )}{" "}
          min{" "}
        </div>
      );
    } else {
      return (
        <div style={{ fontSize: "12px" }}>
          {" "}
          Takes{" "}
          {this.convertToMinutes(
            this.props.routines[i]["expected_completion_time"]
          )}{" "}
          min vs {this.state.AT_expected_completion_time[id]} (calc)
        </div>
      );
    }
  };

  convertToMinutes = (time) => {
    let myStr = time.split(":");
    let hours = myStr[0];
    let hrToMin = hours * 60;
    let minutes = myStr[1] * 1 + hrToMin;
    return minutes;
  };

  showRoutineRepeatStatus = (i) => {
    if (!this.props.routines[i]["repeat"]) {
      return <div style={{ fontSize: "12px" }}> One time only </div>;
    } else {
      switch (this.props.routines[i]["repeat_frequency"]) {
        case "DAY":
          if (this.props.routines[i]["repeat_every"] === "1") {
            return <div style={{ fontSize: "12px" }}> Repeat daily </div>;
          } else {
            return (
              <div style={{ fontSize: "12px" }}>
                {" "}
                Repeat every {this.props.routines[i]["repeat_every"]} days{" "}
              </div>
            );
          }
        case "WEEK":
          if (this.props.routines[i]["repeat_every"] === "1") {
            return <div style={{ fontSize: "12px" }}> Repeat weekly </div>;
          } else {
            return (
              <div style={{ fontSize: "12px" }}>
                {" "}
                Repeat every {this.props.routines[i]["repeat_every"]} weeks{" "}
              </div>
            );
          }
        case "MONTH":
          if (this.props.routines[i]["repeat_every"] === "1") {
            return <div style={{ fontSize: "12px" }}> Repeat monthly </div>;
          } else {
            return (
              <div style={{ fontSize: "12px" }}>
                {" "}
                Repeat every {
                  this.props.routines[i]["repeat_every"]
                } months{" "}
              </div>
            );
          }
        case "YEAR":
          if (this.props.routines[i]["repeat_every"] === "1") {
            return <div> Repeat annually </div>;
          } else {
            return (
              <div>
                {" "}
                Repeat every {this.props.routines[i]["repeat_every"]} years{" "}
              </div>
            );
          }
        default:
          return <div> Show Routine Repeat Options Error</div>;
      }
    }
  };

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
                              title="Available to the user"
                              style={{
                                color: this.state.availabilityColorCode,
                              }}
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
                          // Path={this.state.firebaseRootPath} //holds complete data for action task: fbPath, title, etc
                          Path={firebase
                            .firestore()
                            .collection("users")
                            .doc(this.props.theCurrentUserID)}
                          refresh={this.grabFireBaseRoutinesGoalsData}
                        />
                        <EditIcon
                          openEditModal={() => {
                            this.setState({
                              showEditModal: true,
                              indexEditing: this.findIndexByID(tempID),
                            });
                          }}
                          showModal={this.state.showEditModal}
                          indexEditing={this.state.indexEditing}
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
                      showModal={this.state.showEditModal}
                      indexEditing={this.state.indexEditing}
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
                          title="Available to the user"
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
                        this.setState({
                          showEditModal: true,
                          indexEditing: this.findIndexByID(tempID),
                        });
                      }}
                      showModal={this.state.showEditModal}
                      indexEditing={this.state.indexEditing}
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
                      showModal={this.state.showEditModal}
                      indexEditing={this.state.indexEditing}
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
                {this.props.goals[i]["start_day_and_time"] ? (
                  <Col
                    style={{
                      marginTop: "3px",
                      fontSize: "12px",
                      paddingRight: "0px",
                      paddingLeft: "0px",
                      marginLeft: "10px",
                    }}
                  >
                    {"Start Time: " +
                      this.formatDateTime(
                        this.props.goals[i]["start_day_and_time"]
                      )}
                  </Col>
                ) : (
                  <Col> </Col>
                )}
                {this.props.goals[i]["end_day_and_time"] ? (
                  <Col
                    xs={6}
                    style={{
                      fontSize: "12px",
                      paddingLeft: "0px",
                      paddingRight: "0px",
                    }}
                  >
                    {"End Time: " +
                      this.formatDateTime(
                        this.props.goals[i]["end_day_and_time"]
                      )}
                  </Col>
                ) : (
                  <Col> </Col>
                )}
              </Row>

              <Row>
                {this.props.showGoal &&
                  (this.state.WentThroughATList[tempID] === false ||
                    this.state.WentThroughATList[tempID] === undefined) &&
                  this.getATexpectedTime(tempID)}

                <Col
                  style={{
                    paddingRight: "0px",
                    paddingLeft: "0px",
                    marginLeft: "10px",
                  }}
                >
                  {this.showGoalRepeatStatus(i)}
                </Col>

                <Col xs={6} style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                  {this.thisTakesMeGivenVsSelectedGoals(i, tempID)}
                </Col>
              </Row>
            </ListGroup.Item>
          </div>
        );
      }
    }
    return displayGoals;
  };

  thisTakesMeGivenVsSelectedGoals = (i, id) => {
    if (this.state.AT_expected_completion_time[id] === "0") {
      return (
        <div style={{ fontSize: "12px" }}>
          {" "}
          Takes{" "}
          {this.convertToMinutes(
            this.props.goals[i]["expected_completion_time"]
          )}{" "}
          min{" "}
        </div>
      );
    } else {
      return (
        <div style={{ fontSize: "12px" }}>
          {" "}
          Takes{" "}
          {this.convertToMinutes(
            this.props.goals[i]["expected_completion_time"]
          )}{" "}
          min vs {this.state.AT_expected_completion_time[id]} (calc)
        </div>
      );
    }
  };

  showGoalRepeatStatus = (i) => {
    if (!this.props.goals[i]["repeat"]) {
      return <div> One time goal </div>;
    } else {
      switch (this.props.goals[i]["repeat_frequency"]) {
        case "DAY":
          if (this.props.goals[i]["repeat_every"] === "1") {
            return <div> Repeat daily </div>;
          } else {
            return (
              <div>
                {" "}
                Repeat every {this.props.goals[i]["repeat_every"]} days{" "}
              </div>
            );
          }
        case "WEEK":
          if (this.props.goals[i]["repeat_every"] === "1") {
            return <div> Repeat weekly </div>;
          } else {
            return (
              <div>
                {" "}
                Repeat every {this.props.goals[i]["repeat_every"]} weeks{" "}
              </div>
            );
          }
        case "MONTH":
          if (this.props.goals[i]["repeat_every"] === "1") {
            return <div> Repeat monthly </div>;
          } else {
            return (
              <div>
                {" "}
                Repeat every {this.props.goals[i]["repeat_every"]} months{" "}
              </div>
            );
          }
        case "YEAR":
          if (this.props.goals[i]["repeat_every"] === "1") {
            return <div> Repeat annually </div>;
          } else {
            return (
              <div>
                {" "}
                Repeat every {this.props.goals[i]["repeat_every"]} years{" "}
              </div>
            );
          }
        default:
          return <div> Show Goal Repeat Options Error</div>;
      }
    }
  };

  getGoalsStatus = () => {
    let displayGoals = [];
    if (this.props.goals.length != null) {
      //Check to make sure routines exists
      for (let i = 0; i < this.props.goals.length; i++) {
        let tempTitle = this.props.goals[i]["title"];
        // let tempID = this.state.goals[i]["id"];
        let isComplete = this.props.goals[i]["is_complete"];

        if (
          !this.props.goals[i]["is_available"] ||
          !this.props.goals[i]["is_displayed_today"]
        ) {
          continue; //skip if not available
        }

        let isInProgress = this.props.goals[i]["is_in_progress"];
        displayGoals.push(
          <div key={"goalStatus" + i}>
            <ListGroup.Item
              action
              variant="light"
              style={{ width: "100%", marginBottom: "3px" }}
              onClick={(e) => {
                e.stopPropagation();
                this.getHistoryData(this.props.goals[i]);
                this.setState({
                  historyViewShow: true,
                  historyViewShowObject: this.props.goals[i],
                  isRoutine: false,
                });
              }}
            >
              <Row style={{ margin: "0" }} className="d-flex flex-row-center">
                <Col style={{ textAlign: "center", width: "100%" }}>
                  <div className="fancytext">{tempTitle}</div>
                </Col>
                <div
                  className="fancytext"
                  style={{ position: "absolute", right: "15px", top: "21px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    this.resetRoutinesGoals(this.props.goals[i]);
                  }}
                >
                  Reset
                </div>
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
                      style={{
                        color: isInProgress
                          ? this.state.availabilityColorCode
                          : "black",
                      }}
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

  resetRoutinesGoals = (gr_object) => {
    let db = firebase.firestore();
    db.collection("users")
      .doc(this.props.theCurrentUserID)
      .get()
      .then((doc) => {
        let arrs = doc.data()["goals&routines"];
        arrs.forEach((gr) => {
          if (gr.id == gr_object.id) {
            gr_object["is_in_progress"] = false;
            gr_object["is_complete"] = false;
            gr["is_in_progress"] = false;
            gr["is_complete"] = false;
            Object.keys(gr["ta_notifications"]).forEach((k) => {
              gr["ta_notifications"][k].is_set = false;
            });
            Object.keys(gr["user_notifications"]).forEach((k) => {
              gr["user_notifications"][k].is_set = false;
            });
          }
        });
        db.collection("users")
          .doc(this.props.theCurrentUserID)
          .update({ "goals&routines": arrs });

        db.collection("users")
          .doc(doc.id)
          .collection("goals&routines")
          .get()
          .then((snapshot) => {
            if (!snapshot.empty) {
              snapshot.forEach((gr_doc) => {
                let gr = gr_doc.data();
                gr["actions&tasks"].forEach((at) => {
                  at.is_complete = false;
                  at.is_in_progress = false;
                  db.collection("users")
                    .doc(doc.id)
                    .collection("goals&routines")
                    .doc(gr_doc.id)
                    .collection("actions&tasks")
                    .get()
                    .then((is_snapshot) => {
                      if (!is_snapshot.empty) {
                        is_snapshot.forEach((is_doc) => {
                          let is = is_doc.data();
                          is["instructions&steps"].forEach((x) => {
                            x.is_complete = false;
                            x.is_in_progress = false;
                          });
                          db.collection("users")
                            .doc(doc.id)
                            .collection("goals&routines")
                            .doc(gr_doc.id)
                            .collection("actions&tasks")
                            .doc(is_doc.id)
                            .update(is);
                        });
                      }
                    });
                });
                db.collection("users")
                  .doc(doc.id)
                  .collection("goals&routines")
                  .doc(gr_doc.id)
                  .update(gr);
              });
            }
          });
        this.setState({});
        alert("Item is reset");
      });
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
        if (
          !this.props.routines[i]["is_available"] ||
          !this.props.routines[i]["is_displayed_today"]
        ) {
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
                this.getHistoryData(this.props.routines[i]);
                this.setState({
                  historyViewShow: true,
                  historyViewShowObject: this.props.routines[i],
                  isRoutine: true,
                });
              }}
            >
              <Row style={{ margin: "0" }} className="d-flex flex-row-center">
                <Col style={{ textAlign: "center", width: "100%" }}>
                  <div className="fancytext"> {tempTitle}</div>
                </Col>
                <div
                  className="fancytext"
                  style={{ position: "absolute", right: "15px", top: "21px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    this.resetRoutinesGoals(this.props.routines[i]);
                  }}
                >
                  Reset
                </div>
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
                      style={{
                        color: isInProgress
                          ? this.state.availabilityColorCode
                          : "black",
                      }}
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
    var displayRoutines = this.getRoutines();
    var displayGoals = this.getGoals();
    var displayCompletedGoals = this.getGoalsStatus();
    var displayCompletedRoutines = this.getRoutinesStatus();

    return (
      <div style={{ marginTop: "0" }}>
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
          marginLeft: "10px",
          boxShadow:
            "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        <Modal.Header onHide={this.props.closeGoal} closeButton>
          <Modal.Title>
            <Row>
              <Col style={{ marginRight: "140px" }}>
                <h5 className="normalfancytext">Goals</h5>
              </Col>
              <Col>
                <button
                  type="button"
                  className="btn btn-info btn-md"
                  onClick={() => {
                    this.setState({
                      addNewGRModalShow: true,
                      isRoutine: false,
                    });
                  }}
                >
                  Add Goal
                </button>
              </Col>
            </Row>
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
              zIndex: "5",
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
          </ListGroup>
        </Modal.Body>
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
          marginLeft: "10px",
          boxShadow:
            "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        <Modal.Header onHide={this.props.closeRoutine} closeButton>
          <Row>
            <Col style={{ marginRight: "85px" }}>
              <h5 className="normalfancytext">Routines</h5>
            </Col>
            <Col>
              <button
                type="button"
                className="btn btn-info btn-md"
                onClick={() => {
                  this.addRoutineOnClick();
                }}
              >
                Add Routine
              </button>
            </Col>
          </Row>
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
        </Modal.Body>
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

    // console.log(newStart, newEnd, "newstart");

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

  historyModel = (object) => {
    return (
      <ShowHistory
        closeModal={() => {
          this.setState({ historyItems: [], historyViewShow: false });
        }}
        historyItems={this.state.historyItems}
        displayTitle={object.title}
      />
    );
  };

  getHistoryData = (object) => {
    let historyItems = [];
    const db = firebase.firestore();
    db.collection("history")
      .doc(this.props.theCurrentUserID)
      .collection("goals&routines")
      .get()
      .then(async (snapshot) => {
        let logs = [];
        snapshot.forEach((log) => {
          log.data().log.forEach((gr) => {
            if (gr.id == object.id) {
              gr.date = log.data().date;
              logs.push(gr);
            }
          });
        });

        // push data for current date
        let date = new Date();
        let date_string =
          date.getFullYear() +
          "_" +
          (date.getMonth() > 8
            ? date.getMonth() + 1
            : "0" + (date.getMonth() + 1)) +
          "_" +
          (date.getDate() > 9 ? date.getDate() : "0" + date.getDate());
        date_string = "_Today";
        let currentDateHistory = {
          date: date_string,
          title: object.title,
          is_in_progress: object.is_in_progress,
          is_complete: object.is_complete,
        };

        await db
          .collection("users")
          .doc(this.props.theCurrentUserID)
          .collection("goals&routines")
          .doc(object.id)
          .get()
          .then((ats) => {
            console.log(ats.data()["actions&tasks"]);
            currentDateHistory["actions&tasks"] =
              ats.data()["actions&tasks"] != undefined
                ? ats.data()["actions&tasks"]
                : [];
          });

        for (let i = 0; i < currentDateHistory["actions&tasks"].length; i++) {
          let at = currentDateHistory["actions&tasks"][i];
          await db
            .collection("users")
            .doc(this.props.theCurrentUserID)
            .collection("goals&routines")
            .doc(object.id)
            .collection("actions&tasks")
            .doc(at.id)
            .get()
            .then((singleAT) => {
              if (singleAT.data()["instructions&steps"] != undefined) {
                currentDateHistory["actions&tasks"][i][
                  "instructions&steps"
                ] = singleAT.data()["instructions&steps"];
              }
            });
        }

        logs.push(currentDateHistory);

        let list = [];
        console.log(currentDateHistory, logs);
        let headers = [
          <th key={"history_header_title:"} style={{ width: "400px" }}></th>,
        ];
        for (let i = Math.max(logs.length - 7, 0); i < logs.length; i++) {
          headers.push(
            <th
              key={"history_header:" + logs[i].date}
              style={{ width: "80px", textAlign: "center" }}
            >
              {logs[i].date.split("_").slice(1).join("/")}
            </th>
          );
        }

        let rows_objects = {};
        for (let i = Math.max(logs.length - 7, 0); i < logs.length; i++) {
          let gr = logs[i];
          let date = logs[i].date;
          if (rows_objects["gr:" + gr.title] == undefined) {
            rows_objects["gr:" + gr.title] = {};
          }
          rows_objects["gr:" + gr.title][date] = {
            is_in_progress: gr.is_in_progress,
            is_complete: gr.is_complete,
            title: gr.title,
          };
          if (gr["actions&tasks"] != undefined) {
            gr["actions&tasks"].forEach((at) => {
              if (
                rows_objects["gr:" + gr.title + "," + "at:" + at.title] ==
                undefined
              ) {
                rows_objects["gr:" + gr.title + "," + "at:" + at.title] = {};
              }
              rows_objects["gr:" + gr.title + "," + "at:" + at.title][date] = {
                is_in_progress: at.is_in_progress,
                is_complete: at.is_complete,
                title: at.title,
              };
              if (at["instructions&steps"] != undefined) {
                at["instructions&steps"].forEach((is) => {
                  if (
                    rows_objects[
                      "gr:" +
                        gr.title +
                        "," +
                        "at:" +
                        at.title +
                        "," +
                        "is:" +
                        is.title
                    ] == undefined
                  ) {
                    rows_objects[
                      "gr:" +
                        gr.title +
                        "," +
                        "at:" +
                        at.title +
                        "," +
                        "is:" +
                        is.title
                    ] = {};
                  }
                  rows_objects[
                    "gr:" +
                      gr.title +
                      "," +
                      "at:" +
                      at.title +
                      "," +
                      "is:" +
                      is.title
                  ][date] = is;
                });
              }
            });
          }
        }

        Object.keys(rows_objects).forEach((key, index) => {
          let row = [];
          let cells = [];
          let title_left = "";
          let fontSize = "22px";
          let paddingLeft = "10px";
          if (key.includes("is:")) {
            fontSize = "14x";
            paddingLeft = "50px";
          } else if (key.includes("at:")) {
            fontSize = "18px";
            paddingLeft = "30px";
          }
          for (let i = Math.max(logs.length - 7, 0); i < logs.length; i++) {
            if (rows_objects[key][logs[i].date] == undefined) {
              cells.push(
                <td
                  style={{ width: "80px", textAlign: "center" }}
                  key={"history:" + key + logs[i].date}
                ></td>
              );
            } else {
              let title = rows_objects[key][logs[i].date]["title"];
              let isComplete = rows_objects[key][logs[i].date]["is_complete"];
              let isInProgress =
                rows_objects[key][logs[i].date]["is_in_progress"];
              title_left = title;
              cells.push(
                <td
                  style={{ width: "80px", textAlign: "center" }}
                  key={"history:" + key + logs[i].date}
                >
                  <FontAwesomeIcon
                    style={{
                      color:
                        isComplete || isInProgress
                          ? this.state.availabilityColorCode
                          : "black",
                    }}
                    icon={isComplete ? faTrophy : faRunning}
                    size="lg"
                  />
                </td>
              );
            }
          }
          row.push(
            <tr key={"history_title_row:" + key}>
              <td
                style={{ paddingLeft: paddingLeft, fontSize: fontSize }}
                key={"history_title_left:" + key}
              >
                {title_left}
              </td>
              {cells}
            </tr>
          );
          list.push(row);
        });

        historyItems.push(
          <Table
            key={"goalStatus" + object.id}
            style={{ tableLayout: "fixed", width: "fit-content" }}
            striped
            bordered
            hover
          >
            <thead>
              <tr>{headers}</tr>
            </thead>
            <tbody key="history-body">{list}</tbody>
          </Table>
        );
        this.setState({ historyItems: historyItems });
      });
  };

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
          <div
            className="d-flex justify-content-between"
            style={{ width: "350px" }}
          >
            <div>
              <h5 className="normalfancytext">{this.state.singleAT.title}</h5>{" "}
            </div>
            <div>
              <button
                type="button"
                className="btn btn-info btn-md"
                onClick={() => {
                  this.setState({ addNewISModalShow: true });
                }}
              >
                Add Step
              </button>
            </div>
          </div>
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
                updateNewWentThroughATListObjIS={
                  this.handleWentThroughATListObj
                }
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
      </Modal.Dialog>
    );
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
          <div
            className="d-flex justify-content-between"
            style={{ width: "350px" }}
          >
            <div>
              <h5 className="normalfancytext">{this.state.singleGR.title}</h5>{" "}
            </div>
            <div>
              <button
                type="button"
                className="btn btn-info btn-md"
                onClick={() => {
                  this.setState({ addNewATModalShow: true });
                }}
              >
                Add Action/Task
              </button>
            </div>
          </div>
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
                hideNewATModal={() => {
                  this.setState({ addNewATModalShow: false });
                }}
                width={this.state.modalWidth}
                updateNewWentThroughATListObj={this.handleWentThroughATListObj}
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
            {this.state.historyViewShow
              ? this.historyModel(this.state.historyViewShowObject)
              : ""}
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
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
