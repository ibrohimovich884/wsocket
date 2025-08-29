import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import md5 from "md5";

const app = express();

const client = new MongoClient("mongodb://localhost:27017")
await client.connect()
const collection = client.db("social").collection("passwords")

app.use(express.json())
app.use(cors({
  
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

app.post("/login", async (req, res) => {
  const { username, password } = req.body

  const user = await expo(username, password)
  console.log(user);
  if (user === null) {
    res.send("No user!")
    return
  }
  res.send("Successfull!")
})

app.post("/signup", async (req, res) => {
  const { username, password } = req.body

  await collection.insertOne({ username, password: md5(password) })
  res.status(201).send("Created!")
})

app.listen(3000, () => console.log(3000))

async function expo(username, password) {
  const result = await collection.find({
    username: username,
    password: md5(password),
  }).toArray()

  if (result.length) {
    return result[0];

  }
  return null
}