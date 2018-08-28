export const apiClient = {
  getAllItems() {
    console.log('Fetching all todos item');
    return new Promise(r => {
      setTimeout(r, 1000, [
        { name: 'Köp en katt', completed: true, id: 1 },
        { name: 'Köp en hund', completed: false, id: 2 }
      ]);
    });
  },

  createItem(item) {
    console.log('Create a new item');
    return Promise.resolve(true);
  },

  removeItem(item) {
    console.log('Removing item');
    return Promise.resolve(true);
  },

  updateItem(item) {
    console.log('Updating item');
    return Promise.resolve(true);
  }
};
