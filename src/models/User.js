const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Task = require("./Tasks")

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
    useNewUrlParser: true,
})

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    age: {
        type: Number
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is not a valid email")
            }
        }
    },

    password: {
        type: String,
        required: true
    },

    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
}, {
    timestamps: true
})

userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "author"
})

// HASHING ALGORITHM TO ENCRYPT USER PASSWORD/SAVE USER

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// HASHING ALGORITHM TO DECRYPT USER PASSWORD/ LOGIN

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error("Unable to login")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error("Unable to login")
    }

    return user
}

// HIDE USER DATA  

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

// AUTHENTICATING USER **** COMPARE create user and login router ON USER ROUTE ****

userSchema.methods.accessToken = function () {
    const user = this

    const token = jwt.sign({ _id: user._id.toString() }, "access_token")

    user.tokens = user.tokens.concat({ token })

    user.save()
    return token
}

// DELETE ALL TASKS IF USER IS REMOVED 

userSchema.pre("remove", async function (next) {
    const user = this

    await Task.deleteMany({ author: user._id })

    next()
})


const User = mongoose.model("User", userSchema)

module.exports = User