import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DiscoverBooks.css';

const DiscoverBooksPage = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [error, setError] = useState('');
  const [addedBooks, setAddedBooks] = useState(new Set());
  const [filterAuthor, setFilterAuthor] = useState(''); 
  const [filterYear, setFilterYear] = useState('');
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
      setFilteredBooks(data.items || []);
    } catch (error) {
      console.error('Error searching books:', error);
      setError('Failed to fetch books');
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    searchBooks();
  };

  const applyFilters = () => {
    let filtered = books;

    if (filterAuthor) {
      filtered = filtered.filter(book => book.volumeInfo.authors && book.volumeInfo.authors.includes(filterAuthor));
    }

    if (filterYear) {
      filtered = filtered.filter(book => book.volumeInfo.publishedDate && book.volumeInfo.publishedDate.startsWith(filterYear));
    }

    setFilteredBooks(filtered);
  };

  const clearFilters = () => {
    setFilterAuthor('');
    setFilterYear('');
    setFilteredBooks(books);
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
    <div className="discover-books-page">
      <h1 className="page-title">Discover Books</h1>
      <form className="search-form" onSubmit={handleSearch}>
        <input 
          type="text" 
          className="search-input"
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Search for books..." 
        />
        <button className="search-button" type="submit">Search</button>
      </form>

      {/* Filtros */}
      <div className="filters">
        <label htmlFor="filterAuthor">Filter by Author:</label>
        <input
          id="filterAuthor"
          type="text"
          className="filter-input"
          value={filterAuthor}
          onChange={(e) => setFilterAuthor(e.target.value)}
          placeholder="Author's name"
        />
        <label htmlFor="filterYear">Filter by Year:</label>
        <input
          id="filterYear"
          type="number"
          className="filter-input"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          placeholder="Year"
        />
        <div className="filter-buttons">
          <button className="apply-filters-button" onClick={applyFilters}>Apply Filters</button>
          <button className="clear-filters-button" onClick={clearFilters}>Clear Filters</button>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="books-list">
        {filteredBooks.length ? (
          filteredBooks.map(book => (
            <div className="book-card" key={book.id}>
              <p className="book-title">{book.volumeInfo.title} by {book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown'}</p>
              <p className="book-year">{book.volumeInfo.publishedDate}</p>
              <div className="book-actions">
                <button className="add-button" onClick={() => addBookToList(book, 'want to read')}>Add to Want to Read</button>
                <button className="add-button" onClick={() => addBookToList(book, 'currently reading')}>Add to Currently Reading</button>
                <button className="add-button" onClick={() => addBookToList(book, 'read')}>Add to Read</button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-books-message">No books found</p>
        )}
      </div>
    </div>
  );
};

export default DiscoverBooksPage;
