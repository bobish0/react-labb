export function createItem(name, id = Math.random(), isComplete = false) {
  return {
    id,
    name,
    isComplete
  };
}
