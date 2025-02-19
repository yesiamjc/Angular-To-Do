import {
    generateToken,
    hashPassword,
    comparePassword
} from '../utils/auth.utils.js'
import { users } from '../models/auth.models.js'
import { tasks } from '../models/task.models.js'
import { sendCompletionEmail } from '../utils/email.utils.js'

// Sign Up

export const signUpUser=async(req, res)=>{
 
    const { userName, userEmail, userPassword }=req.body

    if(!userName)
        return res.status(400).json({error:"User name is required"})
    if(!userEmail)
        return res.status(400).json({error:"User email is required"})
    
    const exist=await users.findOne({userEmail})

    if(exist)
        return res.status(400).json({error:"User already exists"})
    
    if(!userPassword)
        return res.status(400).json({error:"User password is required"})
    
    try {
        const hashedPassword=await hashPassword(userPassword)

        const auth=await users.create({
            userName,
            userEmail,
            userPassword:hashedPassword
        })

        auth.userPassword=undefined

        res.status(201).json({message:"User registered successfully"})
    } catch (error) {
       res.status(500).json({error:error.message}) 
    }

}

// Sign in

export const signInUser=async(req, res)=>{
    const { userEmail, userPassword }=req.body
    
    if(!userEmail)
        return res.status(400).json({error:"User email is required"})
    
    const exist=await users.findOne({userEmail})

    if(!exist)
        return res.status(400).json({error:"User do not exist"})
    
    if(!userPassword)
        return res.status(400).json({error:"User password is required"})
    
    try {
        const match=await comparePassword(userPassword, exist.userPassword)

        if(!match)
            return res.status(400).json({error:"Passwords do not match"})
        else{
            const token=generateToken(exist._id)

            exist.userLoggedIn=true
            await exist.save()

            res.cookie("token", token, {
                maxAge:2*60*60*1000
            })

            res.json({
                message:"User logged in successfully", 
                token
            })
        }
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

// Sign Out

export const signOutUser=async(req, res)=>{
    const userId=req.user.id
    

    const auth=await users.findOne({_id:userId})

    if(!auth)
        return res.status(400).json({error: "User not found"})

    auth.userLoggedIn=false
    await auth.save()

    res.clearCookie("token")
    res.json({message:"User signed out successfully"})
}

// Delete user

export const deleteUser=async(req, res)=>{
    const id=req.user.id
    const { userEmail } =req.body
    let role=""

    try {
        const res=await users.findOne({_id:id}).populate('userTasks')
        role=res.userRole
       } catch (error) {
        res.status(500).json({error:error.message})
       }

       if(role === "admin"){
        try {
            const us=await users.findOne({userEmail:userEmail})
            await users.findByIdAndDelete(us._id)
            res.json({message:"User deleted successfully"})
        } catch (error) {
            res.status(500).json({error:error.message})
        }
       }
       else
    return res.status(404).json({error: "only admin can access"})

}

// User 

export const currentUser=async(req, res)=>{
   const id=req.user.id

   try {
    const response=await users.findOne({_id:id}).populate('userTasks')
    res.status(200).json(response)
   } catch (error) {
    res.status(500).json({error:error.message})
   }
}

// admin

export const getAllUsers = async (req, res) => {
    const id=req.user.id
    let role=""

    try {
        const res=await users.findOne({_id:id}).populate('userTasks')
        role=res.userRole
       } catch (error) {
        res.status(500).json({error:error.message})
       }
    
    if(role === "admin"){
        try {
            const response = (await users.find({})).filter(user => user.userRole === "user");
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    else
    return res.status(404).json({error: "only admin can access"})
};

// admin get user 

export const getMyUser=async(req, res)=>{
    const id=req.user.id
    const { userEmail } =req.query
    let role=""

    try {
        const res=await users.findOne({_id:id}).populate('userTasks')
        role=res.userRole
       } catch (error) {
        res.status(500).json({error:error.message})
       }
    
    if(role === "admin"){
        try {
            const response =await users.findOne({userEmail:userEmail}).populate('userTasks')
            console.log('User found:', response);
        console.log('User Tasks:', response.userTasks);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    else
    return res.status(404).json({error: "only admin can access"})
}

// Reassign of tasks

export const reassignTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const adminId = req.user.id;

        const admin = await users.findOne({ _id: adminId });
        if (!admin || admin.userRole !== "admin") {
            return res.status(403).json({ error: "Unauthorized: Admin access required" });
        }

        const task = await tasks.findByIdAndUpdate(
            taskId, 
            { myTaskCompleted: false },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error('Reassign Task Error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const markTaskComplete = async (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({ error: "Task ID is required" });
        }

        const task = await tasks.findById(id);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        try {
            await sendCompletionEmail(task);
            return res.status(200).json({ 
                message: "Completion email sent successfully"
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            return res.status(500).json({ 
                error: "Failed to send completion email",
                details: emailError.message 
            });
        }
    } catch (error) {
        console.error('Task completion error:', error);
        return res.status(500).json({ error: error.message });
    }
};