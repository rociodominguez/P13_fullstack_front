import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import HomePage from './pages/Home/HomePage/HomePage';
import AddBookForm from './components/AddBook/AddBook'; 
import DiscoverBooksPage from './pages/DiscoverBooks/DiscoverBooks';
const App = () => (
  
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/add-book" element={<AddBookForm />} />
      <Route path="/discover-books" element={<DiscoverBooksPage />} />
    </Routes>
  </Router>
);

export default App;