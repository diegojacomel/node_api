// Modules
import express from 'express'

// Middlewares
const { authMiddleware } = require('../middlewares/auth')

// Router
const router = express.Router()

// Routes
router.use(authMiddleware)

router.get('/', (req, res) => {
  res.send({ ok: true })
})

module.exports = app => app.use('/projects', router)
