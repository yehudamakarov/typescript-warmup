import { Router } from "express";

const chumashController = Router();

chumashController.get("/", (req, res) => {
    res.send("This is all your Chumash");
});

export default chumashController;
