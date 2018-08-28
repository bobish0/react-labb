import React, { Component } from 'react';

export class NewItem extends Component {
  state = {
    itemName: ''
  };

  onChange = event => {
    this.setState({ itemName: event.target.value });
  };

  onSubmit = event => {
    event.preventDefault();
    this.props.onCreate(this.state.itemName);
    this.setState({ itemName: '' });
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <input value={this.state.itemName} onChange={this.onChange} />
        <button>Save</button>
      </form>
    );
  }
}
