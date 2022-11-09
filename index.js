const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json())

// setup mongodb
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.lbao5mz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const run = async() => {
    try{
        const serviceCollection = client.db('CoffeeTreat').collection('services');

        // read limited number data from mongodb
        app.get('/services/:count', async(req, res) => {
            const num = parseInt(req.params.count);
            const query = {};
            const cursor = serviceCollection.find(query).sort({ _id: -1 }).limit(num);
            const result = await cursor.toArray();
            res.send(result);
        });

        // read all data from mongodb
        app.get('/services', async(req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        // write data to mongodb
        // app.post('/users', async(req, res) => {
        //     const user = req.body;
        //     console.log(user);
        //     const result = await userCollection.insertOne(user);
        //     res.send(result);
        // })

        // // delete mongodb data
        // app.delete('/users/:id', async(req, res) => {
        //     const id = req.params.id;
        //     const query = {_id: ObjectId(id)};
        //     const result = await userCollection.deleteOne(query);
        //     res.send(result);
        // })
    }
    finally{

    }
}

run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send("Coffee Treat Server Running");
});

app.listen(port, () => {
    console.log(`Coffee Treat Server Running On Port - ${port}`);
});