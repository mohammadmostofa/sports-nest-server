const express = require('express')
const dotenv =  require('dotenv')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
dotenv.config() 

const app = express() ;
const uri = process.env.MONGODB_URI ;
app.use(cors()) ;
const PORT = process.env.PORT 

app.use(express.json()) ;


// mongodb collection
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


// database aikane create o aikane tke collection korte hobe
 async function run() {
  try {
    await client.connect();
    // my first db 
    const db = client.db('sports-nest')
    const facilityCollection = db.collection('facility')

    // fronted teke data anar jonno post api call korte hoi

    app.post('/facility', async (req,res) =>{
           const facilityData = req.body
         const result = await facilityCollection.insertOne(facilityData)
         res.json(result)
    })







    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.dir(error);
  }
}

run();

// server running get api
app.get('/',(req,res) => {
  res.send(`server is running fine !`)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});