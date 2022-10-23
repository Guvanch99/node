const express = require('express')
require('dotenv').config()

const router = require('./routes/tasks')
const connectMongoDB = require('./db/connect')
const notFound = require('./middleware/not-found')
const errorHandler = require('./middleware/error-handler')
const app = express()

const startServer=async ()=>{
  try {
    await connectMongoDB(process.env.MONGO_URI)
    app.listen(5001)
  }catch (e){
    throw new Error(e)
  }
}

app.use(express.json())
app.use(express.static('./public'))
app.use('/api/v1/tasks',router)
app.use(notFound)
app.use(errorHandler)
startServer()


