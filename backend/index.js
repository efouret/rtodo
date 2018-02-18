const restify = require('restify')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const moment = require('moment')

const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({
    todos: [],
    idSequence: 1
  })
  .write()

function getAllTodos(req, res, next) {
  const todos = db.get('todos').sortBy('dueDate').value()
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
  const todo = req.body
  const errors = validateTodo(todo, true)

  if (errors.length > 0) {
    res.send(400, {errors})
    next()
    return
  }

  db.update('idSequence', n => n + 1).write()
  const id = db.get('idSequence').value()
  todo.id = id
  todo.status = 'TODO'
  todo.history = []
  db.get('todos').push(todo).write()
  res.header('Location', `/todos/${id}`)
  res.send(201)
  next()
}

function putTodo(req, res, next) {
  const todo = db.get('todos').find({id: Number(req.params.id)}).value()
  if (!todo) {
    res.send(404, {errors: ['todo-not-found']})
    next()
    return
  }

  const newTodo = req.body
  const errors = validateTodo(newTodo, false)

  if (errors.length > 0) {
    res.send(400, {errors})
    next()
    return
  }

  const historyEntry = {date: moment().toISOString()}

  if (newTodo.name && newTodo.name !== todo.name) {
    historyEntry.previousName = todo.name
    historyEntry.newName = newTodo.name
    todo.name = newTodo.name
  }

  if (newTodo.status && newTodo.status !== todo.status) {
    if (newTodo.status === 'DONE' && todo.repeat) {
      const fromMoment = todo.repeatFrom === 'completion' ? (req.query.completionDate ? moment(req.query.completionDate, moment.ISO_8601) : moment()) : moment(todo.dueDate, moment.ISO_8601)
      historyEntry.completionDate = fromMoment.toISOString()
      const repeatInc = todo.repeat.split(' ')[0]
      const repeatUnit = todo.repeat.split(' ')[1]
      let newDueDate = fromMoment.add(repeatInc, repeatUnit)
      historyEntry.previousDueDate = todo.dueDate
      historyEntry.newDueDate = newDueDate
      todo.dueDate = newDueDate
      historyEntry.previousStatus = todo.status
      historyEntry.newStatus = newTodo.status
      todo.status = 'TODO'
    } else {
      historyEntry.previousStatus = todo.status
      historyEntry.newStatus = newTodo.status
      todo.status = newTodo.status
    }
  }

  if (newTodo.dueDate && newTodo.dueDate !== todo.dueDate) {
    historyEntry.previousDueDate = todo.dueDate
    historyEntry.newDueDate = newTodo.dueDate
    todo.dueDate = newTodo.dueDate
  }

  if (newTodo.repeat && newTodo.repeat !== todo.repeat) {
    historyEntry.previousRepeat = todo.repeat
    historyEntry.newRepeat = newTodo.repeat
    todo.repeat = newTodo.repeat
  }

  todo.history.push(historyEntry)

  db.write()
  res.send(204)
  next()
}

function deleteTodo(req, res, next) {
  db.get('todos').remove({id: Number(req.params.id)}).write()
  res.send(204)
  next()
}

function validateTodo(todo, creation) {
  const errors = []

  if (!todo.name && creation) {
    errors.push('missing-name')
  }

  if (!creation && todo.status && !todo.status.match(/^(TODO|DONE)$/)) {
    errors.push('invalid-status')
  }

  if (todo.repeat && !todo.repeat.match(/^[1-9][0-9]* (day|week|month|year)s?$/)) {
    errors.push('invalid-repeat')
  }

  if (todo.dueDate && !moment(todo.dueDate, moment.ISO_8601).isValid()) {
    errors.push('invalid-dueDate')
  }

  if (todo.repeatFrom && !todo.repeatFrom.match(/^(completion|due)$/)) {
    errors.push('invalid-repeat-from')
  }

  if (todo.repeat && !todo.repeatFrom) {
    errors.push('repeatFrom-needed-for-repeat')
  }

  if (todo.repeat && !todo.dueDate) {
    errors.push('dueDate-needed-for-repeat')
  }

  return errors
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