import mongoose from 'mongoose'

const authSchema=new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true
    },
    userEmail:{
        type:String,
        required:true,
        unique:true
    },
    userPassword:{
        type:String,
        required:true
    },
    userTasks:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'tasks'
        }
    ],
    userLoggedIn:{
        type:Boolean,
        default:false
    }
}, { timestamps:true })

export const users=mongoose.model("users", authSchema)