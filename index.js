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
        const reviewCollection = client.db('CoffeeTreat').collection('reviews');

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

        // read single data by id
        app.get('/services/single/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const cursor = serviceCollection.find(query);
            const result = await cursor.toArray();
            const cursor2 = reviewCollection.find({ serviceId: id }).sort({ _id: -1 });
            const result2 = await cursor2.toArray();
            res.send({
                message: 'done',
                service: result,
                reviews: result2
            })
        });

        // read all reviews from mongodb
        app.get('/reviews', async(req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        // read all reviews by service id
        app.get('/reviews/:serviceId', async(req, res) => {
            const serviceId = req.params.serviceId;
            const query = {serviceId, serviceId};
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        // write all review to mongodb
        app.post('/reviews', async(req, res) => {
            const review = req.body;
            console.log(review);
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

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