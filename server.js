const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3000;

// MongoDB bağlantı bilgileri
const uri = "mongodb://localhost:27017"; // MongoDB'nin çalıştığı bağlantı adresi
const client = new MongoClient(uri);

// Middleware
app.use(bodyParser.json()); // JSON formatında veri almayı sağlar

// MongoDB'ye bağlantı
async function connectDB() {
  try {
    await client.connect(); // MongoDB'ye bağlan
    console.log("MongoDB'ye bağlanıldı!");
  } catch (err) {
    console.error("Bağlantı hatası:", err);
  }
}

// API Endpoints

// 1. Kullanıcı Ekleme (POST /users)
app.post("/users", async (req, res) => {
  try {
    const database = client.db("mydb"); // Veritabanını seç
    const usersCollection = database.collection("users"); // Koleksiyonu seç
    const newUser = req.body; // İstekten gelen kullanıcı verisi

    const result = await usersCollection.insertOne(newUser); // Kullanıcıyı ekle
    res.status(201).json({ message: "Kullanıcı eklendi!", userId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Kullanıcı eklenemedi." });
  }
});

// 2. Tüm Kullanıcıları Listeleme (GET /users)
app.get("/users", async (req, res) => {
  try {
    const database = client.db("mydb"); // Veritabanını seç
    const usersCollection = database.collection("users"); // Koleksiyonu seç
    const users = await usersCollection.find({}).toArray(); // Tüm kullanıcıları getir

    res.status(200).json(users); // Kullanıcıları döndür
  } catch (err) {
    res.status(500).json({ error: "Kullanıcılar getirilemedi." });
  }
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
  connectDB(); // MongoDB'ye bağlan
});
