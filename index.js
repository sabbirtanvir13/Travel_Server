const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://travel_db:KXJENTg9bsmopJRh@cluster0.tx061fa.mongodb.net/?appName=Cluster0";

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
    const db = client.db('travel_db');
    const PackagesCollection = db.collection('Packages');

    console.log("MongoDB connected!");

    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    // all packages
    app.get('/Packages', async (req, res) => {

      const result = await PackagesCollection.find().toArray();
      res.send(result);
    });



    // ADD NEW PACKAGE
    app.post("/Packages", async (req, res) => {
      const data = req.body;

      // createdAt add
      data.createdAt = new Date();

      const result = await PackagesCollection.insertOne(data);

      res.send({
        success: true,
        message: "Package added successfully!",
        insertedId: result.insertedId,
      });
    });





    // Show 6 packages
    app.get("/latest-Packages", async (req, res) => {
      const result = await PackagesCollection
        .find()
        .sort({ createdAt: -1 })
        .limit(6)
        .toArray();
      res.send(result);

    });


    app.get("/Packages/:id", async (req, res) => {
      const id = req.params.id;
      const result = await PackagesCollection.findOne({ _id: new ObjectId(id) });
      if (!result) {
        return res.send({ success: false, message: "Package not found" });
      }
      res.send({ success: true, result });
    });

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  } catch (err) {
    console.error(err);
  }
}

run().catch(console.dir);
