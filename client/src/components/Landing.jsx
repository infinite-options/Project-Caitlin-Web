import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import './App.css';

export default class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loggedIn: false,
      signUpModal: false,
      socialSignUpModal: false,
      newEmail: '',
      newPassword: '',
      newFName: '',
      newLName: '',
      newEmployer: '',
      newClients: [],
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
        <Form.Group as={Row}>
          <Col>
            <Button variant="primary" type="submit" onClick={this.handleSubmit}>
              Sign in
            </Button>
          </Col>
          <Col>
            <Button variant="primary" type="submit" onClick={this.handleSignUp}>
              Sign Up
            </Button>
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Col>
            <h4>Log in with Google</h4>
          </Col>
          <Col>
            <GoogleLogin
              clientId="1009120542229-9nq0m80rcnldegcpi716140tcrfl0vbt.apps.googleusercontent.com"
              buttonText = 'Log In'
              onSuccess={this.responseGoogle}
              onFailure={this.responseGoogle}
              isSignedIn={false}
              disable={false}
              cookiePolicy={"single_host_origin"}
            />
          </Col>
        </Form.Group>
      </Form>
    )
  }

  responseGoogle = (response) => {
    if(response.profileObj !== null || response.profileObj !== undefined) {
      let e = response.profileObj.email;
      let at = response.accessToken;
      let rt = response.googleId;
      let first_name = response.profileObj.givenName;
      let last_name = response.profileObj.familyName;
      console.log(e,at,rt,first_name,last_name)
      axios
        .post("/TASocialLogIn", {
          username: e
        })
        .then((response) => {
          console.log(response.data);
          if(response.data !== false) {
            this.setState({
              loggedIn: true,
            });
          } else {
            console.log('social sign up with',e)
            this.setState({
              socialSignUpModal: true,
              newEmail: e,
            })
            console.log('social sign up modal displayed')
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
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

  handleSignUp = (event) => {
    this.setState({
      signUpModal: true,
      socialSignUpModal: false,
    });
  }

  signUpModal = () => {
    return (
      <Modal show={this.state.signUpModal} onHide={this.hideSignUp}>
        <Form as={Container}>
          <h3 className="bigfancytext formEltMargin">
            Sign Up
          </h3>
          <Form.Group as={Row} className="formEltMargin">
            <Form.Label column sm="4">Email</Form.Label>
            <Col sm="8">
              <Form.Control
                type="text"
                placeholder="example@gmail.com"
                value={this.state.newEmail}
                onChange={this.handleNewEmailChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="formEltMargin">
            <Form.Label column sm="4">Password</Form.Label>
            <Col sm="8">
              <Form.Control
                type="password"
                value={this.state.newPassword}
                onChange={this.handleNewPasswordChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="formEltMargin">
            <Form.Label column sm="2">First Name</Form.Label>
            <Col sm="4">
              <Form.Control
                type="text"
                placeholder="John"
                value={this.state.newFName}
                onChange={this.handleNewFNameChange}
              />
            </Col>
            <Form.Label column sm="2">Last Name</Form.Label>
            <Col sm="4">
              <Form.Control
                type="text"
                placeholder="Doe"
                value={this.state.newLName}
                onChange={this.handleNewLNameChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="formEltMargin">
            <Form.Label column sm="4">Employer</Form.Label>
            <Col sm="8">
              <Form.Control
                type="text"
                value={this.state.newEmployer}
                onChange={this.handleNewEmployerChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="formEltMargin">
            <Col>
              <Button variant="primary" type="submit" onClick={this.handleSignUpDone}>
                Sign Up
              </Button>
            </Col>
            <Col>
              <Button variant="primary" type="submit" onClick={this.hideSignUp}>
                Cancel
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Modal>
    );
  }

  socialSignUpModal = () => {
    return (
      <Modal show={this.state.socialSignUpModal} onHide={this.hideSignUp}>
        <Form as={Container}>
          <h3 className="bigfancytext formEltMargin">
            Sign Up with Social Media
          </h3>
          <Form.Group as={Row} className="formEltMargin">
            <Form.Label column sm="4">Email</Form.Label>
            <Col sm="8">
              <Form.Control
                plaintext
                readOnly
                value={this.state.newEmail}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="formEltMargin">
            <Form.Label column sm="2">First Name</Form.Label>
            <Col sm="4">
              <Form.Control
                type="text"
                placeholder="John"
                value={this.state.newFName}
                onChange={this.handleNewFNameChange}
              />
            </Col>
            <Form.Label column sm="2">Last Name</Form.Label>
            <Col sm="4">
              <Form.Control
                type="text"
                placeholder="Doe"
                value={this.state.newLName}
                onChange={this.handleNewLNameChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="formEltMargin">
            <Form.Label column sm="4">Employer</Form.Label>
            <Col sm="8">
              <Form.Control
                type="text"
                value={this.state.newEmployer}
                onChange={this.handleNewEmployerChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="formEltMargin">
            <Col>
              <Button variant="primary" type="submit" onClick={this.handleSocialSignUpDone}>
                Sign Up
              </Button>
            </Col>
            <Col>
              <Button variant="primary" type="submit" onClick={this.hideSignUp}>
                Cancel
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Modal>
    );
  }

  hideSignUp = () => {
    this.setState({
      signUpModal: false,
      socialSignUpModal: false,
      newEmail: '',
      newPassword: '',
      newFName: '',
      newLName: '',
      newEmployer: '',
      newClients: [],
    })
  }

  handleNewEmailChange = (event) => {
    this.setState({ newEmail: event.target.value });
  }

  handleNewPasswordChange = (event) => {
    this.setState({ newPassword: event.target.value });
  }

  handleNewFNameChange = (event) => {
    this.setState({ newFName: event.target.value });
  }

  handleNewLNameChange = (event) => {
    this.setState({ newLName: event.target.value });
  }

  handleNewEmployerChange = (event) => {
    this.setState({ newEmployer: event.target.value });
  }

  handleSignUpDone = () => {
    axios
      .post("/TASignUp", {
        username: this.state.newEmail,
        password: this.state.newPassword,
        fName: this.state.newFName,
        lName: this.state.newLName,
        employer: this.state.newEmployer,
      })
      .then((response) => {
        console.log(response.data);
        this.hideSignUp();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleSocialSignUpDone = () => {
    axios
      .post("/TASocialSignUp", {
        username: this.state.newEmail,
        fName: this.state.newFName,
        lName: this.state.newLName,
        employer: this.state.newEmployer,
      })
      .then((response) => {
        console.log(response.data);
        this.hideSignUp();
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
          <br />
          {this.LogInForm()}
          {this.signUpModal()}
          {this.socialSignUpModal()}
          <div>V1.4</div>
        </div>

      );
    }
  }
}
