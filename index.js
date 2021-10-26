//import ECAP-DOM
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");

const app = express();
const port = 5000;

//middle-weres CE
app.use(cors());
app.use(express.json());

// mongoDb connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y4qnm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("emaJhon");
    const productCollection = database.collection("products");

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const productsTotal = await cursor.count();
      const page = req.query.page;
      const size = parseInt(req.query.size);
      let result;
      if (page) {
        result = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        result = await cursor.toArray();
      }

      res.json({
        result,
        productsTotal,
      });
    });

    app.post("/products", (req, res) => {
      console.log("post hitted");
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

//Basic API's
app.get("/", (req, res) => {
  res.send("Database running successfully");
});

app.listen(port, () => {
  console.log("bd running  a on port", port);
});
