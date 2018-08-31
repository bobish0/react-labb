import React, { Component } from 'react';

export class NewItem extends Component {
  state = {
    itemName: ''
  };

  onChange = event => {
    console.log(event.target.value);
    this.setState({ itemName: '' });
  };

  onSubmit = event => {
    event.preventDefault();
    // this.props.onCreate(this.state.itemName);
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
