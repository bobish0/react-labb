import React from 'react';
import { Task } from '../app';



interface TaskListProps {
  tasks: Task[]
  onCompleteChange: (taskToChange: Task, isComplete: boolean) => Promise<void>
}

export const TaskList = ({ tasks, onCompleteChange }: TaskListProps) => (
  <ul>
    {[].map(task => (
      <li key={task.id}>{JSON.stringify(task)}</li>
    ))}
  </ul>
);
