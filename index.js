const express = require('express');
const app = express();
const cors = require('cors')
app.use(cors())
const port = 5000

app.use(express.json())
// import { MongoClient } from "mongodb";
const {MongoClient} = require ('mongodb')
const ObjectId = require('mongodb').ObjectId
app.get('/', (req, res)=>{
  res.send("Hello world")
  console.log("hello")
})

const uri = "mongodb+srv://mydb:MxvAqcyeIkpVB8QW@cluster0.33slg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
  try{
    await client.connect();
    const database = client.db("ProdutList")
    const dbCollection = database.collection('products')
    // const doc ={
    //   name:"watch",
    //   price:89
    // }
    // const result = await dbCollection.insertOne(doc)
    // console.log("hitting the dirt", result);
    app.get('/products', async(req, res)=>{
      const cursor = dbCollection.find({})
      const products = await cursor.toArray();
      res.send(products)
    })
    app.post('/products', async (req, res)=>{
      const newUser = req.body;
      const result = await dbCollection.insertOne(newUser)
      console.log("hitting the post", req.body);
      // res.send("post working")
      res.json(result)
      console.log(result);
    })

    app.get('/products/:id', async (req, res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)}
      const products = await dbCollection.findOne(query)
      console.log("dynamic id",id)
      res.send(products)
    })
    app.put('/products/:id', async(req, res)=>{
      const id = req.params.id;
      const updateUser = req.body;
   
      const query = {_id: ObjectId(id)}
      const option = {upsert:true}
      const updateDoc = {
        $set:{
          name:updateUser.name,
          price:updateUser.price,
          quantity:updateUser.quantity
        }
      }
      const result = await dbCollection.updateOne(query, updateDoc, option)
      console.log("updatin user", result);
      res.send(result)
    })
    app.delete('/products/:id', async (req, res)=>{
      const id= req.params.id;
      const query ={_id:ObjectId(id)}
      const products = await dbCollection.deleteOne(query)
      console.log("deleting the id", products);
      res.json(products)
    })
  }
  finally{
  //  await client.close()
  }
}

run().catch(console.dir)

app.listen(port, ()=>{
  console.log("App listring on", port);
})