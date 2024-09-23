import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Error al registrarse');
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      navigate('/home'); 
    } catch (err) {
      console.error('Error al registrar:', err);
      setError('Error al registrarse');
    }
  };

  return (
    <form className="form" onSubmit={handleRegister}>
      <p className="form-title">Create an account</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="input-container">
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
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
        Register 🌺
      </button>
      <p className="signup-link">
        Already have an account?
        <a href="/login"> Sign in</a>
      </p>
    </form>
  );
};

export default RegisterPage;
