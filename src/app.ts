import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173","https://emi.nikitabansal.xyz"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

export default app;
