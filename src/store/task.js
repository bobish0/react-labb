import { observable } from 'mobx';

export class Task {
  @observable id;
  @observable name;
  @observable isComplete;
  api

  constructor(api, id, name, isComplete) {
    this.api = api
    this.id = id
    this.name = name
    this.isComplete = isComplete
  }

  async changeCompleatTask(isComplete) {
    await this.api.updateItem({ id: this.id, name: this.name, isComplete })
    this.isComplete = isComplete
  }
}
