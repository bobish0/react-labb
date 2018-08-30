import React from 'react';
import { observer } from 'mobx-react';

export const TaskList = observer(({ items }) => (
  <ul>
    {items.map(item => (
      <li key={item.id}>
        <input
          type="checkbox"
          checked={item.isComplete}
          // onChange={event => onCompleatChange(item, event.target.checked)}
          onChange={event => item.changeCompleatTask(event.target.checked)}
        />
        {item.name}
      </li>
    ))}
  </ul>
));
