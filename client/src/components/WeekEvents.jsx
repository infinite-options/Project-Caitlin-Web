import React, { Component } from 'react'
import moment from 'moment';
import {
     Container, Row, Col
} from 'react-bootstrap';

export default class WeekEvents extends Component {
  constructor(props) {
      super(props);
      // console.log(this.props.dateContext);
      this.state = {
          dayEvents: [], //holds google events data for a single day
          todayDateObject: moment("03/07/2020"), //this is the date of interset for events to be displaye
          pxPerHour: "30px", //preset size for all columns
          pxPerHourForConversion: 30, // if pxPerHour is change, this should change to reflect it
          zIndex: 1, //thought i needed to increment zIndex for div overlaps but seems to be fine being at 1 for all divs
          eventBoxSize: 130, //width size for event box
          marginFromLeft: 0
      }
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
              <Container>
                <Row key={"weekEvent" + i + j} style={{ position: "relative"}}>
                  <Col
                      style={{
                          position: "relative",
                          borderTop: "1px solid lavender",
                          background: "aliceblue",
                          height: this.state.pxPerHour,
                      }}
                  >
                      {i} {j}
                  </Col >
                </Row>
              </Container>
            );
          }
        res.push(
          <Col>
            {arr}
          </Col>
        );
      }
      return res;
  }

 render() {
    let weekdays = moment.weekdays().map((day) => {
      return (
        <Col className="fancytext">{day}</Col>
      )
    });
     return (
         <Container style={{ height: 'auto', width: '1000px'}}>
           <Row>
             Events
           </Row>
           <Row>
             <Col className="fancytext">Time</Col>
             {weekdays}
           </Row>
           <Row style={{ width: 'auto', height: "300px", overflowX: "visible", overflowY: "scroll"}}>
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
