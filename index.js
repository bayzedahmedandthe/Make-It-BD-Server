require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gekes.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const usersCollection = client.db("Make-It-BD").collection("users");

        app.post("/users", async (req, res) => {
            console.log("check");
            const user = req.body;
            console.log(user);
            const query = {email: user.email};
            const existingUser = await usersCollection.findOne(query);
            if(existingUser){
                return res.send({message: "user already exists"})
            };
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });
        

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {}
}
run().catch(console.dir);





app.get("/", (req, res) => {
    res.send("Make-It-BD-Server is running now")
});

app.listen(port, () => {
    console.log(`Make-It-BD-Server is running now on port${port}`);
})
