// Entry Point of the API Server

const express = require('express')
const passport = require('passport')

/* Creates an Express application.
The express() function is a top-level
function exported by the express module.
*/
const app = express()
const Pool = require('pg').Pool
require('./passportConfig')(passport)

const pool = new Pool({
  user: 'greg',
  host: 'localhost',
  database: 'porschehunter',
  password: 'postgres',
  dialect: 'postgres',
  port: 5432,
})

/* To handle the HTTP Methods Body Parser
is used, Generally used to extract the
entire body portion of an incoming
request stream and exposes it on req.body
*/
const bodyParser = require('body-parser')
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

app.get('/testdata', (req, res, next) => {
  console.log('TEST DATA :')
  pool.query('Select * from test').then(testData => {
    console.log(testData)
    res.send(testData.rows)
  })
})

app.post(
  '/auth/signup',
  passport.authenticate('local-signup', { session: false }),
  (req, res, next) => {
    res.json({
      user: req.user,
    })
  },
)

app.post(
  '/auth/login',
  passport.authenticate('local-login', { session: false }),
  (req, res, next) => {
    res.json({ user: req.user })
  },
)

// Require the Routes API
// Create a Server and run it on the port 3000
const server = app.listen(3000, function () {
  let host = server.address().address
  let port = server.address().port
  // Starting the Server at the port 3000
})
