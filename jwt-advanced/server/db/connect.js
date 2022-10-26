const mongoose = require('mongoose')

const connectDB = async(url)=>{
  try {
    await mongoose.connect(url)
  }catch (e){
    console.log('did not connect to db', e)
  }
}

module.exports = connectDB
