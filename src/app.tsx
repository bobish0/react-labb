import React, { Fragment } from 'react';
import { TaskList } from './tasks/task-list';
import { NewTask } from './tasks/new-task';
import { apiClient } from './api/api-client';
import { constructTask } from './tasks/task';

export interface Task {
  id: number
  isComplete: boolean
  name: string
}

interface AppComponentState {
  loading: boolean
  tasks: Task[]
}

class AppComponent extends React.Component<{}, AppComponentState> {
  state = {
    tasks: [],
    loading: true
  };

  componentDidMount() {
    apiClient
      .getAllTasks()
      .then(tasks => this.setState({ tasks, loading: false }));
  }

  onCompleteChange = async (taskToChange: Task, isComplete: boolean) => {
    const newTaskList = this.state.tasks.map(task => {
      if (task.id === taskToChange.id) {
        return constructTask(task.name, taskToChange.id, isComplete);
      }
      return task;
    });
    this.setState({ ...this.state, tasks: newTaskList });
  };

  onCreate = (taskName: string) => {
    const newTask = constructTask(taskName);
    this.setState({
      tasks: [...this.state.tasks, newTask]
    });
  };

  render() {
    if (this.state.loading) {
      return <h1>Loading...</h1>;
    }
    return (
      <Fragment>
        <NewTask />
        <TaskList
          tasks={this.state.tasks}
          onCompleteChange={this.onCompleteChange}
        />
      </Fragment>
    );
  }
}

export const App = AppComponent;
