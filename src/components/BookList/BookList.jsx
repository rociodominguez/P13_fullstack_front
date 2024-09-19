import React, { useEffect, useState } from 'react';
import BookItem from './BookItem';

const BooksList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch('http://localhost:8080/api/books/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setBooks(data);
    };

    fetchBooks();
  }, []);

  const handleStatusChange = async (bookId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/books/update/${bookId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const updatedBook = await response.json();
        setBooks(books.map(book => (book._id === updatedBook._id ? updatedBook : book)));
      } else {
        const data = await response.json();
        console.error('Error al cambiar el estado del libro:', data.error);
      }
    } catch (err) {
      console.error('Error al cambiar el estado del libro:', err);
    }
  };

  return (
    <div>
      <h1>Books</h1>
      <div>
        <h2>Want to Read</h2>
        {books.filter(book => book.status === 'want to read').map(book => (
          <BookItem key={book._id} book={book} onStatusChange={handleStatusChange} />
        ))}
      </div>
      <div>
        <h2>Currently Reading</h2>
        {books.filter(book => book.status === 'currently reading').map(book => (
          <BookItem key={book._id} book={book} onStatusChange={handleStatusChange} />
        ))}
      </div>
      <div>
        <h2>Read</h2>
        {books.filter(book => book.status === 'read').map(book => (
          <BookItem key={book._id} book={book} onStatusChange={handleStatusChange} />
        ))}
      </div>
    </div>
  );
};

export default BooksList;
