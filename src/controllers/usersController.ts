import { Router } from "express";

const usersController = Router();

usersController.get("/", (req, res) => {
    res.send("This is all of your users...");
});

export default usersController;
