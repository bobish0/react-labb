const BASE_URL = 'http://localhost:5000/api/todo';

export const apiClient = {
  getAllItems() {
    console.log('Fetching all todos item');
    return fetch(BASE_URL).then(result => result.json());
  },

  createItem(item) {
    const serverItem = Object.assign({}, item);
    delete serverItem.id;
    console.log('Create a new item');
    return fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(serverItem)
    }).then(result => result.json());
  },

  removeItem(item) {
    console.log('Removing item');
    return fetch(`${BASE_URL}/${item.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    });
  },

  updateItem(item) {
    console.log('Updating item');
    return fetch(`${BASE_URL}/${item.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    });
  }
};
