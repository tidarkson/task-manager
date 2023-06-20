const express = require('express');
require("../db/mongoose")
const Task = require("../models/Tasks")
const auth = require("../middleware/auth")

const router = new express.Router()

// CREATE ENDPOINTS FOR TASKS 

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        author: req.user._id,
        name: req.user.name 
    })
    console.log(req.user)

    try {
        await task.save()
        res.send(task)
    } catch (err) {
        res.status(400).send(err)
    }
})

// READ ENDPOINTS FOR ALL TASKS BY USER

router.get("/tasks", auth, async (req, res) => {
    try {
        const tasks = await Task.find({
            author: req.user._id,
        })
        res.send(tasks)
    } catch (err) {
        res.status(400).send("An error occurred")
    }

})

// READ ENDPOINTS FOR ONE TASK

router.get("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            author: req.user._id
        })
        res.send(task)
    } catch (err) {
        res.status(400).send("An error occurred")
    }
})

// TASK UPDATING ENDPOINT 

router.patch("/tasks/:id", auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send("Invalid operation")
    }

    try {
        const task = await Task.findOne({
            _id: req.params.id,
            author: req.user._id
        })

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])

        await task.save()

        res.send(task)
    } catch (err) {
        res.status(401).send(err)
    }
})

// TASK DELETING ENDPOINT 

router.delete("/tasks/:id", auth, async (req, res) => {

    try {
        await Task.findOneAndDelete({
            _id: req.params.id,
            author: req.user._id
        })
    } catch (err) {
        res.status(401).send(err)
    }
})

module.exports = router