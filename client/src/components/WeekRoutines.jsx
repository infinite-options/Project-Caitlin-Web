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

  sortRoutines = () => {
    var arr = this.props.routines;
    var dic = {}
    let startObject = this.props.dateContext.clone();
    let endObject = this.props.dateContext.clone();
    let startDay = startObject.startOf("week");
    let endDay = endObject.endOf("week");
    let startDate = new Date(startDay.format("MM/DD/YYYY"));
    let endDate = new Date(endDay.format("MM/DD/YYYY"));
    startDate.setHours(0, 0, 0);
    endDate.setHours(23, 59, 59);
    for (let i = 0; i < arr.length; i++) {
      let tempStart = arr[i].start_day_and_time;
      let tempEnd = arr[i].end_day_and_time;
      let tempStartTime = new Date(new Date(tempStart).toLocaleString('en-US', {
        timeZone: this.props.timeZone
      }));
      let repeatOccurences = parseInt(arr[i]["repeat_occurences"]);
      let repeatEvery = parseInt(arr[i]["repeat_every"]);
      let repeatEnds = arr[i]["repeat_ends"];
      let repeatEndsOn = new Date(new Date(arr[i]["repeat_ends_on"]).toLocaleString('en-US', {
        timeZone: this.props.timeZone
      }));
      repeatEndsOn.setHours(0,0,0,0);
      let repeatFrequency = arr[i]["repeat_frequency"];
      let repeatWeekDays = [];
      if (arr[i]["repeat_week_days"] != null) {
        Object.keys(arr[i]["repeat_week_days"])
        .forEach( (k) => {
          if (arr[i]["repeat_week_days"][k] != "") {
            repeatWeekDays.push(parseInt(k));
          }
        });
      }
      // console.log(
      //   arr[i].repeat, repeatOccurences, repeatEvery, repeatEnds, repeatEndsOn, repeatFrequency, repeatWeekDays
      // )
      if (!arr[i].repeat){
        if (tempStartTime >= startDate && tempStartTime <= endDate) {
          let key = tempStartTime.getDay()+"_"+tempStartTime.getHours();
          if (dic[key] == null) {
            dic[key] = [];
          }
          dic[key].push(arr[i]);
        }
      } else {
        for (let j=0; j<7; j++) {
          let CurrentDate = new Date(startDate);
          let isDisplayedTodayCalculated = false;

          CurrentDate.setDate(CurrentDate.getDate()+j);
          if (CurrentDate >= startDate) {
            if (repeatEnds == "On") {
            } else if (repeatEnds == "After") {
              if (repeatFrequency == "DAY") {
                repeatEndsOn = new Date(startDate);
                repeatEndsOn.setDate(startDate.getDate() + (repeatOccurences-1)*repeatEvery);
              } else if (repeatFrequency == "WEEK"){
                repeatEndsOn = new Date(startDate);
                repeatEndsOn.setDate(startDate.getDate() + (repeatOccurences-1)*7*repeatEvery);
              } else if (repeatFrequency == "MONTH"){
                repeatEndsOn = new Date(startDate);
                repeatEndsOn.setMonth(startDate.getMonth() + (repeatOccurences-1)*repeatEvery);
              } else if (repeatFrequency == "YEAR"){
                repeatEndsOn = new Date(startDate);
                repeatEndsOn.setFullYear(startDate.getFullYear() + (repeatOccurences-1)*repeatEvery);
              }
            } else if (repeatEnds == "Never") {
              repeatEndsOn = CurrentDate;
            }

            if (CurrentDate <= repeatEndsOn) {
              if (repeatFrequency == "DAY") {
                isDisplayedTodayCalculated = Math.floor((CurrentDate.getTime() - startDate.getTime())/(24*3600*1000)) % repeatEvery == 0;
              } else if (repeatFrequency == "WEEK"){
                // isDisplayedTodayCalculated = repeatWeekDays.includes(CurrentDate.getDay()) && Math.floor((CurrentDate.getTime() - startDate.getTime())/(7*24*3600*1000)) % repeatEvery == 0;
                isDisplayedTodayCalculated = repeatWeekDays.includes(CurrentDate.getDay()) &&
                Math.floor(
                  (CurrentDate.getTime() - startDate.getTime()) /
                  (7 * 24 * 3600 * 1000)
                ) % repeatEvery == 0;
              } else if (repeatFrequency == "MONTH"){
                isDisplayedTodayCalculated = (CurrentDate.getDate() == startDate.getDate()) &&
                ((CurrentDate.getFullYear() - startDate.getFullYear())*12 + CurrentDate.getMonth() - startDate.getMonth()) % repeatEvery == 0;
              } else if (repeatFrequency == "YEAR"){
                isDisplayedTodayCalculated = (startDate.getDate() == CurrentDate.getDate()) &&
                (CurrentDate.getMonth() == startDate.getMonth()) &&
                (CurrentDate.getFullYear() - startDate.getFullYear()) % repeatEvery == 0;
              }
            }
          }
          if (isDisplayedTodayCalculated) {
            let key = j+"_"+tempStartTime.getHours();
            if (dic[key] == null) {
              dic[key] = [];
            }
            dic[key].push(arr[i]);
          }
        }
      }
    }
    return dic;
  }

  getRoutineItemFromDic = (day, hour, dic) => {
    let startObject = this.props.dateContext.clone();
    let startDay = startObject.startOf("week");
    let curDate2 = startDay.clone();
    curDate2.add(day, "days");
    var res = [];
    var tempStart = null;
    var tempEnd = null;
    var arr = dic[day+'_'+hour];
    var sameTimeEventCount = 0;
    var addmarginLeft = 0;
    let itemWidth = this.state.eventBoxSize;
    var fontSize = 10;
    if (arr == null) {
      return;
    }
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

              let occurence_dates = [];

              const start_day_and_time = arr[i].start_day_and_time.split(
                " "
              )[0];
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

      arr[i].is_displayed_today = arr[i].is_displayed_today || isDisplayedTodayCalculated;

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
    var arr = this.props.routines;
    let dic = this.sortRoutines();
    for (let i = 0; i < arr.length; i++) {
      arr[i].is_displayed_today = false;
    }
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
                {this.getRoutineItemFromDic(i, j, dic)}
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
