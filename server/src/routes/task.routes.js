import {
    postTask,
    getTasks,
    getTask,
    deleteTask,
    updateTask
} from '../controllers/task.controllers.js'
import express from 'express'

const router=express.Router()

router.post('/', postTask)

router.get('/', getTasks)

router.get('/:id', getTask)

router.delete('/:id', deleteTask)

router.patch('/:id', updateTask)

export default router