const express = require('express')
require('express-async-errors')
const connectDB = require('./db/connect')
const router = require('./router/route')
const errorHandlerMiddleware = require('./middleware/error-handler')
const app = express()
const PORT = process.env.PORT ||5005

app.use(express.json())
app.use(errorHandlerMiddleware)
app.use('/api/v1', router)
const start = async ()=>{
  try {
    console.log('process.env.MONGO_URI', process.env.MONGO_URI)
    await connectDB('mongodb+srv://Guvanch99:Guvanch99@cluster0.v9q8svr.mongodb.net/jwt-basic?retryWrites=true&w=majority')
    app.listen(PORT, ()=>console.log('started'))
  }catch (e){
    throw new Error(e)
  }
}

start()
