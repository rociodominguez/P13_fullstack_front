import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [wantToRead, setWantToRead] = useState([]);
  const [currentlyReading, setCurrentlyReading] = useState([]);
  const [read, setRead] = useState([]);
  const [readingGoal, setReadingGoal] = useState(0);
  const [inputGoal, setInputGoal] = useState('');
  const [readCount, setReadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Recuperar el objetivo de lectura desde localStorage
    const storedGoal = localStorage.getItem('readingGoal');
    if (storedGoal) {
      setReadingGoal(parseInt(storedGoal, 10) || 0); // Asegúrate de que sea un número válido
      setInputGoal(storedGoal);
    }

    const fetchBooks = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:8080/api/books/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }

        const data = await response.json();
        setWantToRead(data.filter(book => book.status === 'want to read'));
        setCurrentlyReading(data.filter(book => book.status === 'currently reading'));
        setRead(data.filter(book => book.status === 'read'));
        setReadCount(data.filter(book => book.status === 'read').length); // Actualiza el conteo de libros leídos
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const handleStatusChange = async (bookId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8080/api/books/update/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update book status');
      }

      const updatedBook = await response.json();

      // Actualizar el estado con el nuevo estado
      setWantToRead(prev => prev.filter(book => book._id !== bookId));
      setCurrentlyReading(prev => prev.filter(book => book._id !== bookId));
      setRead(prev => prev.filter(book => book._id !== bookId));

      if (newStatus === 'want to read') {
        setWantToRead(prev => [...prev, updatedBook]);
      } else if (newStatus === 'currently reading') {
        setCurrentlyReading(prev => [...prev, updatedBook]);
      } else if (newStatus === 'read') {
        setRead(prev => [...prev, updatedBook]);
        setReadCount(prevCount => prevCount + 1); // Actualiza el conteo de libros leídos
      }
    } catch (error) {
      console.error('Error changing book status:', error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this book?');
    if (!isConfirmed) return;
  
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8080/api/books/${bookId}/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete book');
      }
  
      // Remover el libro del estado según su categoría
      setWantToRead(prev => prev.filter(book => book._id !== bookId));
      setCurrentlyReading(prev => prev.filter(book => book._id !== bookId));
      setRead(prev => prev.filter(book => book._id !== bookId));
  
      // Actualiza el conteo de libros leídos sin permitir que sea negativo
      setReadCount(prevCount => Math.max(prevCount - 1, 0)); // Se asegura de que no baje de 0
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };
  

  const handleGoalChange = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const newGoal = parseInt(inputGoal, 10);

    if (isNaN(newGoal) || newGoal < 0) {
      alert('Please enter a valid positive number');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/users/update-reading-goal', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ readingGoal: newGoal }),
      });

      if (!response.ok) {
        throw new Error('Failed to update reading goal');
      }

      const user = await response.json();
      setReadingGoal(user.readingGoal);
      localStorage.setItem('readingGoal', user.readingGoal); // Guardar el nuevo objetivo en localStorage
    } catch (error) {
      console.error('Error updating reading goal:', error);
    }
  };

  return (
    <div>
      <h1>Your Reading Tracker</h1>

      <button onClick={() => navigate('/add-book')}>Add New Book</button>
      <button onClick={() => navigate('/discover-books')}>Discover Books</button>

      <form onSubmit={handleGoalChange}>
        <label>
          Annual Reading Goal:
          <input
            type="number"
            value={inputGoal || ''} // Asegúrate de que no sea undefined
            onChange={(e) => setInputGoal(e.target.value)}
            min="0"
            placeholder="Enter your goal"
          />
        </label>
        <button type="submit">Save Goal</button>
      </form>

      <div>
        <h2>Reading Goal</h2>
        {readingGoal ? (
          <p>You have read {readCount} out of {readingGoal} books this year.</p>
        ) : (
          <p>Please set your annual reading goal.</p>
        )}
        <p>{readCount >= readingGoal ? 'Congratulations! You have met your goal!' : `Keep going! You need to read ${readingGoal - readCount} more books to meet your goal.`}</p>
      </div>

      <div>
        <h2>Want to Read</h2>
        {wantToRead.length ? (
          wantToRead.map(book => (
            <div key={book._id}>
              <p>{book.title} by {book.author}</p>
              <button onClick={() => handleStatusChange(book._id, 'currently reading')}>Move to Currently Reading</button>
              <button onClick={() => handleStatusChange(book._id, 'read')}>Mark as Read</button>
              <button onClick={() => handleDeleteBook(book._id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No books to display</p>
        )}
      </div>

      <div>
        <h2>Currently Reading</h2>
        {currentlyReading.length ? (
          currentlyReading.map(book => (
            <div key={book._id}>
              <p>{book.title} by {book.author}</p>
              <button onClick={() => handleStatusChange(book._id, 'want to read')}>Move to Want to Read</button>
              <button onClick={() => handleStatusChange(book._id, 'read')}>Mark as Read</button>
              <button onClick={() => handleDeleteBook(book._id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No books to display</p>
        )}
      </div>

      <div>
        <h2>Read</h2>
        {read.length ? (
          read.map(book => (
            <div key={book._id}>
              <p>{book.title} by {book.author}</p>
              <button onClick={() => handleStatusChange(book._id, 'want to read')}>Move to Want to Read</button>
              <button onClick={() => handleStatusChange(book._id, 'currently reading')}>Move to Currently Reading</button>
              <button onClick={() => handleDeleteBook(book._id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No books to display</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
