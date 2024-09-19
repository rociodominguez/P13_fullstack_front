// AddBookForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddBookForm = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('want to read');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAddBook = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
  
    try {
      const response = await fetch('http://localhost:8080/api/books/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, author, status })
      });
  
      const data = await response.json(); 
      
      if (!response.ok) {
        console.log('Error response:', data);
        setError(data.error || 'Error adding book');
        return;
      }
  
      navigate('/home'); // Redirige a la página de inicio o donde esté la lista de libros
    } catch (err) {
      console.error('Error adding book:', err);
      setError('Error adding book');
    }
  };

  return (
    <div>
      <h1>Add New Book</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleAddBook}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="want to read">Want to Read</option>
            <option value="currently reading">Currently Reading</option>
            <option value="read">Read</option>
          </select>
        </div>
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default AddBookForm;
