import React from 'react';
import { Form,Row,Col} from "react-bootstrap";


class ShowNotifications extends React.Component{
    render(){
        console.log("I am in the component");
        return (
            <div> 
                <Form.Group controlId="Notification">
                <Row>
                  <Col style = {{paddingRight: "0px" }}>
                    <Form.Control
                      type="number"
                      placeholder="5"
                      style = {{width:"70px", marginTop:".25rem"}}
                    />
                  </Col>
                  <Col xs={8} style = {{paddingLeft:"0px"}}>
                    <Form.Text style = {{fontSize:"65%"}}> Min Before Start Time</Form.Text>
                  </Col>
                </Row>
                <Row style = {{ marginTop:"15px"}}>
                  <Col style = {{paddingRight: "0px"}}>
                  <Form.Text style = {{fontSize:"65%"}}> Caitlin</Form.Text>
                  </Col>
                  <Col xs={8}>
                    <Form.Check type="checkbox" style={{paddingLeft: "0px"}}>
                      <Form.Check.Input
                        type="checkbox"
                        style={{ width: "20px", height: "20px" }}
                      />
           
                      <Form.Control
                        as="textarea"
                        rows="1"
                        type="text"
                        placeholder="Enter Message"
                        style={{marginLeft: "10px"}}
                      />
                    </Form.Check>
                  </Col>
                </Row>
                <Row style = {{marginTop:"10px"}}>
                  <Col style = {{paddingRight: "0px"}}>
                  <Form.Text style = {{fontSize:"65%"}}> TA</Form.Text>
                  </Col>
                  <Col xs={8}>
                    <Form.Check type="checkbox" style={{paddingLeft: "0px"}}>
                      <Form.Check.Input
                        type="checkbox"
                        style={{ width: "20px", height: "20px" }}
                      />
                      <Form.Control
                        as="textarea"
                        rows="1"
                        type="text"
                        placeholder="Enter Message"
                        style={{marginLeft: "10px"}}
                      />
                    </Form.Check>
                  </Col>
                </Row>
                <Row style = {{marginTop:"10px"}}>
                  <Col style = {{paddingRight: "0px" }}>
                    <Form.Control
                      // value={this.state.newEventNotification}
                      // onChange={this.handleNotificationChange}
                      type="number"
                      placeholder="30"
                      style = {{width:"70px", marginTop:".25rem"}}
                    />
                  </Col>
                  <Col xs={8} style = {{paddingLeft:"0px"}}>
                    <Form.Text style = {{fontSize:"65%"}}> Min After Start Time</Form.Text>
                  </Col>
                </Row>
                <Row style = {{ marginTop:"15px"}}>
                  <Col style = {{paddingRight: "0px"}}>
                  <Form.Text style = {{fontSize:"65%"}}> Caitlin</Form.Text>
                  </Col>
                  <Col xs={8}>
                    <Form.Check type="checkbox" style={{paddingLeft: "0px"}}>
                      <Form.Check.Input
                        type="checkbox"
                        style={{ width: "20px", height: "20px" }}
                      />
                     
                      <Form.Control
                        as="textarea"
                        rows="1"
                        type="text"
                        placeholder="Enter Message"
                        style={{marginLeft: "10px"}}
                      />
                    </Form.Check>
                  </Col>
                </Row>
                <Row style = {{marginTop:"10px"}}>
                  <Col style = {{paddingRight: "0px"}}>
                  <Form.Text style = {{fontSize:"65%"}}> TA</Form.Text>
                  </Col>
                  <Col xs={8}>
                    <Form.Check type="checkbox" style={{paddingLeft: "0px"}} >
                      <Form.Check.Input
                        type="checkbox"
                        style={{ width: "20px", height: "20px" }}
                      />
                     
                      <Form.Control
                        as="textarea"
                        rows="1"
                        type="text"
                        placeholder="Enter Message"
                        style={{marginLeft: "10px"}}
                      />
                    </Form.Check>
                  </Col>
                </Row>
                <Row style = {{marginTop:"10px"}}>
                  <Col style = {{paddingRight: "0px" }}>
                    <Form.Control
                      // value={this.state.newEventNotification}
                      // onChange={this.handleNotificationChange}
                      type="number"
                      placeholder="5"
                      style = {{width:"70px", marginTop:".25rem"}}
                    />
                  </Col>
                  <Col xs={8} style = {{paddingLeft:"0px"}}>
                    <Form.Text style = {{fontSize:"65%"}}> Min After End Time</Form.Text>
                  </Col>
                </Row>
                <Row style = {{ marginTop:"15px"}}>
                  <Col style = {{paddingRight: "0px"}}>
                  <Form.Text style = {{fontSize:"65%"}}> Caitlin</Form.Text>
                  </Col>
                  <Col xs={8}>
                    <Form.Check type="checkbox" style={{paddingLeft: "0px"}}>
                      <Form.Check.Input
                        type="checkbox"
                        style={{ width: "20px", height: "20px" }}
                      />
                     
                      <Form.Control
                        as="textarea"
                        rows="1"
                        type="text"
                        placeholder="Enter Message"
                        style={{marginLeft: "10px"}}
                      />
                    </Form.Check>
                  </Col>
                </Row>
                <Row style = {{marginTop:"10px"}}>
                  <Col style = {{paddingRight: "0px"}}>
                  <Form.Text style = {{fontSize:"65%"}}> TA</Form.Text>
                  </Col>
                  <Col xs={8}>
                    <Form.Check type="checkbox" style={{paddingLeft: "0px"}} >
                      <Form.Check.Input
                        type="checkbox"
                        style={{ width: "20px", height: "20px" }}
                      />
                     
                      <Form.Control
                        as="textarea"
                        rows="1"
                        type="text"
                        placeholder="Enter Message"
                        style={{marginLeft: "10px"}}
                      />
                    </Form.Check>
                  </Col>
                </Row>
              
              </Form.Group>
            </div>
        );
    }
}

export default ShowNotifications;