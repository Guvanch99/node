require('dotenv').config();
require('express-async-errors');
const express = require('express');
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const router = require('./routes/productRoutes')
const connectDB = require('./db/connect');

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_NAME,
  api_key:process.env.CLOUDINARY_API,
  cloud_secret:process.env.CLOUDINARY_SECRET
})

const app = express();

app.get('/', (req, res) => {
  res.send('<h1>File Upload Starter</h1>');
});

app.use(express.json())
app.use(fileUpload({useTempFiles: true}))
app.use('/api/v1/products', router)
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
