import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

const HomePage = () => {
  const [wantToRead, setWantToRead] = useState([]);
  const [currentlyReading, setCurrentlyReading] = useState([]);
  const [read, setRead] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
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

      // Update state with the new status
      setWantToRead(prev => prev.filter(book => book._id !== bookId));
      setCurrentlyReading(prev => prev.filter(book => book._id !== bookId));
      setRead(prev => prev.filter(book => book._id !== bookId));

      if (newStatus === 'want to read') {
        setWantToRead(prev => [...prev, updatedBook]);
      } else if (newStatus === 'currently reading') {
        setCurrentlyReading(prev => [...prev, updatedBook]);
      } else if (newStatus === 'read') {
        setRead(prev => [...prev, updatedBook]);
      }
    } catch (error) {
      console.error('Error changing book status:', error);
    }
  };

  return (
    <div>
      <h1>Your Reading Tracker</h1>

      <button onClick={() => navigate('/add-book')}>Add New Book</button>

      <div>
        <h2>Want to Read</h2>
        {wantToRead.length ? (
          wantToRead.map(book => (
            <div key={book._id}>
              <p>{book.title} by {book.author}</p>
              <button onClick={() => handleStatusChange(book._id, 'currently reading')}>Move to Currently Reading</button>
              <button onClick={() => handleStatusChange(book._id, 'read')}>Mark as Read</button>
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
