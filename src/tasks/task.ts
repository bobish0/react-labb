export function constructTask(
  name: string,
  id: number = Math.random(),
  isComplete: boolean = false
) {
  return {
    id,
    name,
    isComplete,
  }
}
