const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
console.log(process.env.PORT)
require('dotenv').config()
// midleware


  app.use(cors({
    origin:  '*'   
  })); 

app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jtcqgec.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const database = client.db("Travelia");
const spotsCollection = database.collection("spots");
const countriesCollection = database.collection("countries");

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

   app.get('/countries', async(req, res)=>{
    const cursor =  countriesCollection.find()
    const result =  await cursor.toArray()
    res.send(result)
   })  
   app.post('/countries', async(req, res)=>{
    const allCountries =  [
      { name: "Bangladesh", image: "https://d3oyr1ewtd57ia.cloudfront.net/BlogListView-Image/9457682352010424-559463218835093-Ratargul-2.jpg", description: "Rich culture and beautiful natural destinations" },
      { name: "Vietnam", image: "https://static.toiimg.com/photo/90957440.cms", description: "Best tourist attraction for History lovers" },
      { name: "Maldives", image: "https://img.traveltriangle.com/blog/wp-content/uploads/2020/01/Places-To-Visit-In-Maldives_11th-jun.jpg", description: "most popular beach destinations" },
      { name: "Thailand", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0NLjRJOLZak8MGK6U_egvMbauqfovuPA30gNekjS5cA&s", description: "Low cost solution for  a luxury trip" },
      { name: "Malaysia", image: "https://static2.tripoto.com/media/filter/tst/img/210609/TripDocument/1474116741_destination_for_malaysian_24343.jpg", description: "Amazing hospitality and rich historical places" },
      { name: "Cambodia", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_TLz5KRRPQc-tCBaKvp2Y9m6Z041LMt-bWqGMTzis-Q&s", description: "One of  the best place to explore as a backpacker" },
    ];
    const result = await countriesCollection.insertMany(allCountries)
    res.send(result)
   }) 
   app.get("/countries/:country", async (req, res) => {
    const country = req.params.country;
    console.log(country)
    const query = {countryName: country}
    const result = await spotsCollection.find(query).toArray();
    console.log(result)
    res.send(result);
  });

    app.post("/spots", async (req, res) => {
      const newSpot = req.body;
      console.log(newSpot);
      const result = await spotsCollection.insertOne(newSpot);
      res.send(result);
    });

    app.get("/spots", async (req, res) => {
      
      const cursor = spotsCollection.find();
      const result = (await cursor.toArray());
      
      
      res.send(result);
    });
    app.get("/spots/myList/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const result = await spotsCollection.find({ email }).toArray();
      res.send(result);
    });
    app.delete("/spots/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await spotsCollection.deleteOne(query);
      res.send(result);
    });
    app.get("/spots/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await spotsCollection.findOne(query);
      res.send(result);
    });
    app.put("/spots/update/:id", async (req, res) => {
      const id = req.params.id;
      const spot = req.body;
      console.log(spot)
      const filter = { _id: new ObjectId(id) };
      const updateSpot = {
       $set:{
        cost: spot.cost,
        countryName: spot.countryName,
        details: spot.details,
        location: spot.location,
        name: spot.name,
        photo: spot.photo,
        seasonality: spot.seasonality,
        time: spot.time,
        visitors: spot.visitors,
       }
      };
      const result = await spotsCollection.updateOne(filter, updateSpot)
      res.send(result)
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Travelia server is running");
});
app.listen(port, () => {
  console.log("server is running on port", port);
});
