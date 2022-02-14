import React, { useState } from 'react';


interface NewTaskProps {
  onCreate: (taskName: string) => void
  checkbox: boolean;
}

export const NewTask = (props: NewTaskProps) => {
  const [taskName, setTaskName] = useState<string>('');
  const [checkbox, setChecked] = useState(false);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setTaskName(event.target.value); // '' Before. 
    setChecked(!checkbox);
  }

  const onSubmit = (event: React.FormEvent)  => {
    event.preventDefault();
    props.onCreate(taskName);
    //setChecked(false)
    setTaskName('');
  };

  return (
    <form onSubmit={onSubmit}>
      <input type='text' value={taskName} onChange={onChange} />
      <button>Save</button>
    </form>
  );
}
