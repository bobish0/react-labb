import { createItem } from '../item';

export const createTask = itemName => ({
  type: 'CREATE_TASK',
  item: createItem(itemName)
});

export const changeCompleatTask = (id, completed) => ({
  type: 'CHANGE_COMPLEAT_TASK',
  id,
  completed
});
