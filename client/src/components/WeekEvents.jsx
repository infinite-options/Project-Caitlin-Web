import React, { Component } from 'react'
import moment from 'moment';
// import axios from "axios";
import {
     Container, Row, Col
} from 'react-bootstrap';

export default class WeekEvents extends Component {
  constructor(props) {
      super(props);
      this.state = {
          pxPerHour: "30px", //preset size for all columns
          pxPerHourForConversion: 30, // if pxPerHour is change, this should change to reflect it
          zIndex: 1, //thought i needed to increment zIndex for div overlaps but seems to be fine being at 1 for all divs
          eventBoxSize: 80, //width size for event box
          marginFromLeft: 0,
          startDateTimeEventDic: {}
      }
      this.hourDisplay = React.createRef();
  }

  componentDidMount() {
    // Set top most time to be current hour
    // Browser scrolls to the bottom if hour >= 18 (tested with Chrome and Firefox)
    let curHour = new Date(new Date().toLocaleString('en-US', {
      timeZone: this.props.timeZone
    })).getHours();
    this.hourDisplay.current.scrollTop = this.state.pxPerHourForConversion * curHour;
  }

  timeDisplay = () => { //this essentially creates the time row
      let arr = [];
      for (let i = 0; i < 24; ++i) {
          arr.push(
              <Row key={"dayEvent" + i}>
                  <Col style={{
                      borderTop: "1px solid lavender",
                      textAlign: "right",
                      height: this.state.pxPerHour,
                  }}>
                      {i}:00
                  </Col >
              </Row>
          )
      }
      return arr
  }

  dateDisplay = () => {
    let arr = [];
    let startObject = this.props.dateContext.clone();
    let startDay = startObject.startOf("week");
    let curDate = startDay.clone();
    for (let i = 0; i<7; i++) {
        arr.push(
            <Col key={"day" + i}>
                <Col style={{
                    textAlign: "center",
                    height: this.state.pxPerHour,
                }}>
                    {curDate.format("M/D")}
                </Col >
            </Col>
        );
        curDate.add(1,"day");
    }
    return arr;
  }

  onEventClick = (e, i) => {
    var arr = this.props.weekEvents;
    e.stopPropagation();
    this.props.eventClick(arr[i]);
  }

  onWeekClick = (event, day, hour) => {
    let startObject = this.props.dateContext.clone();
    let startDay = startObject.startOf("week");
    let curDate = startDay.clone();
    curDate.add(24*day+hour,'hour');
    this.props.onDayClick(curDate);
  }

  weekViewItems = () => { // this creates the events adjusting their div size to reflecting the time it's slotted for
      let dic = this.sortEvents();
      var res= [];
      for (let i = 0; i < 7; ++i) {
          var arr = []
          for( let j = 0; j < 24; ++j) {
            arr.push(
              <Container key={"weekEvent" + i + j}>
                <Row style={{ position: "relative"}}>
                  <Col
                      style={{
                          position: "relative",
                          borderTop: "1px solid lavender",
                          background: "aliceblue",
                          height: this.state.pxPerHour,
                          width: '80px',
                      }}
                      onClick={e => this.onWeekClick(e, i, j)}
                  >
                      {this.getEventItemFromDic(i,j,dic)}
                  </Col >
                </Row>
              </Container>
            );
          }
        res.push(
          <Col key={"dayEvent" + i}>
            {arr}
          </Col>
        );
      }
      return res;
  }

  sortEvents = () => {
    var arr = this.props.weekEvents;
    var dic = {}
    for (let i = 0; i < arr.length; i++) {
        let tempStart = arr[i].start.dateTime;
        let tempEnd = arr[i].end.dateTime;
        let tempStartTime = new Date(new Date(tempStart).toLocaleString('en-US', {
          timeZone: this.props.timeZone
        }));
        let key = tempStartTime.getDay()+"_"+tempStartTime.getHours();
        if (dic[key] == null) {
          dic[key] = [];
        }
        dic[key].push(arr[i]);
    }
    return dic;
  }

  getEventItemFromDic = (day, hour, dic) => {
      let startObject = this.props.dateContext.clone();
      let startDay = startObject.startOf("week");
      let curDate = startDay.clone();
      curDate.add(day,'days');
      var res = []
      var tempStart = null;
      var tempEnd = null;
      var arr = dic[day+"_"+hour];
      var sameTimeEventCount = 0;
      var addmarginLeft = 0;
      let itemWidth = this.state.eventBoxSize;
      var fontSize = 10;
      if (arr == null) {
        return;
      }
      for (let i = 0; i < arr.length; i++) {
        var arr_i = arr[i];
        tempStart = arr_i.start.dateTime;
        tempEnd = arr_i.end.dateTime;
        let tempStartTime = new Date(new Date(tempStart).toLocaleString('en-US', {
          timeZone: this.props.timeZone
        }));
        let tempEndTime = new Date(new Date(tempEnd).toLocaleString('en-US', {
          timeZone: this.props.timeZone
        }));
        let startDate = moment(tempStartTime);
        let endDate = moment(tempEndTime)
        if(curDate.isSameOrAfter(startDate,'day') && curDate.isSameOrBefore(endDate,'day')) {
          if (startDate.date() ===  curDate.date()) {
            if (startDate.hour() === hour) {
              if(startDate.date() === endDate.date()) {
                // addmarginLeft = 0;
                // itemWidth = this.state.eventBoxSize;
                let minsToMarginTop = (tempStartTime.getMinutes() / 60) * this.state.pxPerHourForConversion;
                let hourDiff = tempEndTime.getHours() - tempStartTime.getHours();
                let minDiff = (tempEndTime.getMinutes()) / 60;
                let color = 'PaleTurquoise';
                let height = (hourDiff + minDiff) * this.state.pxPerHourForConversion;
                sameTimeEventCount++;

                //check if there is already an event there overlapping from another hour
                for (let i = 0; i < arr.length; i++) {
                    tempStart = arr[i].start.dateTime;
                    tempEnd = arr[i].end.dateTime;
                    let tempStartTime = new Date(new Date(tempStart).toLocaleString('en-US', {
                      timeZone: this.props.timeZone
                    }));
                    let tempEndTime = new Date(new Date(tempEnd).toLocaleString('en-US', {
                      timeZone: this.props.timeZone
                    }));
                    if (tempStartTime.getHours() < hour && tempEndTime.getHours() > hour) {
                        addmarginLeft += 20;
                        itemWidth = itemWidth - 20;
                    }
                }

                if (sameTimeEventCount > 1) {
                  // console.log("add 20 in day");
                  addmarginLeft += 20;
                  // addmarginLeft += this.state.eventBoxSize/(sameHourItems-1) ;
                  // itemWidth = itemWidth/(sameHourItems-1);
                  itemWidth = itemWidth - 20;
                }
                //chnage font size if not enough space
                if ((tempEndTime.getHours() - tempStartTime.getHours()) < 2) {
                  fontSize = 8;
                }

                // change color if more than one event in same time.
                if (sameTimeEventCount <= 1) {
                  color = (hour % 2 === 0 ? 'PaleTurquoise' : 'skyblue');
                }
                else if (sameTimeEventCount === 2) {
                  color = 'skyblue';
                }
                else {
                  color = 'blue';
                }

                let newElement =
                (

                  <div key={"event" + i}>
                  <div
                  data-toggle="tooltip" data-placement="right" title={arr_i.summary + "\nStart: " + tempStartTime + "\nEnd: " + tempEndTime}
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
                  onClick={e => this.onEventClick(e, i)}
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
                  {arr_i.summary}
                  </div>
                  </div>
                );
                res.push(newElement);
              } else if(startDate.date() !== endDate.date()) {
                let minsToMarginTop = (tempStartTime.getMinutes() / 60) * this.state.pxPerHourForConversion;
                let hourDiff = 24 - tempStartTime.getHours();
                let minDiff = 0;
                let color = 'lavender';
                let height = (hourDiff + minDiff) * this.state.pxPerHourForConversion;
                sameTimeEventCount++;
                let newElement =
                (
                  <div key={"event" + i}>
                  <div

                  data-toggle="tooltip" data-placement="right" title={arr_i.summary + "\nStart: " + tempStartTime + "\nEnd: " + tempEndTime}
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
                  onClick={e => this.onEventClick(e, i)}
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
                  {arr_i.summary}
                  </div>
                  </div>
                );
                res.push(newElement);
              }
            }
          } else if (hour === 0) {
            if(endDate.date() ===  curDate.date()) {
              let minsToMarginTop = 0
              let hourDiff = tempEndTime.getHours();
              let minDiff = (tempEndTime.getMinutes()) / 60;
              let height = (hourDiff + minDiff) * this.state.pxPerHourForConversion;
              let color = 'lavender';
              sameTimeEventCount++;
              let newElement =
              (
                <div key={"event" + i}>
                <div
                data-toggle="tooltip" data-placement="right" title={arr_i.summary + "\nStart: " + tempStartTime + "\nEnd: " + tempEndTime}
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
                onClick={e => this.onEventClick(e, i)}
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
                {arr_i.summary}
                </div>
                </div>
              );
              res.push(newElement);
            } else {
              let minsToMarginTop = 0
              let height = 24 * this.state.pxPerHourForConversion;
              let color = 'lavender';
              sameTimeEventCount++;
              let newElement =
              (
                <div key={"event" + i}>
                <div
                data-toggle="tooltip" data-placement="right" title={arr_i.summary + "\nStart: " + tempStartTime + "\nEnd: " + tempEndTime}
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
                onClick={e => this.onEventClick(e, i)}
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
                {arr_i.summary}
                </div>
                </div>
              );
              res.push(newElement);
            }
          }
        }
      }
      return res;
  }

 render() {
    let weekdays = moment.weekdays().map((day) => {
      return (
        <Col key={"event"+day} className="fancytext">{day}</Col>
      )
    });
     return (
         <Container style={{ height: 'auto', width: '1000px'}}>
           <Row>
             <Col>Events </Col>
             {this.dateDisplay()}
           </Row>
           <Row>
             <Col className="fancytext">Time</Col>
             {weekdays}
           </Row>
           <Row ref={this.hourDisplay} style={{ width: 'auto', height: "180px", overflowX: "visible", overflowY: "scroll"}}>
             <Col>
                 <Container style={{ margin: '0', padding: '0'}}>
                     {this.timeDisplay()}
                 </Container>
             </Col>
             {this.weekViewItems()}
           </Row>
         </Container>
     )
 }
}
