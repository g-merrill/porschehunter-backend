const client = require('./db')
const bcrypt = require('bcryptjs')

const emailExists = async email => {
  const data = await client.query('SELECT * FROM users WHERE email=$1', [email])

  if (data.rowCount == 0) return false
  return data.rows[0]
}

const usernameValid = async username => {
  const data = await client.query('SELECT * FROM users WHERE username=$1', [username])

  return data.rowCount === 0
}

const createUser = async (email, password, username = null) => {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const data = await client.query(
    'INSERT INTO users(email, password, username) VALUES ($1, $2, $3) RETURNING id, email, username',
    [email, hash, username],
  )

  if (data.rowCount == 0) return false
  return data.rows[0]
}

const matchPassword = async (password, hashPassword) => {
  const match = await bcrypt.compare(password, hashPassword)
  return match
}

const sessionsHasUser = req => {
  const { user_id } = req.query
  const rawSessions = req.sessionStore.sessions
  const unparsedSessions = Object.values(rawSessions)
  if (unparsedSessions.length) {
    return unparsedSessions.some(unparsedSession => {
      return JSON.parse(unparsedSession).passport.user.id === parseInt(user_id)
    })
  } else {
    return false
  }
}

module.exports = {
  emailExists,
  usernameValid,
  createUser,
  matchPassword,
  sessionsHasUser,
}
