import React, { useEffect, useState, useContext } from 'react';
import { Navbar, Nav, Container, Card, Badge, Row, Col, Modal, Button, Form, Table } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import './Todo.css'; // Import your custom CSS file

import { MdOutlineTaskAlt } from "react-icons/md";
import { CiCalendarDate } from "react-icons/ci";
import { Link } from 'react-router-dom';
import { FcCustomerSupport } from "react-icons/fc";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { FaThumbsUp } from "react-icons/fa";
import { UserContext } from './UserContext.js';
import { FaThumbsDown } from "react-icons/fa";
import tasklogo from '../AnimeTodo.gif';
import { IoBarChartSharp } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";

const User = () => {
  const { userDetails } = useContext(UserContext); // Access userDetails from context
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [todos, setTodos] = useState([]);

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <Badge bg="danger" className="badge-high">High</Badge>;
      case 'Medium':
        return <Badge bg="warning" className="badge-medium">Medium</Badge>;
      case 'Low':
        return <Badge bg="success" className="badge-low">Low</Badge>;
      default:
        return <Badge bg="secondary" className="uniform-badge">Unknown</Badge>;
    }
  };

  
  useEffect(() => {
    fetch('http://localhost:8083/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleUserClick = async (user) => {
    try {
      const response = await fetch(`http://localhost:8083/api/todos/byuser/${user.id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTodos(data);
      setSelectedUser(user);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  return (
    <>
      <Navbar bg="black" expand="lg">
        <Container>
          <Navbar.Brand href="#my-task"><FcCustomerSupport />&nbsp;
            <font color='white'>PS Helpdesk</font></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
            <Nav.Link as={Link} to={`/Todo?userId=${userDetails.id}`}><font color='white'><MdOutlineTaskAlt />&nbsp;My tasks</font></Nav.Link>
            <Nav.Link as={Link} to={`/User?userId=${userDetails.id}`}><font color='white'><FaUserFriends />&nbsp;My team</font></Nav.Link>
            <Nav.Link as={Link} to={`/Reports?userId=${userDetails.id}`}><font color='white'><IoBarChartSharp />&nbsp;Dashboard</font></Nav.Link>
              
            </Nav>
          </Navbar.Collapse>
        </Container>
        <font color='white'>Welcome, {userDetails.username} &nbsp;&nbsp;&nbsp;<RiLogoutBoxRLine onClick={`/Login`} />&nbsp;Logout&nbsp;&nbsp;&nbsp;&nbsp;</font>
      </Navbar>
      <Container className="mt-4">
        <Row>
          <Col md={3}>
            <div className="d-flex justify-content-between align-items-center mb-1 alert alert-primary">
              <h6 className="mb-0">My team</h6>
              <span className="badge text-bg-danger">{users.length}</span>
   
            </div>
            <Form.Group className="mb-0" controlId="Search">
              <div class="input-group mb-3">
                <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="Search Name"></input>
                <button type="button" class="btn btn-outline-danger">X</button>
              </div>
             
            </Form.Group>
            {users.length === 0 ? (
              <p><font size='2' color='gray'>Oops !!!! List is empty, Please add the team member.....</font></p>
            ) : (
              users.map(user => (
                <Card key={user.id} className="mb-2" onClick={() => handleUserClick(user)}>
                  <Card.Body>
                      <button type="button" className="btn btn-outline-danger" ><strong><font size="4">{user.name.charAt(0)}</font></strong></button>
                      &nbsp;&nbsp;&nbsp;
                      <strong>{user.name}</strong>&nbsp;
                  </Card.Body>
                  <hr className="border border-danger border-3 opacity-80"></hr>
                </Card>
              ))
            )}
          </Col>

          <Col md={9}>
          
          {!selectedUser ? (
              <img src={tasklogo} className="App-logo" alt="logo" width="100%" />
              
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-center mb-3 alert alert-warning">
                  <h6 className="mb-0">List of <i><u>{selectedUser.name}'s</u></i> tasks</h6>
                  <span className="badge text-bg-danger">{todos.length}</span>
                </div>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Deadline</th>
                      <th>Priority</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todos.length === 0 ? (
                      <tr>
                        <td colSpan="6"><font size='2' color='gray'>No todos found for this user.</font></td>
                      </tr>
                    ) : (
                      todos.map((todo, index) => (
                        <tr key={todo.id}>
                          <td>{index + 1}</td>
                          <td>{todo.category}</td>
                          <td>{todo.description}</td>
                          <td>{todo.deadline}</td>
                          <td className="center-content"> {getPriorityBadge(todo.priority)}</td>
                          <td className="center-content">{todo.completed ? <FaThumbsUp  style={{ color: 'green' }}/> : <FaThumbsDown style={{ color: 'red' }} />} </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </>
            )}
           
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default User;
