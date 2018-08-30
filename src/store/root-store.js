import { Tasks } from './tasks';

export class RootStore {
  constructor(api) {
    this.tasks = new Tasks(api);
  }
}
