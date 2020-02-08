import React, { Component, useState } from 'react';

export const NewTask = (props) => {
  const [taskName, setTaskName] = useState('');

  const onChange = event => {
    console.log(event.target.value);
    setTaskName('');
  }

  const onSubmit = event => {
    event.preventDefault();
    // props.onCreate(taskName);
  };

  return (
    <form onSubmit={onSubmit}>
      <input type='text' value={taskName} onChange={onChange} />
      <button>Save</button>
    </form>
  );
}
