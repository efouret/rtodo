const restify = require('restify')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({
    todos: [],
    idSequence: 1
  })
  .write()

function getAllTodos(req, res, next) {
  const todos = db.get('todos').value()
  res.send(todos)
  next()
}

function getTodo(req, res, next) {
  const todo = db.get('todos').find({id: Number(req.params.id)}).value()
  if (todo) {
    res.send(todo)
  } else {
    res.send(404, {error: 'todo-not-found'})
  }
  next()
}

function postTodo(req, res, next) {
  db.update('idSequence', n => n + 1).write()
  const id = db.get('idSequence').value()
  const todo = req.body
  todo.id = id
  todo.status = 'CREATED'
  db.get('todos').push(todo).write()
  res.header('Location', `/todos/${id}`)
  res.send(201)
  next()
}

function putTodo(req, res, next) {
  const todo = db.get('todos').find({id: Number(req.params.id)}).value()
  const newTodo = req.body
  if (newTodo.status) todo.status = req.body.status
  if (newTodo.name) todo.name = req.body.name  
  // TODO update other fields
  // TODO save previous state
  db.write()
  res.send(204)
  next()
}

function deleteTodo(req, res, next) {
  db.get('todos').remove({id: Number(req.params.id)}).write()
  res.send(204)
  next()
}

const server = restify.createServer({
  name: 'rtodo',
  version: '1.0.0'
})

server.use(restify.plugins.requestLogger());

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser())

server.get('/todos', getAllTodos)
server.post('/todos', postTodo)

server.get('/todos/:id', getTodo)
server.put('/todos/:id', putTodo)
server.del('/todos/:id', deleteTodo)

server.listen(8081, () => {
  console.log(`${server.name} listening at ${server.url}`)
})