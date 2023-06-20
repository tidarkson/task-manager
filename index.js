const express = require('express');
const userRouter = require("./src/endpoints/users")
const tasksRouter = require("./src/endpoints/tasks")


const app = express()

app.listen("5000", () => console.log("Listening on port 5000"));

app.use(express.json())
app.use(tasksRouter)
app.use(userRouter)


const Task = require('./src/models/Tasks');
const User = require('./src/models/User');

const main = async () => {
    // const task = await Task.findById('648ade65ae49b958d8a48d1c')
    // await task.populate("author")
    // console.log(task.author)

    // const user = await User.findById("648ad83411bb3b717ed8bc3e")
    // await user.populate("tasks") 
    // console.log(user.tasks)
}

main()

