import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import connectDB from './src/db/db.config.js'
import routes from './src/routes/task.routes.js'

const app=express()

app.use(express.json())

app.use('/api/tasks', routes)

connectDB(app)