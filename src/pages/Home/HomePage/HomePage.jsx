import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReadingGoal from '../ReadingGoal/ReadingGoal';
import BookList from '../BookList/BookList';
import UserGreeting from '../UserGreeting/UserGreeting';
import NavigationButtons from '../NavigationButton/NavigationButton';
import './HomePage.css';

const HomePage = () => {
  const [books, setBooks] = useState({ wantToRead: [], currentlyReading: [], read: [] });
  const [readingGoal, setReadingGoal] = useState(0);
  const [inputGoal, setInputGoal] = useState('');
  const [booksReadCount, setBooksReadCount] = useState(0);
  const navigate = useNavigate();

  const userName = localStorage.getItem('username');

  useEffect(() => {
    const storedGoal = localStorage.getItem('readingGoal');
    if (storedGoal) {
      setReadingGoal(parseInt(storedGoal, 10) || 0);
      setInputGoal(storedGoal);
    }
    fetchBooks();
  }, []);

  useEffect(() => {
    const currentReadCount = books.read.length;
    setBooksReadCount(currentReadCount);
  }, [books]);

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
    localStorage.removeItem('username');
    navigate('/');
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
          // Incrementa el conteo de libros leídos
          setBooksReadCount(prevCount => prevCount + 1);
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
      <UserGreeting userName={userName} />
      <NavigationButtons onLogout={handleLogout} />

      <ReadingGoal booksRead={booksReadCount} />

      <BookList
        books={books.wantToRead}
        title="Want to Read"
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
      <BookList
        books={books.currentlyReading}
        title="Currently Reading"
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
      <BookList
        books={books.read}
        title="Read"
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default HomePage;
