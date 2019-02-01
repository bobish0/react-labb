import React from 'react';

export const TaskList = ({ items, onCompleteChange }) => (
  <ul>
    {[].map(item => (
      <li key={item.id}>{JSON.stringify(item)}</li>
    ))}
  </ul>
);
