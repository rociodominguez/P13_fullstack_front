// BookItem.jsx
import React from 'react';

const BookItem = ({ book, onStatusChange }) => (
  <div>
    <h3>{book.title}</h3>
    <p>{book.author}</p>
    <p>Estado: {book.status}</p>
    <button onClick={() => onStatusChange(book._id, 'want to read')}>Quiero Leer</button>
    <button onClick={() => onStatusChange(book._id, 'currently reading')}>Leyendo</button>
    <button onClick={() => onStatusChange(book._id, 'read')}>Leído</button>
  </div>
);

export default BookItem;
