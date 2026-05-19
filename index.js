const express = require('express')
const dotenv =  require('dotenv')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

    // get api to send data mongodb to frontend
   app.get('/facility', async(req,res)=>{
    const result = await facilityCollection.find().toArray()
    res.json(result)
   })

  // dianamic id sent and receive fronted
  app.get('/facility/:id' , async(req,res) =>{
      const {id}  = req.params ;
      const result = await facilityCollection.findOne({_id:new ObjectId(id)})
      res.send(result) 
  })

  // edit my details id 
app.patch('/facility/:id', async (req, res) => {
    const {id} =  req.params;
    const updateData = req.body
    const result= await  facilityCollection.updateOne(
      {_id:new ObjectId(id)},
      {$set:updateData}
    )
      
    res.json(result)
    
  })



  //  get api to feature show in fronted
  app.get('/features', async(req,res) =>{
    const result = await facilityCollection.find().limit(4).toArray()
    res.send(result)
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