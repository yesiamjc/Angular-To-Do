import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Generate hash from password

export const hashPassword=async(password)=>{
    try {
        const salt = await bcrypt.genSalt(12)
        const hash=await bcrypt.hash(password, salt)
        return hash
    } catch (error) {
        throw new Error(error)
    }
}

// Compare password with hash

export const comparePassword=async(password, hash)=>{
    return await bcrypt.compare(password, hash)
}

// Generate Token

export const generateToken=(userId)=>{
    return jwt.sign(
        {id:userId},
        process.env.JWT_SECRET,
        {
            expiresIn:"2h"
        }
    )
}