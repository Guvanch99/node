require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const connectDB = require('./db/connect')
const router =  require('./router/router')
const errorMiddleware = require('../server/middleware/error-handler')

const app =express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use('/api/v1', router)
app.use(errorMiddleware)
const start = async ()=>{
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(5006, ()=>console.log('started'))
  }catch (e) {
    console.log('error', e)
  }
}
start()

