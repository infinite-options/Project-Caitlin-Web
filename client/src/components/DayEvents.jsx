import React, { Component } from 'react'
import axios from 'axios';
import moment from 'moment';
import {
    OverlayTrigger,
    Tooltip, Button, Container, Row, Col, Modal
} from 'react-bootstrap';

export default class DayEvents extends Component {

    constructor(props) {
        super(props);
        console.log(this.props.today);
        this.state = {
            dayEvents: [], //holds google events data for a single day
            todayDateObject: moment("03/07/2020"), //this is the date of interset for events to be displaye
            pxPerHour: "30px", //preset size for all columns
            pxPerHourForConversion: 30, // if pxPerHour is change, this should change to reflect it
            zIndex: 1, //thought i needed to increment zIndex for div overlaps but seems to be fine being at 1 for all divs
            eventBoxSize: "150px", //width size for event box
            marginFromLeft: 0
        }
    }

    componentDidMount() { //retrive data and put in dayEvents
        console.log("retrieve data for date: " + this.state.todayDateObject.format('MM/DD/YYYY'));
        this.getEventsByIntervalDayVersion(this.state.todayDateObject.format('MM/DD/YYYY'));
    }

    timeDisplay = () => { //this essentially creates the time row
        let arr = [];
        for (let i = 0; i < 24; ++i) {
            arr.push(
                <Row key={"dayEvent" + i}>
                    <Col style={{
                        borderTop: "1px solid lavender",
                        textAlign: "right",
                        height: this.state.pxPerHour
                    }}>
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
        var tempStart = null;
        var tempEnd = null;
        var arr = this.state.dayEvents;
        var sameTimeEventCount = 0;
        var addmarginLeft = 0;
        for (let i = 0; i < arr.length; i++) {
            tempStart = arr[i].start.dateTime;
            tempEnd = arr[i].end.dateTime;
            let tempStartTime = new Date(tempStart);
            let tempEndTime = new Date(tempEnd);
            // console.log ("looooookkkk hererefre  " + tempStartTime);
            /**
             * TODO: add the case where arr[i].start.dateTime doesn't exists
            */
           //Add MarginRight here Lymann

            if (tempStartTime.getHours() == hour) {
                sameTimeEventCount++;
                if(sameTimeEventCount > 1){
                    addmarginLeft += 40; 
                }
                console.log("loook here: " + addmarginLeft);
                let minsToMarginTop = (tempStartTime.getMinutes() / 60) * this.state.pxPerHourForConversion;
                let hourDiff = tempEndTime.getHours() - tempStartTime.getHours();
                let minDiff = (tempEndTime.getMinutes()) / 60;
                let height = (hourDiff + minDiff) * this.state.pxPerHourForConversion;
                let color = 'PaleTurquoise';
                if(sameTimeEventCount <= 1){
                     color = (hour % 2 == 0 ? 'PaleTurquoise' : 'skyblue');
                }
                else if( sameTimeEventCount == 2){
                     console.log("why not hererere ");
                    color = 'skyblue';
                }
                else{
                    color = 'blue';
                }
                
                //increment MarginRight by 10px  here Lymann = 0  

                let newElement =
                    (
                        <div key={"event" + i}>
                            <div
                                data-toggle="tooltip" data-placement="right" title={arr[i].summary + "\nStart: " + tempStartTime + "\nEnd: " + tempEndTime}
                                onMouseOver={e => {
                                    e.target.style.color = "#FFFFFF";
                                    e.target.style.background = "RebeccaPurple";
                                    // e.target.style.marginLeft = "5px";
                                    e.target.style.zIndex = "2"; 
                                }}
                                onMouseOut={e => {
                                    e.target.style.zIndex = "1";
                                    // e.target.style.marginLeft = addmarginLeft + "px";
                                    e.target.style.color = "#000000";
                                    e.target.style.background = color;
                                }}

                                style={{
                                    //add marginRight property : 
                                    // marginLeft: this.state.marginFromLeft + "px",
                                    zIndex: this.state.zIndex,
                                    marginTop: minsToMarginTop + "px",
                                    padding: "5px",
                                    // width:( 10 + i ) + "px", 
                                    fontSize: "10px",
                                    border: "1px lightgray solid ",
                                    // float: "left",
                                    borderRadius: "5px", 
                                    background: color,
                                    width: this.state.eventBoxSize - (addmarginLeft/16),
                                    position: "absolute", 
                                    height: height + "px",
                                    marginLeft: addmarginLeft + "px"
                                }}>
                                {arr[i].summary}
                            </div>
                        </div>
                    );
                res.push(newElement);

                // this.state.marginFromLeft = this.state.marginFromLeft + 5;
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
                <Row key={"dayEvent" + i} style={{ position: "relative" }}>
                    <Col
                        style={{
                            position: "relative",
                            borderTop: "1px solid lavender",
                            width: '180px', //lyman change width to adjust
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
                // margin:'10px',
                padding: '20px',
                //  marginTop: "10px", 
                width: "300px",
                //  border: "2px lightlightgray solid", 
                borderRadius: "20px"
            }}>
                Today's Events:
                <Container style={{}}>
                    <Row >
                        <Col >
                            {/* this is Just for the time */}
                            <Container style={{ margin: '0', padding: '0' }}>
                                {this.timeDisplay()}
                            </Container>
                        </Col>
                        <Col>
                            {/* this is for the actual event slots */}
                            <Container style={{ margin: '0', padding: '0' }}>
                                {this.dayViewItems()}
                            </Container>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }

    /*
*
getEventsByIntervalDayVersion:
gets exactly the days worth of events from the google calendar
*
*
*/
    getEventsByIntervalDayVersion = (day) => {
        console.log('DayEvents getEventsByIntervalDayVersion ran with ' + day);
        console.log(day.toString());
        axios.get('/getEventsByInterval', { //get normal google calendar data for possible future use
            params: {
                start: day.toString(),         
                end: day.toString()
            }
        })
            .then(response => {
                console.log('Today\'s Google Events:')
                console.log(response);
                var events = response.data;
                this.setState({
                    dayEvents: events
                }, () => {
                    console.log("New Events Arrived")
                })
            })
            .catch(error => {
                console.log('Error Occurred ' + error);
            });
    }
}
