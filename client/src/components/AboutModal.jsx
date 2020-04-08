import React from 'react';
import { Form,Row,Col ,Modal,Button,Container} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage
} from "@fortawesome/free-solid-svg-icons";

class AboutModal extends React.Component{

    constructor(props) {
        super(props);
        this.state={
            file: null,
            // image1Click: null
            file2: null,
            file3: null,
            file4: null
        }
    }

    handleFileSelected = event => {
      console.log(event.target.files[0]);
      if(event.target.files[0] != null){
      event.preventDefault(); event.stopPropagation()
      this.setState({
        file: URL.createObjectURL(event.target.files[0])
      });
     }
    };
  
    hideAboutForm = e => {
      this.props.CameBackFalse();   
    };

    // handleImageClick = ()=> {
    //     console.log("I am in here");
    //     this.setState({
    //         image1Click: true
    //       });
    // }

    handleImpPeople1 = (event) =>{
        if(event.target.files[0] != null){
        this.setState({
            file2: URL.createObjectURL(event.target.files[0])
          });
        }
    }
    handleImpPeople2 = (event) =>{
        if(event.target.files[0] != null){
        this.setState({
            file3: URL.createObjectURL(event.target.files[0])
          });
        }
    }
    handleImpPeople3 = (event) =>{
        if(event.target.files[0] != null){
        this.setState({
            file4: URL.createObjectURL(event.target.files[0])
          });
        }
    }

    render(){
        return (
            <div>
                <Modal.Dialog
                    style={{
                    borderRadius: "15px",
                    boxShadow:
                        "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
                    marginLeft: "35px",
                    width: "350px",
                    marginTop: "0"
                    }}
                >
                <Modal.Header
                closeButton
                onHide={() => {
                    // this.setState({
                    // showAboutModal: false
                    // });
                    this.hideAboutForm();
                }}
                >
                    <Modal.Title>
                        <h5 className="normalfancytext">About Me</h5>{" "}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            {(this.state.file === null ? 
                            <FontAwesomeIcon icon={faImage} size="6x"/> : 
                            <img style = 
                                {{display: "block",
                                marginLeft: "auto",
                                marginRight:"auto" ,
                                width: "100%",
                                height:"70px",
                                }}
                                accept="image/*"
                                src={this.state.file } alt="Profile Picture"
                            /> )}
                        </Col>
                        <Col xs={8}>
                        <label >Upload A New Image</label>
                        <input
                            type="file"
                            onChange={this.handleFileSelected}
                            id="ProfileImage"
                        />
                        </Col>
                    </Row>

                    <Form.Group controlId="AboutMessage" style={{ marginTop: "10px" }}>
                        <Form.Label>Message (My Day):</Form.Label>
                        <Form.Control
                        as="textarea"
                        rows="4"
                        // value={this.state.newEventDescription}
                        type="text"
                        placeholder="You are a strong ..."
                        />
                    </Form.Group>
                    <Form.Group controlId="AboutMessageCard">
                        <Form.Label>Message (My Card):</Form.Label>
                        <Form.Control
                        as="textarea"
                        rows="4"
                        type="text"
                        placeholder="You are a safe ..."
                        />
                    </Form.Group>
                    <Form.Group >
                        <Form.Label>Important People</Form.Label>
                        <Row>
                            <Col>
                                {/* <FontAwesomeIcon icon={faImage} size="6x"  /> */}
                                {(this.state.file2 === null ? 
                                <FontAwesomeIcon icon={faImage} size="6x"  /> : 
                                <img style = 
                                    {{display: "block",
                                    marginLeft: "auto",
                                    marginRight:"auto" ,
                                    width: "100%",
                                    height:"90px",
                                    }}
                                    src={this.state.file2 } alt="Important People 1"
                                /> )}
                                
                            </Col>
                            <Col xs={8}>
                                <Form.Control type="text" placeholder="Relationship" />
                                <Form.Control type="text" placeholder="Phone Number" />
                                <input type= "file" onChange={this.handleImpPeople1}/>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: "20px" }}>
                            <Col>
                                {/* <FontAwesomeIcon icon={faImage} size="5x" /> */}
                                {(this.state.file3 === null ? 
                                <FontAwesomeIcon icon={faImage} size="6x"  /> : 
                                <img style = 
                                    {{display: "block",
                                    marginLeft: "auto",
                                    marginRight:"auto" ,
                                    width: "100%",
                                    height:"90px",
                                    }}
                                    src={this.state.file3 } alt="Important People 2"
                                /> )}
                            </Col>
                            <Col xs={8}>
                                <Form.Control type="text" placeholder="Relationship" />
                                <Form.Control type="text" placeholder="Phone Number" />
                                <input type= "file" onChange={this.handleImpPeople2}/>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: "20px" }}>
                            <Col>
                                {/* <FontAwesomeIcon icon={faImage} size="5x" /> */}
                                {(this.state.file4 === null ? 
                                <FontAwesomeIcon icon={faImage} size="6x"  /> : 
                                <img style = 
                                    {{display: "block",
                                    marginLeft: "auto",
                                    marginRight:"auto" ,
                                    width: "100%",
                                    height:"90px",
                                    }}
                                    src={this.state.file4 } alt="Important People 3"
                                /> )}
                            </Col>
                            <Col xs={8}>
                                <Form.Control type="text" placeholder="Relationship" />
                                <Form.Control type="text" placeholder="Phone Number" />
                                <input type= "file" onChange={this.handleImpPeople3}/>
                            </Col>
                        </Row>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Container fluid>
                        <Row>
                            <Col xs={4}>
                                <Button variant="info" type="submit">
                                Save
                                </Button>
                            </Col>
                            <Col xs={4}>
                                <Button variant="secondary" onClick={this.hideAboutForm}>
                                Cancel
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Footer>
            </Modal.Dialog>
         </div>
        );
    }
}

export default AboutModal;