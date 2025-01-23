import { tasks } from "../models/task.models.js";
import { users } from "../models/auth.models.js";
import mongoose from "mongoose";

// Posting a task

export const postTask = async (req, res) => {
  const myTaskUser = req.user.id;

  const { myTask } = req.body;

  if (!myTask) return res.status(400).json({ error: "Task is required" });

  try {
    const task = await tasks.create({ myTask, myTaskUser });
    await users.findByIdAndUpdate(myTaskUser, {
      $push: { userTasks: task._id },
    });

    res.status(201).json({ message: "Data Added Successfully", task });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Getting all tasks

export const getTasks = async (req, res) => {
  const userId = req.user.id;

  try {
    const tsks = await tasks
      .find({ myTaskUser: userId })
      .sort({ createdAt: -1 });
    res.status(200).json({ message: "Here are all the tasks", tsks });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Getting task by id

export const getTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    res.status(404).json({ error: "Invalid id" });

  try {
    const task = await tasks.findById(id);

    if (!task) return res.status(404).json({ error: "No such element found" });

    if (task.myTaskUser.toString() !== req.user.id)
      return res.status(403).json({ error: "unauthorized" });

    res
      .status(200)
      .json({ message: "Here is the task you are looking for", task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deleting task by id

export const deleteTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    res.status(404).json({ error: "Invalid id" });

  try {
    const task = await tasks.findOneAndDelete({ _id: id });

    if (!task) return res.status(404).json({ error: "No such element found" });
    if (task.myTaskUser.toString() !== req.user.id)
      return res.status(403).json({ error: "unauthorized" });
    await users.findByIdAndUpdate(req.user.id, {
      $pull: { userTasks: id },
    });
    res.status(200).json({ message: "Data deleted successfully", task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Updating task by id

export const updateTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    res.status(404).json({ error: "Invalid id" });

  try {
    const task = await tasks.findOneAndUpdate(
      { _id: id },
      {
        ...req.body,
      },
      { new: true }
    );

    if (!task) return res.status(404).json({ error: "No such element found" });
    if (task.myTaskUser.toString() !== req.user.id)
      return res.status(403).json({ error: "unauthorized" });
    res.status(200).json({ message: "Data Update Successfully", task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
