// Modules
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

// Start app
const app = express()

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Controllers
require('./app/controllers')(app)

// Listen
app.listen(5000, () => console.log('Server running on port 5000'))
