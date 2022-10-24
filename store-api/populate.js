require('dotenv').config()

const express = require('express')

const connectDB = require('./db/connect')
const Product = require('./models/product')
const jsonProduct = require('./products.json')
const app=express()

const PORT = process.env.PORT||5002

const start=async ()=>{
  try{
    await connectDB(process.env.MONGO_URI)
    await Product.deleteMany()
    await Product.create(jsonProduct)
    process.exit(0)
  }catch (e){
    console.log('e',e)
    process.exit(1)
  }
}

start()
