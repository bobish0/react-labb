import { observable, decorate } from 'mobx';
import { Task } from './task';
import { createItem } from '../item';

export class Tasks {
  @observable items = [];
  @observable loading = false;
  api

  constructor(api) {
    this.api = api
  }

  async getAllTasks() {
    this.loading = true;
    const items = await this.api.getAllItems()
    this.items = items.map(task => new Task(this.api, task.id, task.name, task.isComplete))
    this.loading = false;
  }

  async createTask(itemName) {
    const task = await this.api.createItem(createItem(itemName))
    const newTask = new Task(this.api, task.id, task.name, task.isComplete)
    this.items.push(newTask)
  }
}
