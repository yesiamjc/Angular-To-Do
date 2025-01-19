import {
    signUpUser,
    signInUser,
    signOutUser,
    deleteUser,
    currentUser
} from '../controllers/auth.controllers.js'
import { verifyToken } from '../middlewares/auth.middlewares.js'
import express from 'express'

const authRoute=express.Router()

authRoute.post('/signUp', signUpUser)

authRoute.post('/signIn', signInUser)

authRoute.post('/signOut', verifyToken, signOutUser)

authRoute.delete('/delete', verifyToken, deleteUser)

authRoute.post('/me', verifyToken, currentUser)

export default authRoute