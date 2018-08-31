import React from 'react';

export const TaskList = ({ items = [], onCompleatChange }) => (
  <ul>
    {items.map(item => (
      <li key={item.id}>{JSON.stringify(item)}</li>
    ))}
  </ul>
);
