import React from 'react';
import './ReadingGoal.css';
import { Button, ButtonGroup } from '@chakra-ui/react'


const ReadingGoal = ({ readingGoal, setReadingGoal, inputGoal, setInputGoal }) => {
  const handleGoalChange = (event) => {
    event.preventDefault();
    const newGoal = parseInt(inputGoal, 10);

    if (isNaN(newGoal) || newGoal < 0) {
      alert('Please enter a valid positive number');
      return;
    }

    setReadingGoal(newGoal);
    localStorage.setItem('readingGoal', newGoal);
  };

  return (
    <div className="reading-goal">
      <form onSubmit={handleGoalChange} className="goal-form">
        <label className="goal-label">
          Annual Reading Goal:
          <input
            type="number"
            value={inputGoal || ''}
            onChange={(e) => setInputGoal(e.target.value)}
            min="0"
            placeholder="Enter your goal"
            className="goal-input"
          />
        </label>
        <Button colorScheme='pink' size='sm' variant='solid' type="submit" className="goal-button">Save Goal</Button>
      </form>

      <div className="goal-status">
        {readingGoal ? (
          <p>You have set a goal to read {readingGoal} books this year.</p>
        ) : (
          <p>Please set your annual reading goal.</p>
        )}
      </div>
    </div>
  );
};

export default ReadingGoal;
