import React from 'react';
import moment from 'moment';

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

  sortEvents = () => {
    var arr = this.props.originalEvents;
    var dic = {}
    for (let i = 0; i < arr.length; i++) {
        let tempStart = arr[i].start.dateTime;
        let tempStartTime = new Date(new Date(tempStart).toLocaleString('en-US', {
          timeZone: this.props.timeZone
        }));
        let key = tempStartTime.getDate()+"_";
        if (dic[key] == null) {
          dic[key] = [];
        }
        dic[key].push(arr[i]);
    }
    return dic;
  }

  getEventsforDay = (i, dic) => {
    var res = [];
    var tempStart = null;
    var tempEnd = null;
    var arr = dic[i+"_"];
    if (arr == null) {
      return []
    }
    // console.log(this.props.originalEvents);
    for (let j = 0; j < arr.length; ++j) {
      if (arr[j].start.dateTime) {
        tempStart = arr[j].start.dateTime;
        tempEnd = arr[j].end.dateTime;
        let startDate = new Date(new Date(tempStart).toLocaleString('en-US', {
          timeZone: this.props.timeZone
        })).getDate();
        let endDate = new Date(new Date(tempEnd).toLocaleString('en-US', {
          timeZone: this.props.timeZone
        })).getDate();

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
              borderRadius: '4px', background: "#42B8DD",
              textShadow: "0 1px 1px rgba(0, 0, 0, 0.2)", marginBottom: "3px"
            }} >{arr[j].summary}</button><br /></div>);
        }
      }
      else {
        tempStart = arr[j].start.date;
        // console.log('start date');
        // console.log(this.props.originalEvents[j].start.date);
        tempEnd = arr[j].end.date;
        let startDate = new Date(new Date(tempStart).toLocaleString('en-US', {
          timeZone: this.props.timeZone
        })).getDate();
        let endDate = new Date(new Date(tempEnd).toLocaleString('en-US', {
          timeZone: this.props.timeZone
        })).getDate();
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
            }} >{arr[j].summary}</button><br /></div>);
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
    var sameDate = this.props.dateObject.format("MM/YYYY") === this.props.dateContext.format("MM/YYYY");

    // console.log(this.props.dateObject.format("DD/MM/YYYY") + "  == " + this.props.dateContext.format("DD/MM/YYYY"));
    for (var d = 1; d <= this.daysInMonth(); d++) {
      let dic = this.sortEvents();
      daysInMonth.push(
        <td key={d} onClick={this.onDayClick.bind(this, d)}>
          <div style={{ padding: '0', margin: '0', height: '110px', width: "100px", overflow: 'auto' }}>
            {
              // eslint-disable-next-line max-len
            }
              <div className={(sameDate && (d === parseInt(this.currentDay(), 10))) ? "numberCircleCurrent" : "numberCircle"} onClick={this.onExpandClick.bind(this, d)}>
                <a className="fancytext"> {d} </a>
              </div>
            {this.getEventsforDay(d, dic)}
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
