import React from 'react';

export const TaskList = ({ items, onCompleatChange }) => (
  <ul>
    {items.map(item => (
      <li key={item.id}>
        <input
          type="checkbox"
          checked={item.isComplete}
          onChange={event => onCompleatChange(item, event.target.checked)}
        />
        {item.name}
      </li>
    ))}
  </ul>
);
