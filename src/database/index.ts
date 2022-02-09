// Database
import mongoose from 'mongoose'

// Database connect
mongoose.connect('mongodb://localhost/noderest')
mongoose.Promise = global.Promise

export default mongoose
