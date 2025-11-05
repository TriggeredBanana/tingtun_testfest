import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import tjenesteeierRoutes from "./routes/tjenesteeier.js";
import userRoutes from "./routes/brukere.js"; 
import testfesterRoutes from "./routes/testfester.js";
import oppgaverRoutes from "./routes/oppgaver.js";
import programRoutes from "./routes/program.js";

dotenv.config();

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use(cookieParser());

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', 
    credentials: true
}));

// Ruter
app.use("/tjenesteeier", tjenesteeierRoutes);
app.use("/brukere", userRoutes);
app.use("/testfester", testfesterRoutes);
app.use("/oppgaver", oppgaverRoutes);
app.use("/program", programRoutes);

app.listen(8800, () => {
  console.log("Connected to backend!");
});
