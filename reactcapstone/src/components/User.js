import React, { useEffect, useState, useContext } from 'react';
import { Navbar, Nav, Container, Card, Badge, Row, Col, Modal, Button, Form, Table, Offcanvas, ListGroup,Toast,ToastContainer } from 'react-bootstrap';

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
import MyNavbar from './MyNavbar.js';
import { BsInfoSquare } from "react-icons/bs";


const User = () => {
  const { userDetails } = useContext(UserContext); // Access userDetails from context
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showToast, setShowToast] = useState('');
  const [showResult, setShowResult] = useState('');

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => {
    setShowModal(true);
    setFormData({ username: '', password: '' });
  }

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


  const fetchUsers = () => {
    fetch('http://localhost:8083/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  };

  useEffect(() => {
    fetchUsers();
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

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleResetSearch = () => {
    setSearchText('');
    fetchUsers();
  };

  const handleSubmit = (event) => {
    event.preventDefault();


    fetch('http://localhost:8083/api/users')
      .then(response => response.json())
      .then(todos => {



        const todoData = {

          name: formData.name,
          username: formData.username,
          password: formData.password
        };

        fetch('http://localhost:8083/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(todoData)
        })
          .then(response => {
            if (response.ok) {
              setShowResult('Todo task added successfully');
              setShowToast(true);
              //alert('New user added successfully');
              // Fetch the updated list of tasks after adding a new task
              fetch('http://localhost:8083/api/users')
                .then(response => response.json())
                .then(users => {
                  setUsers(users); // Update the state with the new list of tasks
                  handleCloseModal(); // Close the dialog box
                })
                .catch(error => {
                  console.error('Error fetching updated todos:', error);
                });
            } else {
              throw new Error('Failed to add ToDo task');
            }
          })
          .catch(error => {
            console.error('Error adding ToDo task:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching ToDo list:', error);
      });
  };

  const handleFormChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = todos.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(todos.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  function OffCanvasExample({ name, icon: Icon, ...props }) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
      <>
        <Icon type="button" onClick={handleShow} style={{ fontSize: '1.5rem', color: 'blue', cursor: 'pointer' }} />
        <Offcanvas show={show} onHide={handleClose} {...props} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>{name}</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <h6>Packages used</h6>
            <ListGroup variant="flush" >
              <ListGroup.Item as="li" className="custom-list-group-item">React Bootstrap</ListGroup.Item>
              <ListGroup.Item as="li" className="custom-list-group-item">Animate.css</ListGroup.Item>
              <ListGroup.Item as="li" className="custom-list-group-item">React Icons</ListGroup.Item>
            </ListGroup>
            <hr class="border border-danger border-3 opacity-80"></hr>
            <h6>Concepts Covered</h6>
            <ListGroup variant="flush" >
              <ListGroup.Item as="li" className="custom-list-group-item">React hooks</ListGroup.Item>
              <ListGroup.Item as="li" className="custom-list-group-item">External Api request</ListGroup.Item>
              <ListGroup.Item as="li" className="custom-list-group-item">Internal Api request</ListGroup.Item>
              <ListGroup.Item as="li" className="custom-list-group-item">ECMAScript 6</ListGroup.Item>
            </ListGroup>
          </Offcanvas.Body>
        </Offcanvas>
      </>
    );
  }

  return (
    <>
      <MyNavbar username={userDetails.username} />
      <Container className="mt-4">
      <div className="d-flex justify-content-between mb-3">
    <div className="input-group">
      <button
        type="button"
        className="btn btn-outline-danger"
        onClick={handleShowModal}
        style={{ height: '40px' }}
      >
        + Add User
      </button>
    </div>
    <div>
      <OffCanvasExample icon={BsInfoSquare} />
    </div>
  </div>
        <Row>
        <ToastContainer className="position-fixed top-0 start-50 translate-middle-x p-3">
            <Toast show={showResult !== ''} onClose={() => setShowResult('')} className="bg-dark text-white">
              <Toast.Header closeButton>
                <strong className="me-auto" style={{color:'green'}}>Success !!!</strong>
              </Toast.Header>
              <Toast.Body>{showResult}</Toast.Body>
            </Toast>
          </ToastContainer>
          <Col md={3}>

            <div className="d-flex justify-content-between align-items-center mb-1 alert alert-primary">
              <h6 className="mb-0">My team</h6>
              <span className="badge text-bg-danger">{users.length}</span>

            </div>
            <Form.Group className="mb-0" controlId="Search">
              <div class="input-group mb-3">
                <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="Search Name" value={searchText}
                  onChange={handleSearch}></input>
                <button type="button" onClick={handleResetSearch} class="btn btn-outline-danger">X</button>
              </div>

            </Form.Group>
            {filteredUsers.length === 0 ? (
              <p><font size='2' color='gray'>Oops !!!! List is empty, Please add the team member.....</font></p>
            ) : (
              filteredUsers.map(user => (
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
                      currentItems.map((todo, index) => (
                        <tr key={todo.id}>
                          <td>{indexOfFirstItem + index + 1}</td>
                          <td>{todo.category}</td>
                          <td>{todo.description}</td>
                          <td>{todo.deadline}</td>
                          <td className="center-content"> {getPriorityBadge(todo.priority)}</td>
                          <td>{todo.completed ? <FaThumbsUp style={{ color: 'green' }} /> : <FaThumbsDown style={{ color: 'red' }} />}</td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
                {/* Pagination */}

                <nav style={{ display: 'flex', justifyContent: 'center' }}>
                  <ul className="pagination"  >
                    {[...Array(totalPages).keys()].map((pageNumber) => (
                      <li key={pageNumber + 1} className={`page-item ${currentPage === pageNumber + 1 ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(pageNumber + 1)}>
                          {pageNumber + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>

              </>
            )}

          </Col>

        </Row>
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              <font color="Green">Add New User</font>
            </Modal.Title>
          </Modal.Header>
          <hr class="border border-danger border-1 opacity-50"></hr>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleFormChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleFormChange}
                  required
                />
              </Form.Group>
              <hr class="border border-danger border-1 opacity-50"></hr>
              <Button variant="success" type="submit">
                Add User
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default User;
