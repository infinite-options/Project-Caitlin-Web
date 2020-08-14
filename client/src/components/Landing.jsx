import React from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import "./App.css";

export default class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loggedIn: false,
      signUpModal: false,
      socialSignUpModal: false,
      newEmail: "",
      newPassword: "",
      newPhoneNumber: "",
      newFName: "",
      newLName: "",
      newEmployer: "",
      newClients: [],
      versionNumber: this.getVersionNumber(),
    };
  }

  LogInForm = () => {
    return (
      <Form
        as={Container}
        style={{
          width: "600px",
          marginRight: "auto",
          padding: "5px 5px 5px 5px",
          borderRadius: "15px",
          boxShadow:
            "0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        <h3 className="bigfancytext">Sign In</h3>
        <Form.Group as={Row}>
          <Form.Label column sm="4">
            Email
          </Form.Label>
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
          <Form.Label column sm="4">
            Password
          </Form.Label>
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
              buttonText="Log In"
              onSuccess={this.responseGoogle}
              onFailure={this.responseGoogle}
              isSignedIn={false}
              disable={false}
              cookiePolicy={"single_host_origin"}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Col>
            <a href="/privacy">privacy</a>
          </Col>
        </Form.Group>
      </Form>
    );
  };

  getVersionNumber = () => {
    axios
      .get("/buildNumber", {
      }).then((response) => {
        this.setState({
           versionNumber: response.data
        })
      });
  };

  responseGoogle = (response) => {
    if (response.profileObj !== null || response.profileObj !== undefined) {
      let e = response.profileObj.email;
      let at = response.accessToken;
      let rt = response.googleId;
      let first_name = response.profileObj.givenName;
      let last_name = response.profileObj.familyName;
      console.log(e, at, rt, first_name, last_name);
      axios
        .post("/TASocialLogIn", {
          username: e,
        })
        .then((response) => {
          console.log(response.data);
          if (response.data !== false) {
            this.setState({
              loggedIn: true,
            });
          } else {
            console.log("social sign up with", e);
            this.setState({
              socialSignUpModal: true,
              newEmail: e,
            });
            console.log("social sign up modal displayed");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

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
        if (response.data !== false) {
          this.setState({
            loggedIn: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleSignUp = (event) => {
    this.setState({
      signUpModal: true,
      socialSignUpModal: false,
    });
  };

  signUpModal = () => {
    return (
      <Modal show={this.state.signUpModal} onHide={this.hideSignUp}>
        <Form as={Container}>
          <h3 className="bigfancytext formEltMargin">Sign Up</h3>
          <Form.Group as={Row} className="formEltMargin">
            <Form.Label column sm="4">
              Email
            </Form.Label>
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
            <Form.Label column sm="4">
              Password
            </Form.Label>
            <Col sm="8">
              <Form.Control
                type="password"
                value={this.state.newPassword}
                onChange={this.handleNewPasswordChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="formEltMargin">
            <Form.Label column sm="4">
              Phone Number
            </Form.Label>
            <Col sm="8">
              <Form.Control
                type="tel"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                placeholder="123-4567-8901"
                value={this.state.newPhoneNumber}
                onChange={this.handleNewPhoneNumberChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="formEltMargin">
            <Form.Label column sm="2">
              First Name
            </Form.Label>
            <Col sm="4">
              <Form.Control
                type="text"
                placeholder="John"
                value={this.state.newFName}
                onChange={this.handleNewFNameChange}
              />
            </Col>
            <Form.Label column sm="2">
              Last Name
            </Form.Label>
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
            <Form.Label column sm="4">
              Employer
            </Form.Label>
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
              <Button
                variant="primary"
                type="submit"
                onClick={this.handleSignUpDone}
              >
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
  };

  socialSignUpModal = () => {
    return (
      <Modal show={this.state.socialSignUpModal} onHide={this.hideSignUp}>
        <Form as={Container}>
          <h3 className="bigfancytext formEltMargin">
            Sign Up with Social Media
          </h3>
          <Form.Group as={Row} className="formEltMargin">
            <Form.Label column sm="4">
              Email
            </Form.Label>
            <Col sm="8">
              <Form.Control plaintext readOnly value={this.state.newEmail} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="formEltMargin">
            <Form.Label column sm="4">
              Phone Number
            </Form.Label>
            <Col sm="8">
               <Form.Control
                  type="tel"
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  placeholder="123-4567-8901"
                  value={this.state.newPhoneNumber}
                  onChange={this.handleNewPhoneNumberChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="formEltMargin">
            <Form.Label column sm="2">
              First Name
            </Form.Label>
            <Col sm="4">
              <Form.Control
                type="text"
                placeholder="John"
                value={this.state.newFName}
                onChange={this.handleNewFNameChange}
              />
            </Col>
            <Form.Label column sm="2">
              Last Name
            </Form.Label>
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
            <Form.Label column sm="4">
              Employer
            </Form.Label>
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
              <Button
                variant="primary"
                type="submit"
                onClick={this.handleSocialSignUpDone}
              >
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
  };

  hideSignUp = () => {
    this.setState({
      signUpModal: false,
      socialSignUpModal: false,
      newEmail: "",
      newPassword: "",
      newPhoneNumber: "",
      newFName: "",
      newLName: "",
      newEmployer: "",
      newClients: [],
    });
  };

  handleNewEmailChange = (event) => {
    this.setState({ newEmail: event.target.value });
  };

  handleNewPasswordChange = (event) => {
    this.setState({ newPassword: event.target.value });
  };

  handleNewPhoneNumberChange = (event) => {
    this.setState({ newPhoneNumber: event.target.value });
  };

  handleNewFNameChange = (event) => {
    this.setState({ newFName: event.target.value });
  };

  handleNewLNameChange = (event) => {
    this.setState({ newLName: event.target.value });
  };

  handleNewEmployerChange = (event) => {
    this.setState({ newEmployer: event.target.value });
  };

  handleSignUpDone = () => {
    axios
      .post("/TASignUp", {
        username: this.state.newEmail,
        password: this.state.newPassword,
        phoneNumber: this.state.newPhoneNumber,
        fName: this.state.newFName,
        lName: this.state.newLName,
        employer: this.state.newEmployer,
      })
      .then((response) => {
        console.log(response.data);
        this.hideSignUp();
      })
      .catch((error) => {
        console.log("its in landing page");
        console.log(error);
      });
  };

  handleSocialSignUpDone = () => {
    axios
      .post("/TASocialSignUp", {
        username: this.state.newEmail,
        phoneNumber: this.state.newPhoneNumber,
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
  };

  render() {
    if (this.state.loggedIn) {
      return <Redirect push to="main" />;
    } else {
      return (
        <div
          style={{
            width: "1000px",
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
            fontFamily: "San Serif",
            fontSize: "1.0em",
            paddingTop: "20px",
          }}
        >
          <a style={{ fontSize: "1.5em", float: "left" }}>
            <img
              style={{ width: "50px", borderRadius: 0, border: 0 }}
              src="Manifest Icon-App-1024x1024.png"
            />
            anifest My Life
          </a>
          <a
            style={{ float: "right", padding: "12px 10px", color: "black" }}
            href="/"
          >
            /SIGN IN
          </a>
          <a
            style={{ float: "right", padding: "12px 10px", color: "black" }}
            href="https://www.infiniteoptions.com"
          >
            /INFINITE OPTIONS
          </a>
          <a
            style={{ float: "right", padding: "12px 10px", color: "black" }}
            href="https://www.notimpossible.com"
          >
            /NOT IMPOSSIBLE
          </a>
          <a
            style={{ float: "right", padding: "12px 0px", color: "black" }}
            href="/"
          >
            /HOME
          </a>
          <div></div>
          <div style={{ display: "-webkit-inline-box", paddingTop: "20px" }}>
            <img
              style={{
                width: "380px",
                marginLeft: "auto",
                marginRight: "30px",
                borderRadius: 0,
                border: 0,
              }}
              src="Helping Others.png"
            />
            <div>
              <div style={{ fontSize: "1.5em" }}>
                <p style={{ display: "inline", color: "#6495ED" }}>Help One</p>{" "}
                -{" "}
                <p style={{ display: "inline", color: "#8FBC8F" }}>Help Many</p>
              </div>
              {this.LogInForm()} V1.47.{this.state.versionNumber}
            </div>
          </div>
          {this.signUpModal()}
          {this.socialSignUpModal()}
          <div
            style={{
              fontFamily: "San Serif",
              fontSize: "1.1em",
              marginTop: "10px",
            }}
          >
            <div
              style={{
                display: "-webkit-inline-box",
                textAlign: "left",
                paddingTop: "10px",
                borderTop: "2px solid #6495ED",
                width: "1000px",
              }}
            >
              <div style={{ width: "220px" }}>The Trusted Advisor</div>
              <div style={{ width: "770px", color: "#6495ED" }}>
                <p>
                  You know you are the key to helping people achieve their
                  potential. Login to make their dreams become their reality!
                </p>
                <p>
                  Login in with an email and password or using Google Login.
                  When you login we track your name, email and user id.
                </p>
              </div>
            </div>
            <div
              style={{
                display: "-webkit-inline-box",
                textAlign: "left",
                paddingTop: "10px",
                borderTop: "2px solid #8FBC8F",
                width: "1000px",
              }}
            >
              <div style={{ width: "220px" }}>The User</div>
              <div style={{ width: "770px", color: "#8FBC8F" }}>
                <p>
                  You know you can accomplish more! With the right help,
                  structure and guidance you can make each day better than the
                  last and move toward your goals!
                </p>
                <p>
                  Your Trusted Advisor will ask you to enter your Google ID and
                  Password to give them access to your Calendar. With that
                  information they will be able to help you manage your day and
                  add structure to your life by customizing Goals and Routines.
                </p>
                <p>
                  It's your life and you are in control! We give you options.
                  You choose what you want to accomplish!
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
