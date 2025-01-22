import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import connectDB from './src/db/db.config.js'
import routes from './src/routes/task.routes.js'
import authRoute from './src/routes/auth.routes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app=express()

app.use(cors({
    origin: 'http://localhost:4200', // Specify the allowed origin
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}))

app.use(express.json())

app.use(cookieParser())

app.use((req, res, next)=>{
    console.log(req.method, req.path)
    next()
})

app.use('/api/tasks', routes)

app.use('/api/users', authRoute)

connectDB(app)