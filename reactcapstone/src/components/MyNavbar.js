import React from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { RiLogoutBoxRLine } from "react-icons/ri";
import { FcCustomerSupport } from "react-icons/fc";
import { MdOutlineTaskAlt } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { IoBarChartSharp } from "react-icons/io5";
import '../components/MyNavbar.css';

const MyNavbar = ({ username }) => {
  const location = useLocation();

  const getNavLinkClass = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

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
            <Nav.Link
              as={Link}
              to="/Todo"
              className={getNavLinkClass('/Todo')}
            >
              <MdOutlineTaskAlt />&nbsp;My tasks
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/User"
              className={getNavLinkClass('/User')}
            >
              <FaUserFriends />&nbsp;My team
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/Reports"
              className={getNavLinkClass('/Reports')}
            >
              <IoBarChartSharp />&nbsp;Dashboard
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <font className="animate__animated animate__bounce" color='Orange'>Welcome, {username} &nbsp;&nbsp;</font>
      <Nav.Link as={Link} to="/">
        <font color='red'><RiLogoutBoxRLine />&nbsp;Logout&nbsp;&nbsp;</font>
      </Nav.Link>
    </Navbar>
  );
};

export default MyNavbar;
