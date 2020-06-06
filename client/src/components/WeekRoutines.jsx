import React, { Component } from 'react'
import moment from 'moment';
import {
     Container, Row, Col
} from 'react-bootstrap';
 
export default class WeekRoutines extends Component {
  constructor(props) {
      super(props);
      // console.log(this.props.dateContext);
      this.state = {
          pxPerHour: "30px", //preset size for all columns
          pxPerHourForConversion: 30, // if pxPerHour is change, this should change to reflect it
          zIndex: 1, //thought i needed to increment zIndex for div overlaps but seems to be fine being at 1 for all divs
          eventBoxSize: 80, //width size for event box
          marginFromLeft: 0
      }
      this.hourDisplay = React.createRef();
  }

  componentDidMount  () {
    // Set top most time to be current hour
    // Browser scrolls to the bottom if hour >= 18
    let curHour = new Date().getHours();
    this.hourDisplay.current.scrollTop = this.state.pxPerHourForConversion * curHour;
  }

getEventItem = (day, hour) => {
  // var res = []
  // var arr = this.props.routines;
  // var sameTimeEventCount = 0;
  // let itemWidth = this.state.eventBoxSize;
  // // var overlapEvent = 0; 
  // var addmarginLeft = 0;
  // var fontSize = 10;


    let startObject = this.props.dateContext.clone();
    let startDay = startObject.startOf("week");
    let curDate = startDay.clone();
    curDate.add(day,'days');
    var res = []
    var tempStart = null;
    var tempEnd = null;
    var arr = this.props.routines;
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

    //   let tempStartTime = new Date(tempStart);
    //   let tempEndTime = new Date(tempEnd);
      let curDate2 = this.props.dateContext.get("date");
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
              if(tempStartTime.getDate() + j === curDate2  && ((curDate2 - initialStartDate) % arr[i].repeat_every) === 0){
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
           
            if(((curDate2 <=  endsOnDate && curDate2 > initialStartDate) || curMonth < initialEndOnMonth)  && ((curDate - initialStartDate) % arr[i].repeat_every) === 0){  
              tempStartTime.setDate(curDate2);
              tempEndTime.setDate(curDate2);
    
            }
         }
        /** doesnt work hen goign to month with reapting and doesnt work when routine spans multiple days */
         else if(arr[i].repeat_ends === "Never"){
          // console.log(getDaysInMonth(curMonth, curYear));
          
           if(curYear > initialStartYear
            && curDate2 % arr[i].repeat_every === 0){
              tempStartTime.setDate(curDate2);
              tempEndTime.setDate(curDate2 + (initialEndDate - initialStartDate));
              tempStartTime.setMonth(curMonth);
              tempEndTime.setMonth(curMonth);
              tempStartTime.setFullYear(curYear);
              tempEndTime.setFullYear(curYear);
           }else if(curYear === initialStartYear
            // && curMonth >initialStartMonth
            && curMonth - initialStartMonth === 1
            // && curDate2 % arr[i].repeat_every === 0
            && (((new Date(curYear, curMonth, 0).getDate())-initialStartDate)+curDate2) % arr[i].repeat_every  === 0
            // do about of monnth - start day % reapeat every 
            // && curDate2 % arr[i].repeat_every === 0
            ){
              console.log("does it go here fooor");
              tempStartTime.setDate(curDate2);
              tempEndTime.setDate(curDate2 + (initialEndDate - initialStartDate) );
              tempStartTime.setMonth(curMonth);
              tempEndTime.setMonth(curMonth);
           }else if(curYear === initialStartYear
             && curMonth - initialStartMonth > 1
            //  && 
             && (new Date(curYear, curMonth, 0).getDate() % arr[i].repeat_every + curDate2)% arr[i].repeat_every === 0
            //  && (((new Date(initialStartYear, initialStartMonth, 0).getDate())-initialStartDate)+curDate2+new Date(curYear, curMonth, 0) ) % arr[i].repeat_every  === 0
            // && curDate2 % arr[i].repeat_every === 0
            //  && (31+curDate2 ) % arr[i].repeat_every  === 0
            ){
              tempStartTime.setDate(curDate2);
              tempEndTime.setDate(curDate2 + (initialEndDate - initialStartDate) );
              tempStartTime.setMonth(curMonth);
              tempEndTime.setMonth(curMonth);
           }
           else if(curYear === initialStartYear 
            && curMonth === initialStartMonth
            && curDate2 > initialStartDate 
            && ((curDate2 - initialStartDate) % arr[i].repeat_every) === 0 
            ) {  
              // console.log("does it go in here first");
              // if(((curDate2 - initialStartDate) % arr[i].repeat_every) === 0){
              //   console.log("does it go in here when %")
              //   tempStartTime.setDate(curDate2);
              //   tempEndTime.setDate(curDate2 + (initialEndDate - initialStartDate));
              // }
              // } else if(curDate2>=initialStartDate && curDate2 <= initialEndDate){
              //   console.log("does it go in here second")
              //   tempStartTime.setDate(curDate2);
              //   tempEndTime.setDate(curDate2 + (initialEndDate - initialStartDate));
              // }
              // console.log("this is the end date ",curDate2 + (initialEndDate - initialStartDate), "this is the start date",curDate2 )        
              tempStartTime.setDate(curDate2);
              tempEndTime.setDate(curDate2 + (initialEndDate - initialStartDate));
           }
         }
        }
        /** REPEAT MONTH */
        if(arr[i].repeat_frequency === "MONTH" ){
          /*** TODO fix if routine goes past 2 years.  */
          if(arr[i].repeat_ends === "After" ){
            for(let j = 1;j< arr[i].repeat_occurences ;j++){
              if(curDate2 >= initialStartDate      
                && curDate2 <= initialEndDate
                && tempStartTime.getMonth() + (j  * arr[i].repeat_every)=== curMonth 
                && ((curMonth - initialStartMonth) % arr[i].repeat_every) === 0
                && initialStartYear === curYear){
                  tempStartTime.setMonth(curMonth);
                  tempEndTime.setMonth(curMonth);
              } 
            }
            if(curDate2 >= initialStartDate      
              && curDate2 <= initialEndDate
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
            }else if(curDate2 >= initialStartDate      
              && curDate2 <= initialEndDate
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
              && curDate2 >= initialStartDate      
              && curDate2<= initialEndDate 
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
              && curDate2 >= initialStartDate      
              && curDate2<= initialEndDate 
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
              && curDate2 >= initialStartDate      
              && curDate2<= initialEndDate 
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
              && curDate2 >= initialStartDate      
              && curDate2<= initialEndDate 
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
           if(curDate2 >= initialStartDate && curDate2<= initialEndDate 
            && curYear > initialStartYear 
            && ((curMonth - initialStartMonth ) % arr[i].repeat_every) === 0){
            tempStartTime.setMonth(curMonth);
            tempEndTime.setMonth(curMonth);
            tempStartTime.setFullYear(curYear);
            tempEndTime.setFullYear(curYear);
           }
           else if(curDate2 >= initialStartDate && curDate2<= initialEndDate 
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
              if(curDate2 >= initialStartDate      
                && curDate2 <= initialEndDate
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
              && curDate2 >= initialStartDate      
              && curDate2<= initialEndDate
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
            if(curDate2 >= initialStartDate && curDate2<= initialEndDate && curMonth === initialStartMonth && curYear > initialStartYear && ((curYear - initialStartYear) % arr[i].repeat_every) === 0){
            tempStartTime.setFullYear(curYear);
            tempEndTime.setFullYear(curYear);
           }
         }
        }
        /*** TODO then do if span week */
      }
    //   console.log("this is the moment of curDate"+ curDate+ "this is the starte date"+ startDate+ "this is the end date"+endDate );
    // if(arr[i].title === "Routine check day never"){
        console.log("this is curDat2 ",curDate2);
        console.log("this is the curDate ", curDate )
        console.log("is this true for is same or after "+ curDate.isSameOrAfter(startDate,'day'))
        console.log("is this true for is same or before "+ curDate.isSameOrBefore(endDate,'day'))
    // }
      
      if(curDate.isSameOrAfter(startDate,'day') && curDate.isSameOrBefore(endDate,'day')) {
    //   if(moment(curDate2).isSameOrAfter(startDate,'day') && moment(curDate2).isSameOrBefore(endDate,'day')) {
        // if (startDate.date() ===  curDate.date()) {
        if (tempStartTime.getDate() === curDate2 &&  curMonth <= tempEndTime.getMonth() && curMonth>= tempStartTime.getMonth() && curYear <= tempEndTime.getFullYear() && curYear>= tempStartTime.getFullYear()) {
            // if (startDate.hour() === hour) {
            if(tempStartTime.getHours() === hour){
                // if(startDate.date() === endDate.date()) {
                if(tempStartTime.getDate() === tempEndTime.getDate()){
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
                } else if(tempStartTime.getDate() !== tempEndTime.getDate()){
                // else if(startDate.date() !== endDate.date()) {
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
            // if(endDate.date() ===  curDate.date()) {
            if( tempEndTime.getDate() === curDate2 && curMonth <= tempEndTime.getMonth() && curMonth>= tempStartTime.getMonth()  && curYear <= tempEndTime.getFullYear() && curYear>= tempStartTime.getFullYear()){
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
            } else if( tempStartTime.getDate() < curDate2 
                && tempEndTime.getDate() > curDate2
                && curMonth <= tempEndTime.getMonth() 
                && curMonth >= tempStartTime.getMonth()
                && curYear <= tempEndTime.getFullYear() 
                && curYear>= tempStartTime.getFullYear()
            ) {
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
              <Container key={"weekRoutine" + i + j}>
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
          <Col key={"dayRoutine" + i}>
            {arr}
          </Col>
        );
      }
      return res;
  }

 render() {
    let weekdays = moment.weekdays().map((day) => {
      return (
        <Col key={"routine"+day} className="fancytext">{day}</Col>
      )
    });
     return (
         <Container style={{ height: 'auto', width: '1000px'}}>
           <Row>
             <Col>
              Routines
             </Col>
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
