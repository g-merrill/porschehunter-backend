const express = require('express')
const passport = require('passport')
require('../passportConfig')(passport)

const router = express.Router()

/* POST signup user. */
router.post(
  '/signup',
  passport.authenticate('local-signup', { session: true }),
  (req, res, next) => {
    res.json({
      user: req.user,
    })
  },
)

/* POST signup user. */
router.post(
  '/login',
  passport.authenticate('local-login', { session: true }),
  (req, res, next) => {
    res.json({ user: req.user })
  },
)

module.exports = router
