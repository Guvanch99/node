require('dotenv').config()
require('express-async-errors')

const express = require('express')

const router = require('./router/products')
const connectDB = require('./db/connect')
const errorHandler = require('./middleware/error-handler')
const notFound = require('./middleware/notFound')

const app=express()

const PORT = process.env.PORT||5002
async function starter(){
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(PORT, ()=>console.log('started'))
  }catch (e){
    console.log('e', e)
  }
}

app.use(express.json())
app.use('/api/v1/products',router)
app.use(notFound)
app.use(errorHandler)

starter()
