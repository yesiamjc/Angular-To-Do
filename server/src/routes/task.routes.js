import {
    postTask,
    getTasks,
    getTask,
    deleteTask,
    updateTask
} from '../controllers/task.controllers.js'
import { verifyToken } from '../middlewares/auth.middlewares.js'
import express from 'express'

const router=express.Router()

router.post('/', verifyToken, postTask)

router.get('/', verifyToken, getTasks)

router.get('/:id', verifyToken, getTask)

router.delete('/:id', verifyToken, deleteTask)

router.patch('/:id', verifyToken, updateTask)


export default router