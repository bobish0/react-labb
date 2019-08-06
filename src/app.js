import React, { Fragment } from 'react';
import { TaskList } from './task-list';
import { NewTask } from './new-task';
import { apiClient } from './api-client';
import { createTask } from './task';

class AppComponent extends React.Component {
  state = {
    tasks: [],
    loading: true
  };

  componentDidMount() {
    apiClient
      .getAllTasks()
      .then(tasks => this.setState({ tasks, loading: false }));
  }

  onCompleteChange = async (taskToChange, isComplete) => {
    const newTaskList = this.state.tasks.map(task => {
      if (task.id === taskToChange.id) {
        return createTask(task.name, taskToChange.id, isComplete);
      }
      return task;
    });
    this.setState({ ...this.state, tasks: newTaskList });
  };

  onCreate = taskName => {
    const newTask = createTask(taskName);
    this.setState({
      tasks: [...this.state.tasks, newTask]
    });
  };

  render() {
    if (this.state.loading || !this.state.tasks) {
      return <h1>Loading...</h1>;
    }
    return (
      <Fragment>
        <TaskList
          tasks={this.state.tasks}
          onCompleteChange={this.onCompleteChange}
        />
        <NewTask />
      </Fragment>
    );
  }
}

export const App = AppComponent;
