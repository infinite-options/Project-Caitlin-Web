import React, { Component } from 'react'
// import axios from 'axios';
import moment from 'moment';
import {  Container, Row, Col} from 'react-bootstrap';

export default class DayGoals extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pxPerHour: "30px", //preset size for all columns
            pxPerHourForConversion: 30, // if pxPerHour is change, this should change to reflect it
            zIndex: 1, //thought i needed to increment zIndex for div overlaps but seems to be fine being at 1 for all divs
            eventBoxSize: "200", //width size for event box
        }
    }

    dayView = () => { //this essentially creates the time row
        let arr = [];
        for (let i = 0; i < 24; ++i) {
            arr.push(
                <Row key={"dayDayViewGoals" + i}>
                    <Col style={{ borderTop: "1px solid mistyrose", textAlign: "right", height: this.state.pxPerHour }}>
                        {i}:00
                    </Col >
                </Row>
            )
        }
        return arr
    }

    GoalClicked  = ()=>{
        this.props.dayGoalClick();
    }
    /**
     * getEventItem: given an hour, this will return all events that was started during that hour
     *
    */
    getEventItem = (hour) => {
        var res = []
        var tempStart = null;
        var tempEnd = null;
        var arr = this.props.goals;
        var sameTimeEventCount = 0;
        let itemWidth = this.state.eventBoxSize;
        // var overlapEvent = 0;
        var addmarginLeft = 0;
        var fontSize = 10;
        for (let i = 0; i < arr.length; i++) {
            tempStart = arr[i].start_day_and_time;
            tempEnd = arr[i].end_day_and_time;
      
            let tempStartTime = new Date(tempStart);
            let tempEndTime = new Date(tempEnd);
            let curDate = this.props.dateContext.get("date");
            let curMonth = this.props.dateContext.get("month");
            let curYear = this.props.dateContext.get("year");

            let initialStartDate =tempStartTime.getDate();
            let initialEndDate =tempEndTime.getDate();
            let initialStartMonth =tempStartTime.getMonth();
            let initialStartYear =tempStartTime.getFullYear();
            let initialEndYear =tempEndTime.getFullYear();


      /**
       * Dealing with repeating Routines
       */
      /**
       * Have to fix if event span multiple days. 
       */
      if(arr[i].repeat === true){
        if(arr[i].repeat_frequency === "DAY" ){
          /*** TODO fix if event goes to another month.  */
          if(arr[i].repeat_ends === "After" ){
            for(let j = 1;j< arr[i].repeat_occurences ;j++){
              if(tempStartTime.getDate() + j === curDate  && ((curDate - initialStartDate) % arr[i].repeat_every) === 0){
                tempStartTime.setDate(tempStartTime.getDate() + j);
                tempEndTime.setDate(tempEndTime.getDate() + j);
              }
              // if()
            }
          }

          
          /** TODO: account for ends on a different month. Also account for event span multiple days.  */
         else if(arr[i].repeat_ends === "On"){
          let endsOnDate = (new Date(arr[i].repeat_ends_on)).getDate();
          let initialEndOnMonth = (new Date(arr[i].repeat_ends_on)).getMonth();
           
            if(((curDate <=  endsOnDate && curDate > initialStartDate) || curMonth < initialEndOnMonth)  && ((curDate - initialStartDate) % arr[i].repeat_every) === 0){  
              tempStartTime.setDate(curDate);
              tempEndTime.setDate(curDate);
    
            }
         }
        /** doesnt work hen goign to month with reapting and doesnt work when routine spans multiple days */
         else if(arr[i].repeat_ends === "Never"){
          
           if(curYear > initialStartYear
            && curDate % arr[i].repeat_every === 0){
              tempStartTime.setDate(curDate);
              tempEndTime.setDate(curDate + (initialEndDate - initialStartDate));
              tempStartTime.setMonth(curMonth);
              tempEndTime.setMonth(curMonth);
              tempStartTime.setFullYear(curYear);
              tempEndTime.setFullYear(curYear);
           }else if(curYear === initialStartYear
            // && curMonth >initialStartMonth
            && curMonth - initialStartMonth === 1
            // && curDate % arr[i].repeat_every === 0
            && (((new Date(curYear, curMonth, 0).getDate())-initialStartDate)+curDate) % arr[i].repeat_every  === 0
            // do about of monnth - start day % reapeat every 
            // && curDate % arr[i].repeat_every === 0
            ){
              console.log("does it go here fooor");
              tempStartTime.setDate(curDate);
              tempEndTime.setDate(curDate + (initialEndDate - initialStartDate) );
              tempStartTime.setMonth(curMonth);
              tempEndTime.setMonth(curMonth);
           }else if(curYear === initialStartYear
             && curMonth - initialStartMonth > 1
            //  && 
             && (new Date(curYear, curMonth, 0).getDate() % arr[i].repeat_every + curDate)% arr[i].repeat_every === 0
            //  && (((new Date(initialStartYear, initialStartMonth, 0).getDate())-initialStartDate)+curDate+new Date(curYear, curMonth, 0) ) % arr[i].repeat_every  === 0
            // && curDate % arr[i].repeat_every === 0
            //  && (31+curDate ) % arr[i].repeat_every  === 0
            ){
              tempStartTime.setDate(curDate);
              tempEndTime.setDate(curDate + (initialEndDate - initialStartDate) );
              tempStartTime.setMonth(curMonth);
              tempEndTime.setMonth(curMonth);
           }
           else if(curYear === initialStartYear 
            && curMonth === initialStartMonth
            && curDate > initialStartDate 
            && ((curDate - initialStartDate) % arr[i].repeat_every) === 0 
            ) {  
              // console.log("does it go in here first");
              // if(((curDate - initialStartDate) % arr[i].repeat_every) === 0){
              //   console.log("does it go in here when %")
              //   tempStartTime.setDate(curDate);
              //   tempEndTime.setDate(curDate + (initialEndDate - initialStartDate));
              // }
              // } else if(curDate>=initialStartDate && curDate <= initialEndDate){
              //   console.log("does it go in here second")
              //   tempStartTime.setDate(curDate);
              //   tempEndTime.setDate(curDate + (initialEndDate - initialStartDate));
              // }
              // console.log("this is the end date ",curDate + (initialEndDate - initialStartDate), "this is the start date",curDate )        
              tempStartTime.setDate(curDate);
              tempEndTime.setDate(curDate + (initialEndDate - initialStartDate));
           }
         }
        }
        /** REPEAT MONTH */
        if(arr[i].repeat_frequency === "MONTH" ){
          /*** TODO fix if routine goes past 2 years.  */
          if(arr[i].repeat_ends === "After" ){
            for(let j = 1;j< arr[i].repeat_occurences ;j++){
              if(curDate >= initialStartDate      
                && curDate <= initialEndDate
                && tempStartTime.getMonth() + (j  * arr[i].repeat_every)=== curMonth 
                && ((curMonth - initialStartMonth) % arr[i].repeat_every) === 0
                && initialStartYear === curYear){
                  tempStartTime.setMonth(curMonth);
                  tempEndTime.setMonth(curMonth);
              } 
            }
            if(curDate >= initialStartDate      
              && curDate <= initialEndDate
              && curYear > initialStartYear
              && curYear - initialStartYear === 1
              && ((curMonth - initialStartMonth) % arr[i].repeat_every) === 0
              ){
                for(let k = 0; k< arr[i].repeat_occurences - (Math.floor((12 - tempStartTime.getMonth()) / arr[i].repeat_every)); k++){
                  if(((k  * arr[i].repeat_every) - (12 - tempStartTime.getMonth()) % arr[i].repeat_every) === curMonth ){
                    tempStartTime.setMonth(curMonth);
                    tempEndTime.setMonth(curMonth);
                    tempStartTime.setFullYear(curYear);
                    tempEndTime.setFullYear(curYear);
                  }   
                }    
            }else if(curDate >= initialStartDate      
              && curDate <= initialEndDate
              && curYear - initialStartYear === 2
              && ((curMonth - initialStartMonth) % arr[i].repeat_every) === 0
              ){
                for(let k = 0; k< arr[i].repeat_occurences - (Math.floor((12 - tempStartTime.getMonth()) / arr[i].repeat_every)) - Math.floor(12/arr[i].repeat_every); k++){
                  if(((k  * arr[i].repeat_every) - (12  % arr[i].repeat_every) - ((12 - tempStartTime.getMonth()) % arr[i].repeat_every) ) === curMonth ){
                    tempStartTime.setMonth(curMonth);
                    tempEndTime.setMonth(curMonth);
                    tempStartTime.setFullYear(curYear);
                    tempEndTime.setFullYear(curYear);
                  }   
                }    
            }
          }
         else if(arr[i].repeat_ends === "On"){
          let endsOnDate = (new Date(arr[i].repeat_ends_on)).getDate();
          let endsOnMonth = (new Date(arr[i].repeat_ends_on)).getMonth();
          let initialEndOnYear = (new Date(arr[i].repeat_ends_on)).getFullYear();
            if(initialStartYear === initialEndOnYear 
              && curMonth <=  endsOnMonth 
              && curMonth > initialStartMonth  
              && curDate >= initialStartDate      
              && curDate<= initialEndDate 
              && curYear === initialStartYear
              && ((curMonth - initialStartMonth) % arr[i].repeat_every) === 0){   
                if(endsOnMonth === curMonth ){
                    if(endsOnDate >= initialStartDate ){
                      tempStartTime.setMonth(curMonth);
                      tempEndTime.setMonth(curMonth);
                    }   
                }
                else{
                      tempStartTime.setMonth(curMonth);
                      tempEndTime.setMonth(curMonth);
                }
            }else if(initialStartYear !== initialEndOnYear
              && curDate >= initialStartDate      
              && curDate<= initialEndDate 
              && curYear > initialStartYear
              && curYear < initialEndOnYear
              && ((curMonth - initialStartMonth) % arr[i].repeat_every) === 0){
              if(endsOnMonth === curMonth ){
                if(endsOnDate >= initialStartDate ){
                  tempStartTime.setMonth(curMonth);
                  tempEndTime.setMonth(curMonth);
                  tempStartTime.setFullYear(curYear);
                  tempEndTime.setFullYear(curYear);
                }   
              }
              else{
                  tempStartTime.setMonth(curMonth);
                  tempEndTime.setMonth(curMonth);
                  tempStartTime.setFullYear(curYear);
                  tempEndTime.setFullYear(curYear);
              }
            }else if(initialStartYear !== initialEndOnYear
              && curMonth <=  endsOnMonth
              && curDate >= initialStartDate      
              && curDate<= initialEndDate 
              && curYear === initialEndOnYear
              && ((curMonth - initialStartMonth) % arr[i].repeat_every) === 0){
              if(endsOnMonth === curMonth ){
                if(endsOnDate >= initialStartDate ){
                  tempStartTime.setMonth(curMonth);
                  tempEndTime.setMonth(curMonth);
                  tempStartTime.setFullYear(curYear);
                  tempEndTime.setFullYear(curYear);
                }   
              }
              else{
                  tempStartTime.setMonth(curMonth);
                  tempEndTime.setMonth(curMonth);
                  tempStartTime.setFullYear(curYear);
                  tempEndTime.setFullYear(curYear);
              }
            }else if(initialStartYear !== initialEndOnYear 
              && curMonth > initialStartMonth
              && curDate >= initialStartDate      
              && curDate<= initialEndDate 
              && curYear === initialStartYear
              && ((curMonth - initialStartMonth) % arr[i].repeat_every) === 0){
              if(endsOnMonth === curMonth ){
                if(endsOnDate >= initialStartDate ){
                  tempStartTime.setMonth(curMonth);
                  tempEndTime.setMonth(curMonth);
                }   
              }
              else{
                  tempStartTime.setMonth(curMonth);
                  tempEndTime.setMonth(curMonth);
              }
            }
         }
         else if(arr[i].repeat_ends === "Never"){
           if(curDate >= initialStartDate && curDate<= initialEndDate 
            && curYear > initialStartYear 
            && ((curMonth - initialStartMonth ) % arr[i].repeat_every) === 0){
            tempStartTime.setMonth(curMonth);
            tempEndTime.setMonth(curMonth);
            tempStartTime.setFullYear(curYear);
            tempEndTime.setFullYear(curYear);
           }
           else if(curDate >= initialStartDate && curDate<= initialEndDate 
            && curMonth > initialStartMonth 
            && curYear ===  initialStartYear
            && ((curMonth - initialStartMonth) % arr[i].repeat_every) === 0){
            tempStartTime.setMonth(curMonth);
            tempEndTime.setMonth(curMonth);
           }
         }
        }

        /** REPEAT YEAR */
        if(arr[i].repeat_frequency === "YEAR" ){
          if(arr[i].repeat_ends === "After" ){
            for(let j = 1;j< arr[i].repeat_occurences ;j++){
              if(curDate >= initialStartDate      
                && curDate <= initialEndDate
                && curMonth >= tempStartTime.getMonth() 
                && curMonth <= tempEndTime.getMonth()  
                && tempStartTime.getFullYear() + (j  * arr[i].repeat_every)=== curYear 
                && ((curYear - initialStartYear) % arr[i].repeat_every) === 0){
                      
                    tempStartTime.setFullYear(curYear);
                    tempEndTime.setFullYear(curYear);
              }
            }
          }
          if(arr[i].repeat_ends === "On"){
          let endsOnDate = (new Date(arr[i].repeat_ends_on)).getDate();
          let endsOnMonth = (new Date(arr[i].repeat_ends_on)).getMonth();
          let initialEndOnYear = (new Date(arr[i].repeat_ends_on)).getFullYear();  
            if(((curYear <=  initialEndOnYear && curYear > initialStartYear) )  
              && curDate >= initialStartDate      
              && curDate<= initialEndDate
              && curMonth === initialStartMonth
              && ((curYear - initialStartYear) % arr[i].repeat_every) === 0){  
                if(initialEndOnYear === curYear ){
                  if(endsOnMonth === initialStartMonth){
                    if(endsOnDate >= initialStartDate ){
                      tempStartTime.setFullYear(curYear);
                      tempEndTime.setFullYear(curYear);
                    }
                  }
                  else if(endsOnMonth > initialStartMonth){
                    tempStartTime.setFullYear(curYear);
                    tempEndTime.setFullYear(curYear);
                  }
                }
                else{
                  tempStartTime.setFullYear(curYear);
                  tempEndTime.setFullYear(curYear);
                }
            }
         }
         else if(arr[i].repeat_ends === "Never"){
            if(curDate >= initialStartDate && curDate<= initialEndDate && curMonth === initialStartMonth && curYear > initialStartYear && ((curYear - initialStartYear) % arr[i].repeat_every) === 0){
            tempStartTime.setFullYear(curYear);
            tempEndTime.setFullYear(curYear);
           }
         }
        }
        /*** TODO then do if span week */
      }

            /**
             * TODO: add the case where arr[i].start.dateTime doesn't exists
            */
           if (tempStartTime.getDate() === curDate &&  curMonth <= tempEndTime.getMonth() && curMonth>= tempStartTime.getMonth() && curYear <= tempEndTime.getFullYear() && curYear>= tempStartTime.getFullYear()) {

              if (tempStartTime.getHours() === hour) {
                if (tempStartTime.getDate() !== tempEndTime.getDate()) {
                    // let minsToMarginTop = (tempStartTime.getMinutes() / 60) *this.state.pxPerHourForConversion;
                    let minsToMarginTop = (tempStartTime.getMinutes() / 60) * this.state.pxPerHourForConversion;
                    // let hourDiff = tempEndTime.getHours() - tempStartTime.getHours();
                    // let minDiff = (tempEndTime.getMinutes()) / 60;
                    // let height = (hourDiff + minDiff) * this.state.pxPerHourForConversion;
                    // let color = 'PaleTurquoise';
                    let hourDiff = 24 - tempStartTime.getHours();
                    let minDiff = 0;
                    let color = "lavender";
                    let height =(hourDiff + minDiff) * this.state.pxPerHourForConversion;
                    sameTimeEventCount++;
                    let newElement = (
                        <div key={"event" + i}>
                          <div
                            data-toggle="tooltip"
                            data-placement="right"
                            title={
                              arr[i].title +
                              "\nStart: " +
                              tempStartTime +
                              "\nEnd: " +
                              tempEndTime
                            }
                            onMouseOver={(e) => {
                              e.target.style.color = "#FFFFFF";
                              e.target.style.background = "RebeccaPurple";
                              e.target.style.zIndex = "2";
                            }}
                            onMouseOut={(e) => {
                              e.target.style.zIndex = "1";
                              e.target.style.color = "#000000";
                              e.target.style.background = color;
                            }}
                            key={i}
                            // value = {i}
                            onClick={this.GoalClicked}
                            style={{
                              zIndex: this.state.zIndex,
                              marginTop: minsToMarginTop + "px",
                              padding: "5px",
                              fontSize: fontSize + "px",
                              border: "1px lightgray solid ",
                              float: "left",
                              borderRadius: "5px",
                              background: color,
                              width: itemWidth + "px",
                              position: "absolute",
                              height: height + "px",
                              marginLeft: addmarginLeft + "px",
                            }}
                          >
                            {arr[i].title}
                          </div>
                        </div>
                      );
                      res.push(newElement);
                    } else {
                        let minsToMarginTop =
                        (tempStartTime.getMinutes() / 60) * this.state.pxPerHourForConversion;
                      let hourDiff = tempEndTime.getHours() - tempStartTime.getHours();
                      let minDiff = tempEndTime.getMinutes() / 60;
                      let height = (hourDiff + minDiff) * this.state.pxPerHourForConversion;
                      let color = "PaleTurquoise";
          
                      sameTimeEventCount++;
                      for (let i = 0; i < arr.length; i++) {
                        tempStart = arr[i].start_day_and_time;
                        tempEnd = arr[i].end_day_and_time;
                  
                        let tempStartTime = new Date(tempStart);
                        let tempEndTime = new Date(tempEnd);
                        if (
                          tempStartTime.getHours() < hour &&
                          tempEndTime.getHours() > hour
                        ) {
                          addmarginLeft += 20;
                          itemWidth = itemWidth - 20;
                          // overlapEvent++;
                        }
                      }
          
                      if (sameTimeEventCount > 1) {
                        addmarginLeft += 20;
                        // addmarginLeft += this.state.eventBoxSize/(sameHourItems-1) ;
                        // itemWidth = itemWidth/(sameHourItems-1);
                        itemWidth = itemWidth - 20;
                        // console.log("thi is the item width after subtracting 40 " + itemWidth);
                      }
          
                      //chnage font size if not enough space
                      if (tempEndTime.getHours() - tempStartTime.getHours() < 2) {
                        fontSize = 8;
                      }
                      // change color if more than one event in same time.
                      if (sameTimeEventCount <= 1) {
                        color = hour % 2 === 0 ? "PaleTurquoise" : "skyblue";
                      } else if (sameTimeEventCount === 2) {
                        color = "skyblue";
                      } else {
                        color = "blue";
                      }
                      let newElement = (
                        <div
                          key={"dayRoutineItem" + i}
                          data-toggle="tooltip"
                          data-placement="right"
                          title={
                            arr[i].title +
                            "\nStart: " +
                            tempStartTime +
                            "\nEnd: " +
                            tempEndTime
                          }
                          onMouseOver={(e) => {
                            e.target.style.color = "#FFFFFF";
                            e.target.style.background = "RebeccaPurple";
                            // e.target.style.marginLeft = "5px";
                            // e.target.style.border= "3px solid w";
                            e.target.style.zIndex = "2";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.zIndex = "1";
          
                            // e.target.style.marginLeft = "0px";
                            e.target.style.color = "#000000";
                            //  e.target.style.background = ( hour % 2 ==0 ?  'PaleTurquoise' : 'skyblue');
                            e.target.style.border = "1px lightgray solid";
          
                            e.target.style.background = color;
                          }}
                          onClick={this.GoalClicked}
                          style={{
                            zIndex: this.state.zIndex,
                            marginTop: minsToMarginTop + "px",
                            padding: "5px",
                            border: "1px lightgray solid ",
                            borderRadius: "5px",
                            position: "absolute",
                            height: height + "px",
                            fontSize: fontSize + "px",
                            background: color,
                            width: itemWidth + "px",
                            marginLeft: addmarginLeft + "px",
                          }}
                        >
                          {arr[i].title}
                        </div>
                      );
                      res.push(newElement);
                    }
                  }
                } else if (hour === 0 && tempEndTime.getDate() === curDate && curMonth <= tempEndTime.getMonth() && curMonth>= tempStartTime.getMonth()  && curYear <= tempEndTime.getFullYear() && curYear>= tempStartTime.getFullYear()) {
                  let minsToMarginTop = 0;
                  let hourDiff = tempEndTime.getHours();
                  let minDiff = tempEndTime.getMinutes() / 60;
                  let height = (hourDiff + minDiff) * this.state.pxPerHourForConversion;
                  let color = "lavender";
                  sameTimeEventCount++;
                  let newElement = (
                    <div key={"event" + i}>
                      <div
                        data-toggle="tooltip"
                        data-placement="right"
                        title={
                          arr[i].title +
                          "\nStart: " +
                          tempStartTime +
                          "\nEnd: " +
                          tempEndTime
                        }
                        onMouseOver={(e) => {
                          e.target.style.color = "#FFFFFF";
                          e.target.style.background = "RebeccaPurple";
                          e.target.style.zIndex = "2";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.zIndex = "1";
                          e.target.style.color = "#000000";
                          e.target.style.background = color;
                        }}
                        key={i}
                        // value = {i}
                        onClick={this.GoalClicked}
                        style={{
                          zIndex: this.state.zIndex,
                          marginTop: minsToMarginTop + "px",
                          padding: "5px",
                          fontSize: fontSize + "px",
                          border: "1px lightgray solid ",
                          float: "left",
                          borderRadius: "5px",
                          background: color,
                          width: itemWidth + "px",
                          position: "absolute", 
                          height: height + "px",
                          marginLeft: addmarginLeft + "px",
                        }}
                      >
                        {arr[i].title}
                      </div>
                    </div>
                  );
                  res.push(newElement);
                } else if (
                  hour === 0 &&
                  tempStartTime.getDate() < curDate &&
                  tempEndTime.getDate() > curDate
                  && curMonth <= tempEndTime.getMonth() 
                  && curMonth >= tempStartTime.getMonth()
                  && curYear <= tempEndTime.getFullYear() 
                  && curYear>= tempStartTime.getFullYear()
                ) {
                  let minsToMarginTop = 0;
                  let hourDiff = 24;
                  let height = hourDiff * this.state.pxPerHourForConversion;
                  let color = "lavender";
                  sameTimeEventCount++;
                  let newElement = (
                    <div key={"event" + i}>
                      <div
                        data-toggle="tooltip"
                        data-placement="right"
                        title={
                          arr[i].title +
                          "\nStart: " +
                          tempStartTime +
                          "\nEnd: " +
                          tempEndTime
                        }
                        onMouseOver={(e) => {
                          e.target.style.color = "#FFFFFF";
                          e.target.style.background = "RebeccaPurple";
                          e.target.style.zIndex = "2";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.zIndex = "1";
                          e.target.style.color = "#000000";
                          e.target.style.background = color;
                        }}
                        key={i}
                        // value = {i}
                        onClick={this.GoalClicked}
                        style={{
                          zIndex: this.state.zIndex,
                          marginTop: minsToMarginTop + "px",
                          padding: "5px",
                          fontSize: fontSize + "px",
                          border: "1px lightgray solid ",
                          float: "left",
                          borderRadius: "5px",
                          background: color,
                          width: itemWidth + "px",
                          position: "absolute",
                          height: height + "px",
                          marginLeft: addmarginLeft + "px",
                        }}
                      >
                        {arr[i].title}
                      </div>
                    </div>
                  );
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
                <Row key={"dayGoal" + i} style={{ position: "relative" }}>
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
            <div style={{margin:'20px',
            padding: '20px',
            marginTop: "0px",
            width: "300px",
            borderRadius: "20px" }}>
                Today's Goals:
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
