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

 async function run() {
  try {
    await client.connect();

    // make db
    await client.db("admin").command({ ping: 1 });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.dir(error);
  }
}

run();


// api make start blew 

app.get('/',(req,res) => {
  res.send(`server is running fine !`)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});