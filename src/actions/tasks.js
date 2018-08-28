import { createItem } from '../item';

export const createTask = itemName => (dispatch, getState, api) => {
  return api.createItem(createItem(itemName)).then(item =>
    dispatch({
      type: 'CREATE_TASK',
      item
    })
  );
};

export const changeCompleatTask = (id, completed) => (
  dispatch,
  getState,
  api
) => {
  return api.updateItem({ id, completed }).then(() =>
    dispatch({
      type: 'CHANGE_COMPLEAT_TASK',
      id,
      completed
    })
  );
};
