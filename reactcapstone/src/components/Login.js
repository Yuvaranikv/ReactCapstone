import React, { useState, useContext } from 'react';
import { Button, Container, Row, Col, Form, Toast, ToastContainer, Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext.js';
import '../components/Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { GoEyeClosed } from "react-icons/go";

function Login() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { setUserDetails } = useContext(UserContext);
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [loginClicked, setLoginClicked] = useState(false);
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState('');
  
  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    const form = event.currentTarget;
    setLoginClicked(true); // Set loginClicked to true when login button is clicked
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true); // Validate the form when login button is clicked
    } else {
      try {
        const response = await fetch(`http://localhost:8083/api/users`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        let user = data.find(user => user.username === username);
        if (!username || !password)
          setError('');
        else if (!user) {
          setError('Username not found.');
          setShowToast(true); // Show toast only when there's an error related to authentication
        } else {
          setError('');
          setUsername('');
          setPassword('');
          // Reset form validation
          setValidated(false);
          localStorage.setItem('localuserid', user.id);
          localStorage.setItem('username', user.username);
          setUserDetails(user);
          navigate(`/Todo?userid=${user.id}`);
        }
      } catch (error) {
        console.error('Error checking username:', error);
        if (loginClicked) { // Check if login button is clicked
          setError('Error checking username.'); // Set error only when login button is clicked
          setShowToast(true); // Show toast only when there's an error related to authentication
        }
      }
    }
  };

  


  return (
    <div>

      <div id="login-page" className="login-container">
        <Container>
          <Row className="justify-content-center">
            <Col sm="4" className="text-center mb-4">
              <Carousel interval={2000}>
                <Carousel.Item>
                  <img
                    src="/images/view-3d-woman(1).jpg"
                    alt="First slide"
                    className="d-block w-100"
                    style={{ maxHeight: '350px', width: 'auto' }}
                  />

                </Carousel.Item>
                <Carousel.Item>
                  <img
                    src="/images/new.jpeg"
                    alt="Second slide"
                    className="d-block w-100"
                    style={{ maxHeight: '350px', width: 'auto' }}
                  />

                </Carousel.Item>
                <Carousel.Item>
                  <img
                    src="/images/checklist1.png"
                    alt="Third slide"
                    className="d-block w-100"
                    style={{ maxHeight: '350px', width: 'auto' }}
                  />

                </Carousel.Item>
                </Carousel>

              {/* <img
              src="/images/view-3d-woman(1).jpg"
              alt=""
              className="img-fluid"
              style={{ maxHeight: '350px', width: 'auto' }}
            /> */}
            </Col>
            <Col sm="4">
              <br></br><br></br>
              <h3 className="fw-normal mb-3 text-center">PS Helpdesk Log in</h3>
              <Form noValidate validated={validated} onSubmit={handleLogin}>
                <Form.Group controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    isInvalid={loginClicked && !username}
                  />
                  <Form.Control.Feedback type="invalid">Please enter your username.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    isInvalid={loginClicked && !password}
                   /> 
                              
                  <Form.Control.Feedback type="invalid">Please enter your password.</Form.Control.Feedback>
                </Form.Group>
                &nbsp;&nbsp;
                <Button variant="info" type="submit" className="mb-3 w-100" id="btnLogin" onClick={handleLogin}>
                  Login
                </Button>
                <p className="small mb-3 text-center">Need support !! call 080-888 888</p>
              </Form>
              {/*
              <p className="small mb-3 text-center"><a className="text-muted" href="#!">Forgot password?</a></p>
              <p className="mb-0 text-center">Don't have an account? <a href="#!" className="text-muted">Register here</a></p>
              */}


            </Col>
          </Row>
          <ToastContainer className="position-fixed top-0 start-50 translate-middle-x p-3">
            <Toast show={error !== ''} onClose={() => setError('')} className="bg-dark text-white">
              <Toast.Header closeButton>
                <strong className="me-auto">Alert !!!</strong>
              </Toast.Header>
              <Toast.Body>{error}</Toast.Body>
            </Toast>
          </ToastContainer>
        </Container>
      </div>
    </div>
  );
}

export default Login;

