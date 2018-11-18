import { Router } from "express";
import mongoose from "mongoose";

const chumashController = Router();
const Chumash = mongoose.model("Chumash");

chumashController.get("/", (req, res) => {
    res.send("This is all your Chumash");
});

export default chumashController;
