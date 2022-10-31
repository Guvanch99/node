require('dotenv').config()
require('express-async-errors')
const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./db/connect')
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')
const productsRouter = require('./routes/productRouter')
const orderRouter = require('./routes/orderRouter')
const reviewsRouter = require('./routes/reviewRouter')
const uploadRouter = require('./routes/uploadRouter')
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundMiddleware = require('./middleware/error-handler')


const app = express()
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(fileUpload())
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productsRouter)
app.use('/api/v1/orders', orderRouter)
app.use('/api/v1/reviews', reviewsRouter)
app.use('/api/v1/uploadImage', uploadRouter)
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 5014
const start = async()=>{
  try {
   await connectDB(process.env.MONGO_URI)
    app.listen(PORT, ()=>console.log('started server'))
  }catch (e) {
    console.log('e')
  }
}

start()
