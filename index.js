const express = require ('express');
const cors = require('cors')
const { MongoClient } = require('mongodb');
const app = express();
const port = 5000;
app.use(cors())
const ObjectId = require('mongodb').ObjectId;


app.use(express.json())
app.get('/', ( req,res)=>{
    res.send('Crud server')
})

// name: mydb
//pasword : MxvAqcyeIkpVB8QW





// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb+srv://mydb:MxvAqcyeIkpVB8QW@cluster0.33slg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri);



async function run(){
  try{
    await client.connect();
    const database = client.db('newDb');
    const userCollection = database.collection('users');

    app.get("/users", async (req,res)=>{
      const cursor = userCollection.find({})
      const users = await cursor.toArray();

      res.send(users)
    })


    app.post('/users', async (req, res)=>{
      const newUser = req.body;
    const result = await  userCollection.insertOne(newUser)
      console.log("hittting the psot",req.body);
      res.json(result)
      console.log(result);
    })

    app.get('/users/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)}
      const user = await userCollection.findOne(query)
      console.log("load user with", id);
      res.send(user)
    })

    app.delete('/users/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await userCollection.deleteOne(query)
      console.log('deleting the id',result, id)
      res.json(1)
    })
  }

  finally{
    // await client.close()
  }

}

run().catch(console.dir)

app.listen(port, ()=>{
    console.log('Running server on', port);
})