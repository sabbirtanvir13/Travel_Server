// const express = require('express');
// const cors = require('cors');
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// const app = express();
// const port = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// const uri = "mongodb+srv://travel_db:KXJENTg9bsmopJRh@cluster0.tx061fa.mongodb.net/?appName=Cluster0";

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     await client.connect();
//     const db = client.db('travel_db');
//     const PackagesCollection = db.collection('Packages');

//     console.log("MongoDB connected!");

//     app.get('/', (req, res) => {
//       res.send('Hello World!');
//     });

//     // all packages
//     app.get('/Packages', async (req, res) => {

//       const result = await PackagesCollection.find().toArray();
//       res.send(result);
//     });

//     // ADD NEW PACKAGE
//     app.post("/Packages", async (req, res) => {
//       const data = req.body;

//       // createdAt add
//       data.createdAt = new Date();

//       const result = await PackagesCollection.insertOne(data);

//       res.send({
//         success: true,
//         message: "Package added successfully!",
//         insertedId: result.insertedId,
//       });
//     });


//     // Show 6 packages
//     app.get("/latest-Packages", async (req, res) => {
//       const result = await PackagesCollection
//         .find()
//         .sort({ createdAt: -1 })
//         .limit(6)
//         .toArray();
//       res.send(result);

//     });


//     app.get("/Packages/:id", async (req, res) => {
//       const id = req.params.id;
//       const result = await PackagesCollection.findOne({ _id: new ObjectId(id) });
//       if (!result) {
//         return res.send({ success: false, message: "Package not found" });
//       }
//       res.send({ success: true, result });
//     });





//  app.get("/my-packages", async (req, res) => {
//       const email = req.query.email;
//       if (!email) return res.status(400).send({ error: "Missing email" });
//       const result = await PackagesCollection.find({ userEmail: email }).toArray();
//       res.send(result);
//     });

//     // Delete a package
//     app.delete("/Packages/:id", async (req, res) => {
//       const id = req.params.id;
//       const result = await PackagesCollection.deleteOne({ _id: new ObjectId(id) });
//       res.send({ success: result.deletedCount > 0 });
//     });

//     // Update a package
//     app.put("/Packages/:id", async (req, res) => {
//       const id = req.params.id;
//       const updated = req.body;
//       const result = await PackagesCollection.updateOne(
//         { _id: new ObjectId(id) },
//         { $set: updated }
//       );
//       res.send({ success: result.modifiedCount > 0 });
//     });



//     app.listen(port, () => {
//       console.log(`Server running on port ${port}`);
//     });

//   } catch (err) {
//     console.error(err);
//   }
// }

// run().catch(console.dir);


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

    // Home
    app.get('/', (req, res) => res.send('Hello World!'));

    // All packages
    app.get('/Packages', async (req, res) => {
      const result = await PackagesCollection.find().toArray();
      res.send(result);
    });

    // Add new package
    app.post("/Packages", async (req, res) => {
      const data = req.body;
      data.createdAt = new Date();
      const result = await PackagesCollection.insertOne(data);
      res.send({ success: true, message: "Package added successfully!", insertedId: result.insertedId });
    });

    // Latest 6 packages
    app.get("/latest-Packages", async (req, res) => {
      const result = await PackagesCollection.find().sort({ createdAt: -1 }).limit(6).toArray();
      res.send(result);
    });

    // Single package by ID
    app.get("/Packages/:id", async (req, res) => {
      const id = req.params.id;
      const result = await PackagesCollection.findOne({ _id: new ObjectId(id) });
      if (!result) return res.send({ success: false, message: "Package not found" });
      res.send({ success: true, result });
    });

    // Get packages by logged-in user
    app.get("/my-packages", async (req, res) => {
      const email = req.query.email;
      if (!email) return res.status(400).send({ error: "Missing email" });
      const result = await PackagesCollection.find({ userEmail: email }).toArray();
      res.send(result);
    });

    // Delete a package
    app.delete("/Packages/:id", async (req, res) => {
      const id = req.params.id;
      const result = await PackagesCollection.deleteOne({ _id: new ObjectId(id) });
      res.send({ success: result.deletedCount > 0 });
    });

    // Update a package
    app.put("/Packages/:id", async (req, res) => {
      const id = req.params.id;
      const updated = req.body;
      const result = await PackagesCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updated }
      );
      res.send({ success: result.modifiedCount > 0 });
    });

    // Start server
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (err) {
    console.error(err);
  }
}

run().catch(console.dir);
