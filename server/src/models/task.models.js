import mongoose from 'mongoose'

const taskSchema=new mongoose.Schema({
    myTask:{
        type:String,
        required:true
    }
}, {timestamps:true})

export const tasks=mongoose.model("tasks", taskSchema)