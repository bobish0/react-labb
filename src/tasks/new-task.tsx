import React, { useState } from 'react';

interface NewTaskProps {
  onCreate: (taskName: string) => void
}

export const NewTask = (props: NewTaskProps) => {
  const [taskName, setTaskName] = useState<string>('');

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setTaskName('');
  }

  const onSubmit = (event: React.FormEvent)  => {
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
