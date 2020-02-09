import React from 'react';
import firebase from "./firebase";
import { ListGroup, Button, Row, Col, Modal, InputGroup, FormControl } from 'react-bootstrap';
import AddNewGRItem from './addNewGRItem.jsx'
import AddNewATItem from './addNewATItem.jsx'
export default class FirebaseV2 extends React.Component {

    state = {
        firebaseRootPath: firebase.firestore().collection('users').doc('7R6hAVmDrNutRkG3sVRy'),
        originalGoalsAndRoutineArr: [],
        goals: [], //array to hold all  goals  
        routines: [], // array to hold all routines 
        singleGR: { //everytime a goal/routine is clicked, we open a modal and the modal info will be provided by this object
            show: false,
            type: "None",
            title: 'GR Name',
            photo: "",
            id: null,
            arr: [],
            fbPath: null
        },
        singleAT: { //for each action/task we click on, we open a new modal to show the steps/instructions affiliate
            //with the task
            show: false,
            type: "None",
            title: 'AT Name',
            photo: '',
            id: null,
            arr: [],
            fbPath: null
        },
        modalWidth: '350px',
        addNewGRModalShow: false,
        addNewATModalShow: false,
        thumbnailWidth: '200px',
        thumbnailHeight: '100px',
        //We will need similar data for the IS: instruction/steps
        //in which we be able to alter each step/ instruction as needed.

        //isRoutine is to check whether we clicked on add routine or add goal
        isRoutine: true
    }

    constructor(props) { // serves almost no purpose currently
        super(props);
        console.log('running Firebase 2');
        // this.state = {date: new Date()};
    }

    componentDidMount() { //Grab the 
        this.grabFireBaseRoutinesGoalsData();
    }

    grabFireBaseRoutinesGoalsData = () => {
        const db = firebase.firestore();
        console.log('FirebaseV2 component did mount');
        const docRef = db.collection('users').doc('7R6hAVmDrNutRkG3sVRy');
        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log('CHeck')
                console.log(doc.data());
                var x = doc.data();
                console.log(x['goals&routines']);
                x = x['goals&routines'];
                let routine = []
                let goal = []
                // console.log(x);
                for (let i = 0; i < x.length; ++i) {
                    if (x[i]['is_persistent']) {
                        console.log("routine " + x[i]['title'])
                        routine.push(x[i])
                    }
                    else {
                        console.log("not routine " + x[i]['title'])
                        goal.push(x[i])
                    }
                }
                this.setState({
                    originalGoalsAndRoutineArr: x,
                    goals: goal,
                    routines: routine
                })

            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    }

    componentWillUnmount() {
        console.log(' FirebaseV2 will unmount web');
    }

    onInputChange = (e) => {
        const inputField = e.target.value;
        console.log('FirebaseV2.jsx :: onInputChange :: ' + inputField);
    }


    //This function essentially grabs all action/tasks
    //for the routine or goal passed in and pops open the
    //modal for the action/task 
    getATList = (id, title, persist) => {
        const db = firebase.firestore();
        console.log('getATList component did mount id : ' + id);
        let docRef = db.collection('users').doc('7R6hAVmDrNutRkG3sVRy')
            .collection('goals&routines').doc(id);
        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log('testes')
                console.log(doc.data());
                var x = doc.data()['actions&tasks']
                console.log(x);
                if (x == null) {
                    console.log("No actions&tasks array!");
                    let singleGR = { //Variable to hold information about the parent Goal/ Routine
                        show: true,
                        type: (persist) ? "Routine" : "Goal",
                        title: title,
                        id: id,
                        arr: [],
                        fbPath: null
                    }
                    this.setState({
                        singleGR: singleGR
                    })
                    return;
                }
                let resArr = this.createListofAT(x);
                //assemble singleGR template here:
                let singleGR = {
                    show: true,
                    type: (persist) ? "Routine" : "Goal",
                    title: title,
                    id: id,
                    arr: resArr,
                    fbPath: docRef
                }

                this.setState({
                    singleGR: singleGR
                })

            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    }

    //Creates a array of all actions/task for get getATList function
    //getATList stands for get all action/task 
    createListofAT = (A) => {
        let res = []
        for (let i = 0; i < A.length; i++) {
            console.log(A[i]['title']);
            if (!A[i]['id'] || !A[i]['title']) {
                console.log('missing photo, title, or id at index : ' + i);
                return []
            }
            let tempID = A[i]['id'];
            let tempPhoto = A[i]['photo'];
            console.log(tempPhoto);
            let tempTitle = A[i]['title'];
            res.push(
                <div key={'AT' + i} >
                    <ListGroup.Item action onClick={() => { this.ATonClickEvent(tempTitle, tempID) }} variant="light" style={{ marginBottom: '3px' }}>
                        <p className="fancytext">{tempTitle}</p>

                        {(tempPhoto ? (<img src={tempPhoto} alt="Routine" height={this.state.thumbnailHeight} width={this.state.thumbnailWidth} className="center" />) : (<div></div>))}

                    </ListGroup.Item>
                </div>
            )
        }
        return res;
    }


    /**
     * takes the list of steps/instructions and returns
     * it in the form of a ListGroup for presentation
    */
    createListofIS = (A) => {
        let res = []
        for (let i = 0; i < A.length; i++) {
            console.log(A[i]['title']);
            console.log(A[i]['id']);
            /**
             * TODO: notify jeremy of this issue:
             * Some of these here don't have IDs, so we need to 
             * ignore it for now
            */
            // if (!A[i]['id'] || !A[i]['title']) {
            //     console.log('missing photo, title, or id at index : ' + i);
            //     return res
            // }
            // let tempID = A[i]['id'];
            let tempPhoto = A[i]['photo'];
            console.log("IS index " + i + " photo url :" + tempPhoto);
            let tempTitle = A[i]['title'];
            res.push(
                <div key={'IS' + i} >
                    <ListGroup.Item action onClick={() => { this.ISonClickEvent(tempTitle) }} variant="light" style={{ marginBottom: '3px' }}>
                        <p className="fancytext">{tempTitle}</p>
                        {(tempPhoto ? (<img src={tempPhoto} alt="Instruction/Step" height={this.state.thumbnailHeight} width={this.state.thumbnailWidth} className="center" />) : (<div></div>))}
                    </ListGroup.Item>
                </div>
            )
        }
        return res;
    }

    ISonClickEvent = (title) => {
        console.log("Inside IS Click " + title);
    }


    /**
     * In this function we are passed in the id title and persist property of the incoming routine/goal
     * and we need to make return a viewable list of all the actions/tasks for this routine/goal
     * which is done in getATList function 
    */
    GRonClickEvent = (title, id, persist) => {
        console.log(id, title, persist);
        this.getATList(id, title, persist)

    }


    /**
     * This needs to be done tomorrow, we are passed in the action/task id and title
     * and we will need to grab all steps/Instructions related to this action/task,
     * do this ASAP TODO 
    */
    ATonClickEvent = (title, id) => {

        /**
         * Steps to procede:
         * 1. singleGR = get its id, and the current ID 
         * 2. We have 2 ids and we know the name of the collection is 'actions&tasks'
         * 3. stepsInstructionArrayPath = firebaseRootPath.collection('goals&routines').doc(this.state.singleGR.id).collection('actions&tasks').doc(id);
         * 4. once we received the doc information, we go to grab the arr['instructions&steps']
         * 
         * 
         * 
         *  show: false,
            type: "None",
            title: 'AT Name',
            photo: '',
            id: null,
            arr: []
        */
        // 
        let stepsInstructionArrayPath = this.state.firebaseRootPath.collection('goals&routines').doc(this.state.singleGR.id).collection('actions&tasks').doc(id);

        console.log(id, title);
        let temp = {
            show: true,
            type: "Action/Task",
            title: title,
            id: id,
            arr: [],
            fbPath: stepsInstructionArrayPath
        }
        stepsInstructionArrayPath.get().then((doc) => {
            if (doc.exists) {
                console.log('Grabbing steps/instructions data:')
                // console.log(doc.data());
                var x = doc.data();
                x = x['instructions&steps'];
                if (x === null) {
                    this.setState(
                        { singleAT: temp }
                    )
                    return;
                }
                console.log(x);
                temp.arr = this.createListofIS(x);
                this.setState(
                    { singleAT: temp }
                )

            } else {
                // doc.data() will be undefined in this case
                console.log("No Instruction/Step documents!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
            alert("Error getting document:", error);
        });


    }

    getRoutines = () => {
        let displayRoutines = [];
        if (this.state.routines.length !== 0) {//Check to make sure routines exists
            for (let i = 0; i < this.state.routines.length; i++) {
                let tempTitle = this.state.routines[i]['title'];
                let tempID = this.state.routines[i]['id'];
                let tempPersist = this.state.routines[i]['is_persistent'];
                displayRoutines.push(
                    <div key={'test0' + i} >
                        <ListGroup.Item action onClick={() => { this.GRonClickEvent(tempTitle, tempID, tempPersist) }} variant="light" style={{ marginBottom: '3px' }}>
                            <Row>

                                <Col sm="auto" md="auto" lg="auto" style={{ width: '100%', height: "100%" }}>
                                <p className="fancytext">{this.state.routines[i]['title']}</p>

                                    {(this.state.routines[i]['photo'] ? (<img src={this.state.routines[i]['photo']} alt="Routine" height={this.state.thumbnailHeight} width={this.state.thumbnailWidth} className="center" />) : (<div></div>))}

                                </Col>
                                <Col>
                                    <p>Time: {Math.floor(1 + Math.random() * (45 - 1))} Minutes</p>
                                    <p> Description: None Yet </p>
                                    {/* <Row style={{margin:'0'}}><p className="fancytext">Description: Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, </p> */}
                                    {/* </Row> */}
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    </div>
                )
            }
        }
        return displayRoutines;
    }

    getGoals = () => {
        let displayGoals = [];

        if (this.state.goals.length != null) {//Check to make sure routines exists
            for (let i = 0; i < this.state.goals.length; i++) {
                // console.log(this.state.goals[i]['title'])
                let tempTitle = this.state.goals[i]['title'];
                let tempID = this.state.goals[i]['id'];
                let tempPersist = this.state.goals[i]['is_persistent'];
                displayGoals.push(
                    <div key={'test1' + i} >
                        <ListGroup.Item action onClick={() => { this.GRonClickEvent(tempTitle, tempID, tempPersist) }} variant="light" style={{ marginBottom: '3px' }}>
                            <Row>

                                <Col sm="auto" md="auto" lg="auto" style={{ margin: '0', width: '100%', height: "100%" }}>
                                <p className="fancytext"> {this.state.goals[i]['title']} </p>

                                    {(this.state.goals[i]['photo'] ? (<img src={this.state.goals[i]['photo']} alt="Routine" className="center" height={this.state.thumbnailHeight} width={this.state.thumbnailWidth} />) : (<div></div>))}

                                </Col>
                                <Col>
                                    <p>Time: {Math.floor(1 + Math.random() * (45 - 1))} Minutes</p>
                                    <p> Description: None Yet </p>
                                    {/* <Row style={{margin:'0'}}><p className="fancytext">Description: Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, </p> */}
                                    {/* </Row> */}
                                </Col>
                            </Row>

                        </ListGroup.Item>



                    </div>
                )
            }
        }

        return displayGoals;
    }

    render() {
        console.log('ran render firebasev2')
        var displayRoutines = this.getRoutines();
        var displayGoals = this.getGoals();


        return (
            <div style={{ marginTop: '0' }} >

                {
                    (this.props.showRoutineGoalModal) ?
                        (<Col style={{ width: this.state.modalWidth, marginTop: '0', marginRight: '15px' }} sm="auto" md="auto" lg="auto" >
                            <div style={{ boxShadow: '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)' }}>
                                {this.abstractedRoutineGoalsList(displayRoutines, displayGoals)}
                            </div>
                        </Col>) : <div> </div>
                }

                {
                    (this.props.showRoutine) ?
                        (<Col style={{ width: this.state.modalWidth, marginTop: '0', marginRight: '15px' }} sm="auto" md="auto" lg="auto" >
                            <div style={{ boxShadow: '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)' }}>
                                {this.abstractedRoutineList(displayRoutines)}
                            </div>
                        </Col>) : <div> </div>
                }
                {
                    (this.props.showGoal) ? (
                        <Col style={{ width: this.state.modalWidth, marginTop: '0', marginRight: '15px' }} sm="auto" md="auto" lg="auto" >
                            <div style={{ boxShadow: '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)' }}>
                                {this.abstractedGoalsList(displayGoals)}
                            </div>
                        </Col>) : <div> </div>
                }

                <Col sm="auto" md="auto" lg="auto">
                    <div style={{ boxShadow: '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)' }}>
                        {(this.state.addNewGRModalShow) ? this.AddNewGRModalAbstracted() : ""}
                    </div>
                </Col>

                {/* <Col sm="auto" md="auto" lg="auto">
                    <div style={{ boxShadow: '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)' }}>
                        {(this.state.singleGR.show) ? this.abstractedActionsAndTaskList() : (<div></div>)}
                    </div>
                </Col> */}

                <Col sm="auto" md="auto" lg="auto">
                    <div style={{ boxShadow: '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)' }}>
                        {(this.state.addNewATModalShow) ? <AddNewATItem /> : (<div></div>)}
                    </div>
                </Col>

                {/* <Col sm="auto" md="auto" lg="auto">
                    <div style={{ boxShadow: '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)' }}>
                        {(this.state.singleAT.show) ? this.abstractedInstructionsAndStepsList() : (<div></div>)}
                    </div>
                </Col> */}
                {/* </Row> */}
            </div>
        )
    }


    /*
abstractedGoalsList: 
shows entire list of goals and routines
*/
    abstractedGoalsList = (displayGoals) => {
        return (
            <Modal.Dialog style={{ marginTop: "0", width: this.state.modalWidth, marginLeft: '0' }}>
                <Modal.Header onClick={this.props.closeGoal} closeButton>
                    <Modal.Title><h5 className="normalfancytext">Goals</h5> </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/**
                     * To allow for the Modals to pop up in front of one another
                     * I have inserted the IS and AT lists inside the RT Goal Modal */ }
                    <div style={{ boxShadow: '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)' }}>
                        {(this.state.addNewGRModalShow) ? this.AddNewGRModalAbstracted() : ""}
                    </div>

                    <div style={{ boxShadow: '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)' }}>
                        {(this.state.singleGR.show) ? this.abstractedActionsAndTaskList() : (<div></div>)}
                    </div>
                    <ListGroup>
                        {displayGoals}
                        {/* Button to add new Goal */}
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" class="btn btn-info btn-md" onClick={() => { this.setState({ addNewGRModalShow: true, isRoutine: false }) }}>Add Goal</button>
                </Modal.Footer>
            </Modal.Dialog>)
    }



    /*
    abstractedRoutineList: 
    shows entire list of routines
    */
    abstractedRoutineList = (displayRoutines) => {
        return (
            <Modal.Dialog style={{ marginTop: "0", width: this.state.modalWidth, marginLeft: '0' }}>
                <Modal.Header onClick={this.props.closeRoutine} closeButton>
                    <Modal.Title> <h5 className="normalfancytext">Routines</h5> </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/**
                     * To allow for the Modals to pop up in front of one another
                     * I have inserted the IS and AT lists inside the RT Goal Modal */ }
                    <div style={{ boxShadow: '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)' }}>
                        {(this.state.addNewGRModalShow) ? this.AddNewGRModalAbstracted() : ""}
                    </div>
                    <div style={{ boxShadow: '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)' }}>
                        {(this.state.singleGR.show) ? this.abstractedActionsAndTaskList() : (<div></div>)}
                    </div>
                    <ListGroup>
                        {displayRoutines}
                    </ListGroup>
                    {/* Button To add new Routine */}
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" class="btn btn-info btn-md" onClick={() => { this.setState({ addNewGRModalShow: true, isRoutine: true }) }} >Add Routine</button>
                </Modal.Footer>
            </Modal.Dialog>)
    }



    /**
     * AddNewGRModalAbstracted:
     * returns a modal showing us a slot to add a new Goal/Routine
    */
    AddNewGRModalAbstracted = () => {
        return (<Modal.Dialog style={{ marginLeft: '0', width: this.state.modalWidth, }}>
            <Modal.Header closeButton onClick={() => { this.setState({ addNewGRModalShow: false }) }}>
                <Modal.Title>

                    <h5 className="normalfancytext">
                        Add New {(this.state.isRoutine ? "Routine" : "Goal")}</h5> </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <AddNewGRItem refresh={this.grabFireBaseRoutinesGoalsData} isRoutine={this.state.isRoutine} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => { this.setState({ addNewGRModalShow: false }) }}>Close</Button>
                <Button variant="info" onClick={() => { this.setState({ addNewGRModalShow: false }) }}>Save changes</Button>
            </Modal.Footer>
        </Modal.Dialog>)
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
        return (<Modal.Dialog style={{ marginLeft: '0', width: this.state.modalWidth, }}>
            <Modal.Header closeButton onClick={() => { this.setState({ singleAT: { show: false } }) }}>
                <Modal.Title><h5 className="normalfancytext">{this.state.singleAT.title}</h5> </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup>
                    {this.state.singleAT.arr}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => { this.setState({ singleAT: { show: false } }) }}>Close</Button>
                <Button variant="info" onClick={() => { this.setState({ singleAT: { show: false } }) }}>Save changes</Button>
            </Modal.Footer>
        </Modal.Dialog>)
    }



    /**
     * abstractedActionsAndTaskList - 
     * returns modal with with a single Routine/ Goal as title
     * and beneath it is the list of action/ task associated with the
     * goal/ routine
    */
    abstractedActionsAndTaskList = () => {
        return (<Modal.Dialog style={{ marginLeft: '0', width: this.state.modalWidth }}>
            <Modal.Header closeButton onClick={() => { this.setState({ singleGR: { show: false } }) }} >
                <Modal.Title><h5 className="normalfancytext">{this.state.singleGR.type + " : " + this.state.singleGR.title}</h5> </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/**
                 * Here Below, the IS list will pop up inside the AT list
                  */}
                <div style={{ boxShadow: '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)' }}>
                    {(this.state.singleAT.show) ? this.abstractedInstructionsAndStepsList() : (<div></div>)}
                </div>
                <ListGroup >
                    <div style={{ height: '500px', overflow: 'scroll' }}>
                        {this.state.singleGR.arr}
                    </div>
                    <button type="button" class="btn btn-info btn-lg" onClick={() => { this.setState({ addNewATModalShow: true }) }} >Add Action/Task</button>
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => { this.setState({ singleGR: { show: false } }) }} >Close</Button>
                <Button variant="info" onClick={() => { this.setState({ singleGR: { show: false } }) }} >Save changes</Button>
            </Modal.Footer>
        </Modal.Dialog>)
    }


    addNewTaskInputBox = () => {
        return (
            <InputGroup size="lg" style={{ marginTop: '20px' }} className="mb-3">
                <FormControl onChange={() => { console.log("addNewGoalInputBox") }}
                    placeholder=""
                />
                <InputGroup.Append>
                    <Button variant="outline-secondary">Add</Button>
                </InputGroup.Append>
            </InputGroup>)
    }


    /*
    abstractedRoutineGoalsList: 
    shows entire list of goals and routines
    */
    abstractedRoutineGoalsList = (displayRoutines, displayGoals) => {
        return (
            <Modal.Dialog style={{ padding: '0', marginTop: "0", width: this.state.modalWidth, marginLeft: '0' }}>
                <Modal.Header closeButton onClick={this.props.closeRoutineGoalModal}>
                    <Modal.Title> <h5 className="normalfancytext">Goals/Routines: </h5> </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h2 className="normalfancytext">Routines</h2>

                    {/**
                     * To allow for the Modals to pop up in front of one another
                     * I have inserted the IS and AT lists inside the RT Goal Modal */ }

                    <div style={{ boxShadow: '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)' }}>
                        {(this.state.singleGR.show) ? this.abstractedActionsAndTaskList() : (<div></div>)}
                    </div>

                    <ListGroup>
                        {displayRoutines}
                        <button type="button" class="btn btn-info btn-lg" onClick={() => { this.setState({ addNewGRModalShow: true, isRoutine: true }) }} >Add Routine</button>
                    </ListGroup>
                    {/* Button To add new Routine */}
                    <h2 className="normalfancytext" style={{ marginTop: '50px' }}>Goals</h2>
                    <ListGroup>
                        {displayGoals}
                        {/* Button to add new Goal */}
                        <button type="button" class="btn btn-info btn-lg" onClick={() => { this.setState({ addNewGRModalShow: true, isRoutine: false }) }}>Add Goal</button>
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal.Dialog>)
    }



    addNewGoalInputBox = () => {
        return (
            <InputGroup size="lg" style={{ marginTop: '20px', width: this.state.modalWidth }} className="mb-3">
                <FormControl onChange={() => { console.log("addNewGoalInputBox") }}
                    placeholder="place holder!!"
                />
                <InputGroup.Append>
                    <Button variant="outline-secondary">Add</Button>
                </InputGroup.Append>
            </InputGroup>)
    }
}