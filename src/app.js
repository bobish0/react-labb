import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { TaskList } from './task-list';
import { NewItem } from './new-task';
import { createItem } from './item';
import { apiClient } from './api-client';

class App extends React.Component {
  state = {
    items: [],
    loading: true
  };

  componentDidMount() {
    apiClient
      .getAllItems()
      .then(items => this.setState({ items, loading: false }));
  }

  onCompleatChange = (id, completed) => {
    const newItemList = this.state.items.map(item => {
      if (item.id === id) {
        return createItem(item.name, id, completed);
      }
      return item;
    });
    this.setState({ items: newItemList });
  };

  onCreate = itemName => {
    this.setState({
      items: [...this.state.items, createItem(itemName)]
    });
  };

  render() {
    if (this.state.loading) {
      return <h1>Loading...</h1>;
    }
    return (
      <Fragment>
        <TaskList
          items={this.state.items}
          onCompleatChange={this.onCompleatChange}
        />
        <NewItem onCreate={this.onCreate} />
      </Fragment>
    );
  }
}

render(<App />, document.getElementById('root'));
