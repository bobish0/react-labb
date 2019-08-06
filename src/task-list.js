import React from 'react';

export const TaskList = ({ tasks, onCompleteChange }) => (
  <ul>
    {[].map(task => (
      <li key={task.id}>{JSON.stringify(task)}</li>
    ))}
  </ul>
);
