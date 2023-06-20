const mongoose = require("mongoose")


const taskSchema = new mongoose.Schema(
    {
        description: {
            type: String,
              required: true,
            trim: true
        },

        completed: {
            type: Boolean,
            required: true
        },
        author : {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref : "User"
        },

        name : {
            type: mongoose.Schema.Types.String,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
) 

taskSchema.pre('save', async function (next){
        const task = this

        next()
})

const Task = mongoose.model("Task", taskSchema)

module.exports = Task