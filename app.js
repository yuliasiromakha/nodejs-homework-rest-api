const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const path = require('path')

const authRouter = require('./routes/api/auth');
const contactsRouter = require('./routes/api/contacts')
const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use('/avatars', express.static(path.join(__dirname, 'public', 'avatars')));

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.use('/api/auth', authRouter)
app.use('/api/contacts', contactsRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  const {status = 500, message = 'Server error'} = err 
  res.status(status).json({ message })
});

module.exports = app