import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddBookForm.css'; 


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
  
      navigate('/home'); 
    } catch (err) {
      console.error('Error adding book:', err);
      setError('Error adding book');
    }
  };

  return (
    <div className="add-book-form">
      <h1>Add New Book</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleAddBook} className="form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            className="select"
          >
            <option value="want to read">Want to Read</option>
            <option value="currently reading">Currently Reading</option>
            <option value="read">Read</option>
          </select>
        </div>
        <button type="submit" className="submit-button">Add Book</button>
      </form>
    </div>
  );
};

export default AddBookForm;