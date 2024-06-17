import React, { useEffect, useState, useContext } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Navbar, Nav, Container, Row, Col, ListGroup, Offcanvas } from 'react-bootstrap';
import { FcCustomerSupport } from "react-icons/fc";
import { MdOutlineTaskAlt } from "react-icons/md";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { IoBarChartSharp } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Todo.css';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext.js';
import MyNavbar from './MyNavbar.js';
import { BsInfoSquare } from "react-icons/bs";

const Reports = () => {
  const [username, setUsername] = useState('');
  const { userDetails } = useContext(UserContext);
  const [todos, setTodos] = useState([]);


  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        if (userDetails) {
          const response = await fetch(`http://localhost:8083/api/todos/byuser/${userDetails.id}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setTodos(data);
          console.log(data);
        }
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, [userDetails]);

  const getCompletedData = () => {
    const completedTasks = todos.filter(task => task.completed).length;
    const incompleteTasks = todos.length - completedTasks;

    return [
      { name: 'Completed Tasks', value: completedTasks },
      { name: 'Incomplete Tasks', value: incompleteTasks }
    ];
  };

  function OffCanvasExample({ name, icon: Icon, ...props }) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
      <>
        <Icon type="button" onClick={handleShow} style={{ fontSize: '2.2rem', color: 'red', cursor: 'pointer' }} />
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
              <ListGroup.Item as="li" className="custom-list-group-item">Rechart</ListGroup.Item>
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

  const COLORS = ['#800080', '#FF8042'];

  const getUsersData = () => {
    const categoryWiseUserTasks = todos.reduce((acc, task) => {
      const userCategoryKey = `${task.userid}-${task.category}`;
      if (!acc[userCategoryKey]) {
        acc[userCategoryKey] = { userid: task.userid, category: task.category, completed: 0, incomplete: 0 };
      }
      if (task.completed) {
        acc[userCategoryKey].completed += 1;
      } else {
        acc[userCategoryKey].incomplete += 1;
      }
      return acc;
    }, {});

    return Object.values(categoryWiseUserTasks);
  };

  // Function to get data for priority-wise completed and incomplete tasks for a user
  const getPriorityData = () => {
    const priorityWiseUserTasks = todos.reduce((acc, task) => {
      const userPriorityKey = `${task.userid}-${task.priority}`;
      if (!acc[userPriorityKey]) {
        acc[userPriorityKey] = { userid: task.userid, priority: task.priority, completed: 0, incomplete: 0 };
      }
      if (task.completed) {
        acc[userPriorityKey].completed += 1;
      } else {
        acc[userPriorityKey].incomplete += 1;
      }
      return acc;
    }, {});

    return Object.values(priorityWiseUserTasks);
  };

  return (
    <div>
      <MyNavbar username={userDetails.username} />

      <Container className="mt-4">
        <Row>
          <Col md={4}>
            <div className="d-flex justify-content-between align-items-center mb-3 alert alert-primary">
              <h6 className="mb-0" >My task status report</h6>
            </div>
            <PieChart width={400} height={400}>
              <Pie
                data={getCompletedData()}
                cx={150}
                cy={200}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {getCompletedData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Col>
          <Col md={7}>
            <div className="d-flex justify-content-between align-items-center mb-3 alert alert-primary" style={{ marginLeft: '60px' }}>
              <h6 className="mb-0" >My tasks priority report</h6>
            </div>
            <BarChart width={645} height={400} data={getPriorityData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="priority" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#800080" name="Completed Tasks" barSize={40} />
              <Bar dataKey="incomplete" fill="#FF8042" name="Incomplete Tasks" barSize={40} />
            </BarChart>
          </Col>
        <Col md={1} style={{ marginTop: '20px' }}>
        <OffCanvasExample icon={BsInfoSquare} />
        </Col>
        </Row>
      </Container>
      <Container className="mt-4">
        <Row>
          <Col md={11}>
            <div className="d-flex justify-content-between align-items-center mb-3 alert alert-primary">
              <h6 className="mb-0">My task category report</h6>
            </div>
            <BarChart width={1020} height={400} data={getUsersData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#800080" name="Completed Tasks" barSize={40} />
              <Bar dataKey="incomplete" fill="#FF8042" name="Incomplete Tasks" barSize={40} />
            </BarChart>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Reports;
