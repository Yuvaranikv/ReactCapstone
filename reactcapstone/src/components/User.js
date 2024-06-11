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
import MyNavbar from './MyNavbar.js';


const User = () => {
  const { userDetails } = useContext(UserContext); // Access userDetails from context
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchText, setSearchText] = useState('');


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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = todos.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(todos.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <MyNavbar username={userDetails.username} />
      <Container className="mt-4">
        <Row>
          <Col md={3}>
            <div className="d-flex justify-content-between align-items-center mb-1 alert alert-primary">
              <h6 className="mb-0">My team</h6>
              <span className="badge text-bg-danger">{users.length}</span>

            </div>
            <Form.Group className="mb-0" controlId="Search">
              <div class="input-group mb-3">
                <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="Search Name"  value={searchText}
                  onChange={handleSearch}></input>
                <button type="button"  onClick={handleResetSearch} class="btn btn-outline-danger">X</button>
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
                        <button  className="page-link"  onClick={() => handlePageChange(pageNumber + 1)}>
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
      </Container>
    </>
  );
};

export default User;
