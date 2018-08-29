import { createItem } from '../item';

const initState = {
  loading: false,
  items: []
};

export const tasks = (state = initState, action) => {
  switch (action.type) {
    case 'SET_LOADING_STATE':
      return {
        ...state,
        loading: action.isLoading
      };
    case 'RESET_ITEMS':
      return {
        ...state,
        items: action.items
      };
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
            return createItem(item.name, action.id, action.isComplete);
          }
          return item;
        })
      };
    default:
      return state;
  }
};
