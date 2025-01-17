import mongoose from 'mongoose'

const taskSchema=new mongoose.Schema({
    myTask:{
        type:String,
        required:true
    },
    myTaskCompleted:{
        type:Boolean,
        default:false
    },
    myTaskUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'auths'
    }
}, {timestamps:true})

export const tasks=mongoose.model("tasks", taskSchema)