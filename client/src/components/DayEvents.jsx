import React, { Component } from 'react'
import axios from 'axios';
import moment from 'moment';
import { Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';

export default class DayEvents extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dayEvents: [], //holds google events data for a single day
            todayDateObject: moment("03/02/2020"),
            pxPerHour: "30px",
            pxPerHourForConversion: 30,
            zIndex: 1,
            eventBoxSize: "150px",
        }
    }

    componentDidMount() {
        this.getEventsByIntervalDayVersion();
    }

    dayView = () => {
        let arr = [];
        for (let i = 0; i < 24; ++i) {
            arr.push(
                <Row>
                    <Col style={{ borderTop: "1px solid lightgray", textAlign: "right", height: this.state.pxPerHour }}>
                        {i}:00
                    </Col >
                </Row>
            )
        }
        return arr
    }

    getEventItem = (hour) => {
        var res = [];
        var tempStart = null;
        var tempEnd = null;
        var arr = this.state.dayEvents;
        for (let i = 0; i < arr.length; i++) {
            tempStart = arr[i].start.dateTime;
            tempEnd = arr[i].end.dateTime;
            let tempStartTime = new Date(tempStart);
            let tempEndTime = new Date(tempEnd);
            if (tempStartTime.getHours() == hour) {
                let minsToMarginTop = (tempStartTime.getMinutes() / 60) * this.state.pxPerHourForConversion;
                let hourDiff = tempEndTime.getHours() - tempStartTime.getHours();
                let minDiff = (tempEndTime.getMinutes())/60 ;
                let height = (hourDiff + minDiff) * this.state.pxPerHourForConversion;
                
                let newElement = (
                    (<div
                        onMouseOver={e => {
                            // e.target.style.background = '#00000000';
                            e.target.style.color = "#FFFFFF";
                        }}
                        onMouseOut={e => { e.target.style.color = "#000000"; }}
                        style={{
                            zIndex: this.state.zIndex,
                            marginTop: minsToMarginTop + "px",  
                            padding: "5px",
                            fontSize: "10px",
                            float: "left",
                            borderRadius: "5px", background: 'PaleTurquoise', width: this.state.eventBoxSize,
                            position: "absolute", height: height + "px"
                        }}>
                        {arr.summary}
                    </div>)
                );


            }
        }
    }

    dayViewItems = () => {
        let arr = [];
        for (let i = 0; i < 24; ++i) {
            arr.push(
                <Row style={{ position: "relative" }}>
                    <Col style={{ position: "relative", borderTop: "1px solid lightgray", width: '180px', background: "aliceblue", height: this.state.pxPerHour }}>
                        {(i == 1) ?
                            (<div
                                onMouseOver={e => {
                                    // e.target.style.background = '#00000000';
                                    e.target.style.color = "#FFFFFF";
                                }}
                                onMouseOut={e => { e.target.style.color = "#000000"; }}
                                style={{
                                    zIndex: this.state.zIndex,
                                    // marginTop: "5px",  
                                    padding: "5px",
                                    fontSize: "10px",
                                    float: "left",
                                    borderRadius: "5px", background: 'lightsteelblue', width: this.state.eventBoxSize,
                                    position: "absolute", height: "70px"
                                }}>
                                Make Lunch
                            </div>)
                            :
                            (<div> </div>)
                        }

                        {(i == 7) ?
                            (<div
                                onMouseOver={event => { event.target.style.color = "#FFFFFF"; }}
                                onMouseOut={event => { event.target.style.color = "#000000"; }} style={{
                                    zIndex: this.state.zIndex,
                                    float: "left",

                                    // marginTop: "5px",
                                    padding: "5px",
                                    fontSize: "10px",
                                    borderRadius: "5px", background: 'skyblue', width: this.state.eventBoxSize,
                                    position: "absolute", height: "200px"
                                }}>Make Dinner</div>)
                            :
                            (<div> </div>)
                        }

                        {(i == 10) ?
                            (<div
                                onMouseOver={event => { event.target.style.color = "#FFFFFF"; }}
                                onMouseOut={event => { event.target.style.color = "#000000"; }} style={{
                                    zIndex: this.state.zIndex,
                                    padding: "5px",
                                    fontSize: "10px",
                                    border: "1px lightgray solid ",
                                    borderRadius: "5px", background: 'PaleTurquoise', width: this.state.eventBoxSize,
                                    position: "absolute", height: "50px"
                                }}>Make Bed</div>)
                            :
                            (<div> </div>)
                        }

                        {(i == 14) ?
                            (<div
                                onMouseOver={event => { event.target.style.color = "#FFFFFF"; }}
                                onMouseOut={event => { event.target.style.color = "#000000"; }} style={{
                                    zIndex: this.state.zIndex,
                                    padding: "5px",
                                    fontSize: "10px",
                                    border: "1px lightgray solid ",
                                    borderRadius: "5px", background: 'PaleTurquoise', width: this.state.eventBoxSize,
                                    position: "absolute", height: "50px"
                                }}>Make Breakfast!</div>)
                            :
                            (<div> </div>)
                        }


                    </Col >
                </Row>
            )
        }
        return arr

    }


    render() {
        return (
            <div style={{ padding: '20px', marginTop: "10px", width: "300px",  borderRadius: "20px" }}>
               Today's Events:
                <Container style={{}}>
                    <Row >
                        <Col >
                            <Container style={{ margin: '0', padding: '0' }}>
                                {this.dayView()}
                            </Container>
                        </Col>
                        {/* <div class="table col-md-1" > */}
                        <Col>
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

    /*
*
getEventsByIntervalDayVersion:
gets exactly the days worth of events from the google calendar
*
*
*/
    getEventsByIntervalDayVersion = (day) => {
        console.log('Main getEventsByIntervalDayVersion ran ');
        axios.get('/getEventsByInterval', { //get normal google calendar data for possible future use
            params: {
                start: day,
                end: day
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

                    // console.log(events.data);
                    // this.createOrganizeData(start0, end0);
                    //Call function to prep data for Monthly View
                })
            })
            .catch(error => {
                console.log('Error Occurred ' + error);
            }
            );
    }
}