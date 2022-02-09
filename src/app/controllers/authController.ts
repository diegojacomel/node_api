// Modules
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

// Models
import User from '../models/User'

// Config
import authConfig from '../../config/auth.json'

// Mailer
// import mailer from '../../modules/mailer'
const mailer: any = require('../../modules/mailer')

// Router
const router = express.Router()

// Helper methods
function generateToken(params) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  })
}

// Routes
router.post('/register', async (req, res) => {
  const { email } = req.body

  try {
    if (await User.findOne({ email })) {
      return res.status(400).send({ error: 'User already exists' })
    }

    const user = await User.create(req.body)

    user.password = undefined

    return res.send({
      user,
      token: generateToken({ id: user.id, name: user.name })
    })
  } catch (err) {
    return res.status(400).send({ error: 'Registration failed' })
  }
})

router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return res.status(400).send({ error: 'User not found' })
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).send({ error: 'Invalid password' })
    }

    user.password = undefined

    res.send({
      user,
      token: generateToken({ id: user.id, name: user.name })
    })
  } catch (err) {
    return res.status(400).send({ error: 'Login failed' })
  }
})

router.post('/forgot_password', async (req, res) => {
  const { email } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).send({ error: 'User not found' })
    }

    const token = crypto.randomBytes(20).toString('hex')

    const now = new Date()
    now.setHours(now.getHours() + 1)

    await User.findByIdAndUpdate(user.id, {
      $set: {
        passwordResetToken: token,
        passwordResetExpires: now
      }
    })

    mailer.sendMail(
      {
        to: email,
        from: 'dmeloj@gmail.com',
        subject: 'Forgot password',
        html: `<p>Você esqueceu sua senha? Então utilize este token para altera-la: ${token}</p>`
      },
      err => {
        if (err) {
          return res
            .status(400)
            .send({ error: 'Cannot send forgot password email' })
        }

        return res.send()
      }
    )
  } catch (err) {
    return res.status(400).send({ error: 'Error on forgot password' })
  }
})

router.post('/reset:_password', async (req, res) => {
  const { email, token, password } = req.body

  try {
    const user = await User.findOne({ email }).select(
      '+passwordResetToken passwordResetExpires'
    )

    if (!user) {
      return res.status(400).send({ error: 'User not found' })
    }

    if (token !== user.passwordResetToken) {
      return res.status(400).send({ error: 'Invalid token' })
    }

    const now = new Date()

    if (now > user.passwordResetExpires) {
      return res
        .status(400)
        .send({ error: 'Token expired, please generate a new one' })
    }

    user.password = password

    await user.save()

    res.send()
  } catch (err) {
    return res.status(400).send({ error: 'Cannot reset password' })
  }
})

module.exports = app => app.use('/auth', router)
