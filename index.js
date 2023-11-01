const express = require('express')
const cors=require('cors')
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port =process.env.PORT || 3000

//MiddleWare

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bw2yndc.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    const database = client.db("carCallection");
    const servicesCollection = database.collection("servicesData");

    // find all data from database
    app.get('/services' ,async(req ,res) =>{
        const cursor =servicesCollection.find();
        const result=await cursor.toArray()
        res.send(result)

    })
    // find one data from database
    app.get('/services/:id' , async(req ,res) =>{
        const id=req.params.id
        const query={
            _id:new ObjectId(id)
        }
        const options = {
            
            // Include only the `title` and `imdb` fields in the returned document
            projection: {  title: 1, img: 1 ,price:1 ,service_id:1 },
          };
        const result = await servicesCollection.findOne(query ,options);
        res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})