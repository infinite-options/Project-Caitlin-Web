import React, { Component } from "react";
import moment from "moment";
import { Container, Row, Col } from "react-bootstrap";

export default class WeekRoutines extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pxPerHour: "30px", //preset size for all columns
      pxPerHourForConversion: 30, // if pxPerHour is change, this should change to reflect it
      zIndex: 1, //thought i needed to increment zIndex for div overlaps but seems to be fine being at 1 for all divs
      eventBoxSize: 80, //width size for event box
      marginFromLeft: 0,
    };
    this.hourDisplay = React.createRef();
  }

  componentDidMount() {
    // Set top most time to be current hour
    // Browser scrolls to the bottom if hour >= 18
    let curHour = new Date().getHours();
    this.hourDisplay.current.scrollTop =
      this.state.pxPerHourForConversion * curHour;
  }

  getEventItem = (day, hour) => {
    let startObject = this.props.dateContext.clone();
    let startDay = startObject.startOf("week");
    let curDate2 = startDay.clone();
    curDate2.add(day, "days");
    var res = [];
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

      let curMonth = curDate2.get("month");
      let curYear = curDate2.get("year");

      // let initialStartDate = tempStartTime.getDate();
      // let initialEndDate = tempEndTime.getDate();
      // let initialStartMonth = tempStartTime.getMonth();
      // let initialStartYear = tempStartTime.getFullYear();
      // let initialEndYear = tempEndTime.getFullYear();

      /** This function takes in the date and gives back the week number it is in for that year */
      // function ISO8601_week_no(dt) {
      //   var tdt = new Date(dt.valueOf());
      //   var dayn = (dt.getDay() + 6) % 7;
      //   tdt.setDate(tdt.getDate() - dayn + 3);
      //   var firstThursday = tdt.valueOf();
      //   tdt.setMonth(0, 1);
      //   if (tdt.getDay() !== 4) {
      //     tdt.setMonth(0, 1 + ((4 - tdt.getDay() + 7) % 7));
      //   }
      //   return 1 + Math.ceil((firstThursday - tdt) / 604800000);
      // }

      /**
       * Dealing with repeating Routines
       */

      let CurrentDate = new Date(
        new Date(curYear, curMonth, curDate2.date()).toLocaleString("en-US", {
          timeZone: this.props.TimeZone,
        })
      );
      CurrentDate.setHours(0, 0, 0, 0);

      let startDate2 = new Date(
        new Date(arr[i].start_day_and_time).toLocaleString("en-US", {
          timeZone: this.props.TimeZone,
        })
      );
      startDate2.setHours(0, 0, 0, 0);

      let isDisplayedTodayCalculated = false;

      let repeatOccurences = parseInt(arr[i].repeat_occurences);

      let repeatEvery = parseInt(arr[i].repeat_every);

      let repeatEnds = arr[i].repeat_ends;

      let repeatEndsOn = new Date(
        new Date(arr[i].repeat_ends_on).toLocaleString("en-US", {
          timeZone: this.props.TimeZone,
        })
      );
      repeatEndsOn.setHours(0, 0, 0, 0);

      let repeatFrequency = arr[i].repeat_frequency;

      let repeatWeekDays = [];
      if (arr[i].repeat_week_days != null) {
        Object.keys(arr[i].repeat_week_days).forEach((k) => {
          if (arr[i].repeat_week_days[k] != "") {
            repeatWeekDays.push(parseInt(k));
          }
        });
      }

      if (!arr[i].repeat) {
        isDisplayedTodayCalculated =
          CurrentDate.getTime() - startDate2.getTime() == 0;
      } else {
        if (CurrentDate >= startDate2) {
          if (repeatEnds == "On") {
          } else if (repeatEnds == "After") {
            if (repeatFrequency == "DAY") {
              repeatEndsOn = new Date(startDate2);
              repeatEndsOn.setDate(
                startDate2.getDate() + (repeatOccurences - 1) * repeatEvery
              );
            } else if (repeatFrequency == "WEEK") {
              /*
              repeatEndsOn = new Date(startDate2);
              repeatEndsOn.setDate(
                startDate2.getDate() +
                  Math.ceil((repeatOccurences - 1) / repeatWeekDays.length) *
                    7 *
                    repeatEvery
              );
              console.log("ends on: ", repeatEndsOn);
              */
              /*
              repeatEndsOn = new Date(startDate2);
              let dates = [];
              console.log("repeatWeekDays", repeatWeekDays);
              let dow = repeatWeekDays[repeatWeekDays.length - 1];
              let numberOfWeek = 1;
              let date = moment(startDate2);
              for (let i = 0; i < repeatOccurences; i++) {
                dow = repeatWeekDays[i];
                if (i >= repeatWeekDays.length) {
                  numberOfWeek = i / repeatWeekDays.length + 1;
                  dow = repeatWeekDays[i % repeatWeekDays.length];
                }

                let newDate = getNextDayOfTheWeek(dow, date, numberOfWeek);
                dates.push(newDate.format("LLL"));
                //date = newDate;
              }
              console.log("dow", dow);
              console.log("dates ", dates);

              let nextDayOftheWeek = new Date(
                repeatEndsOn.setDate(
                  repeatEndsOn.getDate() +
                    ((dow + (7 - repeatEndsOn.getDay())) % 7)
                )
              );
              //console.log("nextDayOftheWeek: ", nextDayOftheWeek);
              //let repeatEndsOn_moment = moment(startDate2).format("LLL");
              //console.log("repeatEndsOn_moment: ", repeatEndsOn_moment);
              console.log("weekOfDays: ", repeatWeekDays);

              repeatEndsOn.setDate(
                nextDayOftheWeek.getDate() +
                  Math.ceil((repeatOccurences - 1) / repeatWeekDays.length) *
                    7 *
                    repeatEvery
                //startDate2.getDate() + repeatOccurences * 7 * repeatEvery
              );
              console.log("ends on: ", repeatEndsOn);*/
              let occurence_dates = [];

              const start_day_and_time = arr[i].start_day_and_time.split(
                " "
              )[0];
              // const initDate = start_day_and_time[1];
              //const initMonth = getMonthNumber(start_day_and_time[2]);
              //const initYear = start_day_and_time[3];

              let initFullDate = start_day_and_time;

              let numberOfWeek = 0;

              let index = repeatWeekDays.indexOf(0);

              if (index !== -1) {
                repeatWeekDays.splice(index, 1);
                repeatWeekDays.push(7);
              }

              const d = moment(initFullDate, "MM/DD/YYYY");
              const today_day = d.isoWeekday();
              const result = repeatWeekDays.filter((day) => day < today_day);
              if (result.length > 0) {
                var new_week = repeatWeekDays.slice(result.length);

                result.forEach((day) => {
                  new_week.push(day);
                });

                repeatWeekDays = new_week;
              }

              for (let i = 0; i < repeatOccurences; i++) {
                let dow = repeatWeekDays[i];
                if (i >= repeatWeekDays.length) {
                  numberOfWeek = Math.floor(i / repeatWeekDays.length);
                  dow = repeatWeekDays[i % repeatWeekDays.length];
                }
                const new_date = moment(initFullDate, "MM/DD/YYYY");
                const nextDayOfTheWeek = getNextDayOfTheWeek(dow, new_date);
                //console.log("NextDayOfWeek: ", nextDayOfTheWeek.format("L"));
                //console.log("numberOfWeeks: ", numberOfWeek);
                const date = nextDayOfTheWeek
                  .clone()
                  .add(numberOfWeek * repeatEvery, "weeks")
                  .format("L");
                occurence_dates.push(date);
              }

              //console.log("occurence_dates: ", occurence_dates);

              let today_date_object = new Date(
                curYear,
                curMonth,
                curDate2.date()
              );
              let today = getFormattedDate(today_date_object);

              if (occurence_dates.includes(today)) {
                isDisplayedTodayCalculated = true;
              }
            } else if (repeatFrequency == "MONTH") {
              repeatEndsOn = new Date(startDate2);
              repeatEndsOn.setMonth(
                startDate2.getMonth() + (repeatOccurences - 1) * repeatEvery
              );
            } else if (repeatFrequency == "YEAR") {
              repeatEndsOn = new Date(startDate2);
              repeatEndsOn.setFullYear(
                startDate2.getFullYear() + (repeatOccurences - 1) * repeatEvery
              );
            }
          } else if (repeatEnds == "Never") {
            repeatEndsOn = CurrentDate;
          }

          if (CurrentDate <= repeatEndsOn) {
            if (repeatFrequency == "DAY") {
              isDisplayedTodayCalculated =
                Math.floor(
                  (CurrentDate.getTime() - startDate2.getTime()) /
                    (24 * 3600 * 1000)
                ) %
                  repeatEvery ==
                0;
            } else if (repeatFrequency == "WEEK") {
              isDisplayedTodayCalculated =
                repeatWeekDays.includes(CurrentDate.getDay()) &&
                Math.floor(
                  (CurrentDate.getTime() - startDate2.getTime()) /
                    (7 * 24 * 3600 * 1000)
                ) %
                  repeatEvery ==
                  0;
            } else if (repeatFrequency == "MONTH") {
              isDisplayedTodayCalculated =
                CurrentDate.getDate() == startDate2.getDate() &&
                ((CurrentDate.getFullYear() - startDate2.getFullYear()) * 12 +
                  CurrentDate.getMonth() -
                  startDate2.getMonth()) %
                  repeatEvery ==
                  0;
            } else if (repeatFrequency == "YEAR") {
              isDisplayedTodayCalculated =
                startDate2.getDate() == CurrentDate.getDate() &&
                CurrentDate.getMonth() == startDate2.getMonth() &&
                (CurrentDate.getFullYear() - startDate2.getFullYear()) %
                  repeatEvery ==
                  0;
            }
          }
        }
      }

      //console.log("isDisplayedTodayCalculated", isDisplayedTodayCalculated);
      if (isDisplayedTodayCalculated) {
        //console.log("today is the day");
        tempStartTime.setMonth(curMonth);
        tempEndTime.setMonth(curMonth);
        tempStartTime.setDate(curDate2.date());
        tempEndTime.setDate(curDate2.date());
        tempStartTime.setFullYear(curYear);
        tempEndTime.setFullYear(curYear);
      }
      // if (arr[i].repeat === true || arr[i].repeat === "1") {
      //   if (arr[i].repeat_frequency === "DAY") {
      //     /*** TODO fix if event goes to another month.  */
      //     if (arr[i].repeat_ends === "After") {
      //       if (arr[i].repeat_ends === "After") {
      //         let occurence_dates = [];
      //         const occurences = parseInt(arr[i].repeat_occurences);
      //         const repeat_every = parseInt(arr[i].repeat_every);

      //         const start_day_and_time = arr[i].start_day_and_time.split(
      //           " "
      //         )[0];
      //         //const initDate = start_day_and_time[1];
      //         //const initMonth = getMonthNumber(start_day_and_time[2]);
      //         //const initYear = start_day_and_time[3];

      //         //let initFullDate = initMonth + "/" + initDate + "/" + initYear;
      //         //var startdate = "20-03-2014";
      //         let new_date = moment(start_day_and_time, "MM/DD/YYYY");
      //         //var thing = new_date.add(5, "days").format("L");
      //         for (let i = 0; i < occurences; i++) {
      //           let date = new_date
      //             .clone()
      //             .add(i * repeat_every, "days")
      //             .format("L");
      //           occurence_dates.push(date);
      //         }

      //         let today_date_object = new Date(
      //           curYear,
      //           curMonth,
      //           curDate2.date()
      //         );
      //         let today = getFormattedDate(today_date_object);

      //         if (occurence_dates.includes(today)) {
      //           tempStartTime.setMonth(curMonth);
      //           tempEndTime.setMonth(curMonth);
      //           tempStartTime.setDate(curDate2.date());
      //           tempEndTime.setDate(curDate2.date());
      //           tempStartTime.setFullYear(curYear);
      //           tempEndTime.setFullYear(curYear);
      //         }
      //       }
      //     } else if (arr[i].repeat_ends === "On") {
      //       const repeat_every = parseInt(arr[i].repeat_every);

      //       const start_day_and_time = arr[i].start_day_and_time.split(" ")[0];
      //       //const startDate = start_day_and_time[1];
      //       //const startMonth = getMonthNumber(start_day_and_time[2]);
      //       //const startYear = start_day_and_time[3];

      //       const end_day_and_time = arr[i].repeat_ends_on.split(" ");

      //       const endDate = end_day_and_time[2];
      //       const endMonth = getMonthNumber(end_day_and_time[1]);
      //       const endYear = end_day_and_time[3];

      //       //let startFullDate = startMonth + "/" + startDate + "/" + startYear;
      //       let endFullDate = endMonth + "/" + endDate + "/" + endYear;

      //       let curFullDateString = new Date(
      //         curYear,
      //         curMonth,
      //         curDate2.date()
      //       );
      //       let curFullDate = getFormattedDate(curFullDateString);

      //       let endMomentDate = moment(endFullDate, "MM/DD/YYYY");

      //       let startMomentDate = moment(start_day_and_time, "MM/DD/YYYY");
      //       let curMomentDate = moment(curFullDate, "MM/DD/YYYY");

      //       let diffDays = curMomentDate.diff(startMomentDate, "days");
      //       let daysFromCurToEnd = endMomentDate.diff(curMomentDate, "days");

      //       if (
      //         diffDays % repeat_every === 0 &&
      //         diffDays >= 0 &&
      //         daysFromCurToEnd >= 0
      //       ) {
      //         tempStartTime.setMonth(curMonth);
      //         tempEndTime.setMonth(curMonth);
      //         tempStartTime.setDate(curDate2.date());
      //         tempEndTime.setDate(curDate2.date());
      //         tempStartTime.setFullYear(curYear);
      //         tempEndTime.setFullYear(curYear);
      //       }
      //     } else if (arr[i].repeat_ends === "Never") {
      //       const occurences = parseInt(arr[i].repeat_occurences);
      //       const repeat_every = parseInt(arr[i].repeat_every);

      //       const start_day_and_time = arr[i].start_day_and_time.split(" ")[0];
      //       //const initDate = start_day_and_time[1];
      //       //const initMonth = getMonthNumber(start_day_and_time[2]);
      //       //const initYear = start_day_and_time[3];

      //       //let initFullDate = initMonth + "/" + initDate + "/" + initYear;
      //       let curFullDateString = new Date(
      //         curYear,
      //         curMonth,
      //         curDate2.date()
      //       );
      //       let curFullDate = getFormattedDate(curFullDateString);

      //       let initMomentDate = moment(start_day_and_time, "MM/DD/YYYY");
      //       let curMomentDate = moment(curFullDate, "MM/DD/YYYY");

      //       let diffDays = curMomentDate.diff(initMomentDate, "days");

      //       if (diffDays % repeat_every === 0 && diffDays >= 0) {
      //         tempStartTime.setMonth(curMonth);
      //         tempEndTime.setMonth(curMonth);
      //         tempStartTime.setDate(curDate2.date());
      //         tempEndTime.setDate(curDate2.date());
      //         tempStartTime.setFullYear(curYear);
      //         tempEndTime.setFullYear(curYear);
      //       }
      //     }
      //   }

      //   if (arr[i].repeat_frequency === "WEEK") {
      //     if (arr[i].repeat_ends === "After") {
      //       let occurence_dates = [];
      //       let week_days_arr = [];
      //       const occurences = parseInt(arr[i].repeat_occurences);
      //       const repeat_every = parseInt(arr[i].repeat_every);

      //       const start_day_and_time = arr[i].start_day_and_time.split(" ")[0];
      //       //const initDate = start_day_and_time[1];
      //       //const initMonth = getMonthNumber(start_day_and_time[2]);
      //       //const initYear = start_day_and_time[3];

      //       //let initFullDate = initMonth + "/" + initDate + "/" + initYear;
      //       //var startdate = "20-03-2014";
      //       var new_date = moment(start_day_and_time, "MM/DD/YYYY");
      //       //var thing = new_date.add(5, "days").format("L");

      //       for (const day in arr[i].repeat_week_days) {
      //         if (arr[i].repeat_week_days[day] !== "") {
      //           week_days_arr.push(day);
      //         }
      //       }

      //       if (week_days_arr.length === 0) {
      //         for (let i = 0; i < occurences; i++) {
      //           let moment_init_date = moment(initFullDate);
      //           let date = moment_init_date
      //             .add(i * repeat_every, "weeks")
      //             .format("L");
      //           occurence_dates.push(date);
      //         }
      //       } else {
      //         for (let j = 0; j < week_days_arr.length; j++) {
      //           let nextDayOfTheWeek = getNextDayOfTheWeek(
      //             week_days_arr[j],
      //             new_date
      //           );
      //           for (let i = 0; i < occurences; i++) {
      //             let date = nextDayOfTheWeek
      //               .clone()
      //               .add(i * repeat_every, "weeks")
      //               .format("L");
      //             occurence_dates.push(date);
      //           }
      //         }
      //       }

      //       //console.log("occurence_dates: ", occurence_dates);

      //       let today_date_object = new Date(
      //         curYear,
      //         curMonth,
      //         curDate2.date()
      //       );
      //       let today = getFormattedDate(today_date_object);

      //       if (occurence_dates.includes(today)) {
      //         tempStartTime.setMonth(curMonth);
      //         tempEndTime.setMonth(curMonth);
      //         tempStartTime.setDate(curDate2.date());
      //         tempEndTime.setDate(curDate2.date());
      //         tempStartTime.setFullYear(curYear);
      //         tempEndTime.setFullYear(curYear);
      //       }

      //       ///

      //       ///
      //     } else if (arr[i].repeat_ends === "On") {
      //       let endsOnDate = new Date(arr[i].repeat_ends_on).getDate();
      //       let endsOnMonth = new Date(arr[i].repeat_ends_on).getMonth();
      //       let initialEndOnYear = new Date(
      //         arr[i].repeat_ends_on
      //       ).getFullYear();
      //       let initialDayCorrect = false;
      //       let startWeek = new Date(
      //         initialStartYear,
      //         initialStartMonth,
      //         initialStartDate
      //       );
      //       let weekStart = ISO8601_week_no(startWeek);
      //       let weekNow = new Date(curYear, curMonth, curDate2.date());
      //       let curWeek = ISO8601_week_no(weekNow);

      //       if (
      //         (curYear < initialEndOnYear &&
      //           curYear > initialStartYear &&
      //           (curWeek - (53 - weekStart)) % arr[i].repeat_every === 0) || // needs work
      //         (curYear === initialEndOnYear &&
      //           curYear !== initialStartYear &&
      //           curMonth < endsOnMonth &&
      //           (curWeek - (53 - weekStart)) % arr[i].repeat_every === 0) || // needs work
      //         (curYear < initialEndOnYear &&
      //           curYear === initialStartYear &&
      //           curMonth > initialStartMonth &&
      //           arr[i].repeat_every === "1") ||
      //         (curYear < initialEndOnYear &&
      //           curYear === initialStartYear &&
      //           curMonth > initialStartMonth &&
      //           arr[i].repeat_every > 1 &&
      //           (curWeek - weekStart) % arr[i].repeat_every === 0) ||
      //         (curYear < initialEndOnYear &&
      //           curYear === initialStartYear &&
      //           curMonth === initialStartMonth &&
      //           curDate2.date() >= initialStartDate &&
      //           arr[i].repeat_every === "1") ||
      //         (curYear < initialEndOnYear &&
      //           curYear === initialStartYear &&
      //           curMonth === initialStartMonth &&
      //           curDate2.date() >= initialStartDate &&
      //           arr[i].repeat_every > 1 &&
      //           (curWeek - weekStart) % arr[i].repeat_every === 0) ||
      //         (curYear === initialEndOnYear &&
      //           curYear === initialStartYear &&
      //           curMonth < endsOnMonth &&
      //           curMonth > initialStartMonth &&
      //           arr[i].repeat_every === "1") ||
      //         (curYear === initialEndOnYear &&
      //           curYear === initialStartYear &&
      //           curMonth < endsOnMonth &&
      //           curMonth > initialStartMonth &&
      //           arr[i].repeat_every > 1 &&
      //           (curWeek - weekStart) % arr[i].repeat_every === 0) ||
      //         (curYear === initialEndOnYear &&
      //           curYear === initialStartYear &&
      //           curMonth === endsOnMonth &&
      //           curMonth === initialStartMonth &&
      //           curDate2.date() >= initialStartDate &&
      //           curDate2.date() <= endsOnDate &&
      //           arr[i].repeat_every === "1") ||
      //         (curYear === initialEndOnYear &&
      //           curYear === initialStartYear &&
      //           curMonth === endsOnMonth &&
      //           curMonth === initialStartMonth &&
      //           curDate2.date() >= initialStartDate &&
      //           curDate2.date() <= endsOnDate &&
      //           arr[i].repeat_every > 1 &&
      //           (curWeek - weekStart) % arr[i].repeat_every === 0) ||
      //         (curYear === initialEndOnYear &&
      //           curYear === initialStartYear &&
      //           curMonth === endsOnMonth &&
      //           curMonth !== initialStartMonth &&
      //           curDate2.date() <= endsOnDate &&
      //           arr[i].repeat_every === "1") ||
      //         (curYear === initialEndOnYear &&
      //           curYear === initialStartYear &&
      //           curMonth === endsOnMonth &&
      //           curMonth !== initialStartMonth &&
      //           curDate2.date() <= endsOnDate &&
      //           arr[i].repeat_every > 1 &&
      //           (curWeek - weekStart) % arr[i].repeat_every === 0) ||
      //         (curYear === initialEndOnYear &&
      //           curYear === initialStartYear &&
      //           curMonth === initialStartMonth &&
      //           curMonth !== endsOnMonth &&
      //           curDate2.date() >= initialStartDate &&
      //           arr[i].repeat_every === "1") ||
      //         (curYear === initialEndOnYear &&
      //           curYear === initialStartYear &&
      //           curMonth === initialStartMonth &&
      //           curMonth !== endsOnMonth &&
      //           curDate2.date() >= initialStartDate &&
      //           arr[i].repeat_every > 1 &&
      //           (curWeek - weekStart) % arr[i].repeat_every === 0)
      //       ) {
      //         Object.keys(arr[i].repeat_week_days).forEach((key) => {
      //           if (
      //             curDate2.date() === initialStartDate &&
      //             curMonth === initialStartMonth &&
      //             curYear === initialStartYear
      //           ) {
      //             if (
      //               (arr[i].repeat_week_days[key] === "Sunday" &&
      //                 new Date(curDate2).getDay() === 0) ||
      //               (arr[i].repeat_week_days[key] === "Monday" &&
      //                 new Date(curDate2).getDay() === 1) ||
      //               (arr[i].repeat_week_days[key] === "Tuesday" &&
      //                 new Date(curDate2).getDay() === 2) ||
      //               (arr[i].repeat_week_days[key] === "Wednesday" &&
      //                 new Date(curDate2).getDay() === 3) ||
      //               (arr[i].repeat_week_days[key] === "Thursday" &&
      //                 new Date(curDate2).getDay() === 4) ||
      //               (arr[i].repeat_week_days[key] === "Friday" &&
      //                 new Date(curDate2).getDay() === 5) ||
      //               (arr[i].repeat_week_days[key] === "Saturday" &&
      //                 new Date(curDate2).getDay() == 6)
      //             ) {
      //               initialDayCorrect = true;
      //             }
      //           }

      //           if (
      //             (arr[i].repeat_week_days[key] === "Sunday" &&
      //               new Date(curDate2).getDay() === 0) ||
      //             (arr[i].repeat_week_days[key] === "Monday" &&
      //               new Date(curDate2).getDay() === 1) ||
      //             (arr[i].repeat_week_days[key] === "Tuesday" &&
      //               new Date(curDate2).getDay() === 2) ||
      //             (arr[i].repeat_week_days[key] === "Wednesday" &&
      //               new Date(curDate2).getDay() === 3) ||
      //             (arr[i].repeat_week_days[key] === "Thursday" &&
      //               new Date(curDate2).getDay() === 4) ||
      //             (arr[i].repeat_week_days[key] === "Friday" &&
      //               new Date(curDate2).getDay() === 5) ||
      //             (arr[i].repeat_week_days[key] === "Saturday" &&
      //               new Date(curDate2).getDay() === 6)
      //           ) {
      //             tempStartTime.setMonth(curMonth);
      //             tempEndTime.setMonth(curMonth);
      //             tempStartTime.setDate(curDate2.date());
      //             tempEndTime.setDate(curDate2.date());
      //             tempStartTime.setFullYear(curYear);
      //             tempEndTime.setFullYear(curYear);
      //           }
      //         });

      //         if (
      //           !initialDayCorrect &&
      //           curDate2.date() === initialStartDate &&
      //           curMonth === initialStartMonth &&
      //           curYear === initialStartYear
      //         ) {
      //           tempStartTime.setDate(curDate2.date() + 1);
      //           tempEndTime.setDate(curDate2.date() + 1);
      //         }
      //       }
      //     } else if (arr[i].repeat_ends === "Never") {
      //       //week starts with each monday
      //       let initialDayCorrect = false;
      //       let startWeek = new Date(
      //         initialStartYear,
      //         initialStartMonth,
      //         initialStartDate
      //       );
      //       let weekStart = ISO8601_week_no(startWeek);
      //       let weekNow = new Date(curYear, curMonth, curDate2.date());
      //       let curWeek = ISO8601_week_no(weekNow);

      //       if (
      //         (curYear > initialStartYear && arr[i].repeat_every === "1") ||
      //         (curYear - initialStartYear === 1 &&
      //           arr[i].repeat_every > 1 &&
      //           (curWeek - (53 - weekStart)) % arr[i].repeat_every === 0) ||
      //         (curYear - initialStartYear > 1 &&
      //           arr[i].repeat_every > 1 &&
      //           (curWeek - (53 - weekStart)) % arr[i].repeat_every === 0) || //might need fixing
      //         (curYear === initialStartYear &&
      //           curMonth > initialStartMonth &&
      //           (curWeek - weekStart) % arr[i].repeat_every === 0) ||
      //         (curYear === initialStartYear &&
      //           curMonth === initialStartMonth &&
      //           curDate2.date() >= initialStartDate &&
      //           (curWeek - weekStart) % arr[i].repeat_every === 0)
      //       ) {
      //         Object.keys(arr[i].repeat_week_days).forEach((key) => {
      //           if (
      //             curDate2.date() === initialStartDate &&
      //             curMonth === initialStartMonth &&
      //             curYear === initialStartYear
      //           ) {
      //             if (
      //               (arr[i].repeat_week_days[key] === "Sunday" &&
      //                 new Date(curDate2).getDay() === 0) ||
      //               (arr[i].repeat_week_days[key] === "Monday" &&
      //                 new Date(curDate2).getDay() === 1) ||
      //               (arr[i].repeat_week_days[key] === "Tuesday" &&
      //                 new Date(curDate2).getDay() === 2) ||
      //               (arr[i].repeat_week_days[key] === "Wednesday" &&
      //                 new Date(curDate2).getDay() === 3) ||
      //               (arr[i].repeat_week_days[key] === "Thursday" &&
      //                 new Date(curDate2).getDay() === 4) ||
      //               (arr[i].repeat_week_days[key] === "Friday" &&
      //                 new Date(curDate2).getDay() === 5) ||
      //               (arr[i].repeat_week_days[key] === "Saturday" &&
      //                 new Date(curDate2).getDay() == 6)
      //             ) {
      //               initialDayCorrect = true;
      //             }
      //           }

      //           if (
      //             (arr[i].repeat_week_days[key] === "Sunday" &&
      //               new Date(curDate2).getDay() === 0) ||
      //             (arr[i].repeat_week_days[key] === "Monday" &&
      //               new Date(curDate2).getDay() === 1) ||
      //             (arr[i].repeat_week_days[key] === "Tuesday" &&
      //               new Date(curDate2).getDay() === 2) ||
      //             (arr[i].repeat_week_days[key] === "Wednesday" &&
      //               new Date(curDate2).getDay() === 3) ||
      //             (arr[i].repeat_week_days[key] === "Thursday" &&
      //               new Date(curDate2).getDay() === 4) ||
      //             (arr[i].repeat_week_days[key] === "Friday" &&
      //               new Date(curDate2).getDay() === 5) ||
      //             (arr[i].repeat_week_days[key] === "Saturday" &&
      //               new Date(curDate2).getDay() === 6)
      //           ) {
      //             tempStartTime.setMonth(curMonth);
      //             tempEndTime.setMonth(curMonth);
      //             tempStartTime.setDate(curDate2.date());
      //             tempEndTime.setDate(curDate2.date());
      //             tempStartTime.setFullYear(curYear);
      //             tempEndTime.setFullYear(curYear);
      //           }
      //         });
      //         if (
      //           !initialDayCorrect &&
      //           curDate2.date() === initialStartDate &&
      //           curMonth === initialStartMonth &&
      //           curYear === initialStartYear
      //         ) {
      //           tempStartTime.setDate(curDate2.date() + 1);
      //           tempEndTime.setDate(curDate2.date() + 1);
      //         }
      //       }
      //     }
      //   }
      //   /** REPEAT MONTH */
      //   if (arr[i].repeat_frequency === "MONTH") {
      //     if (arr[i].repeat_ends === "After") {
      //       for (let j = 1; j < arr[i].repeat_occurences; j++) {
      //         if (
      //           curDate2.date() >= initialStartDate &&
      //           curDate2.date() <= initialEndDate &&
      //           tempStartTime.getMonth() + j * arr[i].repeat_every ===
      //             curMonth &&
      //           (curMonth - initialStartMonth) % arr[i].repeat_every === 0 &&
      //           initialStartYear === curYear
      //         ) {
      //           tempStartTime.setMonth(curMonth);
      //           tempEndTime.setMonth(curMonth);
      //         }
      //       }
      //       if (
      //         curDate2.date() >= initialStartDate &&
      //         curDate2.date() <= initialEndDate &&
      //         curYear > initialStartYear &&
      //         curYear - initialStartYear === 1 &&
      //         (curMonth - initialStartMonth) % arr[i].repeat_every === 0
      //       ) {
      //         for (
      //           let k = 0;
      //           k <
      //           arr[i].repeat_occurences -
      //             Math.floor(
      //               (12 - tempStartTime.getMonth()) / arr[i].repeat_every
      //             );
      //           k++
      //         ) {
      //           if (
      //             k * arr[i].repeat_every -
      //               ((12 - tempStartTime.getMonth()) % arr[i].repeat_every) ===
      //             curMonth
      //           ) {
      //             tempStartTime.setMonth(curMonth);
      //             tempEndTime.setMonth(curMonth);
      //             tempStartTime.setFullYear(curYear);
      //             tempEndTime.setFullYear(curYear);
      //           }
      //         }
      //       } else if (
      //         curDate2.date() >= initialStartDate &&
      //         curDate2.date() <= initialEndDate &&
      //         curYear - initialStartYear === 2 &&
      //         (curMonth - initialStartMonth) % arr[i].repeat_every === 0
      //       ) {
      //         for (
      //           let k = 0;
      //           k <
      //           arr[i].repeat_occurences -
      //             Math.floor(
      //               (12 - tempStartTime.getMonth()) / arr[i].repeat_every
      //             ) -
      //             Math.floor(12 / arr[i].repeat_every);
      //           k++
      //         ) {
      //           if (
      //             k * arr[i].repeat_every -
      //               (12 % arr[i].repeat_every) -
      //               ((12 - tempStartTime.getMonth()) % arr[i].repeat_every) ===
      //             curMonth
      //           ) {
      //             tempStartTime.setMonth(curMonth);
      //             tempEndTime.setMonth(curMonth);
      //             tempStartTime.setFullYear(curYear);
      //             tempEndTime.setFullYear(curYear);
      //           }
      //         }
      //       }
      //     } else if (arr[i].repeat_ends === "On") {
      //       let endsOnDate = new Date(arr[i].repeat_ends_on).getDate();
      //       let endsOnMonth = new Date(arr[i].repeat_ends_on).getMonth();
      //       let initialEndOnYear = new Date(
      //         arr[i].repeat_ends_on
      //       ).getFullYear();
      //       if (
      //         initialStartYear === initialEndOnYear &&
      //         curMonth <= endsOnMonth &&
      //         curMonth > initialStartMonth &&
      //         curDate2.date() >= initialStartDate &&
      //         curDate2.date() <= initialEndDate &&
      //         curYear === initialStartYear &&
      //         (curMonth - initialStartMonth) % arr[i].repeat_every === 0
      //       ) {
      //         if (endsOnMonth === curMonth) {
      //           if (endsOnDate >= initialStartDate) {
      //             tempStartTime.setMonth(curMonth);
      //             tempEndTime.setMonth(curMonth);
      //           }
      //         } else {
      //           tempStartTime.setMonth(curMonth);
      //           tempEndTime.setMonth(curMonth);
      //         }
      //       } else if (
      //         initialStartYear !== initialEndOnYear &&
      //         curDate2.date() >= initialStartDate &&
      //         curDate2.date() <= initialEndDate &&
      //         curYear > initialStartYear &&
      //         curYear < initialEndOnYear &&
      //         (curMonth - initialStartMonth) % arr[i].repeat_every === 0
      //       ) {
      //         if (endsOnMonth === curMonth) {
      //           if (endsOnDate >= initialStartDate) {
      //             tempStartTime.setMonth(curMonth);
      //             tempEndTime.setMonth(curMonth);
      //             tempStartTime.setFullYear(curYear);
      //             tempEndTime.setFullYear(curYear);
      //           }
      //         } else {
      //           tempStartTime.setMonth(curMonth);
      //           tempEndTime.setMonth(curMonth);
      //           tempStartTime.setFullYear(curYear);
      //           tempEndTime.setFullYear(curYear);
      //         }
      //       } else if (
      //         initialStartYear !== initialEndOnYear &&
      //         curMonth <= endsOnMonth &&
      //         curDate2.date() >= initialStartDate &&
      //         curDate2.date() <= initialEndDate &&
      //         curYear === initialEndOnYear &&
      //         (curMonth - initialStartMonth) % arr[i].repeat_every === 0
      //       ) {
      //         if (endsOnMonth === curMonth) {
      //           if (endsOnDate >= initialStartDate) {
      //             tempStartTime.setMonth(curMonth);
      //             tempEndTime.setMonth(curMonth);
      //             tempStartTime.setFullYear(curYear);
      //             tempEndTime.setFullYear(curYear);
      //           }
      //         } else {
      //           tempStartTime.setMonth(curMonth);
      //           tempEndTime.setMonth(curMonth);
      //           tempStartTime.setFullYear(curYear);
      //           tempEndTime.setFullYear(curYear);
      //         }
      //       } else if (
      //         initialStartYear !== initialEndOnYear &&
      //         curMonth > initialStartMonth &&
      //         curDate2.date() >= initialStartDate &&
      //         curDate2.date() <= initialEndDate &&
      //         curYear === initialStartYear &&
      //         (curMonth - initialStartMonth) % arr[i].repeat_every === 0
      //       ) {
      //         if (endsOnMonth === curMonth) {
      //           if (endsOnDate >= initialStartDate) {
      //             tempStartTime.setMonth(curMonth);
      //             tempEndTime.setMonth(curMonth);
      //           }
      //         } else {
      //           tempStartTime.setMonth(curMonth);
      //           tempEndTime.setMonth(curMonth);
      //         }
      //       }
      //     } else if (arr[i].repeat_ends === "Never") {
      //       if (
      //         curDate2.date() >= initialStartDate &&
      //         curDate2.date() <= initialEndDate &&
      //         curYear > initialStartYear &&
      //         (curMonth - initialStartMonth) % arr[i].repeat_every === 0
      //       ) {
      //         tempStartTime.setMonth(curMonth);
      //         tempEndTime.setMonth(curMonth);
      //         tempStartTime.setFullYear(curYear);
      //         tempEndTime.setFullYear(curYear);
      //       } else if (
      //         curDate2.date() >= initialStartDate &&
      //         curDate2.date() <= initialEndDate &&
      //         curMonth > initialStartMonth &&
      //         curYear === initialStartYear &&
      //         (curMonth - initialStartMonth) % arr[i].repeat_every === 0
      //       ) {
      //         tempStartTime.setMonth(curMonth);
      //         tempEndTime.setMonth(curMonth);
      //       }
      //     }
      //   }

      //   /** REPEAT YEAR */
      //   if (arr[i].repeat_frequency === "YEAR") {
      //     if (arr[i].repeat_ends === "After") {
      //       for (let j = 1; j < arr[i].repeat_occurences; j++) {
      //         if (
      //           curDate2.date() >= initialStartDate &&
      //           curDate2.date() <= initialEndDate &&
      //           curMonth >= tempStartTime.getMonth() &&
      //           curMonth <= tempEndTime.getMonth() &&
      //           tempStartTime.getFullYear() + j * arr[i].repeat_every ===
      //             curYear &&
      //           (curYear - initialStartYear) % arr[i].repeat_every === 0
      //         ) {
      //           tempStartTime.setFullYear(curYear);
      //           tempEndTime.setFullYear(curYear);
      //         }
      //       }
      //     }
      //     if (arr[i].repeat_ends === "On") {
      //       let endsOnDate = new Date(arr[i].repeat_ends_on).getDate();
      //       let endsOnMonth = new Date(arr[i].repeat_ends_on).getMonth();
      //       let initialEndOnYear = new Date(
      //         arr[i].repeat_ends_on
      //       ).getFullYear();
      //       if (
      //         curYear <= initialEndOnYear &&
      //         curYear > initialStartYear &&
      //         curDate2.date() >= initialStartDate &&
      //         curDate2.date() <= initialEndDate &&
      //         curMonth === initialStartMonth &&
      //         (curYear - initialStartYear) % arr[i].repeat_every === 0
      //       ) {
      //         if (initialEndOnYear === curYear) {
      //           if (endsOnMonth === initialStartMonth) {
      //             if (endsOnDate >= initialStartDate) {
      //               tempStartTime.setFullYear(curYear);
      //               tempEndTime.setFullYear(curYear);
      //             }
      //           } else if (endsOnMonth > initialStartMonth) {
      //             tempStartTime.setFullYear(curYear);
      //             tempEndTime.setFullYear(curYear);
      //           }
      //         } else {
      //           tempStartTime.setFullYear(curYear);
      //           tempEndTime.setFullYear(curYear);
      //         }
      //       }
      //     } else if (arr[i].repeat_ends === "Never") {
      //       if (
      //         curDate2.date() >= initialStartDate &&
      //         curDate2.date() <= initialEndDate &&
      //         curMonth === initialStartMonth &&
      //         curYear > initialStartYear &&
      //         (curYear - initialStartYear) % arr[i].repeat_every === 0
      //       ) {
      //         tempStartTime.setFullYear(curYear);
      //         tempEndTime.setFullYear(curYear);
      //       }
      //     }
      //   }
      // }

      let startDate = moment(tempStartTime);
      let endDate = moment(tempEndTime);

      if (
        moment(curDate2).isSameOrAfter(startDate, "day") &&
        moment(curDate2).isSameOrBefore(endDate, "day")
      ) {
        if (
          startDate.date() === curDate2.date() &&
          curMonth <= endDate.month() &&
          curMonth >= startDate.month() &&
          curYear <= endDate.year() &&
          curYear >= startDate.year()
        ) {
          if (startDate.hour() === hour) {
            if (startDate.date() === endDate.date()) {
              let minsToMarginTop =
                (tempStartTime.getMinutes() / 60) *
                this.state.pxPerHourForConversion;
              let hourDiff = tempEndTime.getHours() - tempStartTime.getHours();
              let minDiff = tempEndTime.getMinutes() / 60;
              let color = "PaleTurquoise";
              let height =
                (hourDiff + minDiff) * this.state.pxPerHourForConversion;
              sameTimeEventCount++;
              //check if there is already an event there overlapping from another hour
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
                }
              }

              if (sameTimeEventCount > 1) {
                addmarginLeft += 20;
                itemWidth = itemWidth - 20;
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

              if (isDisplayedTodayCalculated) {
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
            } else if (startDate.date() !== endDate.date()) {
              let minsToMarginTop =
                (tempStartTime.getMinutes() / 60) *
                this.state.pxPerHourForConversion;
              let hourDiff = 24 - tempStartTime.getHours();
              let minDiff = 0;
              let color = "lavender";
              let height =
                (hourDiff + minDiff) * this.state.pxPerHourForConversion;
              sameTimeEventCount++;
              if (isDisplayedTodayCalculated) {
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
          }
        } else if (hour === 0) {
          if (
            endDate.date() === curDate2.date() &&
            curMonth <= endDate.month() &&
            curMonth >= startDate.month() &&
            curYear <= endDate.year() &&
            curYear >= startDate.year()
          ) {
            let minsToMarginTop = 0;
            let hourDiff = tempEndTime.getHours();
            let minDiff = tempEndTime.getMinutes() / 60;
            let height =
              (hourDiff + minDiff) * this.state.pxPerHourForConversion;
            let color = "lavender";
            sameTimeEventCount++;
            if (isDisplayedTodayCalculated) {
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
          } else if (
            startDate.date() < curDate2.date() &&
            endDate.date() > curDate2.date() &&
            curMonth <= endDate.month() &&
            curMonth >= startDate.month() &&
            curYear <= endDate.year() &&
            curYear >= startDate.year()
          ) {
            let minsToMarginTop = 0;
            let height = 24 * this.state.pxPerHourForConversion;
            let color = "lavender";
            sameTimeEventCount++;
            if (isDisplayedTodayCalculated) {
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
        }
      }
    }
    return res;
  };

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
          <Container key={"weekRoutine" + i + j}>
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
      res.push(<Col key={"dayRoutine" + i}>{arr}</Col>);
    }
    return res;
  };

  render() {
    let weekdays = moment.weekdays().map((day) => {
      return (
        <Col key={"routine" + day} className="fancytext">
          {day}
        </Col>
      );
    });
    return (
      <Container style={{ height: "auto", width: "1000px" }}>
        <Row>
          <Col>Routines</Col>
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

function getFormattedDate(date) {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, "0");
  let day = date.getDate().toString().padStart(2, "0");

  return month + "/" + day + "/" + year;
}

function getNextDayOfTheWeek(day, date) {
  const dayINeed = day; // for Thursday
  const today = date.isoWeekday();
  //console.log("DayINeed, today", dayINeed, today);

  // if we haven't yet passed the day of the week that I need:
  if (today <= dayINeed) {
    // then just give me this week's instance of that day
    var nextDayOfTheWeek = date.day(dayINeed);
    return nextDayOfTheWeek;
  } else {
    // otherwise, give me *next week's* instance of that same day
    var nextDayOfTheWeek = date.add(1, "weeks").day(dayINeed);
    //console.log("from getNextday", nextDayOfTheWeek.format("L"));
    return nextDayOfTheWeek;
  }
}
function getMonthNumber(str) {
  switch (str) {
    case "Jan":
      return "01";
    case "Feb":
      return "02";
    case "Mar":
      return "03";
    case "April":
      return "04";
    case "May":
      return "05";
    case "Jun":
      return "06";
    case "Jul":
      return "07";
    case "Aug":
      return "08";
    case "Sep":
      return "09";
    case "Oct":
      return "10";
    case "Nov":
      return "11";
    case "Dec":
      return "12";
    default:
      console.log("can't change the month");
      return "";
  }
}
