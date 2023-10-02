const express = require('express')
const passport = require('passport')
require('../passportConfig')(passport)

const router = express.Router()

/* POST signup user. */
router.post(
  '/signup',
  passport.authenticate('local-signup', { session: false }),
  (req, res, next) => {
    res.json({
      user: req.user,
    })
  },
)

/* POST signup user. */
router.post(
  '/login',
  passport.authenticate('local-login', { session: false }),
  (req, res, next) => {
    res.json({ user: req.user })
  },
)

module.exports = router
