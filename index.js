// Entry Point of the API Server

const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const dbConfig = require('./dbConfig')
const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users')

/* Creates an Express application.
The express() function is a top-level
function exported by the express module.
*/
const app = express()
const Pool = require('pg').Pool
require('./passportConfig')(passport)

const pool = new Pool(dbConfig)

/* To handle the HTTP Methods Body Parser
is used, Generally used to extract the
entire body portion of an incoming
request stream and exposes it on req.body
*/

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack)
  }
  client.query('SELECT NOW()', (err, result) => {
    release()
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    console.log('Connected to Database !')
  })
})

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)

app.get('/testdata', (req, res, next) => {
  console.log('TEST DATA :')
  pool.query('Select * from test').then(testData => {
    console.log(testData)
    res.send(testData.rows)
  })
})

// Require the Routes API
// Create a Server and run it on the port 3000
const server = app.listen(3000, function () {
  let host = server.address().address
  let port = server.address().port
  // Starting the Server at the port 3000
})
