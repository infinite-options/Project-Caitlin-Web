import React, { Component } from 'react'
// import axios from 'axios';
// import moment from 'moment';
import {
    Tooltip, Container, Row, Col
} from 'react-bootstrap';

export default class DayEvents extends Component {

    constructor(props) {
        super(props);
        // console.log(this.props.dateContext);
        this.state = {
            //dayEvents: [], //holds google events data for a single day
            // todayDateObject: moment("03/07/2020"), //this is the date of interset for events to be displaye
            pxPerHour: "30px", //preset size for all columns
            pxPerHourForConversion: 30, // if pxPerHour is change, this should change to reflect it
            zIndex: 1, //thought i needed to increment zIndex for div overlaps but seems to be fine being at 1 for all divs
            eventBoxSize: 150, //width size for event box
            marginFromLeft: 0
        }
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

    onEventClick = (e, i) => {
         var arr = this.props.dayEvents;
          e.stopPropagation();
          this.props.eventClickDayView(arr[i]);
    }

   
    /**
     * getEventItem: given an hour, this will return all events that was started during that hour
     *
    */
    getEventItem = (hour) => {
        var res = []
        var tempStart = null;
        var tempEnd = null;
        var arr = this.props.dayEvents;
        var sameTimeEventCount = 0;
        var overlapEvent = 0;
        var addmarginLeft = 0;
        var sameHourItems= 1;
        let itemWidth = this.state.eventBoxSize;
        var fontSize = 10;

        for (let i = 0; i < arr.length; i++) {
            tempStart = arr[i].start.dateTime;
            tempEnd = arr[i].end.dateTime;
            let tempStartTime = new Date(tempStart);
            let tempEndTime = new Date(tempEnd);
            /**
             * TODO: add the case where arr[i].start.dateTime doesn't exists
            */

            if (tempStartTime.getHours() == hour) {
                // addmarginLeft = 0;
                // itemWidth = this.state.eventBoxSize;
                let minsToMarginTop = (tempStartTime.getMinutes() / 60) * this.state.pxPerHourForConversion;
                let hourDiff = tempEndTime.getHours() - tempStartTime.getHours();
                let minDiff = (tempEndTime.getMinutes()) / 60;
                let height = (hourDiff + minDiff) * this.state.pxPerHourForConversion;
                let color = 'PaleTurquoise';

                sameTimeEventCount++;
                //check if there is already an event there overlapping from another hour
                for(let i = 0; i < arr.length; i++){
                    tempStart = arr[i].start.dateTime;
                    tempEnd = arr[i].end.dateTime;
                    let tempStartTime = new Date(tempStart);
                    let tempEndTime = new Date(tempEnd);
                    if (tempStartTime.getHours() <  hour &&  tempEndTime.getHours()> hour) {
                        addmarginLeft += 20;
                        itemWidth = itemWidth - 20;
                    }
                }

                if(sameTimeEventCount > 1  ){
                    // console.log("add 20 in day");
                     addmarginLeft += 20;
                    // addmarginLeft += this.state.eventBoxSize/(sameHourItems-1) ;
                    // itemWidth = itemWidth/(sameHourItems-1);
                    itemWidth = itemWidth - 20;
                }
                //chnage font size if not enough space
                if((tempEndTime.getHours() - tempStartTime.getHours()) < 2){
                    fontSize = 8;
                }

                // change color if more than one event in same time.
                if(sameTimeEventCount <= 1){
                     color = (hour % 2 == 0 ? 'PaleTurquoise' : 'skyblue');
                }
                else if( sameTimeEventCount == 2){
                    color = 'skyblue';
                }
                else{
                    color = 'blue';
                }

                let newElement =
                    (

                         <div key={"event" + i}>
                            <div 

                                data-toggle="tooltip" data-placement="right" title={arr[i].summary + "\nStart: " + tempStartTime + "\nEnd: " + tempEndTime}
                                onMouseOver={e => {
                                    e.target.style.color = "#FFFFFF";
                                    e.target.style.background = "RebeccaPurple";
                                    e.target.style.zIndex = "2";
                                }}
                                onMouseOut={e => {
                                    e.target.style.zIndex = "1";
                                    e.target.style.color = "#000000";
                                    e.target.style.background = color;
                                }}
                                key={i}
                                // value = {i}
                                onClick = {e => this.onEventClick(e, i)}
                                style={{
                                    zIndex: this.state.zIndex,
                                    marginTop: minsToMarginTop + "px",
                                    padding: "5px",
                                    fontSize: fontSize + "px",
                                    border: "1px lightgray solid ",
                                     float: "left",
                                    //  verticalAlign: " ",
                                    // verticalAlign: 'text-top',
                                    // textAlign:"left",
                                    borderRadius: "5px",
                                    background: color,
                                    // width: this.state.eventBoxSize - (addmarginLeft/16),
                                    width: itemWidth + "px",
                                    position: "absolute",
                                    height: height + "px",
                                    marginLeft: addmarginLeft + "px"
                                }}>
                                    {/* {console.log("LOOOOOK "+ arr[i].summary + "   " + this.state.eventBoxSize/(sameHourItems-1) )} */}
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

    onDayClick = (e, i) => {   
        
        console.log("this is the hour:"+i);
        this.props.handleDateClick((this.props.dateContext.format("M") + '/' + this.props.dateContext.format("D") + '/'+  this.props.dateContext.format("Y")), i);
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
                        }}
                        onClick = {e =>this.onDayClick(e, i)}
                        >
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
}
