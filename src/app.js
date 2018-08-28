import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { TaskList } from './task-list';
import { NewItem } from './new-task';
// import { apiClient } from './api-client';
import { createTask, changeCompleatTask } from './actions';

class AppComponent extends React.Component {
  // componentDidMount() {
  //   apiClient
  //     .getAllItems()
  //     .then(items => this.setState({ items, loading: false }));
  // }

  onCompleatChange = (id, completed) => {
    // const newItemList = this.state.items.map(item => {
    //   if (item.id === id) {
    //     const newItem = createItem(item.name, id, completed);
    //     apiClient.updateItem(newItem);
    //     return newItem;
    //   }
    //   return item;
    // });
    // this.setState({ items: newItemList });
    this.props.changeCompleatTask(id, completed);
  };

  onCreate = itemName => {
    // const newItem = createItem(itemName);
    // this.setState({
    //   items: [...this.state.items, newItem]
    // });
    // apiClient.createItem(newItem);
    this.props.createTask(itemName);
  };

  render() {
    if (this.props.tasks.loading) {
      return <h1>Loading...</h1>;
    }
    return (
      <Fragment>
        <TaskList
          items={this.props.tasks.items}
          onCompleatChange={this.onCompleatChange}
        />
        <NewItem onCreate={this.onCreate} />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  tasks: state.tasks
});

const mapDispatchToProps = dispatch => ({
  createTask: itemName => dispatch(createTask(itemName)),
  changeCompleatTask: (id, completed) =>
    dispatch(changeCompleatTask(id, completed))
});

export const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent);
