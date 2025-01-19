import jwt from 'jsonwebtoken'

export const verifyToken=(req, res, next)=>{
    const token=req.cookies.token

    if(!token)
        return res.status(400).json({error:"Sign in to use services"})

    try {
        jwt.verify(token, process.env.JWT_SECRET, async(error, decoded)=>{
            if(error)
                return res.status(400).json({error:"Invalid token"})
            else{
                req.user=decoded
                next()
            }
        })
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}