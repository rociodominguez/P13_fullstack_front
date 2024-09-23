import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DiscoverBooksPage = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [addedBooks, setAddedBooks] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddedBooks = async () => {
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
        const ids = new Set(data.map(book => book.title + book.author)); 
        setAddedBooks(ids);
      } catch (error) {
        console.error('Error fetching added books:', error);
        setError('Failed to fetch added books');
      }
    };

    fetchAddedBooks();
  }, []);

  const searchBooks = async () => {
    if (!query) return;
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();
      setBooks(data.items || []);
    } catch (error) {
      console.error('Error searching books:', error);
      setError('Failed to fetch books');
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    searchBooks();
  };

  const addBookToList = async (book, status) => {
    const bookId = book.volumeInfo.title + book.volumeInfo.authors?.join(', ');
    if (addedBooks.has(bookId)) {
      alert('This book has already been added');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8080/api/books/discovered/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown',
          status
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add book');
      }

      const result = await response.json();
      console.log('Book added:', result);
      setAddedBooks(prev => new Set(prev).add(bookId));
      navigate('/home'); 
    } catch (error) {
      console.error('Error adding book:', error);
      setError('Failed to add book');
    }
  };

  return (
    <div>
      <h1>Discover Books</h1>
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Search for books..." 
        />
        <button type="submit">Search</button>
      </form>

      {error && <p>{error}</p>}

      <div>
        {books.length ? (
          books.map(book => (
            <div key={book.id}>
              <p>{book.volumeInfo.title} by {book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown'}</p>
              <p>{book.volumeInfo.publishedDate}</p>
              <button onClick={() => addBookToList(book, 'want to read')}>Add to Want to Read</button>
              <button onClick={() => addBookToList(book, 'currently reading')}>Add to Currently Reading</button>
              <button onClick={() => addBookToList(book, 'read')}>Add to Read</button>
            </div>
          ))
        ) : (
          <p>No books found</p>
        )}
      </div>
    </div>
  );
};

export default DiscoverBooksPage;
