import React, { Component } from 'react'
import moment from 'moment';
import {
     Container, Row, Col
} from 'react-bootstrap';

export default class WeekGoals extends Component {
  constructor(props) {
      super(props);
      // console.log(this.props.dateContext);
      this.state = {
          pxPerHour: "30px", //preset size for all columns
          pxPerHourForConversion: 30, // if pxPerHour is change, this should change to reflect it
          zIndex: 1, //thought i needed to increment zIndex for div overlaps but seems to be fine being at 1 for all divs
          eventBoxSize: 80, //width size for event box
      }
      this.hourDisplay = React.createRef();
  }

  componentDidMount  () {
    // Set top most time to be current hour
    // Browser scrolls to the bottom if hour >= 18
    let curHour = new Date().getHours();
    this.hourDisplay.current.scrollTop = this.state.pxPerHourForConversion * curHour;
  }

  /**
     * getEventItem: given an hour, this will return all events that was started during that hour
     *
    */
   getEventItem = (day, hour) => {

    let startObject = this.props.dateContext.clone();
    let startDay = startObject.startOf("week");
    let curDate = startDay.clone();
    curDate.add(day,'days');
    var res = []
    var tempStart = null;
    var tempEnd = null;
    var arr = this.props.goals;
    var sameTimeEventCount = 0;
    var addmarginLeft = 0;
    let itemWidth = this.state.eventBoxSize;
    var fontSize = 10;
  for (let i = 0; i < arr.length; i++) {
      tempStart = arr[i].start_day_and_time;
      tempEnd = arr[i].end_day_and_time;
      /**
       * TODO: add the case where arr[i].start.dateTime doesn't exists
      */
      let tempStartTime = new Date(tempStart);
      let tempEndTime = new Date(tempEnd);
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
                            tempStart =  arr[i].start_day_and_time;
                            tempEnd = arr[i].end_day_and_time;
                            let tempStartTime = new Date(tempStart);
                            let tempEndTime = new Date(tempEnd);
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

                                        data-toggle="tooltip" data-placement="right" title={arr[i].title + "\nStart: " + tempStartTime + "\nEnd: " + tempEndTime}
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
                                        // onClick={e => this.onEventClick(e, i)}
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
                                        {arr[i].title}
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

                                        data-toggle="tooltip" data-placement="right" title={arr[i].title + "\nStart: " + tempStartTime + "\nEnd: " + tempEndTime}
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
                                        // onClick={e => this.onEventClick(e, i)}
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
                                        {arr[i].title}
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
                                    data-toggle="tooltip" data-placement="right" title={arr[i].title + "\nStart: " + tempStartTime + "\nEnd: " + tempEndTime}
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
                                    // onClick={e => this.onEventClick(e, i)}
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
                                    {arr[i].title}
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
                                    data-toggle="tooltip" data-placement="right" title={arr[i].title + "\nStart: " + tempStartTime + "\nEnd: " + tempEndTime}
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
                                    // onClick={e => this.onEventClick(e, i)}
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
                                    {arr[i].title}
                                </div>
                            </div>
                        );
                        res.push(newElement);
            }
        }
      }
  }
  return res;
    // var res = []
    // var arr = this.props.goals;
    // var sameTimeEventCount = 0;
    // let itemWidth = this.state.eventBoxSize;
    // // var overlapEvent = 0;
    // var addmarginLeft = 0;
    // var fontSize = 10;
    // for (let i = 0; i < arr.length; i++) {

    //     let start_dateObj = new Date();
    //     let start_dateStr = start_dateObj.toISOString().split('T').shift();
    //     let start_timeStr = arr[i].available_start_time;
    //     let start_timeAndDate = moment(start_dateStr + ' ' + start_timeStr).toDate();

    //     let end_dateObj = new Date();
    //     let end_dateStr = end_dateObj.toISOString().split('T').shift();
    //     let end_timeStr = arr[i].available_end_time;
    //     let end_timeAndDate = moment(end_dateStr + ' ' + end_timeStr).toDate();

    //     let tempStartTime = start_timeAndDate;
    //     let tempEndTime = end_timeAndDate;
    //     /**
    //      * TODO: add the case where arr[i].start.dateTime doesn't exists
    //     */
    //     if (tempStartTime.getHours() === hour) {
    //         // addmarginLeft = 0;
    //         // itemWidth = this.state.eventBoxSize;
    //         // itemWidth = 0;
    //         // console.log("matched" + i );
    //         let minsToMarginTop = (tempStartTime.getMinutes() / 60) * this.state.pxPerHourForConversion;
    //         let hourDiff = tempEndTime.getHours() - tempStartTime.getHours();
    //         let minDiff = (tempEndTime.getMinutes()) / 60;
    //         let height = (hourDiff + minDiff) * this.state.pxPerHourForConversion;
    //         let color = 'PaleTurquoise';

    //         sameTimeEventCount++;
    //         //check if there is already an event there overlapping from another hour
    //         for(let i = 0; i < arr.length; i++){
    //             let start_dateObj = new Date();
    //             let start_dateStr = start_dateObj.toISOString().split('T').shift();
    //             let start_timeStr = arr[i].available_start_time;
    //             let start_timeAndDate = moment(start_dateStr + ' ' + start_timeStr).toDate();

    //             let end_dateObj = new Date();
    //             let end_dateStr = end_dateObj.toISOString().split('T').shift();
    //             let end_timeStr = arr[i].available_end_time;
    //             let end_timeAndDate = moment(end_dateStr + ' ' + end_timeStr).toDate();

    //             let tempStartTime = start_timeAndDate;
    //             let tempEndTime = end_timeAndDate;
    //             if (tempStartTime.getHours() <  hour &&  tempEndTime.getHours()> hour) {
    //                 //  console.log("this is statr time :"+ tempStartTime.getHours() );
    //                 //  console.log("this is end time :"+ tempEndTime.getHours() );
    //                 //  console.log("add 20");
    //                 addmarginLeft += 20;
    //                 itemWidth = itemWidth - 20;
    //                 // console.log(addmarginLeft);
    //                 // overlapEvent++;
    //             }
    //         }


    //         if(sameTimeEventCount > 1  ){
    //             // console.log("In here because same hour  ");
    //             // console.log("add 20");
    //              addmarginLeft += 20;
    //             // addmarginLeft += this.state.eventBoxSize/(sameHourItems-1) ;
    //             // itemWidth = itemWidth/(sameHourItems-1);
    //             itemWidth = itemWidth - 20;
    //             // console.log("thi is the item width after subtracting 40 " + itemWidth);
    //             // console.log(addmarginLeft);
    //         }
    //         // console.log(addmarginLeft);
    //         // console.log("end of this element ");

    //         //chnage font size if not enough space
    //         if((tempEndTime.getHours() - tempStartTime.getHours()) < 2){
    //             fontSize = 8;
    //         }
    //         // change color if more than one event in same time.
    //         if(sameTimeEventCount <= 1){
    //              color = (hour % 2 === 0 ? 'PaleTurquoise' : 'skyblue');
    //         }
    //         else if( sameTimeEventCount === 2){
    //             color = 'skyblue';
    //         }
    //         else{
    //             color = 'blue';
    //         }
    //         let newElement =
    //             (<div key={"dayGoalItem" + i}
    //             data-toggle="tooltip" data-placement="right" title={arr[i].title + "\nStart: " + tempStartTime + "\nEnd: " + tempEndTime}

    //                 onMouseOver={e => {
    //                     e.target.style.color = "#FFFFFF";
    //                     e.target.style.background = "RebeccaPurple";
    //                     // e.target.style.marginLeft = "5px";
    //                     e.target.style.zIndex="2";

    //                 }}
    //                 onMouseOut={e => {
    //                     e.target.style.zIndex="1";
    //                     // e.target.style.marginLeft = "0px";
    //                     e.target.style.color = "#000000";
    //                     e.target.style.background = color;
    //                     e.target.style.border= "1px lightgray solid";
    //                     // e.target.style.background = ( hour % 2 ==0 ?  'PaleTurquoise' : 'skyblue');
    //                 }}
    //                 onClick = {this.GoalClicked}
    //                 style={{
    //                     zIndex: this.state.zIndex,
    //                     marginTop: minsToMarginTop + "px",
    //                     padding: "5px",
    //                     // fontSize: "10px",
    //                     border: "1px lightgray solid ",
    //                     // float: "left",
    //                     borderRadius: "5px",
    //                     // background: (hour % 2 == 0 ? 'PaleTurquoise' : 'skyblue'),
    //                     // width: this.state.eventBoxSize,
    //                     position: "absolute",
    //                     height: height + "px",

    //                     fontSize: fontSize + "px",
    //                     background: color,
    //                     width: itemWidth + "px",
    //                     marginLeft: addmarginLeft + "px"
    //                 }}>
    //                 {arr[i].title}
    //             </div>);
    //         res.push(newElement);
    //     }
    // }
    // return res;
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

  weekViewItems = () => { // this creates the events adjusting their div size to reflecting the time it's slotted for
      var res= [];
      for (let i = 0; i < 7; ++i) {
          var arr = []
          for( let j = 0; j < 24; ++j) {
            arr.push(
              <Container key={"weekGoal" + i + j}>
                <Row style={{ position: "relative"}}>
                  <Col
                      style={{
                          position: "relative",
                          borderTop: "1px solid lavender",
                          background: "aliceblue",
                          height: this.state.pxPerHour,
                      }}
                  >
                      {this.getEventItem(i,j)}
                  </Col >
                </Row>
              </Container>
            );
          }
        res.push(
          <Col key={"dayGoal" + i}>
            {arr}
          </Col>
        );
      }
      return res;
  }

 render() {
    let weekdays = moment.weekdays().map((day) => {
      return (
        <Col key={"goal"+day} className="fancytext">{day}</Col>
      )
    });
     return (
         <Container style={{ height: 'auto', width: '1000px'}}>
          <Row>
            <Col>Goals</Col>
          </Row>
           <Row>
             <Col className="fancytext">Time</Col>
             {weekdays}
           </Row>
           <Row ref={this.hourDisplay} style={{ width: 'auto', height: "180px", overflowX: "visible", overflowY: "scroll"}}>
             <Col >
                 <Container style={{ margin: '0', padding: '0', width: '80px' }}>
                     {this.timeDisplay()}
                 </Container>
             </Col>
             {this.weekViewItems()}
           </Row>
         </Container>
     )
 }
}
