import express from "express";
import cors from 'cors';
import tjenesteeierRoutes from "./routes/tjenesteeier.js";
import userRoutes from "./routes/brukere.js";
import testfesterRoutes from "./routes/testfester.js";
import oppgaverRoutes from "./routes/oppgaver.js";
import programRoutes from "./routes/program.js";

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cors())

app.use("/tjenesteeier", tjenesteeierRoutes);
app.use("/brukere", userRoutes);
app.use("/Testfester", testfesterRoutes);
app.use("/Oppgaver", oppgaverRoutes);
app.use("/program", programRoutes);

app.listen(8800, () => {
  console.log("Connected to backend!");
});