const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const db = require('../db')
const { usernameValid, sessionsHasUser } = require('../helper')

/* GET users */
router.get(
  '/',
  async (req, res, next) => {
    if (!sessionsHasUser(req))
      return res.status(401).send({ message: 'User not logged in' })

    const data = await db.query('SELECT * FROM users')
    res.status(200).send({ count: data.rowCount, data: data.rows })
  },
)

/* GET user */
router.get('/:user_id', async (req, res, next) => {
  if (!sessionsHasUser(req))
    return res.status(401).send({ message: 'User not logged in' })

  const { user_id } = req.params
  const data = await db.query('SELECT * FROM users WHERE id = $1', [user_id])
  if (data.rowCount == 0)
    return res.status(404).send({ message: 'User not found' })

  const { id, email, username } = data.rows[0]
  res.status(200).send({ id, email, username })
})

/* PATCH user */
router.patch('/:user_id', async (req, res, next) => {
  if (!sessionsHasUser(req))
    return res.status(401).send({ message: 'User not logged in' })

  const { user_id } = req.params
  const { password, username } = req.body
  let data = {}
  if (password) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    data = await db.query(
      'UPDATE users SET password = $1 WHERE id = $2 RETURNING id, email, username',
      [hash, user_id],
    )
  } else if (username) {
    if (await usernameValid(username)) {
      data = await db.query(
        'UPDATE users SET username = $1 WHERE id = $2 RETURNING id, email, username',
        [username, user_id],
      )
    } else {
      return res
        .status(401)
        .send({ message: `Username: ${username} is already taken.` })
    }
  } else {
    return res.status(422).send({ message: 'Missing user data in request body' })
  }
  const { id, email, username: newUsername } = data.rows[0]
  res.status(200).send({ id, email, username: newUsername })
})

/* DELETE user */
router.delete('/:user_id', async (req, res, next) => {
  if (!sessionsHasUser(req))
    return res.status(401).send({ message: 'User not logged in' })

  const { user_id } = req.params
  const data = await db.query(
    'DELETE FROM users WHERE id = $1 RETURNING id, email, username',
    [user_id],
  )
  if (data.rowCount == 0)
    return res.status(404).send({ message: 'User not found' })

  const { id, email, username } = data.rows[0]
  res.status(200).send({ id, email, username })
})

module.exports = router
