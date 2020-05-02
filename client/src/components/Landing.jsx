import React from "react";
import axios from "axios";
import {
  Redirect
} from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import "./App.css";

export default class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loggedIn: false,
    }
  }

  LogInForm = () => {
    return (
      <Form as={Container} style={{
        width: "600px",
        margin: "auto",
        padding: "5px 5px",
        borderRadius: "15px",
        boxShadow:
          "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
      }}>
        <h3 className="bigfancytext">Sign In</h3>
        <Form.Group as={Row}>
          <Form.Label column sm="4">Email</Form.Label>
          <Col sm="8">
            <Form.Control
              type="text"
              value={this.state.email}
              onChange={this.handleEmailChange}
              placeholder="example@gmail.com"
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="4">Password</Form.Label>
          <Col sm="8">
            <Form.Control
              type="password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
            />
          </Col>
        </Form.Group>
        <Button variant="primary" type="submit" onClick={this.handleSubmit}>
          Log in
        </Button>
      </Form>
    )
  }

  handleEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(event);
    axios
      .post("/TALogIn", {
        username: this.state.email,
        password: this.state.password,
      })
      .then((response) => {
        console.log(response.data);
        if(response.data !== false) {
          this.setState({
            loggedIn: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    if(this.state.loggedIn) {
      return (<Redirect push to="main" />);
    } else {
      return (
        <div style={{textAlign: "center"}}>
          <h2>
            Welcome to Memory Not Impossible
          </h2>
          {this.LogInForm()}
        </div>
      );
    }
  }
}