require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const authRoutes = require("./src/routes/authRoutes");
const transferenciaRoutes = require("./src/routes/transferenciaRoutes");
const auditoriaRoutes = require("./src/routes/auditoriaRoutes");

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/transferencias", transferenciaRoutes);
app.use("/api/auditorias", auditoriaRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("✅ MongoDB Atlas conectado");
})
.catch((error) => {
    console.error("❌ Error MongoDB:", error);
});

app.get("/", (req, res) => {
    res.json({
        mensaje: "Banco Nexus Cloud API funcionando"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
});