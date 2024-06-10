import React, { useEffect, useState, useContext } from 'react';
import { Navbar, Nav, Container, Card, Badge, Row, Col, Modal, Button, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import './Todo.css'; // Import your custom CSS file
import { FaTrashAlt } from "react-icons/fa";
// import { BiSortAlt2 } from "react-icons/bi";
import { IoSearchOutline } from "react-icons/io5";
import { IoFilterOutline } from "react-icons/io5";
import { MdOutlineTaskAlt } from "react-icons/md";
//import { AiOutlineTeam } from "react-icons/ai";
import { CiCalendarDate } from "react-icons/ci";
// import { FcTodoList } from "react-icons/fc";
import { LiaCalendarWeekSolid } from "react-icons/lia";
import IncompleteTasks from './IncompleteTasks.js'; // Import IncompleteTasks component
import { Link } from 'react-router-dom';
import { FcCustomerSupport } from "react-icons/fc";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { MdOutlineDoneOutline } from "react-icons/md";
//import tasklogo from '../Todotask.jpg';
import { UserContext } from './UserContext.js';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { IoBarChartSharp } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { CgCloseO } from "react-icons/cg";
import SearchItem from './SearchItem.js';
import HighPriorityTasks from './HighPriorityTasks.js';
import 'animate.css';
import { FaCalendarAlt } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";





const gf = new GiphyFetch('N95qIVi6lkqYZbev1opFJguGvsvu9LPo');


const Todo = () => {
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [search, setSearch] = useState('');
  const [gifs, setGifs] = useState([]);
  const [error, setError] = useState(null);
  const { userDetails } = useContext(UserContext);
  const [userId, setUserId] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const userid = queryParams.get('userid');
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showIncompleteTasks, setShowIncompleteTasks] = useState(false);
  const [username, setUsername] = useState('');
  const [showHighPriorityTasks, setShowHighPriorityTasks] = useState(false);
  const [filter, setFilter] = useState(null);
  const [tasks, setTasks] = useState([]);

  // const [showCompleteTasks, setShowCompleteTasks] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    hiddenUserId: '',
    category: '',
    description: '',
    deadline: '',
    priority: 'Low',
  });

  const navigate = useNavigate();



  useEffect(() => {
    if (userDetails) {
      setFormData({
        userId: userDetails.username,
        hiddenUserId: userDetails.id,
        category: '',
        description: '',
        deadline: '',
        priority: 'Low',
      });
    }
  }, [userDetails]);

  // Check formData in console
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);


  const fetchTodos = async () => {
    try {
      if (userDetails) {
        const response = await fetch(`http://localhost:8083/api/todos/byuser/${userDetails.id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTodos(data);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [userDetails]);

  const handleShowHighPriorityTasks = () => {
    setShowHighPriorityTasks(true);
    setShowFilterDialog(false);
  };

  useEffect(() => {
    if (showFilterDialog && filter) {
      fetchTasks();
    }
  }, [showFilterDialog, filter, todos]);

  const fetchSearchResults = async (query) => {
    try {
      const response = await fetch(`http://localhost:8083/api/todos/search/${query}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error searching todos:', error);
    }
  };
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:8083/api/todos');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log("Fetched data:", data); // Debugging

      let filteredTasks;
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Set to start of the day

      if (filter === 'High Priority') {
        filteredTasks = data.filter(task => task.priority === 'High');
      } else if (filter === 'Due This Week') {
        const oneWeekFromNow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 23, 59, 59, 999); // Set to end of the day one week from now
        filteredTasks = data.filter(task => {
          const deadline = new Date(task.deadline);
          return deadline >= now && deadline <= oneWeekFromNow;
        });
      } else if (filter === 'Due Next Week') {
        const startNextWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
        startNextWeek.setHours(0, 0, 0, 0); // Set to start of the day next week
        const endNextWeek = new Date(startNextWeek.getFullYear(), startNextWeek.getMonth(), startNextWeek.getDate() + 7, 23, 59, 59, 999); // Set to end of the day next week
        filteredTasks = data.filter(task => {
          const deadline = new Date(task.deadline);
          return deadline >= startNextWeek && deadline <= endNextWeek;
        });
      }

      console.log("Filtered tasks:", data); // Debugging
      setTodos(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleShowFilter = (filterType) => {
    let filteredTasks;
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Implement the logic to filter tasks based on the selected filter type
    if (filterType === 'High Priority') {
      const highPriorityTasks = todos.filter(task => task.priority === 'High');
      setTodos(highPriorityTasks); // Update tasks state with high priority tasks
    } else if (filterType === 'Due This Week') {
      const oneWeekFromNow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 23, 59, 59, 999); // Set to end of the day one week from now
      filteredTasks = todos.filter(task => {
        const deadline = new Date(task.deadline);
        return deadline >= now && deadline <= oneWeekFromNow;
      });
      setTodos(filteredTasks);
    } else if (filterType === 'Due Next Week') {
      const startNextWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
      startNextWeek.setHours(0, 0, 0, 0); // Set to start of the day next week
      const endNextWeek = new Date(startNextWeek.getFullYear(), startNextWeek.getMonth(), startNextWeek.getDate() + 7, 23, 59, 59, 999); // Set to end of the day next week
      filteredTasks = todos.filter(task => {
        const deadline = new Date(task.deadline);
        return deadline >= startNextWeek && deadline <= endNextWeek;
      });
      setTodos(filteredTasks);
    } else {
      // Clear filter
      // Simply reset the todos to the original data fetched from the server
      fetchTodos();
      console.log('todos' + todos);

    }

    // Hide the filter dialog modal
    setShowFilterDialog(false);
  };







  // useEffect(() => {
  //   const queryParams = new URLSearchParams(location.search);
  //   const userIdFromURL = queryParams.get('userId');
  //   setUserId(userIdFromURL);

  //   const fetchTodos = async () => {
  //     try {
  //       if (userIdFromURL) {
  //         const response = await fetch(`http://localhost:8083/api/todos/byuser/${userIdFromURL}`);
  //         if (!response.ok) {
  //           throw new Error('Network response was not ok');
  //         }
  //         const data = await response.json();
  //         setTodos(data);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching todos:', error);
  //     }
  //   };

  //   fetchTodos();
  // }, [location.search]);


  useEffect(() => {
    if (showNewTaskForm) {
      fetch('http://localhost:8083/api/categories')
        .then(response => response.json())
        .then(data => setCategories(data))
        .catch(error => console.error('Error fetching categories:', error));
    }
  }, [showNewTaskForm]);



  useEffect(() => {
    const fetchGif = async () => {
      try {
        const response = await gf.gif('26ybvRzJrDKvVl8R2');
        setGifs(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError('Unauthorized: Invalid API Key or Permissions Issue.');
        } else {
          setError('An unexpected error occurred.');
        }
      }
    };

    fetchGif();
  }, []);

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

  // const handleCardClick = (todoId) => {
  //   navigate(`/EditTodo?id=${todoId}`);
  // };

  const handleAddTaskClick = () => {
    setShowNewTaskForm(true);
  };

  const handleClose = () => {
    setShowNewTaskForm(false);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:8083/api/todos')
      .then(response => response.json())
      .then(todos => {
        const highestId = todos.reduce((maxId, todo) => Math.max(maxId, todo.id), 0);
        const newTodoId = highestId + 1;

        const todoData = {
          id: newTodoId,
          userid: formData.hiddenUserId,
          category: formData.category,
          description: formData.description,
          deadline: formData.deadline,
          priority: formData.priority,
          completed: false,
          checked: false
        };

        fetch('http://localhost:8083/api/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(todoData)
        })
          .then(response => {
            if (response.ok) {
              alert('Todo task added successfully');
              // Fetch the updated list of tasks after adding a new task
              fetch(`http://localhost:8083/api/todos/byuser/${formData.hiddenUserId}`)
                .then(response => response.json())
                .then(updatedTodos => {
                  setTodos(updatedTodos); // Update the state with the new list of tasks
                  handleClose(); // Close the dialog box
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


  const handleCheck = (id) => {
    const updatedTodo = todos.find((todo) => todo.id === id);
    updatedTodo.completed = !updatedTodo.completed;

    fetch(`http://localhost:8083/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTodo),
    })
      .then((response) => {
        if (response.ok) {
          const updatedTodos = todos.map((todo) =>
            todo.id === id ? updatedTodo : todo
          );
          setTodos(updatedTodos);
        } else {
          throw new Error('Failed to update ToDo status');
        }
      })
      .catch((error) => {
        console.error('Error updating ToDo status:', error);
      });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8083/api/todos/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          const updatedTodos = todos.filter((todo) => todo.id !== id);
          setTodos(updatedTodos);
        } else {
          throw new Error('Failed to delete ToDo');
        }
      })
      .catch((error) => {
        console.error('Error deleting ToDo:', error);
      });
  };

  // const handleShowIncompleteTasks = () => {
  //   setShowIncompleteTasks(true);
  //   setShowFilterDialog(false);
  // };
  // const handleSearch = () => {
  //   navigate('/search');
  // };

  const handleShowCompleteTasks = () => {
    //setShowCompleteTasks(true);
    setShowFilterDialog(false);
  };

  // const handleSearchClick = () => {
  //   setShowSearchBox(!showSearchBox);
  // };

  const newRequests = todos.filter(todo => !todo.completed);
  const inProgress = todos.filter(todo => !todo.completed && todo.status === 'inprogress');
  const completed = todos.filter(todo => todo.completed);

  return (
    <>
      <Navbar bg="black" expand="lg">
        <Container>
          <Navbar.Brand href="#my-task"><FcCustomerSupport />&nbsp;
            <font color='white'>PS Helpdesk</font></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to={`/Todo`}><font color='red'><MdOutlineTaskAlt />&nbsp;My tasks</font></Nav.Link>
              <Nav.Link as={Link} to={`/User`}><font color='white'><FaUserFriends />&nbsp;My team</font></Nav.Link>
              <Nav.Link as={Link} to={`/Reports`}><font color='white'><IoBarChartSharp />&nbsp;Dashboard</font></Nav.Link>
              {/* <Nav.Link as={Link} to={`/GrammarChecker`}><font color='white'><IoBarChartSharp />&nbsp;GrammarChecker</font></Nav.Link> */}
              {/* <Nav.Link as={Link} to={`/MyChatbot`}><font color='white'><IoBarChartSharp />&nbsp;MyChatbot</font></Nav.Link> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
        <font className="animate__animated animate__bounce" color='Orange'>Welcome, {username} &nbsp;&nbsp;&nbsp;
        </font>
        <Nav.Link as={Link} to={`/`}><font color='red'><RiLogoutBoxRLine />&nbsp;Logout&nbsp;&nbsp;&nbsp;</font></Nav.Link>
      </Navbar>
      { (
        <SearchItem
          search={search}
          setSearch={setSearch}
          fetchSearchResults={fetchSearchResults}
        />
      )}
      <Container className="mt-4">
        <Row className="align-items-center mb-3">
          <Col md={2}>
            <button type="button" class="btn btn-outline-danger" onClick={handleAddTaskClick}>+ Add task</button>


          </Col>
          <Col md={10} className="d-flex justify-content-end">
            <Form.Group className="mb-0 me-2" controlId="Filter">
              <font color='Red'><IoFilterOutline /> &nbsp;</font>
              <Form.Label className="d-inline"> <font color='Red' size='4'>Quick Filter : </font></Form.Label>

              <span onClick={() => handleShowFilter('High Priority')}>
                <Form.Label className="d-inline"> <font color='Green' size='4'><MdOutlineTaskAlt />&nbsp;High Priority | </font></Form.Label>
              </span>
              <span onClick={() => handleShowFilter('Due This Week')}>
                <Form.Label className="d-inline"> <font color='Green' size='4'><LiaCalendarWeekSolid />&nbsp;Due This Week | </font></Form.Label>
              </span>
              <span onClick={() => handleShowFilter('Due Next Week')}>
                <Form.Label className="d-inline"> <font color='Green' size='4'><FaCalendarAlt />&nbsp;Due Next Week | </font></Form.Label>
              </span>
              <span onClick={() => handleShowFilter(null)}>
                <Form.Label className="d-inline"> <font color='Red' size='4'><RxCrossCircled />&nbsp;Clear</font></Form.Label>
              </span>
            
            </Form.Group>
            {/* <Form.Group className="mb-0 me-3" controlId="Sort">
            <font color='Green'> <BiSortAlt2 /> &nbsp;</font>
              <Form.Label className="d-inline"><font color='Green'>Sort</font></Form.Label>
            </Form.Group> */}
            <Form.Group className="mb-0" controlId="Search">
              <div class="input-group mb-3">
                <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="Search" value={search} 
                onChange={(e) => setSearch(e.target.value)} />
                <span class="input-group-text" id="basic-addon1"><IoSearchOutline style={{ color: 'red' }} /></span>
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Container>
      
      {!showIncompleteTasks && (
        <Container className="mt-4">
          <Row>
            &nbsp;&nbsp;&nbsp;
            <Col>

              <div className="d-flex justify-content-between align-items-center mb-3 alert alert-primary">
                <h6 className="mb-0">New Requests</h6>
                <span class="badge text-bg-danger">{newRequests.length}</span>
              </div>
              {newRequests.length === 0 ? (
                <p><font size='2' color='gray'>BRAVO !!!! List is empty, you have completed all the assigned task to you :-) enjoy the day.....</font></p>
              ) : (
                newRequests.map(todo => (
                  <Card key={todo.id} className="mb-3">
                    <Card.Body className="d-flex justify-content-between">
                      <li className="item">

                        <label><strong>{todo.description}</strong></label>

                        {getPriorityBadge(todo.priority)}
                        <FaTrashAlt role="button" onClick={() => handleDelete(todo.id)} tabIndex="0" aria-label={`Delete ${todo.description}`} />
                        {/* <input type="checkbox" onChange={() => handleCheck(todo.id)} checked={todo.completed} /> */}

                        <MdOutlineDoneOutline onClick={() => handleCheck(todo.id)} tabIndex="1" aria-label={`Check ${todo.description}`} />

                      </li>

                    </Card.Body>
                    <p align="center">
                      <font size='2' color='gray'>Due : {todo.deadline} Category : {todo.category}</font></p>
                    <hr class="border border-danger border-3 opacity-80"></hr>
                  </Card>
                ))
              )}
            </Col>

            <Col>

              <div className="d-flex justify-content-between align-items-center mb-3 alert alert-warning">
                <h6>In Progress</h6>
                <span class="badge text-bg-danger">{inProgress.length}</span>
              </div>
              {inProgress.length === 0 ? (
                <p><font size='2' color='gray'>OOPS !!!! List is empty, nothing is in-progress state....</font>
                  <br></br>
                  {/* <img src={tasklogo} className="App-logo" alt="logo" /> */}
                  <br></br>
                  <div>
                    <iframe
                      src="https://giphy.com/embed/26ybvRzJrDKvVl8R2"
                      width="100%"
                      height="300"
                      frameBorder="0"
                      className="giphy-embed"
                      allowFullScreen

                    ></iframe>

                  </div>
                  {/* <img src="/Users/yuvarani-k/ReactCapstone/reactcapstone/src/assets/istockphoto-1394757974-1024x1024.jpg"></img> */}
                </p>
              ) : (
                inProgress.map(todo => (
                  <Card key={todo.id} className="mb-3">
                    <Card.Body className="d-flex justify-content-between">
                      <li className="item">
                        <label><strong>{todo.description}</strong></label>


                        {getPriorityBadge(todo.priority)}
                        <FaTrashAlt role="button" onClick={() => handleDelete(todo.id)} tabIndex="0" aria-label={`Delete ${todo.description}`} />
                        <MdOutlineDoneOutline onClick={() => handleCheck(todo.id)} tabIndex="1" aria-label={`Check ${todo.description}`} />


                      </li>
                    </Card.Body>
                    <p align="center">
                      <font size='2' color='gray'>Due : {todo.deadline} Category : {todo.category}</font></p>
                    <hr class="border border-danger border-3 opacity-80"></hr>
                  </Card>

                ))
              )}
            </Col>

            <Col>
              <div className="d-flex justify-content-between align-items-center mb-3 alert alert-success">
                <h6>Completed</h6>
                <span class="badge text-bg-danger">{completed.length}</span>
              </div>
              {completed.length === 0 ? (
                <p><font size='2' color='gray'>OOPS !!!! List is empty, lets target to close some task today ...</font></p>
              ) : (
                completed.map(todo => (
                  <Card key={todo.id} className="mb-3">
                    <Card.Body className="d-flex justify-content-between">
                      <li className="item">
                        <label><strong>{todo.description}</strong></label>

                        {getPriorityBadge(todo.priority)}
                        <FaTrashAlt role="button" onClick={() => handleDelete(todo.id)} tabIndex="0" aria-label={`Delete ${todo.description}`} />
                        <CgCloseO onClick={() => handleCheck(todo.id)} tabIndex="1" aria-label={`Check ${todo.description}`} />


                      </li>
                    </Card.Body>
                    <p align="center">
                      <font size='2' color='gray'>Due : {todo.deadline} Category : {todo.category}</font></p>
                    <hr class="border border-danger border-3 opacity-80"></hr>
                  </Card>
                ))
              )}
            </Col>

          </Row>
        </Container>
      )}

      {showIncompleteTasks && (
        <Row>
          <Col>
            <IncompleteTasks userId={userid} />
          </Col>
        </Row>
      )}

      {/*<Button variant="primary" onClick={() => setShowFilterDialog(true)}>
         Open Filters
      </Button>*/}

      <Modal show={showFilterDialog} onHide={() => setShowFilterDialog(false)} dialogClassName="modal-90w">
        <Modal.Header closeButton>
          <Modal.Title>Quick Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button className="filter-button mb-5" onClick={() => handleShowFilter('High Priority')}>
            <MdOutlineTaskAlt />&nbsp;High Priority
          </Button>&nbsp;&nbsp;
          <Button className="filter-button mb-5" onClick={() => handleShowFilter('Due This Week')}>
            <LiaCalendarWeekSolid />&nbsp;Due This Week
          </Button>&nbsp;&nbsp;
          <Button className="filter-button mb-5" onClick={() => handleShowFilter('Due Next Week')}>
            <LiaCalendarWeekSolid />&nbsp;Due Next Week
          </Button>&nbsp;&nbsp;
          <Button className="filter-button mb-5" onClick={() => handleShowFilter(null)}>
            <LiaCalendarWeekSolid />&nbsp;Clear Filter
          </Button>&nbsp;&nbsp;

          {/* Render filtered tasks here if a filter is applied */}
          {filter && (
            <div>
              <h4>Tasks:</h4>
              <ul>
                {tasks.map(task => (
                  <li key={task.id}>{task.description} - Due: {task.deadline}</li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showNewTaskForm} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title >
            <font color="Green">Add New Task</font>
          </Modal.Title>
        </Modal.Header>
        <hr class="border border-danger border-1 opacity-50"></hr>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-0" controlId="description">
              <Form.Label>Task Description</Form.Label>
              <Form.Control type="text" placeholder="Enter task description" value={formData.description} onChange={handleFormChange} required />
            </Form.Group>
            <Form.Group className="mb-2" controlId="deadline">
              <Form.Label>Deadline</Form.Label>
              <Form.Control type="date" value={formData.deadline} onChange={handleFormChange} required />
            </Form.Group>
            <Form.Group className="mb-2" controlId="priority">
              <Form.Label>Priority</Form.Label>
              <Form.Select value={formData.priority} onChange={handleFormChange}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Select value={formData.category} onChange={handleFormChange} required>
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <hr class="border border-danger border-1 opacity-50"></hr>
            <p align="right">
              <Button variant="success" type="submit" align="right">
                Add Task
              </Button></p>

          </Form>
        </Modal.Body>
      </Modal>


    </>
  );
};

export default Todo;
