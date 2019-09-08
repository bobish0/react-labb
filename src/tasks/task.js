export function constructTask(name, id = Math.random(), isComplete = false) {
  return {
    id,
    name,
    isComplete
  };
}
