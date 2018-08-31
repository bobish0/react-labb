import React, { Fragment } from 'react';
import { TaskList } from './task-list';
import { NewItem } from './new-task';
import { apiClient } from './api-client';
import { createItem } from './item';

class AppComponent extends React.Component {
  state = {
    items: [],
    loading: true
  };

  componentDidMount() {
    apiClient
      .getAllItems()
      .then(items => this.setState({ items, loading: false }));
  }

  onCompleatChange = (itemToChange, isComplete) => {
    const newItemList = this.state.items.map(item => {
      if (item.id === itemToChange.id) {
        return createItem(item.name, itemToChange.id, isComplete);
      }
      return item;
    });
    this.setState({ ...this.state, items: newItemList });
  };

  onCreate = itemName => {
    const newItem = createItem(itemName);
    this.setState({
      items: [...this.state.items, newItem]
    });
  };

  render() {
    if (this.state.loading || !this.state.items) {
      return <h1>Loading...</h1>;
    }
    return (
      <Fragment>
        <TaskList
          items={this.state.items}
          onCompleatChange={this.onCompleatChange}
        />
        <NewItem />
      </Fragment>
    );
  }
}

export const App = AppComponent;
