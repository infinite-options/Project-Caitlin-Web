import React from 'react';
import { Modal, Button, Form,Row,Col} from "react-bootstrap";


class EventBeforeChecked extends React.Component{
    render(){
        console.log("I am in the component");
        return (
            <div> <Row  style = {{marginLeft:"10px"}}>
             <Col>
                   
                    <Form.Control

                      type="number"
                      placeholder="30"
                    />
                  </Col>
                  <Col>
                   
                    <Form.Text style={{fontSize:"8.7px"}}> Minutes Before Start Time </Form.Text>{" "}
                  </Col>
        </Row></div>
        );
    }
}

export default EventBeforeChecked;