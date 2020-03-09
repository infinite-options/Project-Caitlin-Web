import React, { Component } from 'react'
import axios from 'axios';
import moment from 'moment';
import { Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';

import firebase from "./firebase";
export default class DayRoutines extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firebaseRootPath: firebase.firestore().collection('users').doc('7R6hAVmDrNutRkG3sVRy'),
            goals: [], //array to hold all  goals
            routines: [], // array to hold all routines
            dayEvents: [], //holds google events data for a single day
            todayDateObject: moment("03/02/2020"), //this is the date of interset for events to be displaye
            pxPerHour: "30px", //preset size for all columns
            pxPerHourForConversion: 30, // if pxPerHour is change, this should change to reflect it
            zIndex: 1, //thought i needed to increment zIndex for div overlaps but seems to be fine being at 1 for all divs
            eventBoxSize: "150px", //width size for event box
        }
    }

    componentDidMount() {
        this.grabFireBaseRoutinesGoalsData();
    }

    /**
 * grabFireBaseRoutinesGoalsData:
 * this function grabs the goals&routines array from the path located in this function
 * which will then populate the goals, routines,originalGoalsAndRoutineArr array
 * separately. The arrays will be used for display and data manipulation later.
 *
*/
    grabFireBaseRoutinesGoalsData = () => {
        const db = firebase.firestore();
        console.log('DayRoutine component did mount');
        const docRef = db.collection('users').doc('7R6hAVmDrNutRkG3sVRy');
        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log(doc.data());
                var x = doc.data();
                console.log("from DayRoutines");
                console.log(x['goals&routines']);
                x = x['goals&routines'];
                let routine = [];
                let goal = [];
                for (let i = 0; i < x.length; ++i) {
                    if (!x[i]['deleted'] && x[i]['is_persistent']) {
                        console.log("routine " + x[i]['title']);
                        routine.push(x[i]);
                    }
                    else if (!x[i]['deleted'] && !x[i]['is_persistent']) {
                        console.log("not routine " + x[i]['title']);
                        goal.push(x[i]);
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


    dayView = () => { //this essentially creates the time row
        let arr = [];
        for (let i = 0; i < 24; ++i) {
            arr.push(
                <Row key={"dayDayViewRoutines" + i}>
                    <Col style={{
                        borderTop: "1px solid  mistyrose",
                    textAlign: "right",
                    height: this.state.pxPerHour }}>
                        {i}:00
                    </Col >
                </Row>
            )
        }
        return arr
    }


    /**
     * getEventItem: given an hour, this will return all events that was started during that hour
     *
    */
    getEventItem = (hour) => {
        var res = []
        var arr = this.state.routines;
        for (let i = 0; i < arr.length; i++) {

            let start_dateObj = new Date();
            let start_dateStr = start_dateObj.toISOString().split('T').shift();
            let start_timeStr = arr[i].available_start_time;
            let start_timeAndDate = moment(start_dateStr + ' ' + start_timeStr).toDate();

            let end_dateObj = new Date();
            let end_dateStr = end_dateObj.toISOString().split('T').shift();
            let end_timeStr = arr[i].available_end_time;
            let end_timeAndDate = moment(end_dateStr + ' ' + end_timeStr).toDate();

            let tempStartTime = start_timeAndDate;
            let tempEndTime = end_timeAndDate;
            /**
             * TODO: add the case where arr[i].start.dateTime doesn't exists
            */
            if (tempStartTime.getHours() == hour) {
                // console.log("matched" + i );
                let minsToMarginTop = (tempStartTime.getMinutes() / 60) * this.state.pxPerHourForConversion;
                let hourDiff = tempEndTime.getHours() - tempStartTime.getHours();
                let minDiff = (tempEndTime.getMinutes()) / 60;
                let height = (hourDiff + minDiff) * this.state.pxPerHourForConversion;
                let newElement =
                    (<div key={"dayRoutineItem" + i}
                    data-toggle="tooltip" data-placement="right" title={arr[i].title + "\nStart: " + tempStartTime + "\nEnd: " + tempEndTime}

                        onMouseOver={e => {
                            e.target.style.color = "#FFFFFF";
                            e.target.style.background = "RebeccaPurple";
                            e.target.style.marginLeft = "5px";
                            // e.target.style.border= "3px solid w";
                            e.target.style.zIndex="2";




                        }}
                        onMouseOut={e => {
                            e.target.style.zIndex="1";

                            e.target.style.marginLeft = "0px";
                             e.target.style.color = "#000000";
                             e.target.style.background = ( hour % 2 ==0 ?  'PaleTurquoise' : 'skyblue');
                             e.target.style.border= "1px lightgray solid";


                            }}
                        style={{
                            zIndex: this.state.zIndex,
                            marginTop: minsToMarginTop + "px",
                            padding: "5px",
                            fontSize: "10px",
                            border: "1px lightgray solid ",
                            float: "left",
                            borderRadius: "5px", background: (hour % 2 == 0 ? 'PaleTurquoise' : 'skyblue'),
                             width: this.state.eventBoxSize,
                            position: "absolute", height: height + "px"
                        }}>
                        {arr[i].title}
                    </div>);
                res.push(newElement);
            }
        }
        return res;
    }

    /**
     * dayViewItems: goes through hours 0 to 24, and calling getEventItem for each hour
    */
    dayViewItems = () => { // this creates the events adjusting their div size to reflecting the time it's slotted for
        var arr = [];
        for (let i = 0; i < 24; ++i) {
            arr.push(
                <Row key={"dayRoutine" + i} style={{ position: "relative" }}>
                    <Col
                        style={{
                            position: "relative",
                            borderTop: "1px solid mistyrose",
                            width: '180px',
                            background: "aliceblue",
                            height: this.state.pxPerHour
                        }}>
                        {this.getEventItem(i)}
                    </Col >
                </Row>
            )
        }
        return arr;
    }

    render() {
        return (


            <div style={{
                padding: '20px',
                // marginTop: "10px",
                width: "300px",
                borderRadius: "20px" }}>
                Today's Routines:
                <Container style={{}}>
                    <Row >
                        {/* <div class="table col-md-1" > */}
                        <Col>
                            {/* this is for the actual event slots */}
                            <Container style={{ margin: '0', padding: '0' }}>
                                {this.dayViewItems()}
                            </Container>
                            {/* </div> */}
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }

}
