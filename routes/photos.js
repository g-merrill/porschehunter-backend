const express = require('express')
const router = express.Router()
const db = require('../db')
const { sessionsHasUser } = require('../helper')

/* GET photos */
router.get('/:hunt_id/photos', async (req, res, next) => {
  if (!sessionsHasUser(req))
    return res.status(401).send({ message: 'User not logged in' })

  const { hunt_id } = req.params
  try {
    const data = await db.query(
      `SELECT * FROM photos WHERE hunt_id = ${hunt_id}`,
    )
    res.status(200).send({ count: data.rowCount, data: data.rows })
  } catch (error) {
    res.status(422).send({ message: error.message })
  }
})

/* GET photo */
router.get('/:hunt_id/photos/:photo_id', async (req, res, next) => {
  if (!sessionsHasUser(req))
    return res.status(401).send({ message: 'User not logged in' })

  try {
    const { hunt_id, photo_id } = req.params
    const data = await db.query('SELECT * FROM photos WHERE id = $1', [
      photo_id,
    ])
    if (data.rowCount == 0)
      return res.status(404).send({ message: 'photo not found' })

    const photo = data.rows[0]
    res.status(200).send({ ...photo })
  } catch (error) {
    res.status(422).send({ message: error.message })
  }
})

/* CREATE photo */
router.post('/:hunt_id/photos', async (req, res, next) => {
  if (!sessionsHasUser(req))
    return res.status(401).send({ message: 'User not logged in' })

  const { hunt_id } = req.params
  const { uri, car_model, car_type } = req.body
  const { user_id } = req.query
  try {
    const data = await db.query(
      'INSERT INTO photos(user_id, hunt_id, uri, car_model, car_type) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id, hunt_id, uri, car_model, car_type',
      [user_id, hunt_id, uri, car_model, car_type],
    )
    const photo = data.rows[0]
    res.status(201).send({ ...photo })
  } catch (error) {
    res.status(422).send({ message: error.message })
  }
})

/* PATCH photo */
router.patch('/:hunt_id/photos/:photo_id', async (req, res, next) => {
  if (!sessionsHasUser(req))
    return res.status(401).send({ message: 'User not logged in' })

  const { hunt_id, photo_id } = req.params
  const photoBody = req.body
  let queryString = ''
  let counter = 1
  for (const [key, value] of Object.entries(photoBody)) {
    if (counter === 1) {
      queryString = `UPDATE photos SET ${key} = '${value}' WHERE id = ${photo_id} RETURNING id, ${key}`
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
    const photo = data.rows[0]
    res.status(200).send({ ...photo })
  } catch (error) {
    res.status(422).send({ message: error.message })
  }
})

/* DELETE user */
router.delete('/:hunt_id/photos/:photo_id', async (req, res, next) => {
  if (!sessionsHasUser(req))
    return res.status(401).send({ message: 'User not logged in' })

  const { hunt_id, photo_id } = req.params
  try {
    const data = await db.query(
      'DELETE FROM photos WHERE id = $1 RETURNING id',
      [photo_id],
    )
    if (data.rowCount == 0)
      return res.status(404).send({ message: 'photo not found' })

    const { id } = data.rows[0]
    res.status(200).send({ id })
  } catch (error) {
    res.status(422).send({ message: error.message })
  }
})

module.exports = router
