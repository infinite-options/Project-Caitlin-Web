import React, { Component } from "react";
import moment from "moment";
import { Container, Row, Col } from "react-bootstrap";

export default class WeekGoals extends Component {
  constructor(props) {
      super(props);
      this.state = {
          pxPerHour: "30px", //preset size for all columns
          pxPerHourForConversion: 30, // if pxPerHour is change, this should change to reflect it
          zIndex: 1, //thought i needed to increment zIndex for div overlaps but seems to be fine being at 1 for all divs
          eventBoxSize: 80, //width size for event box
      }
      this.hourDisplay = React.createRef();
  }

  componentDidMount() {
    // Set top most time to be current hour
    // Browser scrolls to the bottom if hour >= 18
    let curHour = new Date().getHours();
    this.hourDisplay.current.scrollTop =
      this.state.pxPerHourForConversion * curHour;
  }

  /**
     * getEventItem: given an hour, this will return all events that was started during that hour
     *
    */
   getEventItem = (day, hour) => {

    let startObject = this.props.dateContext.clone();
    let startDay = startObject.startOf("week");
    let curDate2 = startDay.clone();
    curDate2.add(day,'days');
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
      let curMonth = curDate2.get("month");
      let curYear = curDate2.get("year");

      let initialStartDate =tempStartTime.getDate();
      let initialEndDate =tempEndTime.getDate();
      let initialStartMonth =tempStartTime.getMonth();
      let initialStartYear =tempStartTime.getFullYear();
      let initialEndYear =tempEndTime.getFullYear();

      /** This function takes in the date and gives back the week number it is in for that year */
      function ISO8601_week_no(dt) 
      {
            var tdt = new Date(dt.valueOf());
            var dayn = (dt.getDay() + 6) % 7;
            tdt.setDate(tdt.getDate() - dayn + 3);
            var firstThursday = tdt.valueOf();
            tdt.setMonth(0, 1);
            if (tdt.getDay() !== 4) 
              {
              tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
                }
            return 1 + Math.ceil((firstThursday - tdt) / 604800000);
        }

      /**
       * Dealing with repeating Routines
       */
      if(arr[i].repeat === true){
        if(arr[i].repeat_frequency === "DAY" ){
          /*** TODO fix if event goes to another month.  */
          if(arr[i].repeat_ends === "After" ){
            for(let j = 1;j< arr[i].repeat_occurences ;j++){
                if(curYear === initialStartYear
                    && curMonth === initialStartMonth
                    && initialStartDate +  (j  * arr[i].repeat_every) === curDate2.date()
                    && ((curDate2.date() - initialStartDate) % arr[i].repeat_every) === 0
                    ){
                      
                      tempStartTime.setDate(curDate2.date());
                      tempEndTime.setDate(curDate2.date());
                  }else if(curYear === initialStartYear
                    && curMonth > initialStartMonth
                    && (curMonth - initialStartMonth) === 1
                    && arr[i].repeat_every > 1
                    && (curDate2.date() <= ((arr[i].repeat_occurences -1 - Math.floor((new Date(curYear, curMonth, 0).getDate() - initialStartDate)/arr[i].repeat_every)) * arr[i].repeat_every )  )
                    && ((curDate2.date() + ( (Math.floor((new Date(curYear, curMonth, 0).getDate() - initialStartDate))) % arr[i].repeat_every  )) % arr[i].repeat_every === 0)
                    ){
                      tempStartTime.setDate(curDate2.date());
                      tempEndTime.setDate(curDate2.date());
                      tempStartTime.setMonth(curMonth);
                      tempEndTime.setMonth(curMonth);
    
                  }else if(curYear === initialStartYear
                    && curMonth > initialStartMonth
                    && (curMonth - initialStartMonth) > 1
                    && arr[i].repeat_every > 1
                    ){
                      let subtractBy = 0;
                      let indexBy = 9;
                      if(curMonth - initialStartMonth === 2){
                        subtractBy = Math.floor((new Date(curYear, curMonth -1, 0).getDate() - initialStartDate)/ arr[i].repeat_every)+ Math.floor((new Date(curYear, curMonth, 0).getDate())/arr[i].repeat_every) + 1;
                        indexBy = (  (Math.floor((new Date(curYear, curMonth, 0).getDate() - (( (Math.floor((new Date(curYear, curMonth, 0).getDate() - initialStartDate))) % arr[i].repeat_every ) +1  ))  )     ) % arr[i].repeat_every)
                      }
    
                      if((arr[i].repeat_occurences - subtractBy) * arr[i].repeat_every > 0
                        && curDate2.date() <= ( (arr[i].repeat_occurences - subtractBy) * arr[i].repeat_every )
                        && ((curDate2.date() + ( indexBy )) % arr[i].repeat_every === 0)
                        ){
                          tempStartTime.setDate(curDate2.date());
                          tempEndTime.setDate(curDate2.date());
                          tempStartTime.setMonth(curMonth);
                          tempEndTime.setMonth(curMonth);
                      }
                  }else if(curYear === initialStartYear
                    && curMonth > initialStartMonth
                    && (curMonth - initialStartMonth) === 1
                    && arr[i].repeat_every === "1"
                    && ((((arr[i].repeat_occurences  - new Date(curYear, curMonth, 0).getDate())) > 31) 
                        || (curDate2.date() < (arr[i].repeat_occurences  - (new Date(curYear, curMonth, 0).getDate() - initialStartDate))))
    
                    ){
                      tempStartTime.setDate(curDate2.date());
                      tempEndTime.setDate(curDate2.date());
                      tempStartTime.setMonth(curMonth);
                      tempEndTime.setMonth(curMonth);
    
                  }else if(curYear === initialStartYear
                    && curMonth > initialStartMonth
                    && curMonth - initialStartMonth > 1
                    && arr[i].repeat_every === "1"
                    ){
                      let subtractBy = 0;
                      if(curMonth - initialStartMonth === 2){
                        subtractBy = (new Date(curYear, curMonth -1, 0).getDate() - initialStartDate) + (new Date(curYear, curMonth, 0).getDate())
                      }else if(curMonth - initialStartMonth === 3){
                        subtractBy = (new Date(curYear, curMonth -2, 0).getDate() - initialStartDate) + (new Date(curYear, curMonth -1, 0).getDate()) + (new Date(curYear, curMonth, 0).getDate())
                      }else if(curMonth - initialStartMonth === 4){
                        subtractBy = (new Date(curYear, curMonth -3, 0).getDate() - initialStartDate) + (new Date(curYear, curMonth -2, 0).getDate()) + (new Date(curYear, curMonth -1, 0).getDate()) + (new Date(curYear, curMonth, 0).getDate())
                      }else if(curMonth - initialStartMonth === 5){
                        subtractBy = (new Date(curYear, curMonth -4, 0).getDate() - initialStartDate) + (new Date(curYear, curMonth -3, 0).getDate()) + (new Date(curYear, curMonth -2, 0).getDate()) + (new Date(curYear, curMonth -1, 0).getDate()) + (new Date(curYear, curMonth, 0).getDate())
                      }else if(curMonth - initialStartMonth === 6){
                        subtractBy = (new Date(curYear, curMonth -5, 0).getDate() - initialStartDate) + (new Date(curYear, curMonth -4, 0).getDate()) + (new Date(curYear, curMonth -3, 0).getDate()) + (new Date(curYear, curMonth -2, 0).getDate()) + (new Date(curYear, curMonth-1, 0).getDate()) + (new Date(curYear, curMonth, 0).getDate())
                      }else if(curMonth - initialStartMonth === 7){
                        subtractBy = (new Date(curYear, curMonth -6, 0).getDate() - initialStartDate) + (new Date(curYear, curMonth -5, 0).getDate()) + (new Date(curYear, curMonth -4, 0).getDate()) + (new Date(curYear, curMonth -3, 0).getDate()) + (new Date(curYear, curMonth -2, 0).getDate()) + (new Date(curYear, curMonth -1, 0).getDate()) + (new Date(curYear, curMonth , 0).getDate())
                      }else if(curMonth - initialStartMonth === 8){
                        subtractBy = (new Date(curYear, curMonth -7, 0).getDate() - initialStartDate) + (new Date(curYear, curMonth -6, 0).getDate()) + (new Date(curYear, curMonth -5, 0).getDate()) + (new Date(curYear, curMonth -4, 0).getDate()) + (new Date(curYear, curMonth -3, 0).getDate()) + (new Date(curYear, curMonth -2, 0).getDate()) 
                          + (new Date(curYear, curMonth -1, 0).getDate()) + (new Date(curYear, curMonth , 0).getDate())
                      }else if(curMonth - initialStartMonth === 9){
                        subtractBy = (new Date(curYear, curMonth -8, 0).getDate() - initialStartDate) + (new Date(curYear, curMonth -7, 0).getDate()) + (new Date(curYear, curMonth -6, 0).getDate()) + (new Date(curYear, curMonth -5, 0).getDate()) + (new Date(curYear, curMonth -4, 0).getDate()) + (new Date(curYear, curMonth -3, 0).getDate()) 
                          + (new Date(curYear, curMonth -2, 0).getDate()) + (new Date(curYear, curMonth -1, 0).getDate())+ (new Date(curYear, curMonth , 0).getDate())
                      }else if(curMonth - initialStartMonth === 10){
                        subtractBy = (new Date(curYear, curMonth -9, 0).getDate() - initialStartDate) + (new Date(curYear, curMonth -8, 0).getDate()) + (new Date(curYear, curMonth -7, 0).getDate()) + (new Date(curYear, curMonth -6, 0).getDate()) + (new Date(curYear, curMonth -5, 0).getDate()) + (new Date(curYear, curMonth -4, 0).getDate()) 
                          + (new Date(curYear, curMonth -3, 0).getDate()) + (new Date(curYear, curMonth -2, 0).getDate())+ (new Date(curYear, curMonth -1, 0).getDate())+ (new Date(curYear, curMonth , 0).getDate())
                      }else if(curMonth - initialStartMonth === 11){
                        subtractBy = (new Date(curYear, curMonth -10, 0).getDate() - initialStartDate) + (new Date(curYear, curMonth -9, 0).getDate()) + (new Date(curYear, curMonth -8, 0).getDate()) + (new Date(curYear, curMonth -7, 0).getDate()) + (new Date(curYear, curMonth -6, 0).getDate()) + (new Date(curYear, curMonth -5, 0).getDate()) 
                          + (new Date(curYear, curMonth -4, 0).getDate()) + (new Date(curYear, curMonth -3, 0).getDate())+ (new Date(curYear, curMonth -2, 0).getDate())+ (new Date(curYear, curMonth-1 , 0).getDate())+ (new Date(curYear, curMonth , 0).getDate())
                      }
                      if(arr[i].repeat_occurences - subtractBy > 0
                        && curDate2.date() < (arr[i].repeat_occurences - subtractBy)
                        ){
                          tempStartTime.setDate(curDate2.date());
                          tempEndTime.setDate(curDate2.date());
                          tempStartTime.setMonth(curMonth);
                          tempEndTime.setMonth(curMonth);
                      }    
    
                  }else if(curYear > initialStartYear
                    && arr[i].repeat_every === "1"
                    ){
                      tempStartTime.setDate(curDate2.date());
                      tempEndTime.setDate(curDate2.date());
                      tempStartTime.setMonth(curMonth);
                      tempEndTime.setMonth(curMonth);
                      tempStartTime.setFullYear(curYear);
                      tempEndTime.setFullYear(curYear);
                  }
            }
          } 
          /** TODO: account for ends on a different month. Also account for event span multiple days.  */
         else if(arr[i].repeat_ends === "On"){
            let endsOnDate = (new Date(arr[i].repeat_ends_on)).getDate();
            let endsOnMonth = (new Date(arr[i].repeat_ends_on)).getMonth();
            let initialEndOnYear = (new Date(arr[i].repeat_ends_on)).getFullYear();
               
              if((curMonth < endsOnMonth && curYear === initialEndOnYear && curYear === initialStartYear && curMonth === initialStartMonth && curDate2.date() > initialStartDate  && ((curDate2.date() -initialStartDate )% arr[i].repeat_every === 0))
                || (curDate2.date() <=  endsOnDate && curYear === initialEndOnYear && curYear === initialStartYear && curDate2.date() > initialStartDate && curMonth === endsOnMonth && curMonth === initialStartMonth   && ((curDate2.date() -initialStartDate )% arr[i].repeat_every === 0))
                || (curYear !== initialEndOnYear && curYear === initialStartYear && curMonth === initialStartMonth && curDate2.date()> initialStartDate && ((curDate2.date() -initialStartDate )% arr[i].repeat_every === 0))
                ){ 
                  tempStartTime.setDate(curDate2.date());
                  tempEndTime.setDate(curDate2.date());
              }else if((curYear > initialStartYear && curYear < initialEndOnYear && ((((new Date(curYear, curMonth, 0).getDate())-initialStartDate)+curDate2.date()) % arr[i].repeat_every  === 0))
                || (curYear > initialStartYear && curYear === initialEndOnYear && curMonth< endsOnMonth && ((((new Date(curYear, curMonth, 0).getDate())-initialStartDate)+curDate2.date()) % arr[i].repeat_every  === 0))
                || (curYear > initialStartYear && curYear === initialEndOnYear && curMonth === endsOnMonth && curDate2.date() <= endsOnDate && ((((new Date(curYear, curMonth, 0).getDate())-initialStartDate)+curDate2.date()) % arr[i].repeat_every  === 0))
                ){
                  
                  tempStartTime.setDate(curDate2.date());
                  tempEndTime.setDate(curDate2.date());
                  tempStartTime.setMonth(curMonth);
                  tempEndTime.setMonth(curMonth);
                  tempStartTime.setFullYear(curYear);
                  tempEndTime.setFullYear(curYear);
              }else if((curMonth < endsOnMonth && curYear === initialEndOnYear && curYear === initialStartYear && curMonth - initialStartMonth === 1 && ((((new Date(curYear, curMonth, 0).getDate())-initialStartDate)+curDate2.date()) % arr[i].repeat_every  === 0))
                || (curMonth < endsOnMonth&& curYear === initialEndOnYear && curYear === initialStartYear && curMonth - initialStartMonth > 1 && ((((new Date(curYear, curMonth, 0).getDate())-initialStartDate)+curDate2.date()) % arr[i].repeat_every  === 0))
                || (curDate2.date() <=  endsOnDate && curMonth === endsOnMonth && curMonth > initialStartMonth && curYear === initialEndOnYear && curYear === initialStartYear && ((((new Date(curYear, curMonth, 0).getDate())-initialStartDate)+curDate2.date()) % arr[i].repeat_every  === 0))
                || (curYear !== initialEndOnYear && curYear === initialStartYear && curMonth > initialStartMonth && ((((new Date(curYear, curMonth, 0).getDate())-initialStartDate)+curDate2.date()) % arr[i].repeat_every  === 0))
              ){
                
                tempStartTime.setDate(curDate2.date());
                tempEndTime.setDate(curDate2.date());
                tempStartTime.setMonth(curMonth);
                tempEndTime.setMonth(curMonth);
                }
         }
         else if(arr[i].repeat_ends === "Never"){
          
            if(curYear > initialStartYear
                && curDate2.date() % arr[i].repeat_every === 0){
                  tempStartTime.setDate(curDate2.date());
                  tempEndTime.setDate(curDate2.date() + (initialEndDate - initialStartDate));
                  tempStartTime.setMonth(curMonth);
                  tempEndTime.setMonth(curMonth);
                  tempStartTime.setFullYear(curYear);
                  tempEndTime.setFullYear(curYear);
               }else if(curYear === initialStartYear
                && curMonth - initialStartMonth === 1
                && (((new Date(curYear, curMonth, 0).getDate())-initialStartDate)+curDate2.date()) % arr[i].repeat_every  === 0
                ){
                  tempStartTime.setDate(curDate2.date());
                  tempEndTime.setDate(curDate2.date() + (initialEndDate - initialStartDate) );
                  tempStartTime.setMonth(curMonth);
                  tempEndTime.setMonth(curMonth);
               }else if(curYear === initialStartYear
                 && curMonth - initialStartMonth > 1
                 && (new Date(curYear, curMonth, 0).getDate() % arr[i].repeat_every + curDate2.date())% arr[i].repeat_every === 0
                ){
                  tempStartTime.setDate(curDate2.date());
                  tempEndTime.setDate(curDate2.date() + (initialEndDate - initialStartDate) );
                  tempStartTime.setMonth(curMonth);
                  tempEndTime.setMonth(curMonth);
               }
               else if(curYear === initialStartYear 
                && curMonth === initialStartMonth
                && curDate2.date() > initialStartDate 
                && ((curDate2.date() - initialStartDate) % arr[i].repeat_every) === 0 
                ) {         
                  tempStartTime.setDate(curDate2.date());
                  tempEndTime.setDate(curDate2.date() + (initialEndDate - initialStartDate));
               }
           }
        }

        if(arr[i].repeat_frequency === "WEEK" ){
            if(arr[i].repeat_ends === "After" ){
              let daysPerWeek = 0;
              let weekAfter = 0;
              let daysAfter  = 0;
              let dayArray = [];
              let numDaysAfter;
              
              Object.keys(arr[i].repeat_week_days).forEach(key => {
                dayArray.push(arr[i].repeat_week_days[key]);
                if(arr[i].repeat_week_days[key] !== ""){ 
                  
                  daysPerWeek ++;
                }
              })
              if(daysPerWeek != 0){
              weekAfter = Math.floor(arr[i].repeat_occurences / daysPerWeek);
              daysAfter = arr[i].repeat_occurences % daysPerWeek;
              }
              let startWeek = new Date(initialStartYear, initialStartMonth, initialStartDate);
              let weekStart = ISO8601_week_no(startWeek);
              let weekNow = new Date(curYear, curMonth,curDate2.date());
              let curWeek = ISO8601_week_no(weekNow);
              if(((curWeek - weekStart) < weekAfter) && (curWeek - weekStart) >= 0 && curYear === initialStartYear){
                 
                  if(curWeek === weekStart && curDate2.date() < initialStartDate ){
                    console.log("shouldn't show event")
                  }
                  else{
                    if((dayArray[0] === 'Sunday' && new Date(curDate2).getDay()=== 0) 
                    || (dayArray[1] === 'Monday' && new Date(curDate2).getDay()=== 1)
                    || (dayArray[2] === 'Tuesday' && new Date(curDate2).getDay()=== 2)
                    || (dayArray[3] === 'Wednesday' && new Date(curDate2).getDay()=== 3)
                    || (dayArray[4] === 'Thursday' && new Date(curDate2).getDay()=== 4)
                    || (dayArray[5] === 'Friday' && new Date(curDate2).getDay()=== 5)
                    || (dayArray[6] === 'Saturday' && new Date(curDate2).getDay()=== 6)
                    ){
                      tempStartTime.setDate(curDate2.date());
                      tempEndTime.setDate(curDate2.date() );
                      tempStartTime.setMonth(curMonth);
                      tempEndTime.setMonth(curMonth);
                    }
                  }   
               
              }
              if((curWeek - weekStart === weekAfter ) && daysAfter >= daysPerWeek){  
                if((dayArray[0] === 'Sunday' && new Date(curDate2).getDay()=== 0) 
                || (dayArray[1] === 'Monday' && new Date(curDate2).getDay()=== 1)
                || (dayArray[2] === 'Tuesday' && new Date(curDate2).getDay()=== 2)
                || (dayArray[3] === 'Wednesday' && new Date(curDate2).getDay()=== 3)
                || (dayArray[4] === 'Thursday' && new Date(curDate2).getDay()=== 4)
                || (dayArray[5] === 'Friday' && new Date(curDate2).getDay()=== 5)
                || (dayArray[6] === 'Saturday' && new Date(curDate2).getDay()=== 6)
                ){
                  tempStartTime.setDate(curDate2.date());
                  tempEndTime.setDate(curDate2.date() );
                  tempStartTime.setMonth(curMonth);
                  tempEndTime.setMonth(curMonth);
                }
                             
              } else if((curWeek - weekStart === weekAfter ) && daysAfter > 0 && daysAfter< daysPerWeek ){
                let numDaysAfter = 0;
                  if( ((curWeek - 7)* 7) +  Math.floor(7/ daysPerWeek) * daysAfter  === curDate2.date()){
                    
                      if((dayArray[0] === 'Sunday' && new Date(curDate2).getDay()=== 0) 
                      || (dayArray[1] === 'Monday' && new Date(curDate2).getDay()=== 1)
                      || (dayArray[2] === 'Tuesday' && new Date(curDate2).getDay()=== 2)
                      || (dayArray[3] === 'Wednesday' && new Date(curDate2).getDay()=== 3)
                      || (dayArray[4] === 'Thursday' && new Date(curDate2).getDay()=== 4)
                      || (dayArray[5] === 'Friday' && new Date(curDate2).getDay()=== 5)
                      || (dayArray[6] === 'Saturday' && new Date(curDate2).getDay()=== 6)
                      ){
                        tempStartTime.setDate(curDate2.date());
                        tempEndTime.setDate(curDate2.date() );
                        tempStartTime.setMonth(curMonth);
                        tempEndTime.setMonth(curMonth);
                        numDaysAfter++;
                      }  
                  }
              }else if((curWeek - weekStart === weekAfter + 1 ) &&  daysAfter > daysPerWeek) {
  
              }
          
            }
            else if(arr[i].repeat_ends === "On" ){
              let endsOnDate = (new Date(arr[i].repeat_ends_on)).getDate();
              let endsOnMonth = (new Date(arr[i].repeat_ends_on)).getMonth();
              let initialEndOnYear = (new Date(arr[i].repeat_ends_on)).getFullYear();
              let initialDayCorrect = false;
              let startWeek = new Date(initialStartYear, initialStartMonth, initialStartDate);
              let weekStart = ISO8601_week_no(startWeek);
              let weekNow = new Date(curYear, curMonth,curDate2.date());
              let curWeek = ISO8601_week_no(weekNow);
  
              if((curYear < initialEndOnYear && curYear > initialStartYear && ((curWeek - (53 - weekStart))% arr[i].repeat_every === 0)) // needs work
                || (curYear === initialEndOnYear &&  curYear !== initialStartYear && curMonth < endsOnMonth && ((curWeek - (53 - weekStart))% arr[i].repeat_every === 0)) // needs work
                || (curYear < initialEndOnYear && curYear === initialStartYear && curMonth > initialStartMonth && arr[i].repeat_every === "1")
                || (curYear < initialEndOnYear && curYear === initialStartYear && curMonth > initialStartMonth && arr[i].repeat_every > 1 && ((curWeek - weekStart) % arr[i].repeat_every) === 0)
                || (curYear < initialEndOnYear && curYear === initialStartYear && curMonth === initialStartMonth && curDate2.date() >= initialStartDate && arr[i].repeat_every === "1")
                || (curYear < initialEndOnYear && curYear === initialStartYear && curMonth === initialStartMonth && curDate2.date() >= initialStartDate && arr[i].repeat_every > 1 && ((curWeek - weekStart) % arr[i].repeat_every) === 0)
                || (curYear === initialEndOnYear &&  curYear === initialStartYear && curMonth < endsOnMonth && curMonth > initialStartMonth && arr[i].repeat_every === "1")
                || (curYear === initialEndOnYear &&  curYear === initialStartYear && curMonth < endsOnMonth && curMonth > initialStartMonth && arr[i].repeat_every > 1 && ((curWeek - weekStart) % arr[i].repeat_every) === 0)
                || (curYear === initialEndOnYear &&  curYear === initialStartYear && curMonth === endsOnMonth && curMonth === initialStartMonth && curDate2.date() >= initialStartDate && curDate2.date() <= endsOnDate && arr[i].repeat_every === "1") 
                || (curYear === initialEndOnYear &&  curYear === initialStartYear && curMonth === endsOnMonth && curMonth === initialStartMonth && curDate2.date() >= initialStartDate && curDate2.date() <= endsOnDate && arr[i].repeat_every > 1 && ((curWeek - weekStart) % arr[i].repeat_every) === 0)
                || (curYear === initialEndOnYear &&  curYear === initialStartYear && curMonth === endsOnMonth && curMonth !== initialStartMonth && curDate2.date() <= endsOnDate && arr[i].repeat_every === "1")
                || (curYear === initialEndOnYear &&  curYear === initialStartYear && curMonth === endsOnMonth && curMonth !== initialStartMonth && curDate2.date() <= endsOnDate && arr[i].repeat_every > 1 && ((curWeek - weekStart) % arr[i].repeat_every) === 0)
                || (curYear === initialEndOnYear &&  curYear === initialStartYear && curMonth === initialStartMonth && curMonth !== endsOnMonth && curDate2.date() >= initialStartDate && arr[i].repeat_every === "1")
                || (curYear === initialEndOnYear &&  curYear === initialStartYear && curMonth === initialStartMonth && curMonth !== endsOnMonth && curDate2.date() >= initialStartDate && arr[i].repeat_every > 1 && ((curWeek - weekStart) % arr[i].repeat_every) === 0)
                ){
                      Object.keys(arr[i].repeat_week_days).forEach(key => {
                        if(curDate2.date() === initialStartDate && curMonth === initialStartMonth && curYear === initialStartYear){
                          if((arr[i].repeat_week_days[key] === 'Sunday' && new Date(curDate2).getDay() === 0) 
                            || arr[i].repeat_week_days[key] === 'Monday' && new Date(curDate2).getDay() === 1
                            || arr[i].repeat_week_days[key] === 'Tuesday' && new Date(curDate2).getDay() === 2
                            || arr[i].repeat_week_days[key] === 'Wednesday' && new Date(curDate2).getDay() === 3
                            || arr[i].repeat_week_days[key] === 'Thursday' && new Date(curDate2).getDay() === 4
                            || arr[i].repeat_week_days[key] === 'Friday' && new Date(curDate2).getDay() === 5
                            || arr[i].repeat_week_days[key] === 'Saturday' && new Date(curDate2).getDay() == 6
                            ){
                              initialDayCorrect = true;
                            }
                        }
                        
                        if((arr[i].repeat_week_days[key] === 'Sunday' && new Date(curDate2).getDay()=== 0)
                        || (arr[i].repeat_week_days[key] === 'Monday' && new Date(curDate2).getDay()=== 1)
                        || (arr[i].repeat_week_days[key] === 'Tuesday' && new Date(curDate2).getDay()=== 2)
                        || (arr[i].repeat_week_days[key] === 'Wednesday' && new Date(curDate2).getDay()=== 3)
                        || (arr[i].repeat_week_days[key] === 'Thursday' && new Date(curDate2).getDay()=== 4)
                        || (arr[i].repeat_week_days[key] === 'Friday' && new Date(curDate2).getDay()=== 5)
                        || (arr[i].repeat_week_days[key] === 'Saturday' && new Date(curDate2).getDay()=== 6)
                        ){
                            
                          tempStartTime.setDate(curDate2.date());
                          tempEndTime.setDate(curDate2.date() );
                          tempStartTime.setMonth(curMonth);
                          tempEndTime.setMonth(curMonth);
                          tempStartTime.setFullYear(curYear);
                          tempEndTime.setFullYear(curYear);
                        } 
                        
                    })
  
                    if(!initialDayCorrect && curDate2.date() === initialStartDate && curMonth === initialStartMonth && curYear === initialStartYear){
                        tempStartTime.setDate(curDate2.date() + 1);
                        tempEndTime.setDate(curDate2.date() + 1);
                    }
                  }
              
            }
            else if(arr[i].repeat_ends === "Never"){
              //week starts with each monday 
              let initialDayCorrect = false;
              let startWeek = new Date(initialStartYear, initialStartMonth, initialStartDate);
              let weekStart = ISO8601_week_no(startWeek);
              let weekNow = new Date(curYear, curMonth,curDate2.date());
              let curWeek = ISO8601_week_no(weekNow);
              
              if( (curYear > initialStartYear  && arr[i].repeat_every === "1") 
                || (((curYear - initialStartYear) === 1) && arr[i].repeat_every > 1 && ((curWeek - (53 - weekStart))% arr[i].repeat_every === 0))
                || (((curYear - initialStartYear) > 1) && arr[i].repeat_every > 1 && ((curWeek - (53 - weekStart))% arr[i].repeat_every === 0)) //might need fixing
                || (curYear === initialStartYear && curMonth > initialStartMonth && ((curWeek - weekStart) % arr[i].repeat_every) === 0)
                || (curYear === initialStartYear && curMonth === initialStartMonth && curDate2.date() >= initialStartDate && ((curWeek - weekStart) % arr[i].repeat_every) === 0)
                ){
  
              Object.keys(arr[i].repeat_week_days).forEach(key => {
  
                if(curDate2.date() === initialStartDate && curMonth === initialStartMonth && curYear === initialStartYear){
                  if((arr[i].repeat_week_days[key] === 'Sunday' && new Date(curDate2).getDay() === 0) 
                    || arr[i].repeat_week_days[key] === 'Monday' && new Date(curDate2).getDay() === 1
                    || arr[i].repeat_week_days[key] === 'Tuesday' && new Date(curDate2).getDay() === 2
                    || arr[i].repeat_week_days[key] === 'Wednesday' && new Date(curDate2).getDay() === 3
                    || arr[i].repeat_week_days[key] === 'Thursday' && new Date(curDate2).getDay() === 4
                    || arr[i].repeat_week_days[key] === 'Friday' && new Date(curDate2).getDay() === 5
                    || arr[i].repeat_week_days[key] === 'Saturday' && new Date(curDate2).getDay() == 6
                    ){
                      initialDayCorrect = true;
                    }
                }
                
                if((arr[i].repeat_week_days[key] === 'Sunday' && new Date(curDate2).getDay()=== 0)
                || (arr[i].repeat_week_days[key] === 'Monday' && new Date(curDate2).getDay()=== 1)
                || (arr[i].repeat_week_days[key] === 'Tuesday' && new Date(curDate2).getDay()=== 2)
                || (arr[i].repeat_week_days[key] === 'Wednesday' && new Date(curDate2 ).getDay()=== 3)
                || (arr[i].repeat_week_days[key] === 'Thursday' && new Date(curDate2).getDay()=== 4)
                || (arr[i].repeat_week_days[key] === 'Friday' && new Date(curDate2).getDay()=== 5)
                || (arr[i].repeat_week_days[key] === 'Saturday' && new Date(curDate2).getDay()=== 6)
                ){
                  tempStartTime.setDate(curDate2.date());
                  tempEndTime.setDate(curDate2.date() );
                  tempStartTime.setMonth(curMonth);
                  tempEndTime.setMonth(curMonth);
                  tempStartTime.setFullYear(curYear);
                  tempEndTime.setFullYear(curYear);
                }         
             })
             if(!initialDayCorrect && curDate2.date() === initialStartDate && curMonth === initialStartMonth && curYear === initialStartYear){
                tempStartTime.setDate(curDate2.date() + 1);
                tempEndTime.setDate(curDate2.date() + 1);
             }
            }
           }
  
        }
        /** REPEAT MONTH */
        if(arr[i].repeat_frequency === "MONTH" ){
          if(arr[i].repeat_ends === "After" ){
            for(let j = 1;j< arr[i].repeat_occurences ;j++){
              if(curDate2.date() >= initialStartDate      
                && curDate2.date() <= initialEndDate
                && tempStartTime.getMonth() + (j  * arr[i].repeat_every)=== curMonth 
                && ((curMonth - initialStartMonth) % arr[i].repeat_every) === 0
                && initialStartYear === curYear){
                  tempStartTime.setMonth(curMonth);
                  tempEndTime.setMonth(curMonth);
              } 
            }
            if(curDate2.date() >= initialStartDate      
              && curDate2.date() <= initialEndDate
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
            }else if(curDate2.date() >= initialStartDate      
              && curDate2.date() <= initialEndDate
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
              && curDate2.date() >= initialStartDate      
              && curDate2.date()<= initialEndDate 
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
              && curDate2.date() >= initialStartDate      
              && curDate2.date()<= initialEndDate 
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
              && curDate2.date() >= initialStartDate      
              && curDate2.date()<= initialEndDate 
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
              && curDate2.date() >= initialStartDate      
              && curDate2.date()<= initialEndDate 
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
           if(curDate2.date() >= initialStartDate && curDate2.date()<= initialEndDate 
            && curYear > initialStartYear 
            && ((curMonth - initialStartMonth ) % arr[i].repeat_every) === 0){
            tempStartTime.setMonth(curMonth);
            tempEndTime.setMonth(curMonth);
            tempStartTime.setFullYear(curYear);
            tempEndTime.setFullYear(curYear);
           }
           else if(curDate2.date() >= initialStartDate && curDate2.date()<= initialEndDate 
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
              if(curDate2.date() >= initialStartDate      
                && curDate2.date() <= initialEndDate
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
              && curDate2.date() >= initialStartDate      
              && curDate2.date()<= initialEndDate
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
            if(curDate2.date() >= initialStartDate 
            && curDate2.date()<= initialEndDate 
            && curMonth === initialStartMonth 
            && curYear > initialStartYear 
            && ((curYear - initialStartYear) % arr[i].repeat_every) === 0){
                tempStartTime.setFullYear(curYear);
                tempEndTime.setFullYear(curYear);
           }
         }
        }
      }
      let startDate = moment(tempStartTime);
      let endDate = moment(tempEndTime)

      if(moment(curDate2).isSameOrAfter(startDate,'day') && moment(curDate2).isSameOrBefore(endDate,'day')) {
        if (startDate.date() === curDate2.date() &&  curMonth <= endDate.month() && curMonth>= startDate.month() && curYear <= endDate.year() && curYear>= startDate.year()) {
            if (startDate.hour() === hour) {
                if(startDate.date() === endDate.date()) {
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
                            addmarginLeft += 20;
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
                                            marginLeft: addmarginLeft + "px"
                                        }}>
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
                                            marginLeft: addmarginLeft + "px"
                                        }}>
                                        {arr[i].title}
                                    </div>
                                </div>
                            );
                        res.push(newElement);
                }
            }
        } else if (hour === 0) {
            if(endDate.date() ===  curDate2.date() && curMonth <= endDate.month() && curMonth >= startDate.month() && curYear <= endDate.year() &&  curYear >= startDate.year()) {
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
                                        marginLeft: addmarginLeft + "px"
                                    }}>
                                    {arr[i].title}
                                </div>
                            </div>
                        );
                        res.push(newElement);
            } 
            else if( startDate.date() < curDate2.date() 
                && endDate.date() > curDate2.date()
                && curMonth <= endDate.month() 
                && curMonth >= startDate.month()
                && curYear <= endDate.year() 
                && curYear>= startDate.year()
            )
            
            {
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
                                        marginLeft: addmarginLeft + "px"
                                    }}>
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


  timeDisplay = () => {
    //this essentially creates the time row
    let arr = [];
    for (let i = 0; i < 24; ++i) {
      arr.push(
        <Row key={"dayEvent" + i}>
          <Col
            style={{
              borderTop: "1px solid lavender",
              textAlign: "right",
              height: this.state.pxPerHour,
            }}
          >
            {i}:00
          </Col>
        </Row>
      );
    }
    return arr;
  };

  weekViewItems = () => {
    // this creates the events adjusting their div size to reflecting the time it's slotted for
    var res = [];
    for (let i = 0; i < 7; ++i) {
      var arr = [];
      for (let j = 0; j < 24; ++j) {
        arr.push(
          <Container key={"weekGoal" + i + j}>
            <Row style={{ position: "relative" }}>
              <Col
                style={{
                  position: "relative",
                  borderTop: "1px solid lavender",
                  background: "aliceblue",
                  height: this.state.pxPerHour,
                }}
              >
                {this.getEventItem(i, j)}
              </Col>
            </Row>
          </Container>
        );
      }
      res.push(<Col key={"dayGoal" + i}>{arr}</Col>);
    }
    return res;
  };

  render() {
    let weekdays = moment.weekdays().map((day) => {
      return (
        <Col key={"goal" + day} className="fancytext">
          {day}
        </Col>
      );
    });
    return (
      <Container style={{ height: "auto", width: "1000px" }}>
        <Row>
          <Col>Goals</Col>
        </Row>
        <Row>
          <Col className="fancytext">Time</Col>
          {weekdays}
        </Row>
        <Row
          ref={this.hourDisplay}
          style={{
            width: "auto",
            height: "180px",
            overflowX: "visible",
            overflowY: "scroll",
          }}
        >
          <Col>
            <Container style={{ margin: "0", padding: "0", width: "80px" }}>
              {this.timeDisplay()}
            </Container>
          </Col>
          {this.weekViewItems()}
        </Row>
      </Container>
    );
  }
}
