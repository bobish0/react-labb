import React from 'react'

export const TaskList = ({ items, onCompleatChange }) => (
  <ul>
    {items.map(item => (
      <li key={item.id}>
        {item.name}
        <input
          type="checkbox"
          checked={item.completed}
          onChange={event => onCompleatChange(item.id, event.target.checked)}
        />
      </li>
    ))}
  </ul>
)
