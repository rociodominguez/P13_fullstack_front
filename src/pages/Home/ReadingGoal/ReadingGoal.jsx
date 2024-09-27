import React, { useState, useEffect } from 'react';

const ReadingGoal = ({ booksRead }) => {
  const [readingGoal, setReadingGoal] = useState(0);

  useEffect(() => {
    const goalFromStorage = localStorage.getItem('readingGoal');

    if (goalFromStorage) {
      setReadingGoal(parseInt(goalFromStorage, 10));
    }
  }, []);

  const handleGoalChange = (inputGoal) => {
    if (isNaN(inputGoal) || inputGoal <= 0) {
      alert('Please enter a valid number greater than 0');
      return;
    }

    setReadingGoal(inputGoal);
    localStorage.setItem('readingGoal', inputGoal);

    fetch('http://localhost:8080/api/users/update-reading-goal', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ readingGoal: inputGoal })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  return (
    <div>
      <h2>Your Reading Goal</h2>
      <p>Current Goal: {readingGoal} books</p>
      
      <input
        type="number"
        placeholder="Set your reading goal"
        onChange={(e) => handleGoalChange(e.target.value)}
      />
      <button onClick={() => handleGoalChange(readingGoal)}>Set Goal</button>

      {readingGoal > 0 && (
        <div className="goal-status">
          <p>You have read {booksRead} of {readingGoal} books. {readingGoal - booksRead} books left to reach your goal.</p>
          {booksRead >= readingGoal && <p>Congratulations! You've reached your reading goal!</p>}
        </div>
      )}
    </div>
  );
};

export default ReadingGoal;
