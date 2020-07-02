import React, { Component } from "react";
import firebase from "./firebase";
import moment from "moment";
import { Container, Row, Col } from "react-bootstrap";

export default class DayRoutines extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routines: [], // array to hold all routines
      pxPerHour: "30px", //preset size for all columns
      pxPerHourForConversion: 30, // if pxPerHour is change, this should change to reflect it
      zIndex: 1, //thought i needed to increment zIndex for div overlaps but seems to be fine being at 1 for all divs
      eventBoxSize: "200", //width size for event box
    };
  }

  dayView = () => {
    //this essentially creates the time row
    let arr = [];
    for (let i = 0; i < 24; ++i) {
      arr.push(
        <Row key={"dayDayViewRoutines" + i}>
          <Col
            style={{
              borderTop: "1px solid  mistyrose",
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

  RoutineClicked = () => {
    this.props.dayRoutineClick();
  };

  /**
   * getEventItem: given an hour, this will return all events that was started during that hour
   *
   */
  getEventItem = (hour) => {
    var res = [];
    var tempStart = null;
    var tempEnd = null;
    var arr = this.props.routines;
    var sameTimeEventCount = 0;
    let itemWidth = this.state.eventBoxSize;
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

      let initialStartDate = tempStartTime.getDate();
      let initialEndDate = tempEndTime.getDate();
      let initialStartMonth = tempStartTime.getMonth();
      let initialStartYear = tempStartTime.getFullYear();
      let initialEndYear = tempEndTime.getFullYear();

      // console.log(
      //   tempStartTime,
      //   "//",
      //   tempEndTime,
      //   "//",
      //   curDate,
      //   "//",
      //   curMonth,
      //   "//",
      //   curYear
      // );
      // console.log(
      //   initialStartDate,
      //   "//",
      //   initialEndDate,
      //   "//",
      //   initialStartMonth,
      //   "//",
      //   initialStartYear,
      //   "//"
      // );

      /** This function takes in the date and gives back the week number it is in for that year */
      function ISO8601_week_no(dt) {
        var tdt = new Date(dt.valueOf());
        var dayn = (dt.getDay() + 6) % 7;
        tdt.setDate(tdt.getDate() - dayn + 3);
        var firstThursday = tdt.valueOf();
        tdt.setMonth(0, 1);
        if (tdt.getDay() !== 4) {
          tdt.setMonth(0, 1 + ((4 - tdt.getDay() + 7) % 7));
        }
        return 1 + Math.ceil((firstThursday - tdt) / 604800000);
      }
      /**
       * Dealing with repeating Routines
       */

      if (arr[i].repeat === true || arr[i].repeat === "1") {
        if (arr[i].repeat_frequency === "DAY") {
          /*** TODO fix if event goes to another month.  */
          if (arr[i].repeat_ends === "After") {
            for (let j = 1; j < arr[i].repeat_occurences; j++) {
              if (
                curYear === initialStartYear &&
                curMonth === initialStartMonth &&
                initialStartDate + j * arr[i].repeat_every === curDate &&
                (curDate - initialStartDate) % arr[i].repeat_every === 0
              ) {
                tempStartTime.setDate(curDate);
                tempEndTime.setDate(curDate);
              } else if (
                curYear === initialStartYear &&
                curMonth > initialStartMonth &&
                curMonth - initialStartMonth === 1 &&
                arr[i].repeat_every > 1 &&
                curDate <=
                  (arr[i].repeat_occurences -
                    1 -
                    Math.floor(
                      (new Date(curYear, curMonth, 0).getDate() -
                        initialStartDate) /
                        arr[i].repeat_every
                    )) *
                    arr[i].repeat_every &&
                (curDate +
                  (Math.floor(
                    new Date(curYear, curMonth, 0).getDate() - initialStartDate
                  ) %
                    arr[i].repeat_every)) %
                  arr[i].repeat_every ===
                  0
              ) {
                tempStartTime.setMonth(curMonth);
                tempEndTime.setMonth(curMonth);
                tempStartTime.setDate(curDate);
                tempEndTime.setDate(curDate);
              } else if (
                curYear === initialStartYear &&
                curMonth > initialStartMonth &&
                curMonth - initialStartMonth > 1 &&
                arr[i].repeat_every > 1
              ) {
                let subtractBy = 0;
                let indexBy = 9;
                if (curMonth - initialStartMonth === 2) {
                  subtractBy =
                    Math.floor(
                      (new Date(curYear, curMonth - 1, 0).getDate() -
                        initialStartDate) /
                        arr[i].repeat_every
                    ) +
                    Math.floor(
                      new Date(curYear, curMonth, 0).getDate() /
                        arr[i].repeat_every
                    ) +
                    1;
                  indexBy =
                    Math.floor(
                      new Date(curYear, curMonth, 0).getDate() -
                        ((Math.floor(
                          new Date(curYear, curMonth, 0).getDate() -
                            initialStartDate
                        ) %
                          arr[i].repeat_every) +
                          1)
                    ) % arr[i].repeat_every;
                }

                if (
                  (arr[i].repeat_occurences - subtractBy) *
                    arr[i].repeat_every >
                    0 &&
                  curDate <=
                    (arr[i].repeat_occurences - subtractBy) *
                      arr[i].repeat_every &&
                  (curDate + indexBy) % arr[i].repeat_every === 0
                ) {
                  tempStartTime.setMonth(curMonth);
                  tempEndTime.setMonth(curMonth);
                  tempStartTime.setDate(curDate);
                  tempEndTime.setDate(curDate);
                }
              } else if (
                curYear === initialStartYear &&
                curMonth > initialStartMonth &&
                curMonth - initialStartMonth === 1 &&
                arr[i].repeat_every === "1" &&
                (arr[i].repeat_occurences -
                  new Date(curYear, curMonth, 0).getDate() >
                  31 ||
                  curDate <
                    arr[i].repeat_occurences -
                      (new Date(curYear, curMonth, 0).getDate() -
                        initialStartDate))
              ) {
                tempStartTime.setMonth(curMonth);
                tempEndTime.setMonth(curMonth);
                tempStartTime.setDate(curDate);
                tempEndTime.setDate(curDate);
              } else if (
                curYear === initialStartYear &&
                curMonth > initialStartMonth &&
                curMonth - initialStartMonth > 1 &&
                arr[i].repeat_every === "1"
              ) {
                let subtractBy = 0;
                if (curMonth - initialStartMonth === 2) {
                  subtractBy =
                    new Date(curYear, curMonth - 1, 0).getDate() -
                    initialStartDate +
                    new Date(curYear, curMonth, 0).getDate();
                } else if (curMonth - initialStartMonth === 3) {
                  subtractBy =
                    new Date(curYear, curMonth - 2, 0).getDate() -
                    initialStartDate +
                    new Date(curYear, curMonth - 1, 0).getDate() +
                    new Date(curYear, curMonth, 0).getDate();
                } else if (curMonth - initialStartMonth === 4) {
                  subtractBy =
                    new Date(curYear, curMonth - 3, 0).getDate() -
                    initialStartDate +
                    new Date(curYear, curMonth - 2, 0).getDate() +
                    new Date(curYear, curMonth - 1, 0).getDate() +
                    new Date(curYear, curMonth, 0).getDate();
                } else if (curMonth - initialStartMonth === 5) {
                  subtractBy =
                    new Date(curYear, curMonth - 4, 0).getDate() -
                    initialStartDate +
                    new Date(curYear, curMonth - 3, 0).getDate() +
                    new Date(curYear, curMonth - 2, 0).getDate() +
                    new Date(curYear, curMonth - 1, 0).getDate() +
                    new Date(curYear, curMonth, 0).getDate();
                } else if (curMonth - initialStartMonth === 6) {
                  subtractBy =
                    new Date(curYear, curMonth - 5, 0).getDate() -
                    initialStartDate +
                    new Date(curYear, curMonth - 4, 0).getDate() +
                    new Date(curYear, curMonth - 3, 0).getDate() +
                    new Date(curYear, curMonth - 2, 0).getDate() +
                    new Date(curYear, curMonth - 1, 0).getDate() +
                    new Date(curYear, curMonth, 0).getDate();
                } else if (curMonth - initialStartMonth === 7) {
                  subtractBy =
                    new Date(curYear, curMonth - 6, 0).getDate() -
                    initialStartDate +
                    new Date(curYear, curMonth - 5, 0).getDate() +
                    new Date(curYear, curMonth - 4, 0).getDate() +
                    new Date(curYear, curMonth - 3, 0).getDate() +
                    new Date(curYear, curMonth - 2, 0).getDate() +
                    new Date(curYear, curMonth - 1, 0).getDate() +
                    new Date(curYear, curMonth, 0).getDate();
                } else if (curMonth - initialStartMonth === 8) {
                  subtractBy =
                    new Date(curYear, curMonth - 7, 0).getDate() -
                    initialStartDate +
                    new Date(curYear, curMonth - 6, 0).getDate() +
                    new Date(curYear, curMonth - 5, 0).getDate() +
                    new Date(curYear, curMonth - 4, 0).getDate() +
                    new Date(curYear, curMonth - 3, 0).getDate() +
                    new Date(curYear, curMonth - 2, 0).getDate() +
                    new Date(curYear, curMonth - 1, 0).getDate() +
                    new Date(curYear, curMonth, 0).getDate();
                } else if (curMonth - initialStartMonth === 9) {
                  subtractBy =
                    new Date(curYear, curMonth - 8, 0).getDate() -
                    initialStartDate +
                    new Date(curYear, curMonth - 7, 0).getDate() +
                    new Date(curYear, curMonth - 6, 0).getDate() +
                    new Date(curYear, curMonth - 5, 0).getDate() +
                    new Date(curYear, curMonth - 4, 0).getDate() +
                    new Date(curYear, curMonth - 3, 0).getDate() +
                    new Date(curYear, curMonth - 2, 0).getDate() +
                    new Date(curYear, curMonth - 1, 0).getDate() +
                    new Date(curYear, curMonth, 0).getDate();
                } else if (curMonth - initialStartMonth === 10) {
                  subtractBy =
                    new Date(curYear, curMonth - 9, 0).getDate() -
                    initialStartDate +
                    new Date(curYear, curMonth - 8, 0).getDate() +
                    new Date(curYear, curMonth - 7, 0).getDate() +
                    new Date(curYear, curMonth - 6, 0).getDate() +
                    new Date(curYear, curMonth - 5, 0).getDate() +
                    new Date(curYear, curMonth - 4, 0).getDate() +
                    new Date(curYear, curMonth - 3, 0).getDate() +
                    new Date(curYear, curMonth - 2, 0).getDate() +
                    new Date(curYear, curMonth - 1, 0).getDate() +
                    new Date(curYear, curMonth, 0).getDate();
                } else if (curMonth - initialStartMonth === 11) {
                  subtractBy =
                    new Date(curYear, curMonth - 10, 0).getDate() -
                    initialStartDate +
                    new Date(curYear, curMonth - 9, 0).getDate() +
                    new Date(curYear, curMonth - 8, 0).getDate() +
                    new Date(curYear, curMonth - 7, 0).getDate() +
                    new Date(curYear, curMonth - 6, 0).getDate() +
                    new Date(curYear, curMonth - 5, 0).getDate() +
                    new Date(curYear, curMonth - 4, 0).getDate() +
                    new Date(curYear, curMonth - 3, 0).getDate() +
                    new Date(curYear, curMonth - 2, 0).getDate() +
                    new Date(curYear, curMonth - 1, 0).getDate() +
                    new Date(curYear, curMonth, 0).getDate();
                }
                if (
                  arr[i].repeat_occurences - subtractBy > 0 &&
                  curDate < arr[i].repeat_occurences - subtractBy
                ) {
                  tempStartTime.setMonth(curMonth);
                  tempEndTime.setMonth(curMonth);
                  tempStartTime.setDate(curDate);
                  tempEndTime.setDate(curDate);
                }
              } else if (
                curYear > initialStartYear &&
                arr[i].repeat_every === "1"
              ) {
                tempStartTime.setMonth(curMonth);
                tempEndTime.setMonth(curMonth);
                tempStartTime.setDate(curDate);
                tempEndTime.setDate(curDate);
                tempStartTime.setFullYear(curYear);
                tempEndTime.setFullYear(curYear);
              }
            }
          } else if (arr[i].repeat_ends === "On") {
            /** TODO: account for ends on a different month > 1 . Also account for event span multiple days.  */
            let endsOnDate = new Date(arr[i].repeat_ends_on).getDate();
            let endsOnMonth = new Date(arr[i].repeat_ends_on).getMonth();
            let initialEndOnYear = new Date(
              arr[i].repeat_ends_on
            ).getFullYear();

            if (
              (curMonth < endsOnMonth &&
                curYear === initialEndOnYear &&
                curYear === initialStartYear &&
                curMonth === initialStartMonth &&
                curDate > initialStartDate &&
                (curDate - initialStartDate) % arr[i].repeat_every === 0) ||
              (curDate <= endsOnDate &&
                curYear === initialEndOnYear &&
                curYear === initialStartYear &&
                curDate > initialStartDate &&
                curMonth === endsOnMonth &&
                curMonth === initialStartMonth &&
                (curDate - initialStartDate) % arr[i].repeat_every === 0) ||
              (curYear !== initialEndOnYear &&
                curYear === initialStartYear &&
                curMonth === initialStartMonth &&
                curDate > initialStartDate &&
                (curDate - initialStartDate) % arr[i].repeat_every === 0)
            ) {
              tempStartTime.setDate(curDate);
              tempEndTime.setDate(curDate);
            } else if (
              (curYear > initialStartYear &&
                curYear < initialEndOnYear &&
                (new Date(curYear, curMonth, 0).getDate() -
                  initialStartDate +
                  curDate) %
                  arr[i].repeat_every ===
                  0) ||
              (curYear > initialStartYear &&
                curYear === initialEndOnYear &&
                curMonth < endsOnMonth &&
                (new Date(curYear, curMonth, 0).getDate() -
                  initialStartDate +
                  curDate) %
                  arr[i].repeat_every ===
                  0) ||
              (curYear > initialStartYear &&
                curYear === initialEndOnYear &&
                curMonth === endsOnMonth &&
                curDate <= endsOnDate &&
                (new Date(curYear, curMonth, 0).getDate() -
                  initialStartDate +
                  curDate) %
                  arr[i].repeat_every ===
                  0)
            ) {
              tempStartTime.setMonth(curMonth);
              tempEndTime.setMonth(curMonth);
              tempStartTime.setDate(curDate);
              tempEndTime.setDate(curDate);
              tempStartTime.setFullYear(curYear);
              tempEndTime.setFullYear(curYear);
            } else if (
              (curMonth < endsOnMonth &&
                curYear === initialEndOnYear &&
                curYear === initialStartYear &&
                curMonth - initialStartMonth === 1 &&
                (new Date(curYear, curMonth, 0).getDate() -
                  initialStartDate +
                  curDate) %
                  arr[i].repeat_every ===
                  0) ||
              (curMonth < endsOnMonth &&
                curYear === initialEndOnYear &&
                curYear === initialStartYear &&
                curMonth - initialStartMonth > 1 &&
                (new Date(curYear, curMonth, 0).getDate() -
                  initialStartDate +
                  curDate) %
                  arr[i].repeat_every ===
                  0) ||
              (curDate <= endsOnDate &&
                curMonth === endsOnMonth &&
                curMonth > initialStartMonth &&
                curYear === initialEndOnYear &&
                curYear === initialStartYear &&
                (new Date(curYear, curMonth, 0).getDate() -
                  initialStartDate +
                  curDate) %
                  arr[i].repeat_every ===
                  0) ||
              (curYear !== initialEndOnYear &&
                curYear === initialStartYear &&
                curMonth > initialStartMonth &&
                (new Date(curYear, curMonth, 0).getDate() -
                  initialStartDate +
                  curDate) %
                  arr[i].repeat_every ===
                  0)
            ) {
              tempStartTime.setMonth(curMonth);
              tempEndTime.setMonth(curMonth);
              tempStartTime.setDate(curDate);
              tempEndTime.setDate(curDate);
            }
          } else if (arr[i].repeat_ends === "Never") {
            /** doesnt work when going to month with reapting and doesn't work when routine spans multiple days */
            if (
              curYear > initialStartYear &&
              curDate % arr[i].repeat_every === 0
            ) {
              tempStartTime.setMonth(curMonth);
              tempEndTime.setMonth(curMonth);
              tempStartTime.setDate(curDate);
              tempEndTime.setDate(curDate);
              tempStartTime.setFullYear(curYear);
              tempEndTime.setFullYear(curYear);
            } else if (
              curYear === initialStartYear &&
              curMonth - initialStartMonth === 1 &&
              (new Date(curYear, curMonth, 0).getDate() -
                initialStartDate +
                curDate) %
                arr[i].repeat_every ===
                0
            ) {
              tempStartTime.setMonth(curMonth);
              tempEndTime.setMonth(curMonth);
              tempStartTime.setDate(curDate);
              tempEndTime.setDate(curDate);
            } else if (
              curYear === initialStartYear &&
              curMonth - initialStartMonth > 1 &&
              ((new Date(curYear, curMonth, 0).getDate() %
                arr[i].repeat_every) +
                curDate) %
                arr[i].repeat_every ===
                0
            ) {
              tempStartTime.setMonth(curMonth);
              tempEndTime.setMonth(curMonth);
              tempStartTime.setDate(curDate);
              tempEndTime.setDate(curDate);
            } else if (
              curYear === initialStartYear &&
              curMonth === initialStartMonth &&
              curDate > initialStartDate &&
              (curDate - initialStartDate) % arr[i].repeat_every === 0
            ) {
              tempStartTime.setDate(curDate);
              tempEndTime.setDate(curDate);
            }
          }
        }
        /***   Repeat WEEK */
        if (arr[i].repeat_frequency === "WEEK") {
          if (arr[i].repeat_ends === "After") {
            let occurence_dates = [];
            let week_days_arr = [];
            const occurences = parseInt(arr[i].repeat_occurences);
            const repeat_every = parseInt(arr[i].repeat_every);

            const start_day_and_time = arr[i].start_day_and_time.split(" ");
            const initDate = start_day_and_time[1];
            const initMonth = getMonthNumber(start_day_and_time[2]);
            const initYear = start_day_and_time[3];

            let initFullDate = initMonth + "/" + initDate + "/" + initYear;
            //var startdate = "20-03-2014";
            var new_date = moment(initFullDate, "MM/DD/YYYY");
            //var thing = new_date.add(5, "days").format("L");

            for (const day in arr[i].repeat_week_days) {
              if (arr[i].repeat_week_days[day] !== "") {
                week_days_arr.push(day);
              }
            }

            if (week_days_arr.length === 0) {
              for (let i = 0; i < occurences; i++) {
                let moment_init_date = moment(initFullDate);
                let date = moment_init_date
                  .add(i * repeat_every, "weeks")
                  .format("L");
                occurence_dates.push(date);
              }
            } else {
              for (let j = 0; j < week_days_arr.length; j++) {
                let nextDayOfTheWeek = getNextDayOfTheWeek(
                  week_days_arr[j],
                  new_date
                );
                for (let i = 0; i < occurences; i++) {
                  let date = nextDayOfTheWeek
                    .clone()
                    .add(i * repeat_every, "weeks")
                    .format("L");
                  occurence_dates.push(date);
                }
              }
            }

            //console.log("occurence_dates: ", occurence_dates);

            let today_date_object = new Date(curYear, curMonth, curDate);
            let today = getFormattedDate(today_date_object);

            if (occurence_dates.includes(today)) {
              tempStartTime.setMonth(curMonth);
              tempEndTime.setMonth(curMonth);
              tempStartTime.setDate(curDate);
              tempEndTime.setDate(curDate);
              tempStartTime.setFullYear(curYear);
              tempEndTime.setFullYear(curYear);
            }

            ///

            ///
          } else if (arr[i].repeat_ends === "On") {
            let endsOnDate = new Date(arr[i].repeat_ends_on).getDate();
            let endsOnMonth = new Date(arr[i].repeat_ends_on).getMonth();
            let initialEndOnYear = new Date(
              arr[i].repeat_ends_on
            ).getFullYear();
            let initialDayCorrect = false;
            let startWeek = new Date(
              initialStartYear,
              initialStartMonth,
              initialStartDate
            );
            let weekStart = ISO8601_week_no(startWeek);
            let weekNow = new Date(curYear, curMonth, curDate);
            let curWeek = ISO8601_week_no(weekNow);

            if (
              (curYear < initialEndOnYear &&
                curYear > initialStartYear &&
                (curWeek - (53 - weekStart)) % arr[i].repeat_every === 0) || // needs work
              (curYear === initialEndOnYear &&
                curYear !== initialStartYear &&
                curMonth < endsOnMonth &&
                (curWeek - (53 - weekStart)) % arr[i].repeat_every === 0) || // needs work
              (curYear < initialEndOnYear &&
                curYear === initialStartYear &&
                curMonth > initialStartMonth &&
                arr[i].repeat_every === "1") ||
              (curYear < initialEndOnYear &&
                curYear === initialStartYear &&
                curMonth > initialStartMonth &&
                arr[i].repeat_every > 1 &&
                (curWeek - weekStart) % arr[i].repeat_every === 0) ||
              (curYear < initialEndOnYear &&
                curYear === initialStartYear &&
                curMonth === initialStartMonth &&
                curDate >= initialStartDate &&
                arr[i].repeat_every === "1") ||
              (curYear < initialEndOnYear &&
                curYear === initialStartYear &&
                curMonth === initialStartMonth &&
                curDate >= initialStartDate &&
                arr[i].repeat_every > 1 &&
                (curWeek - weekStart) % arr[i].repeat_every === 0) ||
              (curYear === initialEndOnYear &&
                curYear === initialStartYear &&
                curMonth < endsOnMonth &&
                curMonth > initialStartMonth &&
                arr[i].repeat_every === "1") ||
              (curYear === initialEndOnYear &&
                curYear === initialStartYear &&
                curMonth < endsOnMonth &&
                curMonth > initialStartMonth &&
                arr[i].repeat_every > 1 &&
                (curWeek - weekStart) % arr[i].repeat_every === 0) ||
              (curYear === initialEndOnYear &&
                curYear === initialStartYear &&
                curMonth === endsOnMonth &&
                curMonth === initialStartMonth &&
                curDate >= initialStartDate &&
                curDate <= endsOnDate &&
                arr[i].repeat_every === "1") ||
              (curYear === initialEndOnYear &&
                curYear === initialStartYear &&
                curMonth === endsOnMonth &&
                curMonth === initialStartMonth &&
                curDate >= initialStartDate &&
                curDate <= endsOnDate &&
                arr[i].repeat_every > 1 &&
                (curWeek - weekStart) % arr[i].repeat_every === 0) ||
              (curYear === initialEndOnYear &&
                curYear === initialStartYear &&
                curMonth === endsOnMonth &&
                curMonth !== initialStartMonth &&
                curDate <= endsOnDate &&
                arr[i].repeat_every === "1") ||
              (curYear === initialEndOnYear &&
                curYear === initialStartYear &&
                curMonth === endsOnMonth &&
                curMonth !== initialStartMonth &&
                curDate <= endsOnDate &&
                arr[i].repeat_every > 1 &&
                (curWeek - weekStart) % arr[i].repeat_every === 0) ||
              (curYear === initialEndOnYear &&
                curYear === initialStartYear &&
                curMonth === initialStartMonth &&
                curMonth !== endsOnMonth &&
                curDate >= initialStartDate &&
                arr[i].repeat_every === "1") ||
              (curYear === initialEndOnYear &&
                curYear === initialStartYear &&
                curMonth === initialStartMonth &&
                curMonth !== endsOnMonth &&
                curDate >= initialStartDate &&
                arr[i].repeat_every > 1 &&
                (curWeek - weekStart) % arr[i].repeat_every === 0)
            ) {
              Object.keys(arr[i].repeat_week_days).forEach((key) => {
                if (
                  curDate === initialStartDate &&
                  curMonth === initialStartMonth &&
                  curYear === initialStartYear
                ) {
                  if (
                    (arr[i].repeat_week_days[key] === "Sunday" &&
                      new Date(this.props.dateContext).getDay() === 0) ||
                    (arr[i].repeat_week_days[key] === "Monday" &&
                      new Date(this.props.dateContext).getDay() === 1) ||
                    (arr[i].repeat_week_days[key] === "Tuesday" &&
                      new Date(this.props.dateContext).getDay() === 2) ||
                    (arr[i].repeat_week_days[key] === "Wednesday" &&
                      new Date(this.props.dateContext).getDay() === 3) ||
                    (arr[i].repeat_week_days[key] === "Thursday" &&
                      new Date(this.props.dateContext).getDay() === 4) ||
                    (arr[i].repeat_week_days[key] === "Friday" &&
                      new Date(this.props.dateContext).getDay() === 5) ||
                    (arr[i].repeat_week_days[key] === "Saturday" &&
                      new Date(this.props.dateContext).getDay() == 6)
                  ) {
                    initialDayCorrect = true;
                  }
                }

                if (
                  (arr[i].repeat_week_days[key] === "Sunday" &&
                    new Date(this.props.dateContext).getDay() === 0) ||
                  (arr[i].repeat_week_days[key] === "Monday" &&
                    new Date(this.props.dateContext).getDay() === 1) ||
                  (arr[i].repeat_week_days[key] === "Tuesday" &&
                    new Date(this.props.dateContext).getDay() === 2) ||
                  (arr[i].repeat_week_days[key] === "Wednesday" &&
                    new Date(this.props.dateContext).getDay() === 3) ||
                  (arr[i].repeat_week_days[key] === "Thursday" &&
                    new Date(this.props.dateContext).getDay() === 4) ||
                  (arr[i].repeat_week_days[key] === "Friday" &&
                    new Date(this.props.dateContext).getDay() === 5) ||
                  (arr[i].repeat_week_days[key] === "Saturday" &&
                    new Date(this.props.dateContext).getDay() === 6)
                ) {
                  tempStartTime.setMonth(curMonth);
                  tempEndTime.setMonth(curMonth);
                  tempStartTime.setDate(curDate);
                  tempEndTime.setDate(curDate);
                  tempStartTime.setFullYear(curYear);
                  tempEndTime.setFullYear(curYear);
                }
              });

              if (
                !initialDayCorrect &&
                curDate === initialStartDate &&
                curMonth === initialStartMonth &&
                curYear === initialStartYear
              ) {
                tempStartTime.setDate(curDate + 1);
                tempEndTime.setDate(curDate + 1);
              }
            }
          } else if (arr[i].repeat_ends === "Never") {
            //week starts with each monday
            let initialDayCorrect = false;
            let startWeek = new Date(
              initialStartYear,
              initialStartMonth,
              initialStartDate
            );
            let weekStart = ISO8601_week_no(startWeek);
            let weekNow = new Date(curYear, curMonth, curDate);
            let curWeek = ISO8601_week_no(weekNow);

            if (
              (curYear > initialStartYear && arr[i].repeat_every === "1") ||
              (curYear - initialStartYear === 1 &&
                arr[i].repeat_every > 1 &&
                (curWeek - (53 - weekStart)) % arr[i].repeat_every === 0) ||
              (curYear - initialStartYear > 1 &&
                arr[i].repeat_every > 1 &&
                (curWeek - (53 - weekStart)) % arr[i].repeat_every === 0) || //might need fixing
              (curYear === initialStartYear &&
                curMonth > initialStartMonth &&
                (curWeek - weekStart) % arr[i].repeat_every === 0) ||
              (curYear === initialStartYear &&
                curMonth === initialStartMonth &&
                curDate >= initialStartDate &&
                (curWeek - weekStart) % arr[i].repeat_every === 0)
            ) {
              Object.keys(arr[i].repeat_week_days).forEach((key) => {
                if (
                  curDate === initialStartDate &&
                  curMonth === initialStartMonth &&
                  curYear === initialStartYear
                ) {
                  if (
                    (arr[i].repeat_week_days[key] === "Sunday" &&
                      new Date(this.props.dateContext).getDay() === 0) ||
                    (arr[i].repeat_week_days[key] === "Monday" &&
                      new Date(this.props.dateContext).getDay() === 1) ||
                    (arr[i].repeat_week_days[key] === "Tuesday" &&
                      new Date(this.props.dateContext).getDay() === 2) ||
                    (arr[i].repeat_week_days[key] === "Wednesday" &&
                      new Date(this.props.dateContext).getDay() === 3) ||
                    (arr[i].repeat_week_days[key] === "Thursday" &&
                      new Date(this.props.dateContext).getDay() === 4) ||
                    (arr[i].repeat_week_days[key] === "Friday" &&
                      new Date(this.props.dateContext).getDay() === 5) ||
                    (arr[i].repeat_week_days[key] === "Saturday" &&
                      new Date(this.props.dateContext).getDay() == 6)
                  ) {
                    initialDayCorrect = true;
                  }
                }

                if (
                  (arr[i].repeat_week_days[key] === "Sunday" &&
                    new Date(this.props.dateContext).getDay() === 0) ||
                  (arr[i].repeat_week_days[key] === "Monday" &&
                    new Date(this.props.dateContext).getDay() === 1) ||
                  (arr[i].repeat_week_days[key] === "Tuesday" &&
                    new Date(this.props.dateContext).getDay() === 2) ||
                  (arr[i].repeat_week_days[key] === "Wednesday" &&
                    new Date(this.props.dateContext).getDay() === 3) ||
                  (arr[i].repeat_week_days[key] === "Thursday" &&
                    new Date(this.props.dateContext).getDay() === 4) ||
                  (arr[i].repeat_week_days[key] === "Friday" &&
                    new Date(this.props.dateContext).getDay() === 5) ||
                  (arr[i].repeat_week_days[key] === "Saturday" &&
                    new Date(this.props.dateContext).getDay() === 6)
                ) {
                  tempStartTime.setMonth(curMonth);
                  tempEndTime.setMonth(curMonth);
                  tempStartTime.setDate(curDate);
                  tempEndTime.setDate(curDate);
                  tempStartTime.setFullYear(curYear);
                  tempEndTime.setFullYear(curYear);
                }
              });
              if (
                !initialDayCorrect &&
                curDate === initialStartDate &&
                curMonth === initialStartMonth &&
                curYear === initialStartYear
              ) {
                tempStartTime.setDate(curDate + 1);
                tempEndTime.setDate(curDate + 1);
              }
            }
          }
        }
        /** REPEAT MONTH */
        if (arr[i].repeat_frequency === "MONTH") {
          /*** TODO fix if routine goes past 2 years.  */
          if (arr[i].repeat_ends === "After") {
            for (let j = 1; j < arr[i].repeat_occurences; j++) {
              if (
                curDate >= initialStartDate &&
                curDate <= initialEndDate &&
                tempStartTime.getMonth() + j * arr[i].repeat_every ===
                  curMonth &&
                (curMonth - initialStartMonth) % arr[i].repeat_every === 0 &&
                initialStartYear === curYear
              ) {
                tempStartTime.setMonth(curMonth);
                tempEndTime.setMonth(curMonth);
              }
            }
            if (
              curDate >= initialStartDate &&
              curDate <= initialEndDate &&
              curYear > initialStartYear &&
              curYear - initialStartYear === 1 &&
              (curMonth - initialStartMonth) % arr[i].repeat_every === 0
            ) {
              for (
                let k = 0;
                k <
                arr[i].repeat_occurences -
                  Math.floor(
                    (12 - tempStartTime.getMonth()) / arr[i].repeat_every
                  );
                k++
              ) {
                if (
                  k * arr[i].repeat_every -
                    ((12 - tempStartTime.getMonth()) % arr[i].repeat_every) ===
                  curMonth
                ) {
                  tempStartTime.setMonth(curMonth);
                  tempEndTime.setMonth(curMonth);
                  tempStartTime.setFullYear(curYear);
                  tempEndTime.setFullYear(curYear);
                }
              }
            } else if (
              curDate >= initialStartDate &&
              curDate <= initialEndDate &&
              curYear - initialStartYear === 2 &&
              (curMonth - initialStartMonth) % arr[i].repeat_every === 0
            ) {
              for (
                let k = 0;
                k <
                arr[i].repeat_occurences -
                  Math.floor(
                    (12 - tempStartTime.getMonth()) / arr[i].repeat_every
                  ) -
                  Math.floor(12 / arr[i].repeat_every);
                k++
              ) {
                if (
                  k * arr[i].repeat_every -
                    (12 % arr[i].repeat_every) -
                    ((12 - tempStartTime.getMonth()) % arr[i].repeat_every) ===
                  curMonth
                ) {
                  tempStartTime.setMonth(curMonth);
                  tempEndTime.setMonth(curMonth);
                  tempStartTime.setFullYear(curYear);
                  tempEndTime.setFullYear(curYear);
                }
              }
            }
          } else if (arr[i].repeat_ends === "On") {
            let endsOnDate = new Date(arr[i].repeat_ends_on).getDate();
            let endsOnMonth = new Date(arr[i].repeat_ends_on).getMonth();
            let initialEndOnYear = new Date(
              arr[i].repeat_ends_on
            ).getFullYear();
            if (
              initialStartYear === initialEndOnYear &&
              curMonth <= endsOnMonth &&
              curMonth > initialStartMonth &&
              curDate >= initialStartDate &&
              curDate <= initialEndDate &&
              curYear === initialStartYear &&
              (curMonth - initialStartMonth) % arr[i].repeat_every === 0
            ) {
              if (endsOnMonth === curMonth) {
                if (endsOnDate >= initialStartDate) {
                  tempStartTime.setMonth(curMonth);
                  tempEndTime.setMonth(curMonth);
                }
              } else {
                tempStartTime.setMonth(curMonth);
                tempEndTime.setMonth(curMonth);
              }
            } else if (
              initialStartYear !== initialEndOnYear &&
              curDate >= initialStartDate &&
              curDate <= initialEndDate &&
              curYear > initialStartYear &&
              curYear < initialEndOnYear &&
              (curMonth - initialStartMonth) % arr[i].repeat_every === 0
            ) {
              if (endsOnMonth === curMonth) {
                if (endsOnDate >= initialStartDate) {
                  tempStartTime.setMonth(curMonth);
                  tempEndTime.setMonth(curMonth);
                  tempStartTime.setFullYear(curYear);
                  tempEndTime.setFullYear(curYear);
                }
              } else {
                tempStartTime.setMonth(curMonth);
                tempEndTime.setMonth(curMonth);
                tempStartTime.setFullYear(curYear);
                tempEndTime.setFullYear(curYear);
              }
            } else if (
              initialStartYear !== initialEndOnYear &&
              curMonth <= endsOnMonth &&
              curDate >= initialStartDate &&
              curDate <= initialEndDate &&
              curYear === initialEndOnYear &&
              (curMonth - initialStartMonth) % arr[i].repeat_every === 0
            ) {
              if (endsOnMonth === curMonth) {
                if (endsOnDate >= initialStartDate) {
                  tempStartTime.setMonth(curMonth);
                  tempEndTime.setMonth(curMonth);
                  tempStartTime.setFullYear(curYear);
                  tempEndTime.setFullYear(curYear);
                }
              } else {
                tempStartTime.setMonth(curMonth);
                tempEndTime.setMonth(curMonth);
                tempStartTime.setFullYear(curYear);
                tempEndTime.setFullYear(curYear);
              }
            } else if (
              initialStartYear !== initialEndOnYear &&
              curMonth > initialStartMonth &&
              curDate >= initialStartDate &&
              curDate <= initialEndDate &&
              curYear === initialStartYear &&
              (curMonth - initialStartMonth) % arr[i].repeat_every === 0
            ) {
              if (endsOnMonth === curMonth) {
                if (endsOnDate >= initialStartDate) {
                  tempStartTime.setMonth(curMonth);
                  tempEndTime.setMonth(curMonth);
                }
              } else {
                tempStartTime.setMonth(curMonth);
                tempEndTime.setMonth(curMonth);
              }
            }
          } else if (arr[i].repeat_ends === "Never") {
            if (
              curDate >= initialStartDate &&
              curDate <= initialEndDate &&
              curYear > initialStartYear &&
              (curMonth - initialStartMonth) % arr[i].repeat_every === 0
            ) {
              tempStartTime.setMonth(curMonth);
              tempEndTime.setMonth(curMonth);
              tempStartTime.setFullYear(curYear);
              tempEndTime.setFullYear(curYear);
            } else if (
              curDate >= initialStartDate &&
              curDate <= initialEndDate &&
              curMonth > initialStartMonth &&
              curYear === initialStartYear &&
              (curMonth - initialStartMonth) % arr[i].repeat_every === 0
            ) {
              tempStartTime.setMonth(curMonth);
              tempEndTime.setMonth(curMonth);
            }
          }
        }

        /** REPEAT YEAR */
        if (arr[i].repeat_frequency === "YEAR") {
          if (arr[i].repeat_ends === "After") {
            for (let j = 1; j < arr[i].repeat_occurences; j++) {
              if (
                curDate >= initialStartDate &&
                curDate <= initialEndDate &&
                curMonth >= tempStartTime.getMonth() &&
                curMonth <= tempEndTime.getMonth() &&
                tempStartTime.getFullYear() + j * arr[i].repeat_every ===
                  curYear &&
                (curYear - initialStartYear) % arr[i].repeat_every === 0
              ) {
                tempStartTime.setFullYear(curYear);
                tempEndTime.setFullYear(curYear);
              }
            }
          }
          if (arr[i].repeat_ends === "On") {
            let endsOnDate = new Date(arr[i].repeat_ends_on).getDate();
            let endsOnMonth = new Date(arr[i].repeat_ends_on).getMonth();
            let initialEndOnYear = new Date(
              arr[i].repeat_ends_on
            ).getFullYear();
            if (
              curYear <= initialEndOnYear &&
              curYear > initialStartYear &&
              curDate >= initialStartDate &&
              curDate <= initialEndDate &&
              curMonth === initialStartMonth &&
              (curYear - initialStartYear) % arr[i].repeat_every === 0
            ) {
              if (initialEndOnYear === curYear) {
                if (endsOnMonth === initialStartMonth) {
                  if (endsOnDate >= initialStartDate) {
                    tempStartTime.setFullYear(curYear);
                    tempEndTime.setFullYear(curYear);
                  }
                } else if (endsOnMonth > initialStartMonth) {
                  tempStartTime.setFullYear(curYear);
                  tempEndTime.setFullYear(curYear);
                }
              } else {
                tempStartTime.setFullYear(curYear);
                tempEndTime.setFullYear(curYear);
              }
            }
          } else if (arr[i].repeat_ends === "Never") {
            if (
              curDate >= initialStartDate &&
              curDate <= initialEndDate &&
              curMonth === initialStartMonth &&
              curYear > initialStartYear &&
              (curYear - initialStartYear) % arr[i].repeat_every === 0
            ) {
              tempStartTime.setFullYear(curYear);
              tempEndTime.setFullYear(curYear);
            }
          }
        }
      }

      //***   Firbase boolean varibale to help mobile side know if to display routine */
      let checkCurDate = moment();

      // console.log("this si the moment ",checkCurDate );

      if (
        checkCurDate.date() === curDate &&
        checkCurDate.month() === curMonth &&
        checkCurDate.year() === curYear &&
        ((tempStartTime.getDate() === curDate &&
          curMonth <= tempEndTime.getMonth() &&
          curMonth >= tempStartTime.getMonth() &&
          curYear <= tempEndTime.getFullYear() &&
          curYear >= tempStartTime.getFullYear()) ||
          (tempEndTime.getDate() === curDate &&
            curMonth <= tempEndTime.getMonth() &&
            curMonth >= tempStartTime.getMonth() &&
            curYear <= tempEndTime.getFullYear() &&
            curYear >= tempStartTime.getFullYear()) ||
          (tempStartTime.getDate() < curDate &&
            tempEndTime.getDate() > curDate &&
            curMonth <= tempEndTime.getMonth() &&
            curMonth >= tempStartTime.getMonth() &&
            curYear <= tempEndTime.getFullYear() &&
            curYear >= tempStartTime.getFullYear()))
      ) {
        if (arr[i].is_displayed_today !== (true || "1")) {
          arr[i].is_displayed_today = true;
          let newArr = this.props.originalGoalsAndRoutineArr;
          newArr[this.props.routine_ids[i]].is_displayed_today = true;
          firebase
            .firestore()
            .collection("users")
            .doc(this.props.theCurrentUserId)
            .update({ "goals&routines": newArr });
        }
      } else if (
        checkCurDate.date() === curDate &&
        checkCurDate.month() === curMonth &&
        checkCurDate.year() === curYear
      ) {
        // console.log("does it go here");
        if (arr[i].is_displayed_today === (true || "1")) {
          arr[i].is_displayed_today = false;
          let newArr = this.props.originalGoalsAndRoutineArr;
          newArr[this.props.routine_ids[i]].is_displayed_today = false;
          firebase
            .firestore()
            .collection("users")
            .doc(this.props.theCurrentUserId)
            .update({ "goals&routines": newArr });
        }
      }

      /**
       * TODO: add the case where arr[i].start.dateTime doesn't exists
       */

      if (
        tempStartTime.getDate() === curDate &&
        curMonth <= tempEndTime.getMonth() &&
        curMonth >= tempStartTime.getMonth() &&
        curYear <= tempEndTime.getFullYear() &&
        curYear >= tempStartTime.getFullYear()
      ) {
        if (tempStartTime.getHours() === hour) {
          if (tempStartTime.getDate() !== tempEndTime.getDate()) {
            let minsToMarginTop =
              (tempStartTime.getMinutes() / 60) *
              this.state.pxPerHourForConversion;
            let hourDiff = 24 - tempStartTime.getHours();
            let minDiff = 0;
            let color = "lavender";
            let height =
              (hourDiff + minDiff) * this.state.pxPerHourForConversion;
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
                  onClick={this.RoutineClicked}
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
              (tempStartTime.getMinutes() / 60) *
              this.state.pxPerHourForConversion;
            let hourDiff = tempEndTime.getHours() - tempStartTime.getHours();
            let minDiff = tempEndTime.getMinutes() / 60;
            let height =
              (hourDiff + minDiff) * this.state.pxPerHourForConversion;
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
              }
            }

            if (sameTimeEventCount > 1) {
              addmarginLeft += 20;
              itemWidth = itemWidth - 20;
            }

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
                  e.target.style.zIndex = "2";
                }}
                onMouseOut={(e) => {
                  e.target.style.zIndex = "1";
                  e.target.style.color = "#000000";
                  e.target.style.border = "1px lightgray solid";
                  e.target.style.background = color;
                }}
                onClick={this.RoutineClicked}
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
      } else if (
        hour === 0 &&
        tempEndTime.getDate() === curDate &&
        curMonth <= tempEndTime.getMonth() &&
        curMonth >= tempStartTime.getMonth() &&
        curYear <= tempEndTime.getFullYear() &&
        curYear >= tempStartTime.getFullYear()
      ) {
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
              onClick={this.RoutineClicked}
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
        tempEndTime.getDate() > curDate &&
        curMonth <= tempEndTime.getMonth() &&
        curMonth >= tempStartTime.getMonth() &&
        curYear <= tempEndTime.getFullYear() &&
        curYear >= tempStartTime.getFullYear()
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
              onClick={this.RoutineClicked}
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
  };

  /**
   * dayViewItems: goes through hours 0 to 24, and calling getEventItem for each hour
   */
  dayViewItems = () => {
    // this creates the events adjusting their div size to reflecting the time it's slotted for
    var arr = [];
    for (let i = 0; i < 24; ++i) {
      arr.push(
        <Row key={"dayRoutine" + i} style={{ position: "relative" }}>
          <Col
            style={{
              position: "relative",
              borderTop: "1px solid mistyrose",
              width: "180px",
              background: "aliceblue",
              height: this.state.pxPerHour,
            }}
          >
            {this.getEventItem(i)}
          </Col>
        </Row>
      );
    }
    return arr;
  };

  render() {
    return (
      <div
        style={{
          padding: "20px",
          width: "300px",
          borderRadius: "20px",
        }}
      >
        Today's Routines:
        <Container style={{}}>
          <Row>
            <Col>
              <Container style={{ margin: "0", padding: "0" }}>
                {this.dayViewItems()}
              </Container>
            </Col>
          </Row>
        </Container>
      </div>
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
    // console.log("from getNextday", nextDayOfTheWeek.format("L"));
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
