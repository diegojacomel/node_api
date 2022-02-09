// Modules
import path from 'path'
import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'

// Config
import { host, port, user, pass } from '../config/mail.json'

const transport = nodemailer.createTransport({
  host,
  port,
  auth: { user, pass }
})

transport.use(
  'compile',
  hbs({
    viewEngine: {
      extname: '.html',
      layoutsDir: path.resolve('./src/resources/mail'),
      defaultLayout: 'template',
      partialsDir: path.resolve('./src/resources/mail')
    },
    viewPath: path.resolve('./src/resources/mail'),
    extName: '.html'
  })
)

module.exports = transport
