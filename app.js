require('dotenv').config()
require('express-async-errors')

//express
const express = require('express')
const app = express()

//rest of the packages
const cookieParser = require('cookie-parser')
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')

//database
const connectDB = require('./db/connect')

// routers
const authRouter = require('./routes/authRoutes')

//middlewares
const notFound = require('./middlewares/not-found')
const errorHandler = require('./middlewares/error-handler')



app.set('trust proxy', 1)
app.use(rateLimiter({
    windowMs:15*60*1000,
    max:60
}))

app.use(helmet())
app.use(cors())
app.use(xss())
app.use(mongoSanitize())


app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

app.use('/api/v1/auth',authRouter)

app.use(notFound)
app.use(errorHandler)


const PORT = process.env.PORT || 5000


const start = async()=>{
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(PORT,console.log(`server is listening at port ${PORT}`))
    } catch (error) {
        console.log(error);
    }
}


start()