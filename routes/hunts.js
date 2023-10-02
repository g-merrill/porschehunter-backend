const express = require('express')
const router = express.Router()
const db = require('../db')
const { sessionsHasUser } = require('../helper')

/* GET hunts */
router.get('/', async (req, res, next) => {
  if (!sessionsHasUser(req))
    return res.status(401).send({ message: 'User not logged in' })

  try {
    const data = await db.query('SELECT * FROM hunts')
    res.status(200).send({ count: data.rowCount, data: data.rows })
  } catch (error) {
    res.status(422).send({ message: error.message })
  }
})

/* GET hunt */
router.get('/:hunt_id', async (req, res, next) => {
  if (!sessionsHasUser(req))
    return res.status(401).send({ message: 'User not logged in' })

  try {
    const { hunt_id } = req.params
    const data = await db.query('SELECT * FROM hunts WHERE id = $1', [
      hunt_id,
    ])
    if (data.rowCount == 0)
      return res.status(404).send({ message: 'Hunt not found' })

    const hunt = data.rows[0]
    res.status(200).send({ ...hunt })
  } catch (error) {
    res.status(422).send({ message: error.message })
  }

})

/* CREATE hunt */
router.post('/', async (req, res, next) => {
  if (!sessionsHasUser(req))
    return res.status(401).send({ message: 'User not logged in' })

  const { title, location } = req.body
  const { user_id } = req.query
  try {
    const data = await db.query(
      'INSERT INTO hunts(user_id, title, location) VALUES ($1, $2, $3) RETURNING id, title, location',
      [user_id, title, location],
    )
    const hunt = data.rows[0]
    res.status(201).send({ ...hunt })
  } catch (error) {
    res.status(422).send({ message: error.message })
  }
})

/* PATCH hunt */
router.patch('/:hunt_id', async (req, res, next) => {
  if (!sessionsHasUser(req))
    return res.status(401).send({ message: 'User not logged in' })

  const { hunt_id } = req.params
  const huntBody = req.body
  let queryString = ''
  let counter = 1
  for (const [key, value] of Object.entries(huntBody)) {
    if (counter === 1) {
      queryString = `UPDATE hunts SET ${key} = '${value}' WHERE id = ${hunt_id} RETURNING id, ${key}`
      counter++
    } else {
      const separated = queryString.split(' WHERE')
      let beforeWhereStatement = separated.shift()
      beforeWhereStatement += `, ${key} = '${value}'`
      separated.unshift(beforeWhereStatement)
      queryString = separated.join(' WHERE')
      queryString += `, ${key}`
    }
  }
  try {
    data = await db.query(queryString)
    const hunt = data.rows[0]
    res.status(200).send({ ...hunt })
  } catch (error) {
    res.status(422).send({ message: error.message })
  }
})

/* DELETE user */
router.delete('/:hunt_id', async (req, res, next) => {
  if (!sessionsHasUser(req))
    return res.status(401).send({ message: 'User not logged in' })

  const { hunt_id } = req.params

  try {
    const data = await db.query(
      'DELETE FROM hunts WHERE id = $1 RETURNING id, title',
      [hunt_id],
    )
    if (data.rowCount == 0)
      return res.status(404).send({ message: 'Hunt not found' })

    const { id, title } = data.rows[0]
    res.status(200).send({ id, title })
  } catch (error) {
    res.status(422).send({ message: error.message })
  }
})

module.exports = router
