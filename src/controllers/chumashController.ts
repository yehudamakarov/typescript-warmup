import { Router } from "express";
import moment from "moment";
import mongoose from "mongoose";

export default () => {
    const chumashController = Router();
    const chumashModel = mongoose.model("Chumash");

    chumashController.get("/", (req, res) => {
        // const date = moment().subtract(1, "days");
        const date = moment().subtract(1, "days").startOf("day").toDate();
        chumashModel.findOne({ learnOnDate: date }).then((chumashDocument) => {
            res.json(chumashDocument);
        }).catch((reason) => {
            res.json(reason);
        });
    });

    return chumashController;
};
