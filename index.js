require('dotenv').config();
const express = require('express');
const cors = require('cors');  

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());          
app.use(express.json());


const uri = process.env.MONGO_URI;



// console.log("URI:", process.env.MONGO_URI);


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
    await client.connect();
     const db= client.db('next-shop')
    const featuresCollection =db.collection('features')
    const displayProsuctsCollection =db.collection('display-products')
    const reviews =db.collection('reviews')
    const items =db.collection('items')

    app.get('/features', async (req, res) => {
      try {
        const featuresData = await featuresCollection.find().toArray();
        res.json(featuresData);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });
    app.get('/products', async (req, res) => {
      try {
        const featuresData = await displayProsuctsCollection.find().toArray();
        res.json(featuresData);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });
    app.get('/reviews', async (req, res) => {
      try {
        const coustomerReview = await reviews.find().toArray();
        res.json(coustomerReview);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });
    app.get('/items', async (req, res) => {
      try {
        const listItems = await items.find().toArray();
        res.json(listItems);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });
    app.get("/items/:id", async (req, res) => {
  try {
     const id = req.params.id;
    const item = await items.findOne({ _id: new ObjectId(id) });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

    app.post("/items", async (req, res) => {
  try {
    const product = req.body;
    if (!product.title || !product.description || !product.price) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const result = await items.insertOne(product);
    res.status(201).json({ message: "Product added successfully", id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
    app.delete("/items/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const result = await items.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 1) {
          res.json({ message: "Product deleted successfully" });
        } else {
          res.status(404).json({ message: "Product not found" });
        }
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

   









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
