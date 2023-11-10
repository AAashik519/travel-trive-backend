const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middleware 
app.use(cors())
app.use(express.json());
dotenv.config();
 
 
 
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.o1ht6xv.mongodb.net/?retryWrites=true&w=majority`;

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

    const travelDB=client.db('Travel_Trive')
    const countryCollection =travelDB.collection('countries') 
    const bookingCollection =travelDB.collection('bookings') 


    // get All counries
    app.get('/countries', async(req,res)=>{
        const result = await countryCollection.find().toArray()
        res.send(result)
    })
    //get Single country
    app.get('/countries/:id', async(req,res)=>{
        const id = req.params.id 
        const query = {_id : new ObjectId(id)}

        const result = await countryCollection.findOne(query)
        res.send(result)
    })

    //bookings 
    app.post('/bookings',async(req,res)=>{
        const bookings = req.body
        const result = await bookingCollection.insertOne(bookings)
         res.send(result)
        //  console.log(result);
    })

    app.get('/bookings', async(req,res)=>{
        // console.log(req.query.email);

        let query = {}
  
        if(req.query?.email){
            query = {email :req.query.email}
        }
  
  
        const result = await bookingCollection.find(query).toArray()
     
        res.send(result)
    })

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})