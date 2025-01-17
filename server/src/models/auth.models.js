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
    userRefreshToken:{
        type:String
    },
    userLoggedIn:{
        type:Boolean,
        default:false
    }
}, { timestamps:true })

export const auths=mongoose.model("auths", authSchema)