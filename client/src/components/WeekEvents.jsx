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
          pxPerHour: "30px", //preset size for all columns
          pxPerHourForConversion: 30, // if pxPerHour is change, this should change to reflect it
          zIndex: 1, //thought i needed to increment zIndex for div overlaps but seems to be fine being at 1 for all divs
          eventBoxSize: 150, //width size for event box
          marginFromLeft: 0
      }
  }

  weekdays = moment.weekdays();

 render() {
     return (
         <Row>
          {this.weekdays}
         </Row>
     )
 }
}
