const mongodb = require("mongodb")
const { MongoClient, ObjectID } = require("mongodb") // pull the mongoclient to initialize our database. This gives us access to the functions necessay to connect to our database so we can perform our CRUD operations 


// Now lets define the coonection url and the database we are trying to connect to 
const connectionURL = 'mongodb://127.0.0.1:27017'
const database = 'task-manager'



MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('uNABLE to connect to   MongoDB')
    }

    const db = client.db(database)

    // when it come to creating data into the databasem there are two main methods we can use, these are insertOne() and insertMany(). as shown in examples below 


    // db.collection("users").insertOne({
    //     name: "Tee Ai Darkson",
    //     age: 28
    // },(err, res)=> {
    //     if(err) {
    //         console.log(err)
    //     }
    //     console.log(res.ops)
    // })

    // db.collection('users').insertMany(
    //     [{
    //         name: "Ken",
    //         age: 25
    //     }, {
    //         name: "Client",
    //         age: 41
    //     }]
    // )

    // db.collection('tasks').insertMany(
    //     [
    //         {
    //             description: "coding",
    //             completed: false

    //         },
    //         {
    //             description: "Off geneator",
    //             completed: false
    //         },
    //         {
    //             description: "Eat lunch",
    //             completed: true

    //         }
    //     ], (error, res) => {
    //         if (error) {
    //             console.log("An error occured")
    //     }

    //     console.log(res.ops)
    // }
    // )


    // when it comes to reading data from the database, there are two main methods we can use, these are findOne() and find(). The find method takes two arguments, the first is an object representing the name or the ID of the object we are looking for, and a callback function that will be called with the result of the find operation.

    // db.collection('tasks').findOne({ _id: new ObjectID("647bae89437ba51564281350") }, (err, res) => {
    //     if (err) {
    //         return console.log("Unable to find document")
    //     }

    //     console.log(res)
    // })

    // db.collection('tasks').find({completed: false}).toArray((err, res) => {
    //     console.log(res)
    // })

    // Moving further, just like we use insertOne/insertMany and find/findOne to create and read our documents respectively, we use updateOne/updateMany to update our documents, as illustrated below
    


    // const updatePromise = db.collection("tasks").updateOne({_id: new ObjectID("647bae89437ba5156428134e")},
    //         {
    //             $set: {
    //                 completed: true
    //             }
    //         }
    //     )
    //     updatePromise.then((result)=>{
    //         return console.log(result)
    //     }).catch((err=>{
    //         console.log(err)
    //     }))

        db.collection("tasks").deleteOne({_id: new ObjectID("647bae89437ba5156428134e")})
})