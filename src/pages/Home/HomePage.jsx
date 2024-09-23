import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReadingGoal from './ReadingGoal';
import BookList from './BookList';
import './HomePage.css';
import { Button, ButtonGroup } from '@chakra-ui/react'

const HomePage = () => {
  const [books, setBooks] = useState({ wantToRead: [], currentlyReading: [], read: [] });
  const [readingGoal, setReadingGoal] = useState(0);
  const [inputGoal, setInputGoal] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedGoal = localStorage.getItem('readingGoal');
    if (storedGoal) {
      setReadingGoal(parseInt(storedGoal, 10) || 0);
      setInputGoal(storedGoal);
    }
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8080/api/books/', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch books');

      const data = await response.json();
      setBooks({
        wantToRead: data.filter(book => book.status === 'want to read'),
        currentlyReading: data.filter(book => book.status === 'currently reading'),
        read: data.filter(book => book.status === 'read'),
      });
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

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

      setBooks(prevBooks => {
        const newBooks = { ...prevBooks };
        Object.keys(newBooks).forEach(key => {
          newBooks[key] = newBooks[key].filter(book => book._id !== bookId);
        });
        if (newStatus === 'want to read') {
          newBooks.wantToRead.push(updatedBook);
        } else if (newStatus === 'currently reading') {
          newBooks.currentlyReading.push(updatedBook);
        } else if (newStatus === 'read') {
          newBooks.read.push(updatedBook);
        }
        return newBooks;
      });
    } catch (error) {
      console.error('Error changing book status:', error);
    }
  };

  const handleDelete = async (bookId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8080/api/books/${bookId}/delete`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to delete book');
      }

      setBooks(prevBooks => {
        const newBooks = { ...prevBooks };
        Object.keys(newBooks).forEach(key => {
          newBooks[key] = newBooks[key].filter(book => book._id !== bookId);
        });
        return newBooks;
      });
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div className="home-page">
      <h1>Your Reading Tracker</h1>
      <Button colorScheme='pink' size='sm' className="button" onClick={() => navigate('/add-book')}>Add New Book</Button>
      <Button colorScheme='pink' size='sm' className="button" onClick={() => navigate('/discover-books')}>Discover Books</Button>
      <Button colorScheme='pink' size='sm' className="button" onClick={handleLogout}>Logout</Button>

      <ReadingGoal
        readingGoal={readingGoal}
        setReadingGoal={setReadingGoal}
        inputGoal={inputGoal}
        setInputGoal={setInputGoal}
      />

      <BookList
        books={books.wantToRead}
        title="Want to Read"
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        className="book-list"
      />
      <BookList
        books={books.currentlyReading}
        title="Currently Reading"
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        className="book-list"
      />
      <BookList
        books={books.read}
        title="Read"
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        className="book-list"
      />
    </div>
  );
};

export default HomePage;
