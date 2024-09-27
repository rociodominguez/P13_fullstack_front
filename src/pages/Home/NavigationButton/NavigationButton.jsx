import React from 'react';
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const NavigationButtons = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="navigation-buttons">
      <Button colorScheme='pink' size='sm' className="button" onClick={() => navigate('/add-book')}>Add New Book</Button>
      <Button colorScheme='pink' size='sm' className="button" onClick={() => navigate('/discover-books')}>Discover Books</Button>
      <Button colorScheme='pink' size='sm' className="button" onClick={onLogout}>Logout</Button>
    </div>
  );
};

export default NavigationButtons;
