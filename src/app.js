import React, { Fragment } from 'react';
// import { connect } from 'react-redux';
import { TaskList } from './task-list';
import { NewItem } from './new-task';
import { inject, observer } from 'mobx-react';
// import { apiClient } from './api-client';
// import { createTask, changeCompleatTask, getAllTasks } from './actions';

@inject('tasks')
@observer
class AppComponent extends React.Component {
  componentDidMount() {
    this.props.tasks.getAllTasks();
    // this.props.getAllTasks();
    // apiClient
    //   .getAllItems()
    //   .then(items => this.setState({ items, loading: false }));
  }

  // onCompleatChange = (item, isComplete) => {
  //   // const newItemList = this.state.items.map(item => {
  //   //   if (item.id === id) {
  //   //     const newItem = createItem(item.name, id, isComplete);
  //   //     apiClient.updateItem(newItem);
  //   //     return newItem;
  //   //   }
  //   //   return item;
  //   // });
  //   // this.setState({ items: newItemList });
  //   this.props.changeCompleatTask(item, isComplete);
  // };

  onCreate = itemName => {
    // const newItem = createItem(itemName);
    // this.setState({
    //   items: [...this.state.items, newItem]
    // });
    // apiClient.createItem(newItem);
    // this.props.createTask(itemName);
    this.props.tasks.createTask(itemName);
  };

  render() {
    console.log(this.props.tasks.loading, !this.props.tasks.items);
    if (this.props.tasks.loading || !this.props.tasks.items) {
      return <h1>Loading...</h1>;
    }
    return (
      <Fragment>
        <TaskList
          items={this.props.tasks.items}
          // onCompleatChange={this.onCompleatChange}
        />
        <NewItem onCreate={this.onCreate} />
      </Fragment>
    );
  }
}

// const mapStateToProps = state => ({
//   tasks: state.tasks
// });

// const mapDispatchToProps = dispatch => ({
//   getAllTasks: () => dispatch(getAllTasks()),
//   createTask: itemName => dispatch(createTask(itemName)),
//   changeCompleatTask: (item, isComplete) =>
//     dispatch(changeCompleatTask(item, isComplete))
// });

// export const App = connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(AppComponent);

export const App = AppComponent;
