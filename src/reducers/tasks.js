import { createItem } from '../item';

const initState = {
  loading: false,
  items: []
};

export const tasks = (state = initState, action) => {
  switch (action.type) {
    case 'CREATE_TASK':
      return {
        ...state,
        items: [...state.items, action.item]
      };
    case 'CHANGE_COMPLEAT_TASK':
      return {
        ...state,
        items: state.items.map(item => {
          if (item.id === action.id) {
            return createItem(item.name, action.id, action.completed);
          }
          return item;
        })
      };
    default:
      return state;
  }
};
