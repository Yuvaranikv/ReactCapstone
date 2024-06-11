import React, { useEffect, useState, useContext } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap';
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
              <h6 className="mb-0">My task status report</h6>
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
          <Col md={8}>
          <div className="d-flex justify-content-between align-items-center mb-3 alert alert-primary">
              <h6 className="mb-0">My tasks priority report</h6>
            </div>
              {/* Bar chart for priority-wise task report */}
              <BarChart width={720} height={400} data={getPriorityData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="priority" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#800080" name="Completed Tasks" />
              <Bar dataKey="incomplete" fill="#FF8042" name="Incomplete Tasks" />
            </BarChart>
        
            </Col>
            </Row>
      </Container>

      <Container className="mt-4">
        <Row>
            <Col md={12}>
            <div className="d-flex justify-content-between align-items-center mb-3 alert alert-primary">
              <h6 className="mb-0">My task category report</h6>
            </div>
            <BarChart width={1000} height={400} data={getUsersData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#800080" name="Completed Tasks" />
              <Bar dataKey="incomplete" fill="#FF8042" name="Incomplete Tasks" />
            </BarChart>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Reports;
