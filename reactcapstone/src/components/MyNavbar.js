import { Nav, Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { RiLogoutBoxRLine } from "react-icons/ri";
import { FcCustomerSupport } from "react-icons/fc";
import { MdOutlineTaskAlt } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { IoBarChartSharp } from "react-icons/io5";
import '../components/MyNavbar.css';

const MyNavbar = ({ username }) => {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">
          <FcCustomerSupport />
          <span className="brand-text">PS Helpdesk</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={`/Todo`} activeClassName="NavLink-active" className="nav-link">
              <MdOutlineTaskAlt />&nbsp;My tasks
            </Nav.Link>
            <Nav.Link as={Link} to={`/User`} activeClassName="NavLink-active" className="nav-link">
              <FaUserFriends />&nbsp;My team
            </Nav.Link>
            <Nav.Link as={Link} to={`/Reports`} activeClassName="NavLink-active" className="nav-link">
              <IoBarChartSharp />&nbsp;Dashboard
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <font className="animate__animated animate__bounce" color='Orange'>Welcome, {username} &nbsp;&nbsp;&nbsp;
        </font>
        <Nav.Link as={Link} to={`/`}><font color='red'><RiLogoutBoxRLine />&nbsp;Logout&nbsp;&nbsp;&nbsp;</font></Nav.Link>
     
    </Navbar>
  );
};

export default MyNavbar;
