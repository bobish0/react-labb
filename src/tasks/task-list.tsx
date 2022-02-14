import React from "react";
import { Task } from "../app";

interface TaskListProps {
  tasks: Task[];
  onCompleteChange: (taskToChange: Task, isComplete: boolean) => Promise<void>;
}

export const TaskList = ({ tasks, onCompleteChange }: TaskListProps) => (
  <ul>
    {tasks.map((task) => (
      <li key={task.id}>
        {task.name}{" "}
        <input
          type="checkbox"
          onChange={(event) => {
            console.log(
              "Update task: " + task + ". Complete: " + event.target.checked
            );
            onCompleteChange(task, event.target.checked);
          }}
          checked={task.isComplete}
        />
      </li>
    ))}
  </ul>
);
