import fs from 'fs'
import path from 'path'

module.exports = app => {
  fs.readdirSync(__dirname)
    .filter(file => file.indexOf('.') !== 0 && file !== 'index.ts')
    .forEach(file => require(path.resolve(__dirname, file))(app))
}
