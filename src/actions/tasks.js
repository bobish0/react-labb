import { createItem } from '../item';

export const setLoadingState = isLoading => ({
  type: 'SET_LOADING_STATE',
  isLoading
});

export const getAllTasks = () => (dispatch, getState, api) => {
  dispatch(setLoadingState(true));
  return api.getAllItems().then(items => {
    dispatch({
      type: 'RESET_ITEMS',
      items
    });
    dispatch(setLoadingState(false));
  });
};

export const createTask = itemName => (dispatch, getState, api) => {
  return api.createItem(createItem(itemName)).then(item =>
    dispatch({
      type: 'CREATE_TASK',
      item
    })
  );
};

export const changeCompleatTask = (item, isComplete) => (
  dispatch,
  getState,
  api
) => {
  return api.updateItem({ ...item, isComplete }).then(() =>
    dispatch({
      type: 'CHANGE_COMPLEAT_TASK',
      id: item.id,
      isComplete
    })
  );
};
