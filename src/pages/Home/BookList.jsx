import React from 'react';
import './BookList.css';
import { Button, ButtonGroup } from '@chakra-ui/react'


const BookList = ({ books, title, onStatusChange, onDelete }) => {
  return (
    <div className="book-list">
      <h2 className="book-list-title">{title}</h2>
      {books.length ? (
        books.map(book => (
          <div key={book._id} className="book-item">
            <p className="book-info">{book.title} by {book.author}</p>
            <div className="button-group">
              {title === "Want to Read" && (
                <>
                  <Button colorScheme='pink' variant='outline' size='sm' className="status-button" onClick={() => onStatusChange(book._id, 'currently reading')}>Move to Currently Reading</Button>
                  <Button colorScheme='pink' variant='outline' size='sm' className="status-button" onClick={() => onStatusChange(book._id, 'read')}>Mark as Read</Button>
                </>
              )}
              {title === "Currently Reading" && (
                <>
                  <Button colorScheme='pink' variant='outline' size='sm' className="status-button" onClick={() => onStatusChange(book._id, 'want to read')}>Move to Want to Read</Button>
                  <Button colorScheme='pink' variant='outline' size='sm' className="status-button" onClick={() => onStatusChange(book._id, 'read')}>Mark as Read</Button>
                </>
              )}
              {title === "Read" && (
                <>
                  <Button colorScheme='pink' variant='outline' size='sm' className="status-button" onClick={() => onStatusChange(book._id, 'want to read')}>Move to Want to Read</Button>
                  <Button colorScheme='pink' variant='outline' size='sm' className="status-button" onClick={() => onStatusChange(book._id, 'currently reading')}>Move to Currently Reading</Button>
                </>
              )}
              <Button size='sm' colorScheme='red' variant='ghost' className="delete-button" onClick={() => onDelete(book._id)}>Delete</Button>
            </div>
          </div>
        ))
      ) : (
        <p className="no-books-message">No books to display</p>
      )}
    </div>
  );
};

export default BookList;
