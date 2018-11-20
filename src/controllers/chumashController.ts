import { Router } from "express";
import mongoose from "mongoose";

export default () => {
    const chumashController = Router();
    const Chumash = mongoose.model("Chumash");

    chumashController.get("/", (req, res) => {
        res.send("This is all your Chumash");
    });

    return chumashController;
};
