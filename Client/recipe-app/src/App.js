import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Navigate, Routes } from 'react-router-dom';
import LoginForm from "./components/Login"
import RegisterForm from "./components/RegisterForm"
// import Dashboard from './components/Recipe';
import axios from 'axios';
import Recipe from './components/Recipe';
import Navbar from './components/Navbar';
function App() {

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/login"
            element={<LoginForm />}
          />
          <Route path="/recipe"
            element={
              // token ? <Dashboard token={token} /> : <Navigate to="/login" />
              <Recipe />
            }
          />
          <Route path="/register"
            element={<RegisterForm />}
          />
          <Route path="/"
            element={<Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}






export default App;
