import React, { Component, useState } from 'react';

export const NewTask = (props) => {

  const [task, setTask] = useState({name: ''});

  const onChange = event => {
    console.log(event.target.value);
    setTask({name: ''});
  }

  const onSubmit = event => {
    event.preventDefault();
    // props.onCreate(task.name);
  };

  return (
    <form onSubmit={onSubmit}>
      <input type='text' value={task.name} onChange={onChange} />
      <button>Save</button>
    </form>
  );
}
