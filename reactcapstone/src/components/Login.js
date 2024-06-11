import React, { useState, useContext } from 'react';
import { Button, Container, Row, Col, Form, Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext.js';
import '../components/Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';



function Login() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { setUserDetails } = useContext(UserContext);
  const navigate = useNavigate();




  const handleLogin = async () => {
    try {
      const response = await fetch(`http://localhost:8083/api/users`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
  
      let user = data.find(user => user.username === username);
      if (!user) {
        setError('Username not found.');
      } else {
        setError('');
        localStorage.setItem('localuserid',user.id)
        localStorage.setItem('username', user.username);
        setUserDetails(user);
       
        navigate(`/Todo?userid=${user.id}`);
       
      }
    } catch (error) {
      console.error('Error checking username:', error);
      setError('Error checking username.');
    }
  };

  return (
    <div>
    
    <div id="login-page" className="login-container">
      <Container>
        <Row className="justify-content-center">
          <Col sm="4" className="text-center mb-4">
            <img
              src="/images/view-3d-woman(1).jpg"
              alt=""
              className="img-fluid"
              style={{ maxHeight: '350px', width: 'auto' }}
            />
          </Col>
          <Col sm="4">
            <br></br><br></br>
            <h3 className="fw-normal mb-3 text-center">PS Helpdesk Log in</h3>
            <Form>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="password"
                  placeholder="Password"
                />
              </Form.Group>
              <Button className="mb-3 w-100" id="btnLogin" variant="info" onClick={handleLogin}>
                Login
              </Button>
              
              {/*
              <p className="small mb-3 text-center"><a className="text-muted" href="#!">Forgot password?</a></p>
              <p className="mb-0 text-center">Don't have an account? <a href="#!" className="text-muted">Register here</a></p>
              */}
               <p className="small mb-3 text-center">Need support !! call 080-888 888</p>
            </Form>
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
