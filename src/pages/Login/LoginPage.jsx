import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Error al iniciar sesión');
        return;
      }
  
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.name); 
      localStorage.setItem('readingGoal', data.readingGoal || 0); 
      navigate('/home');
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('Error al iniciar sesión');
    }
  };

  return (
    <form className="form" onSubmit={handleLogin}>
      <p className="form-title">Sign in to your account</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <span></span>
      </div>
      <div className="input-container">
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="submit">
        Sign in 🌼
      </button>
      <p className="signup-link">
        No account?
        <a href="/register"> Sign up</a>
      </p>
    </form>
  );
};

export default LoginPage;
