const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
// Use the cors middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://shamim69:xjExcGaHrsjGCKiW@cluster0.i67gqld.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db("cricketDB");
    const matchSchedule = database.collection("matchSchedule");
    const teamList = database.collection("teamList");
    const topFiveBatsmanInfo = database.collection("topFiveBatsmanInfo");
    const users = database.collection("users");

    app.get("/", (req, res) => {
      res.send("ICC Men's Cricket World Cup-2023- server");
    });

    app.get("/upcoming-matchSaccule", async (req, res) => {
      const query = { status: "Match not started" };
      const matches = await matchSchedule.find(query).toArray();
      res.send(matches);
    });

    app.get("/all-teams", async (req, res) => {
      const allTeamsInfo = await teamList.find().toArray();
      res.send(allTeamsInfo);
    });

    app.get("/top-batsmans", async (req, res) => {
      const topPlayers = await topFiveBatsmanInfo.find().toArray();
      res.send(topPlayers);
    });

    app.post("/register", async (req, res) => {
      const userData = req.body;
      const result = await users.insertOne(userData);
      res.send(result)
    });

    app.get("/login", async (req, res) => {
      const email = req.query.email;
      const password = req.query.password;
      // const query = { email:email,password: password};
      const userData = await users.find().toArray()
      if(userData?.length>0){
        const checkedAuthintacate = userData?.find(element=>element?.email === email && element.password === password)
        checkedAuthintacate ? res.send(checkedAuthintacate) : res.status(302).json({ error: 'Invalid Data' });
      }
      
    });

    // make end points for bulk entry data in database
    app.post("/test", async (req, res) => {
      const data = req.body;
      const options = { ordered: true };
      const result = await topFiveBatsmanInfo.insertMany(data, options);
      console.log(result);
      result?.acknowledged ? res.send("sabbash beta") : res.send("hugamara");
    });
    app.post("/testOne", async (req, res) => {
      const data = req.body;
      // const options = { ordered: true };
      const result = await teamList.insertOne(data);
      console.log(result);
      result?.acknowledged ? res.send("sabbash beta") : res.send("hugamara");
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.listen(port, () => {
  console.log(`ICC Men's cricket world cup server running on ${port}`);
});


