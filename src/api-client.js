export const apiClient = {
  getAllItems() {
    return new Promise(r => {
      setTimeout(r, 1000, [
        { name: 'Köp en katt', completed: true, id: 1 },
        { name: 'Köp en hund', completed: false, id: 2 }
      ]);
    });
  },

  createItem(item) {
    return Promise.resolve(true);
  },

  removeItem(item) {
    return Promise.resolve(true);
  },

  updateItem(item) {
    return Promise.resolve(true);
  }
};
