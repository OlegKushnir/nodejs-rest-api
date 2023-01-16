const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const path = require('path')
const {errorHandler} = require('./helpers/apiHelpers')
const usersRouter = require('./routes/api/authRouter');
const contactsRouter = require('./routes/api/contacts');

const PUBLIC_DIR = path.resolve('./public/avatars');

const app = express()
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/contacts', contactsRouter)
app.use("/avatars", express.static(PUBLIC_DIR));
app.use(errorHandler)


app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app
