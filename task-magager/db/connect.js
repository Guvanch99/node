const mongoose = require('mongoose')

async function connectMongoDB(url){
  return await mongoose
    .connect(url)
    .then(()=>console.log('connected'))
    .catch(e=>console.log('e', e))

}

module.exports = connectMongoDB
