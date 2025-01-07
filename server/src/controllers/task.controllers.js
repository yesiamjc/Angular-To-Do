import { tasks } from '../models/task.models.js'
import mongoose from 'mongoose'

// Posting a task

export const postTask=async(req, res)=>{
    const { myTask }=req.body

    try {
        const task=await tasks.create({myTask})
        res.status(201).json({message:"Data Added Successfully", task})
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}

// Getting all tasks

export const getTasks=async(req, res)=>{
    try {
        const tsks=await tasks.find({}).sort({createdAt:-1})
        res.status(200).json({message:"Here are all the tasks", tsks})
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}

// Getting task by id

export const getTask=async(req, res)=>{
    const {id}=req.params

    if(!mongoose.Types.ObjectId.isValid(id))
        res.status(404).json({error: "Invalid id"})

    try {
        const task=await tasks.findById(id)

        if(!task)
            res.status(404).json({error: "No such element found"})
        else
        res.status(200).json({message:"Here is the task you are looking for", task})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

// Deleting task by id

export const deleteTask=async(req, res)=>{
    const {id}=req.params

    if(!mongoose.Types.ObjectId.isValid(id))
        res.status(404).json({error: "Invalid id"})

    try {
        const task=await tasks.findOneAndDelete({_id:id})

        if(!task)
            res.status(404).json({error: "No such element found"})
        else
        res.status(200).json({message: "Data deleted successfully", task})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

// Updating task by id

export const updateTask=async(req, res)=>{
    const {id}=req.params

    if(!mongoose.Types.ObjectId.isValid(id))
        res.status(404).json({error: "Invalid id"})

    try {
        const task=await tasks.findOneAndUpdate({_id:id}, {
            ...req.body
        }, {new:true})

        if(!task)
            res.status(404).json({error: "No such element found"})
        else
        res.status(200).json({message: "Data Update Successfully", task})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}