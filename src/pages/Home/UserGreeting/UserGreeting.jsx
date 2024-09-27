import React from 'react';

const UserGreeting = ({ userName }) => (
  <div className="user-greeting">
    <h1>💚 Welcome, {userName}!</h1>
    <h2>Your Reading Tracker</h2>
  </div>
);

export default UserGreeting;