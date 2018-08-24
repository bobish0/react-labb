import React, { Fragment } from 'react'
import { render } from 'react-dom'
import { TaskList } from './task-list'
import { NewItem } from './new-task'
import { createItem } from './item'

class App extends React.Component {
  state = {
    items: []
  }

  onCompleatChange = (id, completed) => {
    const newItemList = this.state.items.map(item => {
      if (item.id === id) {
        return createItem(item.name, id, completed)
      }
      return item
    })
    this.setState({ items: newItemList })
  }

  onCreate = itemName => {
    this.setState({
      items: [...this.state.items, createItem(itemName)]
    })
  }

  render() {
    return (
      <Fragment>
        <TaskList items={this.state.items} onCompleatChange={this.onCompleatChange} />
        <NewItem onCreate={this.onCreate} />
      </Fragment>
    )
  }
}

render(<App />, document.getElementById('root'))
