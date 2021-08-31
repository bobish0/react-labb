import { Task } from "../app"

const BASE_URL = "http://localhost:5000/api/todo"

export const apiClient = {
  getAllTasks(): Promise<Task[]> {
    console.log("Fetching all todo tasks")
    return Promise.resolve([
      {
        id: 1,
        name: "Feed cat",
        isComplete: true,
      },
      {
        id: 2,
        name: "Save world",
        isComplete: false,
      },
    ])
    // return fetch(BASE_URL).then(result => result.json());
  },

  createTask(task: Task) {
    const serverTask = Object.assign({}, task)
    delete serverTask.id
    console.log("Create a new task")
    return fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serverTask),
    }).then((result) => result.json())
  },

  removeTask(task: Task) {
    console.log("Removing task")
    return fetch(`${BASE_URL}/${task.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    })
  },

  updateTask(task: Task) {
    console.log("Updating task")
    return fetch(`${BASE_URL}/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    })
  },
}
