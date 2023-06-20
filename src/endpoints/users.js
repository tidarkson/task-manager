const express = require('express');
require("../db/mongoose")
const User = require("../models/User")
const auth = require("../middleware/auth")
const router = new express.Router()

// CREATE ENDPOINTS FOR USERS
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.accessToken()
        res.send({user, token})
    } catch (err) {
        res.status(400).send("An error occurred")
    }
})

// LOGIN ENDPOINTS FOR USERS

router.post("/users/login", async (req, res)=> {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.accessToken()
        try {
            res.send({user, token})
        } catch (err) {
            res.status(400).send("An error occurred")
        }
}) 

// LOGOUT ENDPOINT FOR USER 

router.post("/users/logout", auth, async (req, res)=> {
        try{
            req.user.tokens = req.user.tokens.filter((token)=> token.token !== req.token)
            await req.user.save()
            res.send()
        } catch (err) {
            res.status(500).send()
        }
})

// LOGOUT ENDPOINT FOR MULTIPLE SESSIONS OF A USER 

router.post("/users/logout-all", auth, async(req, res)=> {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (err){
        res.status(500).send()
    }
})

// READ ENDPOINTS FOR USERS

router.get("/users/me", auth, async (req, res) => {
    res.send(req.user)
})

router.get("/users/:id", async (req, res) => {
    try {
        const user = await User.findById({
            _id: req.params.id
        })
        res.send(user)
    } catch (err) {
        res.status(400).send("An error occurred")
    }
})

// USER UPDATING ENDPOINT 

router.patch("/users/me", auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send("Invalid operation")
    }

    try {
        const user = req.user
        updates.forEach((update) => user[update] = req.body[update])

        await user.save()

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (err) {
        res.status(401).send(err)
    }
})

// USER DELETING ENDPOINT 

router.delete("/users/me", auth, async (req, res) => {

    try {
        const user = await User.findByIdAndDelete(req.user._id)
        // await req.user.remove()
        res.send(req.user)
    } catch (err) {
        res.status(500).send()
    }
})
 
module.exports = router