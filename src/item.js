export function createItem(name, id = Math.random(), completed = false) {
  return {
    id,
    name,
    completed
  };
}
