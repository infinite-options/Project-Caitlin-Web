import React from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExpandAlt
} from "@fortawesome/free-solid-svg-icons";
import { Row, Col } from "react-bootstrap";

export default class TylersCalendarv1 extends React.Component {


  componentDidMount() {
  }

  weekdays = moment.weekdays();
  weekdaysShort = moment.weekdaysShort(); // ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  componentWillUnmount() {

  }

  year = () => {
    return this.props.dateContext.format("Y");
  }
  currentDay = () => {
    return this.props.dateObject.format("D");
  };
  month = () => {
    return this.props.dateContext.format("MMMM");
  }

  daysInMonth = () => {
    return this.props.dateContext.daysInMonth();
  }
  firstDayOfMonth = () => {
    let dateContext = this.props.dateContext;
    let firstDay = moment(dateContext)
      .startOf("month")
      .format("d"); // Day of week 0...1..5...6
    return firstDay;
  };

  //Returns a dense populated set of icons to be pushed onto a day i
  //into the table
  getEventsforDay = (i) => {
    var res = [];
    var tempStart = null;
    var tempEnd = null;
    if (this.props.originalEvents == null) {
      return []
    }
    // console.log(this.props.originalEvents);
    for (let j = 0; j < this.props.originalEvents.length; ++j) {
      if (this.props.originalEvents[j].start.dateTime) {
        tempStart = this.props.originalEvents[j].start.dateTime;
        tempEnd = this.props.originalEvents[j].end.dateTime;
        let startDate = new Date(tempStart).getDate();
        let endDate = new Date(tempEnd).getDate();
        // console.log(startDate)
        if (i >= startDate && i <= endDate) {
          res.push(<div key={'event' + j}><button
            value={j}
            onClick={this.onEventClick}
            className="btn btn-sm" style={{
              padding: '3px',
              paddingLeft: '4px',
              paddingRight: '4px',
              fontSize: '9px', color: "white",
              borderRadius: '4px', background: "rgb(66, 184, 221)",
              textShadow: "0 1px 1px rgba(0, 0, 0, 0.2)", marginBottom: "3px"
            }} >{this.props.originalEvents[j].summary}</button><br /></div>);
        }
      }
      else {
        tempStart = this.props.originalEvents[j].start.date;
        // console.log('start date');
        // console.log(this.props.originalEvents[j].start.date);
        tempEnd = this.props.originalEvents[j].end.date;
        let startDate = new Date(tempStart).getDate();
        let endDate = new Date(tempEnd).getDate();
        // console.log(startDate)
        if (i > startDate && i <= endDate) {
          // console.log('sss' + i, startDate, endDate);
          res.push(<div key={'event' + j}><button
            value={j}
            onClick={this.onEventClick}
            className="btn btn-sm" style={{
              padding: '3px',
              paddingLeft: '4px',
              paddingRight: '4px',
              fontSize: '9px', color: "white",
              borderRadius: '3px', background: "CornflowerBlue",
              textShadow: "0 1px 1px rgba(0, 0, 0, 0.2), ", marginBottom: "3px"
            }} >{this.props.originalEvents[j].summary}</button><br /></div>);
        }
      }

    }
    return res;
  }

  onEventClick = (x) => {
    x.stopPropagation();
    this.props.eventClick(x.target.value);
  }

  onDayClick = (d) => {
    this.props.handleDateClick(this.props.dateContext.format("M") + '/' + d + '/' + this.props.dateContext.format("Y"));
  }

  onExpandClick = (d) => {
    this.props.handleExpandClick(this.props.dateContext.format("M") + '/' + d + '/' + this.props.dateContext.format("Y"));
  }

  render() {
    let daysInMonth = [];
    let weekdays = this.weekdays.map((day) => {
      return (
        <td className="fancytext" key={day}>{day}</td>
      )
    });

    //create the blank slots to push day 1 to right day
    let blanks = [];


    for (let i = 0; i < this.firstDayOfMonth(); i++) {
      blanks.push(<td key={'empty' + i} className="calendar-day empty">{""}</td>);
    }


    //The variable below tells us if the current month we are at is today's month
    var sameDate = this.props.dateObject.format("DD/MM/YYYY") === this.props.dateContext.format("DD/MM/YYYY");
    // console.log(this.props.dateObject.format("DD/MM/YYYY") + "  == " + this.props.dateContext.format("DD/MM/YYYY"));
    for (var d = 1; d <= this.daysInMonth(); d++) {
      // let currentDay = d == this.currentDay() ? "today" : "";

      // const todayStyle = { boxShadow: '4px 4px 8px 4px rgba(0, 0, 0, 0.2)' };

      daysInMonth.push(
        <td key={d} onClick={this.onDayClick.bind(this, d)}>
          <div style={{ padding: '0', margin: '0', height: '110px', width: "100px", overflow: 'auto' }}>
            {
              // eslint-disable-next-line max-len
            }
            <div >
              <Row>
                <Col>
                  <div className={(sameDate && (d === parseInt(this.currentDay(), 10))) ? "numberCircle" : ""} >
                    <span className="fancytext"> {d} </span>
                  </div>
                </Col>
                <Col>
                  <FontAwesomeIcon
                    style={{ 'marginLeft': '60%' }}
                    icon={faExpandAlt}
                    size="sm"
                    className="X"
                    onClick={this.onExpandClick.bind(this, d)}
                  />
                </Col>
              </Row>
            </div>
            {this.getEventsforDay(d)}
          </div>
        </td>
      );
    }

    var totalSlots = [...blanks, ...daysInMonth];
    let rows = [];
    let cells = [];

    totalSlots.forEach((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
      if (i === totalSlots.length - 1) {
        // let insertRow = cells.slice();
        rows.push(cells);
      }
    });

    var daysinmonth = rows.map((data, i) => {
      return <tr style={{ padding: '0px' }} key={i * 11}>{data}</tr>;
    });

    return (
      <div>
        <table className="table" style={{ height: '450px', tableLayout: 'fixed', width: '910px' }}>
          <thead>
            <tr>
              {weekdays}
            </tr>
          </thead>
          <tbody style={{ height: '450px', width: '600px' }}>
            {daysinmonth}
          </tbody>
        </table>
      </div>
    )
  }

}