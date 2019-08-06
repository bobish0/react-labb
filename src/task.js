export function createTask(name, id = Math.random(), isComplete = false) {
  return {
    id,
    name,
    isComplete
  };
}
