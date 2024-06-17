import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './components/UserContext.js';
import Todo from './components/Todo.js';
import Login from './components/Login.js';
import User from './components/User.js';
import SearchItem from './components/SearchItem.js';
import Reports from './components/Reports.js';
import MyNavbar from './components/MyNavbar.js';
import './components/MyNavbar.css';
import ImageViewer from './components/ImageViewer.js';

function App() {
  const [search, setSearch] = useState('');

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/MyNavbar"
            element={<MyNavbar />}
          />
          <Route
            path="/Todo"
            element={<Todo />}
          />
          <Route
            path="/User"
            element={<User />}
          />
          <Route
            path="/Reports"
            element={<Reports />}
          />
          <Route
            path="/SearchItem"
            element={<SearchItem search={search} setSearch={setSearch} />}
          />
           <Route path="/ImageViewer" element={ImageViewer} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
