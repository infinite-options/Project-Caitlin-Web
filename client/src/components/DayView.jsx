import React from 'react';
import './DayView.css';


const DayView = (props) => {
    console.log(props.originalEvents);
    console.log("this is here");
    console.log(props.originalEvents[0]);
    return(
         
        <div>
            {/* {props.originalEvents[0].summary} */}
            <h2 style = {{textAlign:"center"}}> Sat 29 </h2>
            <table style = {{width: "100%", marginLeft: "20px"}}>
            <tr style = {{width: "50px", height: "100px"}}>
                <th style= {{width:"100px"}}>GMT-08</th>
                <th>Events</th>
                <th>Routines</th>
                <th>Goals</th>
            </tr>
            <tr style = {{width: "50px", height: "100px"}}>
                <td>8:00 am</td>
               
                <td>
                    {/* <hr />  */}
                    {/* {this.props.originalEvents[0].summary}} */}
                    {/* {props.originalEvents.length} */}
                
                 </td>
                <td><hr/></td>
                <td><hr/></td>
            
            </tr>
            {/* <hr  style = {{width:"100%"}}/> */}
            <tr style = {{width: "50px", height: "100px"}}>
                <td>9:00 am</td>
                <td><hr/></td>
                <td><hr/></td>
                <td><hr/></td>
            </tr>
            {/* <hr  style = {{width:"100%"}}/> */}
            <tr style = {{width: "50px", height: "100px"}}>
                <td>10:00 am</td>
                <td><hr/></td>
                <td><hr/></td>
                <td><hr/></td>
            </tr>
            {/* <hr  style = {{width:"100%"}}/> */}
            <tr style = {{width: "50px", height: "100px"}}>
                <td>11:00 am</td>
                <td><hr/></td>
                <td><hr/></td>
                <td><hr/></td>
            </tr>
            {/* <hr  style = {{width:"100%"}}/> */}
            <tr style = {{width: "50px", height: "100px"}}>
                <td>12:00 pm</td>
                <td><hr/></td>
                <td><hr/></td>
                <td><hr/></td>
            </tr>
            {/* <hr  style = {{width:"100%"}}/> */}
            <tr style = {{width: "50px", height: "100px"}}>
                <td>1:00 pm</td>
                <td><hr/></td>
                <td><hr/></td>
                <td><hr/></td>
            </tr>
            {/* <hr  style = {{width:"100%"}}/> */}
            <tr style = {{width: "50px", height: "100px"}}>
                <td>2:00 pm</td>
                <td><hr/></td>
                <td><hr/></td>
                <td><hr/></td>
            </tr>
            {/* <hr  style = {{width:"100%"}}/> */}
            <tr style = {{width: "50px", height: "100px"}}>
                <td>3:00 pm</td>
                <td><hr/></td>
                <td><hr/></td>
                <td><hr/></td>
            </tr>
            {/* <hr  style = {{width:"100%"}}/> */}
            <tr style = {{width: "50px", height: "100px"}}>
                <td>4:00 pm</td>
                <td><hr/></td>
                <td><hr/></td>
                <td><hr/></td>
            </tr>
            {/* <hr  style = {{width:"100%"}}/> */}
            <tr style = {{width: "50px", height: "100px"}}>
                <td>5:00 pm</td>
                <td><hr/></td>
                <td><hr/></td>
                <td><hr/></td>
            </tr>
            {/* <hr  style = {{width:"100%"}}/> */}
            <tr style = {{width: "50px", height: "100px"}}>
                <td>6:00 pm</td>
                <td><hr/></td>
                <td><hr/></td>
                <td><hr/></td>
            </tr>
            {/* <hr  style = {{width:"100%"}}/> */}
            <tr style = {{width: "50px", height: "100px"}}>
                <td>7:00 pm</td>
                <td><hr/></td>
                <td><hr/></td>
                <td><hr/></td>
            </tr>
            {/* <hr  style = {{width:"100%"}}/> */}
            <tr style = {{width: "50px", height: "100px"}}>
                <td>8:00 pm</td>
                <td><hr/></td>
                <td><hr/></td>
                <td><hr/></td>
            </tr>
            {/* <hr  style = {{width:"100%"}}/> */}
            <tr style = {{width: "50px", height: "100px"}}>
                <td>9:00 pm</td>
                <td><hr/></td>
                <td><hr/></td>
                <td><hr/></td>
            </tr>
            {/* <hr  style = {{width:"100%"}}/> */}
            <tr style = {{width: "50px", height: "100px"}}>
                <td>10:00 pm</td>
                <td><hr/></td>
                <td><hr/></td>
                <td><hr/></td>
            </tr>
            {/* <hr  style = {{width:"100%"}}/> */}
            <tr style = {{width: "50px", height: "100px"}}>
                <td>11:00 pm</td>
                <td><hr/></td>
                <td><hr/></td>
                <td><hr/></td>
            </tr>
            {/* <hr  style = {{width:"100%"}}/> */}
            <tr style = {{width: "50px", height: "100px"}}>
                <td>12:00 am</td>
                <td><hr/></td>
                <td><hr/></td>
                <td><hr/></td>
            </tr>

            </table>
        </div>

    );
}

export default DayView;