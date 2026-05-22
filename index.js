const express = require('express')
const dotenv =  require('dotenv')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config() 

const app = express() ;
const uri = process.env.MONGODB_URI ;
app.use(cors()) ;
const PORT = process.env.PORT 
//express connect between server
app.use(express.json()) ;


// mongodb collection
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});




//     const JWKS = createRemoteJWKSet(
//       new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
//     )

// const verifyToken = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//     const token = authHeader.split(" ")[1]; 


//     if (!token) {
//     return res.status(401).json({ message: "Token missing" });
//   }


//   try {

//     const { payload } = await jwtVerify(token, JWKS);

//     console.log(payload, "payload");

//     req.user = payload; // best practice
//     next();
//     } catch (err) {
//     return res.status(403).json({ message: "Forbidden" });
//   }

// };


// database aikane create o aikane tke collection korte hobe
 async function run() {
  try {
    // await client.connect();
    // collection database name
    const db = client.db('sports-nest')
    const facilityCollection = db.collection('facility')
    const bookingCollection = db.collection('booking')
    // fronted teke data anar jonno post api call korte hoi
    app.post('/facility',  async (req,res) =>{
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
  app.get('/facility/:id',   async(req,res) =>{
      const {id}  = req.params ;
      const result = await facilityCollection.findOne({_id:new ObjectId(id)})
      res.send(result) 
  })

  // edit my details id 
app.patch('/facility/:id',  async (req, res) => {
    const {id} =  req.params;
    const updateData = req.body
    const result= await  facilityCollection.updateOne(
      {_id:new ObjectId(id)},
      {$set:updateData}
    )
      
    res.json(result)
    
  })
  
  //  delete fronted details
app.delete('/facility/:id', async (req, res) => {
       const {id} =  req.params;
        const result= await  facilityCollection.deleteOne(
      {_id:new ObjectId(id)},) 

       if(result.deletedCount > 0){
                return res.status(200).json({ success: true }); 
         }  else 
            { return res.status(404).json({ success: false, message: "Not Found" }); 
       }
  })

  //  get api to feature show in fronted
  app.get('/features', async(req,res) =>{
    const result = await facilityCollection.find().limit(8).toArray()
    res.send(result)
  })



  // booking 
  app.post('/booking', async (req,res)=>{
      const bookingData = req.body;
      const result = await bookingCollection.insertOne(bookingData);
      res.json(result)
  })

// single data show by userid
// mongod and get id  name same tai ekta itd disi 
app.get('/booking/:user_id',  async(req,res) =>{
    const {user_id} = req.params;
    const result = await bookingCollection.find({user_id}).toArray()
    res.json(result)
})


// delete

app.delete('/booking/:id', async (req, res) =>{
     const {id}  = req.params;
     const result = await bookingCollection.deleteOne({
       _id:new ObjectId(id)
     })

     res.json(result)
})

// update data or edit in booking 

app.patch('/booking/:id', async (req,res) =>{
  const {id} =  req.params;
  const updateData = req.body;
  const result = await bookingCollection.updateOne(
    {_id:new ObjectId(id)},
    {$set:updateData}
  ) ;

  res.json(result)

})


    // await client.db("admin").command({ ping: 1 });
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