import { randomUUID } from 'node:crypto'
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-paths.js";

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { id } = req.query
      const tasks = database.select('tasks', id ? id : null)
      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description, completed_at } = req.body

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: completed_at ? completed_at : null,
        created_at: new Date(),
        updated_at: new Date()
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const id = req.params.id
      const { title, description } = req.body

      if (!title || !description) {
        return res.writeHead(400).end(JSON.stringify({ Erro: 'title or description are required' }))
      }

      const [task] = database.select('tasks', id)

      if (!task) {
        return res.writeHead(404).end(JSON.stringify({ Erro: 'Task not found' }))
      }

      database.update('tasks', id, {
        title,
        description,
        updated_at: new Date()
      })
      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const id = req.params.id
      const [task] = database.select('tasks', id ? id : null)

      if (!task) {
        return res.writeHead(404).end()
      }

      const isCompleted = !!task.completed_at

      const completed_at = isCompleted ? null : new Date()


      database.update('tasks', id, { completed_at })
      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const id = req.params.id
      const [task] = database.select('tasks', id)

      if (!task) {
        return res.writeHead(404).end(JSON.stringify({ Erro: 'Task not found' }))
      }

      database.delete('tasks', id)
      return res.writeHead(204).end()
    }
  }
]